package com.senai.pint.controller;

import com.senai.pint.entity.UsuarioEntity;
import com.senai.pint.model.UsuarioModel;
import com.senai.pint.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public List<UsuarioEntity> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioEntity> buscar(@PathVariable Long id) {

        UsuarioEntity usuario = service.buscar(id);

        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(usuario);
    }

    @PostMapping
    public ResponseEntity<UsuarioEntity> salvar(@RequestBody UsuarioModel model) {

        UsuarioEntity usuario = service.salvar(model);

        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioEntity> atualizar(
            @PathVariable Long id,
            @RequestBody UsuarioModel model) {

        UsuarioEntity usuario = service.atualizar(id, model);

        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(usuario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {

        if (!service.excluir(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}