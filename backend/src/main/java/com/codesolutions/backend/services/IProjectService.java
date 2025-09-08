package com.codesolutions.backend.services;

import com.codesolutions.backend.dto.ProjectCoreDTO;
import com.codesolutions.backend.dto.ProjectCreateDTO;
import com.codesolutions.backend.dto.ProjectMembershipCoreDTO;
import com.codesolutions.backend.dto.ProjectOfUserDTO;
import com.codesolutions.backend.entities.Project;
import com.codesolutions.backend.enums.ProjectRole;

import java.util.List;
import java.util.Optional;

public interface IProjectService {

    ProjectCoreDTO createProject(ProjectCreateDTO projectDTO, Long creatorId);
    
    List<ProjectOfUserDTO> getUserProjects(Long userId);
    
    Optional<Project> getProjectById(Long projectId);

    List<ProjectMembershipCoreDTO> getProjectMembers(Long projectId);

    boolean isOperationAllowed(Long projectId, Long userId, ProjectRole... allowedRoles);

    ProjectRole getUserProjectRole(Long projectId, Long userId);
    
}