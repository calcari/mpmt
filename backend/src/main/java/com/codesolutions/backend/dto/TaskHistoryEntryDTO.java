package com.codesolutions.backend.dto;

import com.codesolutions.backend.entities.TaskHistoryEntry;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskHistoryEntryDTO {
    private Long id;
    private Long taskId;
    private String taskName;
    private String field;
    private String oldValue;
    private String newValue;
    private Long changedById;
    private String changedByUsername;
    private LocalDateTime changedAt;
    
    public static TaskHistoryEntryDTO fromEntity(TaskHistoryEntry entry) {
        if (entry == null) return null;
        
        return new TaskHistoryEntryDTO(
                entry.getId(),
                entry.getTask() != null ? entry.getTask().getId() : null,
                entry.getTask() != null ? entry.getTask().getName() : null,
                entry.getField(),
                entry.getOldValue(),
                entry.getNewValue(),
                entry.getChangedBy() != null ? entry.getChangedBy().getId() : null,
                entry.getChangedBy() != null ? entry.getChangedBy().getUsername() : null,
                entry.getChangedAt()
        );
    }
}
