package com.codesolutions.backend.dto;

import com.codesolutions.backend.entities.ProjectMembership;
import com.codesolutions.backend.enums.ProjectRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMembershipCoreDTO {
    private Long id;
    private Long projectId;
    private String projectName;
    private Long userId;
    private String username;
    private String email;
    private ProjectRole role;
    private Long invitedById;
    private String invitedByUsername;
    private LocalDateTime invitedAt;
    private LocalDateTime acceptedAt;
    
    public static ProjectMembershipCoreDTO fromEntity(ProjectMembership member) {
        if (member == null) return null;
        
        return new ProjectMembershipCoreDTO(
                member.getId(),
                member.getProject() != null ? member.getProject().getId() : null,
                member.getProject() != null ? member.getProject().getName() : null,
                member.getUser() != null ? member.getUser().getId() : null,
                member.getUser() != null ? member.getUser().getUsername() : null,
                member.getUser() != null ? member.getUser().getEmail() : null,
                member.getRole(),
                member.getInvitedBy() != null ? member.getInvitedBy().getId() : null,
                member.getInvitedBy() != null ? member.getInvitedBy().getUsername() : null,
                member.getInvitedAt(),
                member.getAcceptedAt()
        );
    }
}
