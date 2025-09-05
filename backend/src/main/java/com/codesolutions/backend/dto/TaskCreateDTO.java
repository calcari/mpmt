package com.codesolutions.backend.dto;

import com.codesolutions.backend.enums.TaskPriority;
import com.codesolutions.backend.enums.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskCreateDTO {
    private String name;
    private String description;
    private LocalDate dueDate;
    private TaskStatus status;
    private TaskPriority priority;
}

