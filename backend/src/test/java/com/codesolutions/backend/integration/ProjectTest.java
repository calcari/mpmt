package com.codesolutions.backend.integration;

import com.codesolutions.backend.dto.ProjectOfUserDTO;
import com.codesolutions.backend.dto.ProjectWithTasksDTO;
import com.codesolutions.backend.dto.ProjectMembershipCoreDTO;
import com.codesolutions.backend.dto.ProjectMembershipCreateDTO;
import com.codesolutions.backend.utils.BusinessErrorEnum;
import com.fasterxml.jackson.databind.JsonNode;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;
import jakarta.servlet.http.Cookie;

import com.codesolutions.backend.dto.ProjectCoreDTO;
import com.codesolutions.backend.dto.ProjectCreateDTO;

import java.time.LocalDate;

import org.springframework.test.context.ActiveProfiles;

import com.codesolutions.backend.enums.ProjectRole;
import com.codesolutions.backend.services.NotificationService;
import com.codesolutions.backend.utils.TestIds;

import static org.mockito.Mockito.*;
import org.springframework.boot.test.mock.mockito.MockBean;


@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProjectTest {

    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private NotificationService notificationServiceMock; //Pour ne pas envoyer des emails pendant les tests

    @Test
    void getUserProjects_Success() throws Exception {
        mockMvc.perform(get("/api/projects/me")
                .cookie(new Cookie("X-User-Id", TestIds.admin_p1.toString())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(greaterThan(0)));
    }

    @Test
    void getProject_Success() throws Exception {
        mockMvc.perform(get("/api/projects/{projectId}", TestIds.projet_p1)
                .cookie(new Cookie("X-User-Id", TestIds.admin_p1.toString())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("projet_p1"));
    }

    @Test
    void getProject_NotMember() throws Exception {
        mockMvc.perform(get("/api/projects/{projectId}", TestIds.projet_p2)
                .cookie(new Cookie("X-User-Id", TestIds.non_membre.toString())))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void getProjectMembers_Success() throws Exception {
        mockMvc.perform(get("/api/projects/{projectId}/members", TestIds.projet_p1)
                .cookie(new Cookie("X-User-Id", TestIds.admin_p1.toString())))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(greaterThan(0)));
    }

    @Test
    void getProjectMembers_NotMember() throws Exception {
        mockMvc.perform(get("/api/projects/{projectId}/members", TestIds.projet_p1)
                .cookie(new Cookie("X-User-Id", TestIds.non_membre.toString())))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void createProject_Success() throws Exception {
        var startDate = LocalDate.now();
        
        mockMvc.perform(post("/api/projects")
                .cookie(new Cookie("X-User-Id", TestIds.admin_p1.toString()))
                .contentType("application/json")
                .content("""
                    {
                        "name": "Nouveau Projet",
                        "description": "Description du nouveau projet",
                        "startDate": "%s"
                    }
                    """.formatted(startDate)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Nouveau Projet"));
    }

    @Test
    void addMemberToProject_Success() throws Exception {
        doNothing().when(notificationServiceMock).sendProjectInviteNotification(any(), any(), any());

        mockMvc.perform(post("/api/projects/{projectId}/members", TestIds.projet_p1)
                .cookie(new Cookie("X-User-Id", TestIds.admin_p1.toString()))
                .contentType("application/json")
                .content("""
                    {
                        "userEmail": "non_membre@test.com",
                        "role": "MEMBER"
                    }
                    """))
            .andExpect(status().isOk());
    }

    @Test
    void addMemberToProject_MissingRights() throws Exception {
        mockMvc.perform(post("/api/projects/{projectId}/members", TestIds.projet_p1)
                .cookie(new Cookie("X-User-Id", TestIds.member_p1.toString()))
                .contentType("application/json")
                .content("""
                    {
                        "userEmail": "non_membre@test.com",
                        "role": "MEMBER"
                    }
                    """))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.code").value(BusinessErrorEnum.MISSING_RIGHTS.name()));
    }

    @Test
    void addMemberToProject_InviteeNotFound() throws Exception {
        mockMvc.perform(post("/api/projects/{projectId}/members", TestIds.projet_p1)
                .cookie(new Cookie("X-User-Id", TestIds.admin_p1.toString()))
                .contentType("application/json")
                .content("""
                    {
                        "userEmail": "not-found@test.com",
                        "role": "MEMBER"
                    }
                    """))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.code").value(BusinessErrorEnum.INVITEE_NOT_FOUND.name()));
    }

    @Test
    void addMemberToProject_AlreadyMember() throws Exception {
        mockMvc.perform(post("/api/projects/{projectId}/members", TestIds.projet_p1)
                .cookie(new Cookie("X-User-Id", TestIds.admin_p1.toString()))
                .contentType("application/json")
                .content("""
                    {
                        "userEmail": "member_p1@test.com",
                        "role": "MEMBER"
                    }
                    """))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value(BusinessErrorEnum.INVITEE_ALREADY_MEMBER.name()));
    }
}
