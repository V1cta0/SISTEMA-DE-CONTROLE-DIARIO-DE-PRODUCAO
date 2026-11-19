package com.senai.pint.service;

import com.senai.pint.entity.UsuarioEntity;
import com.senai.pint.model.UsuarioModel;
import com.senai.pint.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public List<UsuarioEntity> listar() {
        return repository.findAll();
    }

    public UsuarioEntity buscar(Long id) {
        return repository.findById(id).orElse(null);
    }

    public UsuarioEntity salvar(UsuarioModel model) {

        UsuarioEntity usuario = new UsuarioEntity();

        usuario.setNome(model.getNome());
        usuario.setEmail(model.getEmail());
        usuario.setSenhaHash(model.getSenhaHash());
        usuario.setTipoUsuario(model.getTipoUsuario());

        return repository.save(usuario);
    }

    public UsuarioEntity atualizar(Long id, UsuarioModel model) {

        UsuarioEntity usuario = repository.findById(id).orElse(null);

        if (usuario == null) {
            return null;
        }

        usuario.setNome(model.getNome());
        usuario.setEmail(model.getEmail());
        usuario.setSenhaHash(model.getSenhaHash());
        usuario.setTipoUsuario(model.getTipoUsuario());

        return repository.save(usuario);
    }

    public boolean excluir(Long id) {

        if (!repository.existsById(id)) {
            return false;
        }

        repository.deleteById(id);

        return true;
    }
}