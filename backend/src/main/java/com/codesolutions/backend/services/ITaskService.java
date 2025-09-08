package com.codesolutions.backend.services;

import com.codesolutions.backend.dto.*;

import java.util.List;
import java.util.Optional;

public interface ITaskService {
    
    TaskCoreDTO createTask(TaskCreateDTO taskDTO, Long projectId, Long creatorId);
    
    List<TaskCoreDTO> getProjectTasks(Long projectId);

    Optional<TaskWithDetailsDTO> getTaskWithDetails(Long taskId);

    TaskCoreDTO updateTask(Long taskId, TaskUpdateDTO taskDTO, Long updaterId);

    TaskAssignationDTO assignTaskToUser(Long taskId, Long assigneeId, Long assignerId);
}