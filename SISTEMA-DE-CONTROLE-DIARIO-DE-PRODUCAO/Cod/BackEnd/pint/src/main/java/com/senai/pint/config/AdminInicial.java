package com.senai.pint.config;

import com.senai.pint.entity.UsuarioEntity;
import com.senai.pint.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/** Cria o usuário padrão da tela de login na primeira vez que o back-end sobe. */
@Component
public class AdminInicial implements CommandLineRunner {

    private final UsuarioRepository usuarios;
    private final BCryptPasswordEncoder encoder;

    public AdminInicial(UsuarioRepository usuarios, BCryptPasswordEncoder encoder) {
        this.usuarios = usuarios;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (usuarios.existsByEmail("admin@cical.com.br")) {
            return;
        }
        UsuarioEntity admin = new UsuarioEntity();
        admin.setNome("Administrador");
        admin.setEmail("admin@cical.com.br");
        admin.setSenhaHash(encoder.encode("admin123"));
        admin.setTipoUsuario("admin");
        usuarios.save(admin);
    }
}
