package com.codesolutions.backend.repositories;

import com.codesolutions.backend.entities.TaskAssignation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskAssignationRepository extends JpaRepository<TaskAssignation, Object[]> {
    
    List<TaskAssignation> findByTaskId(Long taskId);
    
    List<TaskAssignation> findByUserId(Long userId);
}