package com.senai.pint.config;

import com.senai.pint.service.SessaoService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    private final SessaoService sessoes;

    public AuthInterceptor(SessaoService sessoes) {
        this.sessoes = sessoes;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String cabecalho = request.getHeader("Authorization");
        Long usuarioId = null;
        if (cabecalho != null && cabecalho.startsWith("Bearer ")) {
            usuarioId = sessoes.usuarioId(cabecalho.substring(7).trim());
        }

        if (usuarioId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"erro\":\"Sessão expirada. Faça login novamente.\"}");
            return false;
        }

        request.setAttribute("usuarioId", usuarioId);
        return true;
    }
}
