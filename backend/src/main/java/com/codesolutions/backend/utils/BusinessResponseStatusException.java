package com.codesolutions.backend.utils;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class BusinessResponseStatusException extends ResponseStatusException {
    public BusinessResponseStatusException(BusinessErrorEnum code, HttpStatus status, String message){
        super(status, message);
        this.getBody().setProperty("code", code.name());
    }
}
