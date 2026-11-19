package com.senai.pint.repository;

import com.senai.pint.entity.ProducaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ProducaoRepository extends JpaRepository<ProducaoEntity, Long> {
    List<ProducaoEntity> findByUsuarioId(Long usuarioId);
    List<ProducaoEntity> findByDataBetween(LocalDate inicio, LocalDate fim);
    Optional<ProducaoEntity> findFirstByCodigoBarrasOrderByDataDescIdDesc(String codigoBarras);
}
