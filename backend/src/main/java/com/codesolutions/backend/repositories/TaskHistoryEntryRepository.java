package com.codesolutions.backend.repositories;

import com.codesolutions.backend.entities.TaskHistoryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskHistoryEntryRepository extends JpaRepository<TaskHistoryEntry, Long> {
    
    List<TaskHistoryEntry> findByTaskId(Long taskId);

} 