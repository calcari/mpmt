package com.codesolutions.backend.controllers;

import com.codesolutions.backend.dto.TaskCoreDTO;
import com.codesolutions.backend.dto.TaskCreateDTO;
import com.codesolutions.backend.dto.TaskUpdateDTO;
import com.codesolutions.backend.dto.TaskWithDetailsDTO;
import com.codesolutions.backend.dto.TaskAssignationDTO;
import com.codesolutions.backend.services.TaskService;
import com.codesolutions.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin( origins = {"http://localhost:4200","http://localhost:8055","https://mpmt.calcari.dev", }, allowCredentials = "true")
public class TaskController {
    
    private final TaskService taskService;
    private final UserService userService;
    
    @PostMapping("/project/{projectId}")
    public TaskCoreDTO createTask(@PathVariable Long projectId,
                         @RequestBody TaskCreateDTO taskDTO,
                         @RequestAttribute Long userId) {
        userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        return taskService.createTask(taskDTO, projectId, userId);
    }
    
    @GetMapping("/project/{projectId}")
    public List<TaskCoreDTO> getProjectTasks(@PathVariable Long projectId,
                                           @RequestAttribute Long userId) {
        return taskService.getProjectTasks(projectId);
    }

    
    @GetMapping("/{taskId}/details")
    public TaskWithDetailsDTO getTask(@PathVariable Long taskId,
                                   @RequestAttribute Long userId) {
        return taskService.getTaskWithDetails(taskId)
                .orElseThrow(() -> new RuntimeException("Tâche non trouvée"));
    }
    
    @PutMapping("/{taskId}")
    public TaskCoreDTO updateTask(@PathVariable Long taskId,
                         @RequestBody TaskUpdateDTO taskDTO,
                         @RequestAttribute Long userId) {
        userService.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        return taskService.updateTask(taskId, taskDTO, userId);
    }

    @PostMapping("/{taskId}/assign")
    public TaskAssignationDTO assignTaskToUser(@PathVariable Long taskId,
                                         @RequestParam Long assigneeId,
                                         @RequestAttribute(name="userId") Long assignerId) {
        return taskService.assignTaskToUser(taskId, assigneeId, assignerId);
    }

} 