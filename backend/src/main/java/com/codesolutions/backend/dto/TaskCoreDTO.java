package com.codesolutions.backend.dto;

import com.codesolutions.backend.entities.Task;
import com.codesolutions.backend.enums.TaskPriority;
import com.codesolutions.backend.enums.TaskStatus;
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
public class TaskCoreDTO {
    private Long id;
    private String name;
    private String description;
    private LocalDate dueDate;
    private LocalDate completedDate;
    private TaskStatus status;
    private TaskPriority priority;
    private Long projectId;
    private Long createdById;
    private String createdByUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TaskCoreDTO fromEntity(Task task) {
        if (task == null) return null;
        
        return new TaskCoreDTO(
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
                task.getUpdatedAt()
        );
    }
}
