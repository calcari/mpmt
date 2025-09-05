INSERT INTO projects (id, name, description, start_date, created_at, updated_at) VALUES
(1, 'projet_p1', 'description_projet_p1', '2025-09-01', NOW(), NOW()),
(2, 'projet_p2', 'description_projet_p2', '2025-09-01', NOW(), NOW());


INSERT INTO users (id, username, email, password, created_at, updated_at) VALUES
(11, 'admin_p1', 'admin_p1@test.com', 'password', NOW(), NOW()),
(12, 'member_p1', 'member_p1@test.com', 'password', NOW(), NOW()),
(13, 'viewer_p1', 'viewer_p1@test.com', 'password', NOW(), NOW()),
(21, 'admin_p2', 'admin_p2@test.com', 'password', NOW(), NOW()),
(22, 'member_p2', 'member_p2@test.com', 'password', NOW(), NOW()),
(99, 'non_membre', 'non_membre@test.com', 'password', NOW(), NOW());


INSERT INTO project_memberships (project_id, user_id, role, invited_by) VALUES
-- Projet 1
(1, 11, 'ADMIN', 11),
(1, 12, 'MEMBER', 11),
(1, 13, 'VIEWER', 11),
-- Projet 2
(2, 21, 'ADMIN', 21),
(2, 22, 'MEMBER', 21);

INSERT INTO tasks (id, project_id, name, description, due_date, status, priority, created_by, completed_date, created_at, updated_at) VALUES
(1, 1, 'tache1_p1_admin', 'description_tache1_p1', '2025-09-15', 'DONE', 'HIGH', 11, '2025-09-14', NOW(), NOW()),
(2, 1, 'tache2_p1_libre', 'description_tache2_p1', '2025-09-30', 'TODO', 'MEDIUM', 11, NULL, NOW(), NOW());


-- tache1_p1 assignée à admin_p1
INSERT INTO task_assignations (task_id, user_id, assigned_at) VALUES
(1, 11, NOW());

INSERT INTO task_history (task_id, changed_by, field, old_value, new_value, changed_at) VALUES
(1, 11, 'status', 'TODO', 'DOING', '2025-09-02'),
(1, 11, 'status', 'DOING', 'DONE', '2025-09-14'),
(2, 11, 'status', 'TODO', 'DOING', '2025-09-15');

-- Correction auto-increment
ALTER TABLE projects ALTER COLUMN id RESTART WITH 3;
ALTER TABLE tasks ALTER COLUMN id RESTART WITH 3;
ALTER TABLE users ALTER COLUMN id RESTART WITH 100;


