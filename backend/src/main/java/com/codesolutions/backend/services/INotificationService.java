package com.codesolutions.backend.services;

import com.codesolutions.backend.entities.Project;
import com.codesolutions.backend.entities.Task;
import com.codesolutions.backend.entities.User;

public interface INotificationService {

    void sendProjectInviteNotification(Project project, User invitee, User inviter);

    void sendTaskAssignationNotification(Project project, Task task, User assignee, User assigner);
} 