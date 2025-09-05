package com.codesolutions.backend.dto;

import com.codesolutions.backend.enums.ProjectRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMembershipCreateDTO {
    private Long projectId;
    private String userEmail;
    private ProjectRole role;
    private Long inviterId;
}
