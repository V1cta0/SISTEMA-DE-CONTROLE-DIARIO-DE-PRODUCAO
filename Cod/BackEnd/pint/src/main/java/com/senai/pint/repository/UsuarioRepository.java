package com.senai.pint.repository;

import com.senai.pint.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<UsuarioEntity, Long> {
    boolean existsByEmail(String email);
}
