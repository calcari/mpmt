package com.codesolutions.backend.controllers.inputs;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginRequestBody {

    @Email
    private String email;
    private String password;
} 