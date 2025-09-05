package com.codesolutions.backend.services;

import com.codesolutions.backend.utils.BusinessErrorEnum;
import com.codesolutions.backend.dto.UserCoreDTO;
import com.codesolutions.backend.entities.User;
import com.codesolutions.backend.repositories.UserRepository;
import com.codesolutions.backend.utils.BusinessResponseStatusException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.stereotype.Service;
import org.springframework.web.ErrorResponseException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    
    private final UserRepository userRepository;
    
    public UserCoreDTO register(String email, String password, String username) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setUsername(username);

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BusinessResponseStatusException(BusinessErrorEnum.DUPLICATE_EMAIL, HttpStatus.CONFLICT ,"Cet email est déjà utilisé");
        }
        
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new BusinessResponseStatusException(BusinessErrorEnum.DUPLICATE_USERNAME, HttpStatus.CONFLICT ,"Ce nom d'utilisateur est déjà utilisé");
        }
        
        User savedUser = userRepository.save(user);
        return UserCoreDTO.fromEntity(savedUser);
    }
    
    public Optional<UserCoreDTO> login(String email, String password) {
        return userRepository.findByEmail(email)
                //Dans un projet réel on devrait vérifier le hash du mot de passe.
                .filter(user -> password.equals(user.getPassword())).map(UserCoreDTO::fromEntity);
    }
    
    public Optional<UserCoreDTO> findByEmail(String email) {
        return userRepository.findByEmail(email).map(UserCoreDTO::fromEntity);
    }
    
    public Optional<UserCoreDTO> findById(Long id) {
        return userRepository.findById(id).map(UserCoreDTO::fromEntity);
    }

} 