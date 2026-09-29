package com.senai.pint.model;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProducaoModel {
    private Long id;
    private LocalDate data;
    private String turno;
    private String produto;
    private String tipoTorra;
    private String tipoMoagem;
    private Double quantidadeKg;
    private String codigoBarras;
    private String observacoes;
    private Long usuarioId;
    private LocalDateTime criadoEm;
}
