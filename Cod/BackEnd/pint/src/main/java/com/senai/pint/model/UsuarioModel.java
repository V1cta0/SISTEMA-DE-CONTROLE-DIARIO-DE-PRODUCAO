package com.senai.pint.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioModel {

    private String nome;
    private String email;
    private String senhaHash;
    private String tipoUsuario;
}