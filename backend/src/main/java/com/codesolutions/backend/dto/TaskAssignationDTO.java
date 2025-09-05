package com.codesolutions.backend.dto;

import com.codesolutions.backend.entities.TaskAssignation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskAssignationDTO {
    private Long taskId;
    private String taskName;
    private Long assigneeId;
    private String assigneeUsername;
    private String assigneeEmail;
    private LocalDateTime assignedAt;
    
    public static TaskAssignationDTO fromEntity(TaskAssignation assignation) {
        if (assignation == null) return null;
        
        return new TaskAssignationDTO(
                assignation.getId().taskId(),
                assignation.getTask() != null ? assignation.getTask().getName() : null,
                assignation.getId().userId(),
                assignation.getUser() != null ? assignation.getUser().getUsername() : null,
                assignation.getUser() != null ? assignation.getUser().getEmail() : null,
                assignation.getAssignedAt()
        );
    }
}
