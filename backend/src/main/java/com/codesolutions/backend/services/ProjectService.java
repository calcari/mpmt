package com.codesolutions.backend.services;

import com.codesolutions.backend.dto.*;
import com.codesolutions.backend.entities.Project;
import com.codesolutions.backend.entities.ProjectMembership;
import com.codesolutions.backend.entities.User;
import com.codesolutions.backend.enums.ProjectRole;
import com.codesolutions.backend.repositories.ProjectMembershipRepository;
import com.codesolutions.backend.repositories.ProjectRepository;
import com.codesolutions.backend.repositories.UserRepository;
import com.codesolutions.backend.utils.BusinessErrorEnum;
import com.codesolutions.backend.utils.BusinessResponseStatusException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProjectService implements IProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMembershipRepository projectMembershipRepository;
    private final UserRepository userRepository;
    private final INotificationService notificationService;

    public ProjectCoreDTO createProject(ProjectCreateDTO projectDTO, Long creatorId) {

        Project project = new Project();
        project.setName(projectDTO.getName());
        project.setDescription(projectDTO.getDescription());
        project.setStartDate(projectDTO.getStartDate());

        project = projectRepository.save(project);
        var creatorRef = userRepository.getReferenceById(creatorId);

        // Add creator as admin
        ProjectMembership membership = new ProjectMembership();
        membership.setUser(creatorRef);
        membership.setInvitedBy(creatorRef);
        membership.setProject(project);
        membership.setRole(ProjectRole.ADMIN);
        membership.setInvitedAt(LocalDateTime.now());
        membership.setAcceptedAt(LocalDateTime.now());
        
        projectMembershipRepository.save(membership);
        
        return ProjectCoreDTO.fromEntity(project);
    }
    
    public List<ProjectOfUserDTO> getUserProjects(Long userId) {
        List<Project> projects = projectRepository.findByUserId(userId);
        List<ProjectMembership> memberships = projectMembershipRepository.findByUserId(userId);
        return projects.stream().map(project -> {
            var membership = memberships.stream().filter(mbs -> mbs.getProject().getId().equals(project.getId())).findFirst().orElseThrow();
           return ProjectOfUserDTO.fromEntity(project, membership);
        }).toList();
    }
    
    public Optional<Project> getProjectById(Long projectId) {
        return projectRepository.findById(projectId);
    }
    
    public Optional<ProjectWithTasksDTO> getProjectWithTasks(Long projectId) {
        return projectRepository.findById(projectId)
                .map(ProjectWithTasksDTO::fromEntity);
    }
    
    public ProjectMembershipCoreDTO addMemberToProject(ProjectMembershipCreateDTO membershipDTO, Long inviterId) {
        Project project = projectRepository.findById(membershipDTO.getProjectId())
                .orElseThrow();

        User inviter = userRepository.findById(inviterId).orElseThrow();

        User invitee = userRepository.findByEmail(membershipDTO.getUserEmail())
                .orElseThrow(() -> new BusinessResponseStatusException(BusinessErrorEnum.INVITEE_NOT_FOUND, HttpStatus.NOT_FOUND, "User '" + membershipDTO.getUserEmail() + "' not found"));


        if (projectMembershipRepository.existsByProjectIdAndUserId(membershipDTO.getProjectId(), invitee.getId())) {
            throw new BusinessResponseStatusException(BusinessErrorEnum.INVITEE_ALREADY_MEMBER, HttpStatus.BAD_REQUEST, "User '" + membershipDTO.getUserEmail() + "' is already member of the project");
        }
        
        ProjectMembership membership = new ProjectMembership();
        membership.setProject(project);
        membership.setUser(invitee);
        membership.setRole(membershipDTO.getRole());
        membership.setInvitedBy(inviter);
        membership.setInvitedAt(LocalDateTime.now());

        this.notificationService.sendProjectInviteNotification(project, invitee, inviter);
        
        membership = projectMembershipRepository.save(membership);
        return ProjectMembershipCoreDTO.fromEntity(membership);
    }

    
    public List<ProjectMembershipCoreDTO> getProjectMembers(Long projectId) {
        List<ProjectMembership> members = projectMembershipRepository.findByProjectId(projectId);
        return members.stream()
                .map(ProjectMembershipCoreDTO::fromEntity)
                .toList();
    }
    
    public boolean isUserProjectMember(Long projectId, Long userId) {
        return projectMembershipRepository.existsByProjectIdAndUserId(projectId, userId);
    }
    
    public ProjectRole getUserProjectRole(Long projectId, Long userId) {
        return projectMembershipRepository.findByProjectIdAndUserId(projectId, userId).map(x->x.getRole()).orElse(null);
    }

    public boolean isOperationAllowed(Long projectId, Long userId, ProjectRole... allowedRoles){
        var role = this.getUserProjectRole(projectId, userId);
        return Arrays.stream(allowedRoles).toList().contains(role);
    }

} 