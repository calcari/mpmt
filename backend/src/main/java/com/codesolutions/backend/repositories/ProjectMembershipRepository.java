package com.codesolutions.backend.repositories;

import com.codesolutions.backend.entities.ProjectMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMembershipRepository extends JpaRepository<ProjectMembership, Long> {

    Optional<ProjectMembership> findByProjectIdAndUserId(Long projectId, Long userId);

    List<ProjectMembership> findByProjectId(Long projectId);

    List<ProjectMembership> findByUserId(Long userId);

    boolean existsByProjectIdAndUserId(Long projectId, Long userId);
} 