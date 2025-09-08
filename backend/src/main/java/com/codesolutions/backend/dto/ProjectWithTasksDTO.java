package com.codesolutions.backend.dto;

import com.codesolutions.backend.entities.Project;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data()
@EqualsAndHashCode(callSuper = true)
public class ProjectWithTasksDTO extends ProjectCoreDTO {
    private List<TaskCoreDTO> tasks;

    public ProjectWithTasksDTO(Long id, String name, String description, LocalDate startDate, LocalDateTime createdAt, LocalDateTime updatedAt, List<TaskCoreDTO> tasks) {
        super(id, name, description, startDate, createdAt, updatedAt);
        this.tasks = tasks;
    }


    public static ProjectWithTasksDTO fromEntity(Project project) {
        if (project == null) return null;

        List<TaskCoreDTO> tasks = null;
        if (project.getTasks() != null) {
            tasks = project.getTasks().stream().map(TaskCoreDTO::fromEntity).toList();
        }

        return new ProjectWithTasksDTO(project.getId(), project.getName(), project.getDescription(), project.getStartDate(), project.getCreatedAt(), project.getUpdatedAt(), tasks);
    }
}
