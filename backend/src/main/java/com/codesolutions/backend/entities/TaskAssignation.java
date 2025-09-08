package com.codesolutions.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;



@Entity
@Table(name = "task_assignations")
@Data @NoArgsConstructor
public class TaskAssignation {

    @EmbeddedId
    private TaskAssignationKey id;

    @MapsId("taskId") //Nécessaire pour l'ORM
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @MapsId("userId") //Nécessaire pour l'ORM
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime assignedAt;

    public TaskAssignation(Task task, User user) {
        this.task = task;
        this.user = user;
        this.id = new TaskAssignationKey(task.getId(), user.getId());
    }

    //Objet représentant la clé composite.
    @Embeddable
    public static record TaskAssignationKey(
            @Column(name = "task_id") Long taskId,
            @Column(name = "user_id") Long userId
    ) implements Serializable {}

} 