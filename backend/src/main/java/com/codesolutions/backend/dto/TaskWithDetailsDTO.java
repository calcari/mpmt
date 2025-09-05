package com.codesolutions.backend.dto;

import com.codesolutions.backend.entities.Task;
import com.codesolutions.backend.enums.TaskPriority;
import com.codesolutions.backend.enums.TaskStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class TaskWithDetailsDTO extends TaskCoreDTO {
    private List<TaskAssignationDTO> assignations;
    private List<TaskHistoryEntryDTO> history;

    public TaskWithDetailsDTO(Long id, String name, String description, LocalDate dueDate, LocalDate completedDate, TaskStatus status, TaskPriority priority, Long projectId, Long createdById, String createdByUsername, LocalDateTime createdAt, LocalDateTime updatedAt, List<TaskAssignationDTO> assignations, List<TaskHistoryEntryDTO> history) {
        super(id, name, description, dueDate, completedDate, status, priority, projectId, createdById, createdByUsername, createdAt, updatedAt);
        this.assignations = assignations;
        this.history = history;
    }

    public static TaskWithDetailsDTO fromEntity(Task task) {
        if (task == null) return null;
        
        List<TaskAssignationDTO> assignations = null;
        if (task.getAssignations() != null) {
            assignations = task.getAssignations().stream()
                    .map(TaskAssignationDTO::fromEntity)
                    .toList();
        }
        
        List<TaskHistoryEntryDTO> history = null;
        if (task.getHistory() != null) {
            history = task.getHistory().stream()
                    .map(TaskHistoryEntryDTO::fromEntity)
                    .toList();
        }
        
        return new TaskWithDetailsDTO(
                task.getId(),
                task.getName(),
                task.getDescription(),
                task.getDueDate(),
                task.getCompletedDate(),
                task.getStatus(),
                task.getPriority(),
                task.getProject() != null ? task.getProject().getId() : null,
                task.getCreatedBy() != null ? task.getCreatedBy().getId() : null,
                task.getCreatedBy() != null ? task.getCreatedBy().getUsername() : null,
                task.getCreatedAt(),
                task.getUpdatedAt(),
                assignations,
                history
        );
    }
}
