package com.codesolutions.backend.repositories;

import com.codesolutions.backend.entities.Project;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    
    @Query("SELECT p FROM Project p JOIN FETCH p.members pm WHERE pm.user.id = :userId")
    List<Project> findByUserId(@Param("userId") Long userId);

} 