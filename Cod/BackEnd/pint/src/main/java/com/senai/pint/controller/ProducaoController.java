package com.senai.pint.controller;

import com.senai.pint.model.ProducaoModel;
import com.senai.pint.service.ProducaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/producoes")
@CrossOrigin
public class ProducaoController {

    private final ProducaoService service;

    public ProducaoController(ProducaoService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProducaoModel> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProducaoModel> buscar(@PathVariable Long id) {
        ProducaoModel producao = service.buscar(id);
        return producao == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(producao);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<ProducaoModel> listarPorUsuario(@PathVariable Long usuarioId) {
        return service.listarPorUsuario(usuarioId);
    }

    @PostMapping
    public ResponseEntity<ProducaoModel> salvar(@RequestBody ProducaoModel model) {
        ProducaoModel producao = service.salvar(model);
        return producao == null ? ResponseEntity.badRequest().build() : ResponseEntity.ok(producao);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProducaoModel> atualizar(@PathVariable Long id, @RequestBody ProducaoModel model) {
        ProducaoModel producao = service.atualizar(id, model);
        return producao == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(producao);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        return service.excluir(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
