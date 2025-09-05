package com.codesolutions.backend.integration;

import com.codesolutions.backend.dto.TaskCoreDTO;
import com.codesolutions.backend.dto.TaskWithDetailsDTO;
import com.codesolutions.backend.dto.TaskCreateDTO;
import com.codesolutions.backend.dto.TaskUpdateDTO;
import com.codesolutions.backend.dto.TaskAssignationDTO;
import com.codesolutions.backend.enums.TaskStatus;
import com.codesolutions.backend.enums.TaskPriority;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;
import jakarta.servlet.http.Cookie;
import org.springframework.test.context.ActiveProfiles;

import com.codesolutions.backend.utils.BusinessErrorEnum;
import com.fasterxml.jackson.databind.JsonNode;

import com.codesolutions.backend.utils.TestIds;

import static org.mockito.Mockito.*;


import org.springframework.boot.test.mock.mockito.MockBean;

import com.codesolutions.backend.services.NotificationService;


@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TaskTest {

    @Autowired
    private MockMvc mockMvc;
    

    @MockBean
    private NotificationService notificationServiceMock; //Pour ne pas envoyer des emails pendant les tests


    @Test
    void getProjectTasks_Success() throws Exception {
        mockMvc.perform(get("/api/tasks/project/{projectId}", TestIds.projet_p1)
                .cookie(new Cookie("X-User-Id", TestIds.admin_p1.toString())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(greaterThan(0)));
    }

    @Test
    void getTaskDetails_Success() throws Exception {
        mockMvc.perform(get("/api/tasks/{taskId}/details", TestIds.tache_1_p1_admin)
                .cookie(new Cookie("X-User-Id", TestIds.admin_p1.toString())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("tache1_p1_admin"));
    }

    @Test
    void createTask_Success() throws Exception {
        var dueDate = LocalDate.now().plusDays(7);
        
        mockMvc.perform(post("/api/tasks/project/{projectId}", TestIds.projet_p1)
                .cookie(new Cookie("X-User-Id", TestIds.admin_p1.toString()))
                .contentType("application/json")
                .content("""
                    {
                        "name": "Nouvelle Tâche",
                        "description": "Description de la nouvelle tâche",
                        "status": "TODO",
                        "priority": "MEDIUM",
                        "dueDate": "%s"
                    }
                    """.formatted(dueDate)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Nouvelle Tâche"));
    }

    @Test
    void createTask_MissingRights() throws Exception {
        var dueDate = LocalDate.now().plusDays(7);
        
        mockMvc.perform(post("/api/tasks/project/{projectId}", TestIds.projet_p1)
                .cookie(new Cookie("X-User-Id", TestIds.viewer_p1.toString()))
                .contentType("application/json")
                .content("""
                    {
                        "name": "Nouvelle Tâche",
                        "description": "Description de la nouvelle tâche",
                        "status": "TODO",
                        "priority": "MEDIUM",
                        "dueDate": "%s"
                    }
                    """.formatted(dueDate)))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.code").value(BusinessErrorEnum.MISSING_RIGHTS.name()));
    }

    @Test
    void updateTask_Success() throws Exception {
        mockMvc.perform(put("/api/tasks/{taskId}", TestIds.tache_2_p1_libre)
                .cookie(new Cookie("X-User-Id", TestIds.admin_p1.toString()))
                .contentType("application/json")
                .content("""
                    {
                        "name": "Tâche Modifiée",
                        "description": "Description modifiée",
                        "status": "DOING",
                        "priority": "HIGH"
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Tâche Modifiée"));
    }

    @Test
    void updateTask_MissingRights() throws Exception {
        mockMvc.perform(put("/api/tasks/{taskId}", TestIds.tache_1_p1_admin)
                .cookie(new Cookie("X-User-Id", TestIds.viewer_p1.toString()))
                .contentType("application/json")
                .content("""
                    {
                        "name": "Tâche Modifiée",
                        "description": "Description modifiée",
                        "status": "DOING",
                        "priority": "HIGH"
                    }
                    """))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.code").value(BusinessErrorEnum.MISSING_RIGHTS.name()));
    }

    @Test
    void assignTask_Success() throws Exception {
        doNothing().when(notificationServiceMock).sendTaskAssignationNotification(any(), any(), any(), any());

        mockMvc.perform(post("/api/tasks/{taskId}/assign", TestIds.tache_2_p1_libre)
                .cookie(new Cookie("X-User-Id", TestIds.admin_p1.toString()))
                .param("assigneeId", TestIds.member_p1.toString()))
            .andExpect(status().isOk());
    }

    @Test
    void assignTask_MissingRights() throws Exception {
        mockMvc.perform(post("/api/tasks/{taskId}/assign", TestIds.tache_2_p1_libre)
                .cookie(new Cookie("X-User-Id", TestIds.viewer_p1.toString()))
                .param("assigneeId", TestIds.admin_p1.toString()))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.code").value(BusinessErrorEnum.MISSING_RIGHTS.name()));
    }

    @Test
    void assignTask_AssigneeNotMember() throws Exception {
        mockMvc.perform(post("/api/tasks/{taskId}/assign", TestIds.tache_2_p1_libre)
                .cookie(new Cookie("X-User-Id", TestIds.admin_p1.toString()))
                .param("assigneeId", TestIds.member_p2.toString()))
            .andExpect(status().isBadRequest())
            .andExpect(content().string(containsString(BusinessErrorEnum.ASSIGNEE_NOT_MEMBER.name())));
    }
    

    @Test
    void assignTask_AssigneeAlreadyAssigned() throws Exception {
        mockMvc.perform(post("/api/tasks/{taskId}/assign", TestIds.tache_1_p1_admin)
                .cookie(new Cookie("X-User-Id", TestIds.member_p1.toString()))
                .param("assigneeId", TestIds.admin_p1.toString()))
            .andExpect(status().isBadRequest())
            .andExpect(content().string(containsString(BusinessErrorEnum.ASSIGNEE_ALREADY_ASSIGNED.name())));
    }

}
