package com.codesolutions.backend.services;

import com.codesolutions.backend.dto.UserCoreDTO;
import com.codesolutions.backend.entities.User;

import java.util.Optional;

public interface IUserService {
    
    UserCoreDTO register(String email, String password, String username);
    
    Optional<UserCoreDTO> login(String email, String password);
    
    Optional<UserCoreDTO> findByEmail(String email);
    
    Optional<UserCoreDTO> findById(Long id);
}