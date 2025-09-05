package com.codesolutions.backend.integration;

import com.codesolutions.backend.controllers.inputs.LoginRequestBody;
import com.codesolutions.backend.controllers.inputs.RegisterRequestBody;
import com.codesolutions.backend.dto.UserCoreDTO;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;
import org.springframework.test.context.ActiveProfiles;

import com.codesolutions.backend.utils.BusinessErrorEnum;

import com.codesolutions.backend.utils.TestIds;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthTest {

    @Autowired
    private MockMvc mockMvc;
    

    @Test
    void register_Success() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                .contentType("application/json")
                .content("""
                    {
                        "email": "nouveau@exemple.fr",
                        "password": "passowrd",
                        "username": "nouveau_username"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.username").value("nouveau_username"));
    }

    @Test
    void register_DuplicateEmail() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                .contentType("application/json")
                .content("""
                    {
                        "email": "admin_p1@test.com",
                        "password": "password",
                        "username": "nouveau_username"
                    }
                    """))
            .andExpect(status().isConflict())
            .andExpect(content().string(containsString(BusinessErrorEnum.DUPLICATE_EMAIL.name())));

    }

    @Test
    void register_DuplicateUsername() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                .contentType("application/json")
                .content("""
                    {
                        "email": "nouveau_email@test.fr",
                        "password": "password",
                        "username": "admin_p1"
                    }
                    """))
            .andExpect(status().isConflict())
            .andExpect(content().string(containsString(BusinessErrorEnum.DUPLICATE_USERNAME.name())));
    }

    @Test
    void login_Success() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType("application/json")
                .content("""
                    {
                        "email": "admin_p1@test.com",
                        "password": "password"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.username").value("admin_p1"));
    }

    @Test
    void login_WrongUsername() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType("application/json")
                .content("""
                    {
                        "email": "wrong@test.com",
                        "password": "password"
                    }
                    """))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void login_WrongPassword() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType("application/json")
                .content("""
                    {
                        "email": "admin_p1@test.com",
                        "password": "mauvais_motdepasse"
                    }
                    """))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void auth_NoCookie() throws Exception {
        mockMvc.perform(get("/api/projects/1"))
            .andExpect(status().isUnauthorized());
    }

}
