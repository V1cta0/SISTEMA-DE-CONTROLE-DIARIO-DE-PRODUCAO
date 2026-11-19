package com.senai.pint.service;

import com.senai.pint.entity.ProducaoEntity;
import com.senai.pint.entity.UsuarioEntity;
import com.senai.pint.repository.ProducaoRepository;
import com.senai.pint.repository.UsuarioRepository;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

@Service
public class PainelService {

    public record UsuarioDto(Long id, String nome, String email, String tipoUsuario) {}
    public record LoginResposta(String token, UsuarioDto usuario) {}
    public record Parcela(String chave, double total) {}
    public record Resumo(double producaoHoje, double producaoMes,
                         List<Parcela> porProduto, List<Parcela> porTurno, List<Parcela> ultimosDias) {}
    public record ProducaoDto(Long id, LocalDate data, String turno, String produto, String tipoTorra,
                              String tipoMoagem, Double quantidadeKg, String codigoBarras,
                              String observacoes, String usuarioNome) {}
    public record NovaProducao(LocalDate data, String turno, String produto, String tipoTorra,
                               String tipoMoagem, Double quantidadeKg, String codigoBarras, String observacoes) {}

    public record CodigoConhecido(String produto, String tipoTorra, String tipoMoagem) {}

    private static final Set<String> TURNOS = Set.of("Manhã", "Tarde", "Noite");
    private static final Set<String> PRODUTOS = Set.of("Café Torrado", "Café Moído", "Blend");
    private static final Set<String> TORRAS = Set.of("Claro", "Médio", "Escuro");
    private static final Set<String> MOAGENS = Set.of("Grossa", "Média", "Fina");
    /** Limite de segurança por registro: evita gravar um código de barras que caiu no campo de quantidade. */
    private static final double LIMITE_KG = 100_000.0;

    private final UsuarioRepository usuarios;
    private final ProducaoRepository producoes;
    private final SessaoService sessoes;
    private final BCryptPasswordEncoder encoder;

    public PainelService(UsuarioRepository usuarios, ProducaoRepository producoes,
                         SessaoService sessoes, BCryptPasswordEncoder encoder) {
        this.usuarios = usuarios;
        this.producoes = producoes;
        this.sessoes = sessoes;
        this.encoder = encoder;
    }

    /** Devolve null quando e-mail ou senha estão errados. */
    public LoginResposta login(String email, String senha) {
        if (vazio(email) || vazio(senha)) {
            return null;
        }
        UsuarioEntity u = usuarios.findByEmail(email.trim()).orElse(null);
        if (u == null || !encoder.matches(senha, u.getSenhaHash())) {
            return null;
        }
        return new LoginResposta(sessoes.criar(u.getId()),
                new UsuarioDto(u.getId(), u.getNome(), u.getEmail(), u.getTipoUsuario()));
    }

    @Transactional(readOnly = true)
    public Resumo resumo() {
        LocalDate hoje = LocalDate.now();
        LocalDate inicioMes = hoje.withDayOfMonth(1);
        LocalDate inicio14 = hoje.minusDays(13);
        LocalDate desde = inicioMes.isBefore(inicio14) ? inicioMes : inicio14;

        double totalHoje = 0;
        double totalMes = 0;
        Map<String, Double> porProduto = new TreeMap<>();
        Map<String, Double> porTurno = new TreeMap<>();
        Map<String, Double> porDia = new TreeMap<>();

        for (ProducaoEntity p : producoes.findByDataBetween(desde, hoje)) {
            double kg = p.getQuantidadeKg();
            porDia.merge(p.getData().toString(), kg, Double::sum);
            if (p.getData().equals(hoje)) {
                totalHoje += kg;
            }
            if (!p.getData().isBefore(inicioMes)) {
                totalMes += kg;
                porProduto.merge(p.getProduto(), kg, Double::sum);
                porTurno.merge(p.getTurno(), kg, Double::sum);
            }
        }

        List<Parcela> ultimosDias = new ArrayList<>();
        for (int i = 13; i >= 0; i--) {
            String dia = hoje.minusDays(i).toString();
            ultimosDias.add(new Parcela(dia, porDia.getOrDefault(dia, 0.0)));
        }
        return new Resumo(totalHoje, totalMes, parcelas(porProduto), parcelas(porTurno), ultimosDias);
    }

    @Transactional(readOnly = true)
    public List<ProducaoDto> listar(LocalDate inicio, LocalDate fim, String produto, String turno) {
        return producoes.findAll(Sort.by(Sort.Direction.DESC, "data", "id")).stream()
                .filter(p -> inicio == null || !p.getData().isBefore(inicio))
                .filter(p -> fim == null || !p.getData().isAfter(fim))
                .filter(p -> vazio(produto) || p.getProduto().equals(produto))
                .filter(p -> vazio(turno) || p.getTurno().equals(turno))
                .map(this::paraDto)
                .toList();
    }

    @Transactional
    public ProducaoDto registrar(Long usuarioId, NovaProducao n) {
        if (n.data() == null || vazio(n.turno()) || vazio(n.produto())
                || n.quantidadeKg() == null || n.quantidadeKg() <= 0) {
            throw new IllegalArgumentException("Preencha data, turno, produto e uma quantidade maior que zero.");
        }
        if (!TURNOS.contains(n.turno().trim()) || !PRODUTOS.contains(n.produto().trim())) {
            throw new IllegalArgumentException("Turno ou produto inválido.");
        }
        validarOpcao(n.tipoTorra(), TORRAS, "Tipo de torra inválido.");
        validarOpcao(n.tipoMoagem(), MOAGENS, "Tipo de moagem inválido.");
        if (n.quantidadeKg() > LIMITE_KG) {
            throw new IllegalArgumentException("Quantidade acima de " + (long) LIMITE_KG
                    + " kg. Confira se o código de barras não foi lido no campo errado.");
        }
        String codigo = nuloSeVazio(n.codigoBarras());
        if (codigo != null && codigo.length() > 50) {
            throw new IllegalArgumentException("O código de barras pode ter no máximo 50 caracteres.");
        }
        UsuarioEntity usuario = usuarios.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        ProducaoEntity p = new ProducaoEntity();
        p.setData(n.data());
        p.setTurno(n.turno().trim());
        p.setProduto(n.produto().trim());
        p.setTipoTorra(nuloSeVazio(n.tipoTorra()));
        p.setTipoMoagem(nuloSeVazio(n.tipoMoagem()));
        p.setQuantidadeKg(n.quantidadeKg());
        p.setCodigoBarras(nuloSeVazio(n.codigoBarras()));
        p.setObservacoes(nuloSeVazio(n.observacoes()));
        p.setUsuario(usuario);
        return paraDto(producoes.save(p));
    }

    /** Último produto registrado com esse código de barras (para preencher o formulário ao escanear). */
    @Transactional(readOnly = true)
    public CodigoConhecido buscarPorCodigo(String codigo) {
        if (vazio(codigo)) {
            return null;
        }
        return producoes.findFirstByCodigoBarrasOrderByDataDescIdDesc(codigo.trim())
                .map(p -> new CodigoConhecido(p.getProduto(), p.getTipoTorra(), p.getTipoMoagem()))
                .orElse(null);
    }

    private void validarOpcao(String valor, Set<String> permitidos, String mensagem) {
        if (!vazio(valor) && !permitidos.contains(valor.trim())) {
            throw new IllegalArgumentException(mensagem);
        }
    }

    private List<Parcela> parcelas(Map<String, Double> mapa) {
        return mapa.entrySet().stream().map(e -> new Parcela(e.getKey(), e.getValue())).toList();
    }

    private ProducaoDto paraDto(ProducaoEntity p) {
        return new ProducaoDto(p.getId(), p.getData(), p.getTurno(), p.getProduto(), p.getTipoTorra(),
                p.getTipoMoagem(), p.getQuantidadeKg(), p.getCodigoBarras(), p.getObservacoes(),
                p.getUsuario().getNome());
    }

    private boolean vazio(String s) {
        return s == null || s.isBlank();
    }

    private String nuloSeVazio(String s) {
        return vazio(s) ? null : s.trim();
    }
}
