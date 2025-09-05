package com.codesolutions.backend.controllers;

import com.codesolutions.backend.dto.*;
import com.codesolutions.backend.enums.ProjectRole;
import com.codesolutions.backend.services.ProjectService;
import com.codesolutions.backend.services.UserService;
import com.codesolutions.backend.utils.BusinessErrorEnum;
import com.codesolutions.backend.utils.BusinessResponseStatusException;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.web.server.ResponseStatusException;


@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin( origins = {"http://localhost:4200","http://localhost:8055","https://mpmt.calcari.dev", }, allowCredentials = "true")
public class ProjectController {
    
    private final ProjectService projectService;
    private final UserService userService;

    
    @GetMapping("/me")
    public List<ProjectOfUserDTO> getUserProjects(@RequestAttribute Long userId) {
        return projectService.getUserProjects(userId);
    }

    @PostMapping
    public ProjectCoreDTO createProject(@RequestBody ProjectCreateDTO projectDTO,
                                        @RequestAttribute Long userId) {
        /*
         * On peut faire plusieurs appels à findById (ici ou dans les services ...) sans que ça duplique les appels à la db.
         * Spring cache les appels simples (repository.findById) au niveau de l'ORM (il y a un contexte partagé pour chaque requète HTTP).
         * */
       userService.findById(userId).orElseThrow();

        return projectService.createProject(projectDTO, userId);
    }

    @GetMapping("/{projectId}")
    public ProjectWithTasksDTO getProject(@PathVariable Long projectId, 
                                       @RequestAttribute Long userId) {
        if (!projectService.isUserProjectMember(projectId, userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "L'utilisateur n'est pas membre de ce projet");
        }
        
        return projectService.getProjectWithTasks(projectId)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé"));
    }
    
    @PostMapping("/{projectId}/members")
    public ProjectMembershipCoreDTO addMemberToProject(@PathVariable Long projectId,
                                                       @RequestBody ProjectMembershipCreateDTO memberDTO,
                                                       @RequestAttribute(name="userId") Long inviterId) {

        if(!projectService.isOperationAllowed(projectId, inviterId, ProjectRole.ADMIN)){
            throw new BusinessResponseStatusException(BusinessErrorEnum.MISSING_RIGHTS, HttpStatus.UNAUTHORIZED, "Seuls les administrateurs du projet peuvent ajouter des membres.");
        }
        
        memberDTO.setProjectId(projectId);
        return projectService.addMemberToProject(memberDTO, inviterId);
    }
    
    @GetMapping("/{projectId}/members")
    public List<ProjectMembershipCoreDTO> getProjectMembers(@PathVariable Long projectId,
                                                            @RequestAttribute Long userId) {
        if (!projectService.isUserProjectMember(projectId, userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "L'utilisateur n'est pas membre de ce projet");
        }
        
        return projectService.getProjectMembers(projectId);
    }
} 