package com.senai.pint.repository;

import com.senai.pint.entity.ProducaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProducaoRepository extends JpaRepository<ProducaoEntity, Long> {
    List<ProducaoEntity> findByUsuarioId(Long usuarioId);
}
