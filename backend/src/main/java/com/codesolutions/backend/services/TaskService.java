package com.codesolutions.backend.services;

import com.codesolutions.backend.dto.TaskCoreDTO;
import com.codesolutions.backend.dto.TaskCreateDTO;
import com.codesolutions.backend.dto.TaskUpdateDTO;
import com.codesolutions.backend.dto.TaskWithDetailsDTO;
import com.codesolutions.backend.dto.TaskHistoryEntryDTO;
import com.codesolutions.backend.dto.TaskAssignationDTO;
import com.codesolutions.backend.entities.*;
import com.codesolutions.backend.enums.ProjectRole;
import com.codesolutions.backend.repositories.*;
import com.codesolutions.backend.utils.BusinessErrorEnum;
import com.codesolutions.backend.utils.BusinessResponseStatusException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class TaskService implements ITaskService {
    
    private final TaskRepository taskRepository;
    private final TaskAssignationRepository taskAssignationRepository;
    private final TaskHistoryEntryRepository taskHistoryEntryRepository;
    private final ProjectRepository projectRepository;

    private final ProjectService projectService;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    
    public TaskCoreDTO createTask(TaskCreateDTO taskDTO, Long projectId, Long creatorId) {

        //Récupération des entités
        Project project = projectService.getProjectById(projectId).orElseThrow();
        User creator = userRepository.findById(creatorId).orElseThrow();

        //Vérifications
        if(!projectService.isOperationAllowed(projectId, creatorId, ProjectRole.ADMIN, ProjectRole.MEMBER)){
            throw new BusinessResponseStatusException(BusinessErrorEnum.MISSING_RIGHTS, HttpStatus.UNAUTHORIZED, "Seuls les membres ou administrateurs du projet peuvent ajouter des tâches.");
        }


        Task task = new Task();
        task.setName(taskDTO.getName());
        task.setDescription(taskDTO.getDescription());
        task.setDueDate(taskDTO.getDueDate());
        task.setStatus(taskDTO.getStatus());
        task.setPriority(taskDTO.getPriority());
        task.setProject(project);
        task.setCreatedBy(creator);
        
        task = taskRepository.save(task);
        
        // Create history entry
        TaskHistoryEntry history = new TaskHistoryEntry();
        history.setTask(task);
        history.setChangedBy(creator);
        history.setNewValue("Task created");
        history.setChangedAt(LocalDateTime.now());
        
        taskHistoryEntryRepository.save(history);
        
        return TaskCoreDTO.fromEntity(task);
    }
    
    public List<TaskCoreDTO> getProjectTasks(Long projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        return tasks.stream()
                .map(TaskCoreDTO::fromEntity)
                .toList();
    }

    public Optional<TaskWithDetailsDTO> getTaskWithDetails(Long taskId) {

        var task = taskRepository.findById(taskId);
        if(task.isEmpty()) return Optional.empty();
        var history = taskHistoryEntryRepository.findByTaskId(taskId);
        var assignations = taskAssignationRepository.findByTaskId(taskId);
        task.get().setAssignations(assignations);
        task.get().setHistory(history);
        return Optional.of(TaskWithDetailsDTO.fromEntity(task.get()));
    }
    
    public TaskCoreDTO updateTask(Long taskId, TaskUpdateDTO taskDTO, Long updaterId) {

        // Récupération entités
        Task task = taskRepository.findById(taskId).orElseThrow();
        User updater = userRepository.findById(updaterId).orElseThrow();

        // Vérifications
        if(!projectService.isOperationAllowed(task.getProject().getId(), updaterId, ProjectRole.ADMIN, ProjectRole.MEMBER)){
            throw new BusinessResponseStatusException(BusinessErrorEnum.MISSING_RIGHTS, HttpStatus.UNAUTHORIZED, "Seuls les membres ou administrateurs du projet peuvent modifier des tâches.");
        }

        //Création des history entries
        var entries = Stream.of(
                this.buildHistoryEntry(task, updater, "Titre", task.getName(), taskDTO.getName()),
                this.buildHistoryEntry(task, updater, "Description", task.getDescription(), taskDTO.getDescription()),
                this.buildHistoryEntry(task, updater, "Echeance", Objects.toString(task.getDueDate(),"null"),Objects.toString(taskDTO.getDueDate(),"null")),
                this.buildHistoryEntry(task, updater, "Réalisation", Objects.toString(task.getCompletedDate(),"null"), Objects.toString(taskDTO.getCompletedDate(),"null")),
                this.buildHistoryEntry(task, updater, "Priorité", Objects.toString(task.getPriority(),"null"), Objects.toString(taskDTO.getPriority(),"null")),
                this.buildHistoryEntry(task, updater, "Statut", Objects.toString(task.getStatus(),"null"), Objects.toString(taskDTO.getStatus(),"null"))
        ).filter(Optional::isPresent).map(Optional::get);


        //Modification de la task
        task.setName(taskDTO.getName());
        task.setDescription(taskDTO.getDescription());
        task.setDueDate(taskDTO.getDueDate());
        task.setStatus(taskDTO.getStatus());
        task.setPriority(taskDTO.getPriority());
        task.setCompletedDate(taskDTO.getCompletedDate());

        //Sauvegarde des entities
        entries.forEach(taskHistoryEntryRepository::save);
        task = taskRepository.save(task);
        return TaskCoreDTO.fromEntity(task);
    }

    private Optional<TaskHistoryEntry> buildHistoryEntry(Task task, User updater, String fieldName, String oldValue, String newValue){
        if(oldValue.equals(newValue))return Optional.empty();

        TaskHistoryEntry historyEntry = new TaskHistoryEntry();
        historyEntry.setTask(task);
        historyEntry.setChangedBy(updater);
        historyEntry.setField(fieldName);
        historyEntry.setOldValue(oldValue);
        historyEntry.setNewValue(newValue);

        return Optional.of(historyEntry);
    }

    
    public TaskAssignationDTO assignTaskToUser(Long taskId, Long assigneeId, Long assignerId) {

        //Récupération des entités
        Task task = taskRepository.findById(taskId).orElseThrow();
        Project project = projectRepository.findById(task.getProject().getId()).orElseThrow();
        User assignee = userRepository.findById(assigneeId).orElseThrow();
        User assigner = userRepository.findById(assignerId).orElseThrow();
        var assignations = taskAssignationRepository.findByTaskId(taskId);


        //Vérifications
        if(!projectService.isOperationAllowed(project.getId(), assignerId, ProjectRole.ADMIN, ProjectRole.MEMBER)){
            throw new BusinessResponseStatusException(BusinessErrorEnum.MISSING_RIGHTS, HttpStatus.UNAUTHORIZED, "Seuls les membres ou administrateurs du projet peuvent assigner des tâches.");
        }
        
        if (!projectService.isUserProjectMember(project.getId(), assigneeId)) {
            throw new BusinessResponseStatusException(BusinessErrorEnum.ASSIGNEE_NOT_MEMBER, HttpStatus.BAD_REQUEST, "L'assigné n'est pas membre de ce projet.");
        }
        
        if (assignations.stream().anyMatch(x -> assignee.getId().equals(x.getUser().getId()))) {
            throw new BusinessResponseStatusException(BusinessErrorEnum.ASSIGNEE_ALREADY_ASSIGNED, HttpStatus.BAD_REQUEST, "Cette tâche est déjà assignée à cet utilisateur.");
        }

        //Assignation
        TaskAssignation assignation = new TaskAssignation(task, assignee);

        // Envoi de l'email de notification
        notificationService.sendTaskAssignationNotification(project, task, assignee, assigner);

        //Enregistrement
        taskAssignationRepository.save(assignation);

        return TaskAssignationDTO.fromEntity(assignation);
    }
} 