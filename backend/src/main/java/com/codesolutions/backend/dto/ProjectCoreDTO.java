package com.codesolutions.backend.dto;

import com.codesolutions.backend.entities.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectCoreDTO {

    Long id;
    String name;
    String description;
    LocalDate startDate;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    
    public static ProjectCoreDTO fromEntity(Project project) {
        if (project == null) return null;
        
        return new ProjectCoreDTO(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getStartDate(),
                project.getCreatedAt(),
                project.getUpdatedAt()
        );
    }
} 