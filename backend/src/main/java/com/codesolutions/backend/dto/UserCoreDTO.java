package com.codesolutions.backend.dto;

import com.codesolutions.backend.entities.User;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCoreDTO {
     Long id;
     String username;
     String email;
     LocalDateTime createdAt;
     LocalDateTime updatedAt;
     
           public static UserCoreDTO fromEntity(User user) {
          if (user == null) return null;
          
          return new UserCoreDTO(
                  user.getId(),
                  user.getUsername(),
                  user.getEmail(),
                  user.getCreatedAt(),
                  user.getUpdatedAt()
          );
      }
}