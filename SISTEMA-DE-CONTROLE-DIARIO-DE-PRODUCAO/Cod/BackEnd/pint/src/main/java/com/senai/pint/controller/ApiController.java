package com.senai.pint.controller;

import com.senai.pint.service.LeitorCodigoBarras;
import com.senai.pint.service.PainelService;
import com.senai.pint.service.PainelService.NovaProducao;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Map;

/** Rotas usadas pelo site (React). Tudo, menos o login, exige o token no cabeçalho Authorization. */
@RestController
@RequestMapping("/api")
public class ApiController {

    private final PainelService painel;
    private final LeitorCodigoBarras leitor;

    public ApiController(PainelService painel, LeitorCodigoBarras leitor) {
        this.painel = painel;
        this.leitor = leitor;
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> corpo) {
        var resposta = painel.login(corpo.get("email"), corpo.get("senha"));
        return resposta == null
                ? erro(HttpStatus.UNAUTHORIZED, "E-mail ou senha incorretos.")
                : ResponseEntity.ok(resposta);
    }

    @GetMapping("/dashboard/resumo")
    public ResponseEntity<?> resumo() {
        return ResponseEntity.ok(painel.resumo());
    }

    @GetMapping("/producoes")
    public ResponseEntity<?> listar(
            @RequestParam(name = "dataInicio", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(name = "dataFim", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim,
            @RequestParam(name = "produto", required = false) String produto,
            @RequestParam(name = "turno", required = false) String turno) {
        return ResponseEntity.ok(painel.listar(dataInicio, dataFim, produto, turno));
    }

    @PostMapping("/producoes")
    public ResponseEntity<?> registrar(@RequestAttribute("usuarioId") Long usuarioId,
                                       @RequestBody NovaProducao corpo) {
        try {
            return ResponseEntity.ok(painel.registrar(usuarioId, corpo));
        } catch (IllegalArgumentException e) {
            return erro(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (DataIntegrityViolationException e) {
            return erro(HttpStatus.BAD_REQUEST, "Os dados não puderam ser gravados. Confira os campos e tente de novo.");
        }
    }

    /** Devolve o produto já registrado com esse código de barras, ou 204 se o código ainda é novo. */
    @GetMapping("/codigo-barras/{codigo}")
    public ResponseEntity<?> consultarCodigo(@PathVariable("codigo") String codigo) {
        var conhecido = painel.buscarPorCodigo(codigo);
        return conhecido == null ? ResponseEntity.noContent().build() : ResponseEntity.ok(conhecido);
    }

    @PostMapping("/codigo-barras/ler")
    public ResponseEntity<?> lerCodigo(@RequestParam("imagem") MultipartFile imagem) throws IOException {
        return leitor.ler(imagem.getBytes())
                .<ResponseEntity<?>>map(codigo -> ResponseEntity.ok(Map.of("codigo", codigo)))
                .orElseGet(() -> erro(HttpStatus.UNPROCESSABLE_ENTITY,
                        "Não foi possível ler o código de barras. Aproxime a câmera e tente de novo."));
    }

    private ResponseEntity<Map<String, String>> erro(HttpStatus status, String mensagem) {
        return ResponseEntity.status(status).body(Map.of("erro", mensagem));
    }
}
