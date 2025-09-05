package com.codesolutions.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * Middleware qui simule une authentification en récupérant l'userId dans un header custom.
 */
@Component
public class UserIdMiddleware extends OncePerRequestFilter {

    private static final List<String> PUBLIC_ROUTES = Arrays.asList(
            "/api/auth/login",
            "/api/auth/register"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws ServletException, IOException {
        String requestPath = req.getRequestURI();

        if (!requestPath.startsWith("/api/") || PUBLIC_ROUTES.contains(requestPath) || req.getMethod().equals("OPTIONS") /* Pour laisser passer le preflight CORS */) {
            chain.doFilter(req, res);
            return;
        }

        Cookie[] cookies = req.getCookies();

        String userId$ = cookies == null ? null : Arrays.stream(cookies)
                .filter(c -> "X-User-Id".equalsIgnoreCase(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);

        if (userId$ == null) {
            res.setStatus(HttpStatus.UNAUTHORIZED.value());
            return;
        }
        req.setAttribute("userId", userId$);

        chain.doFilter(req, res);
    }

}
