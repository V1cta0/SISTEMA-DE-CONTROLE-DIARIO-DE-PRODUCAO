package com.senai.pint.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/** Guarda os tokens de login em memória (somem quando o back-end reinicia). */
@Service
public class SessaoService {

    private final Map<String, Long> sessoes = new ConcurrentHashMap<>();

    public String criar(Long usuarioId) {
        String token = UUID.randomUUID().toString();
        sessoes.put(token, usuarioId);
        return token;
    }

    public Long usuarioId(String token) {
        return token == null ? null : sessoes.get(token);
    }
}
