package com.codesolutions.backend.controllers.inputs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RegisterRequestBody {

    @Email
    private String email;

    @Min(8)
    private String password;

    private String username;
} 