package com.senai.pint.service;

import com.senai.pint.entity.ProducaoEntity;
import com.senai.pint.entity.UsuarioEntity;
import com.senai.pint.model.ProducaoModel;
import com.senai.pint.repository.ProducaoRepository;
import com.senai.pint.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProducaoService {

    private final ProducaoRepository repository;
    private final UsuarioRepository usuarioRepository;

    public ProducaoService(ProducaoRepository repository, UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<ProducaoModel> listar() {
        return repository.findAll().stream().map(this::toModel).toList();
    }

    public ProducaoModel buscar(Long id) {
        return repository.findById(id).map(this::toModel).orElse(null);
    }

    public List<ProducaoModel> listarPorUsuario(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId).stream().map(this::toModel).toList();
    }

    public ProducaoModel salvar(ProducaoModel model) {
        UsuarioEntity usuario = buscarUsuario(model.getUsuarioId());
        if (usuario == null) {
            return null;
        }

        ProducaoEntity entity = toEntity(model, usuario);
        return toModel(repository.save(entity));
    }

    public ProducaoModel atualizar(Long id, ProducaoModel model) {
        ProducaoEntity entity = repository.findById(id).orElse(null);

        if (entity == null) {
            return null;
        }

        UsuarioEntity usuario = buscarUsuario(model.getUsuarioId());
        if (usuario == null) {
            return null;
        }

        entity.setData(model.getData());
        entity.setTurno(model.getTurno());
        entity.setProduto(model.getProduto());
        entity.setTipoTorra(model.getTipoTorra());
        entity.setTipoMoagem(model.getTipoMoagem());
        entity.setQuantidadeKg(model.getQuantidadeKg());
        entity.setCodigoBarras(model.getCodigoBarras());
        entity.setObservacoes(model.getObservacoes());
        entity.setUsuario(usuario);

        return toModel(repository.save(entity));
    }

    public boolean excluir(Long id) {
        if (!repository.existsById(id)) {
            return false;
        }

        repository.deleteById(id);
        return true;
    }

    private UsuarioEntity buscarUsuario(Long id) {
        if (id == null) {
            return null;
        }
        return usuarioRepository.findById(id).orElse(null);
    }

    private ProducaoEntity toEntity(ProducaoModel model, UsuarioEntity usuario) {
        ProducaoEntity entity = new ProducaoEntity();
        entity.setId(model.getId());
        entity.setData(model.getData());
        entity.setTurno(model.getTurno());
        entity.setProduto(model.getProduto());
        entity.setTipoTorra(model.getTipoTorra());
        entity.setTipoMoagem(model.getTipoMoagem());
        entity.setQuantidadeKg(model.getQuantidadeKg());
        entity.setCodigoBarras(model.getCodigoBarras());
        entity.setObservacoes(model.getObservacoes());
        entity.setUsuario(usuario);
        entity.setCriadoEm(model.getCriadoEm());
        return entity;
    }

    private ProducaoModel toModel(ProducaoEntity entity) {
        return new ProducaoModel(
                entity.getId(),
                entity.getData(),
                entity.getTurno(),
                entity.getProduto(),
                entity.getTipoTorra(),
                entity.getTipoMoagem(),
                entity.getQuantidadeKg(),
                entity.getCodigoBarras(),
                entity.getObservacoes(),
                entity.getUsuario().getId(),
                entity.getCriadoEm()
        );
    }
}
