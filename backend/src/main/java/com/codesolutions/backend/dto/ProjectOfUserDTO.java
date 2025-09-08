package com.codesolutions.backend.dto;

import com.codesolutions.backend.entities.Project;
import com.codesolutions.backend.entities.ProjectMembership;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data()
@EqualsAndHashCode(callSuper = true)
public class ProjectOfUserDTO extends ProjectCoreDTO {
    private ProjectMembershipCoreDTO membership;

    public ProjectOfUserDTO(Long id, String name, String description, LocalDate startDate, LocalDateTime createdAt, LocalDateTime updatedAt, ProjectMembershipCoreDTO membership) {
        super(id, name, description, startDate, createdAt, updatedAt);
        this.membership = membership;
    }

    public static ProjectOfUserDTO fromEntity(Project project, ProjectMembership membership) {
        if (project == null ) return null;
        ProjectMembershipCoreDTO membershipDTO =  ProjectMembershipCoreDTO.fromEntity(membership);
        return new ProjectOfUserDTO(project.getId(), project.getName(), project.getDescription(), project.getStartDate(), project.getCreatedAt(), project.getUpdatedAt(), membershipDTO);
    }
}
