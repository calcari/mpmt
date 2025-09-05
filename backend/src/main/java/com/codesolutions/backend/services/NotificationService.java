package com.codesolutions.backend.services;

import com.codesolutions.backend.entities.Project;
import com.codesolutions.backend.entities.Task;
import com.codesolutions.backend.entities.User;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;


@Service
@RequiredArgsConstructor
public class NotificationService implements INotificationService {

    @Value("${mail.maildiver.api-key}")
    private String apiKey;

    private final ObjectMapper json;


    public void sendProjectInviteNotification(Project project, User invitee, User inviter) {
        RestClient restClient = RestClient.create();

        ObjectNode body = json.createObjectNode()
                .put("from", "MPMT <notifications@mpmt.calcari.dev>")
                .put("to", invitee.getEmail())
                .put("subject", "Invitation MPMT")
                .put("template_id", "01990aac-0cfe-76ee-9e27-9b25dc78b61d")
                .set("variables", json.createObjectNode()
                        .put("project_id", project.getId())
                        .put("project_name", project.getName())
                        .put("inviter_name", inviter.getUsername())
                        .put("invitee_name", invitee.getUsername())
                );

        JsonNode res = restClient.post()
                .uri("https://api.maildiver.com/v1/emails")
                .header("Authorization", "Bearer " + this.apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(JsonNode.class);
    }

    public void sendTaskAssignationNotification(Project project, Task task, User assignee, User assigner) {
        RestClient restClient = RestClient.create();


        ObjectNode body = json.createObjectNode()
                .put("from", "MPMT <notifications@mpmt.calcari.dev>")
                .put("to", assignee.getEmail())
                .put("subject", "Tâche MPMT")
                .put("template_id", "01991a92-292a-74ea-a277-2507d0764e3d")
                .set("variables", json.createObjectNode()
                        .put("project_id", project.getId())
                        .put("task_name", task.getName())
                        .put("assigner_name", assigner.getUsername())
                        .put("assignee_name", assignee.getUsername())
                );

        JsonNode res = restClient.post()
                .uri("https://api.maildiver.com/v1/emails")
                .header("Authorization", "Bearer " + this.apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(JsonNode.class);
    }
} 