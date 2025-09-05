package com.codesolutions.backend.controllers;

import com.codesolutions.backend.controllers.inputs.LoginRequestBody;
import com.codesolutions.backend.controllers.inputs.RegisterRequestBody;
import com.codesolutions.backend.dto.UserCoreDTO;
import com.codesolutions.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin( origins = {"http://localhost:4200","http://localhost:8055","https://mpmt.calcari.dev", }, allowCredentials = "true")
public class AuthController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<UserCoreDTO> register(@RequestBody RegisterRequestBody body) {
        UserCoreDTO user = userService.register(body.getEmail(), body.getPassword(), body.getUsername());
        return ResponseEntity.ok().header("Set-Cookie", buildSetCookieHeader(user.getId())).body(user);
    }
    
    @PostMapping("/login")
    public ResponseEntity<UserCoreDTO> login(@RequestBody LoginRequestBody body) {
        return userService.login(body.getEmail(), body.getPassword())
                .map(user -> ResponseEntity.ok().header("Set-Cookie", buildSetCookieHeader(user.getId())).body(user))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    private String buildSetCookieHeader(Long userId){
        return  "X-User-Id=" + userId + "; Path=/; HttpOnly; SameSite=None; Secure";
    }
} 