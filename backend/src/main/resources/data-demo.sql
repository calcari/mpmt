-- Insert test users
INSERT INTO users (username, email, password, created_at, updated_at) VALUES
('admin', 'admin@mpmt.com', 'password', NOW(), NOW()),
('michel', 'michel.dupont@example.com', 'password', NOW(), NOW()),
('marie', 'marie.martin@example.com', 'password', NOW(), NOW()),
('pierre', 'pierre.durand@example.com', 'password', NOW(), NOW());

-- Insert test projects
INSERT INTO projects (name, description, start_date, created_at, updated_at) VALUES
('Projet MPMT', 'V2 de la plateforme MPMT', '2025-07-01', NOW(), NOW()),
('Refonte Site Web', 'Refonte du site web de l''entreprise familiale', '2025-08-01', NOW(), NOW()),
('App Mobile', 'Développement d''une application mobile pour Android', '2025-09-01', NOW(), NOW());

-- Insert project memberships
INSERT INTO project_memberships (project_id, user_id, role, invited_by) VALUES
(1, 1, 'ADMIN', 1),
(1, 2, 'MEMBER', 1),
(1, 3, 'MEMBER', 1),
(1, 4, 'VIEWER', 1),
(2, 1, 'ADMIN', 1),
(2, 2, 'MEMBER', 1),
(3, 1, 'ADMIN', 1),
(3, 3, 'MEMBER', 1);

-- Insert test tasks
INSERT INTO tasks (project_id, name, description, due_date, status, priority, created_by, completed_date, created_at, updated_at) VALUES
(1, 'Configurer la BDD', 'Mettre en place le schéma de base de données et les données initiales', '2025-07-15', 'DONE', 'HIGH', 1, '2025-07-14', NOW(), NOW()),
(1, 'Créer les APIs', 'Développer les endpoints REST pour la gestion des utilisateurs', '2025-07-30', 'DOING', 'HIGH', 1, NULL, NOW(), NOW()),
(1, 'Designer l''interface', 'Créer les maquettes de l''interface utilisateur', '2025-08-15', 'TODO', 'MEDIUM', 2, NULL, NOW(), NOW()),
(1, 'Écrire les tests', 'Rédiger les tests unitaires et d''intégration', '2025-08-28', 'TODO', 'MEDIUM', 3, NULL, NOW(), NOW()),
(2, 'Design page d''accueil', 'Concevoir la nouvelle mise en page de la page d''accueil', '2025-08-20', 'DOING', 'HIGH', 1, NULL, NOW(), NOW()),
(2, 'Migration contenu', 'Migrer le contenu de l''ancien site web', '2025-09-15', 'TODO', 'LOW', 2, NULL, NOW(), NOW()),
(3, 'Architecture app', 'Concevoir l''architecture de l''application mobile', '2025-09-30', 'TODO', 'URGENT', 1, NULL, NOW(), NOW());

-- Insert task assignations
INSERT INTO task_assignations (task_id, user_id, assigned_at) VALUES
(1, 1, NOW()),
(2, 2, NOW()),
(3, 3, NOW()),
(4, 3, NOW()),
(5, 1, NOW()),
(6, 2, NOW()),
(7, 1, NOW());

-- Insert task history
INSERT INTO task_history (task_id, changed_by, field, old_value, new_value, changed_at) VALUES
(1, 1, 'name', 'Setup BDD', 'Configurer la BDD', '2025-07-02 09:30:00'),
(1, 1, 'status', 'TODO', 'DOING', '2025-07-03 10:15:00'),
(1, 1, 'status', 'DOING', 'DONE', '2025-07-14 16:45:00'),
(2, 1, 'status', 'TODO', 'DOING', '2025-07-15 08:20:00'),
(2, 1, 'priority', 'MEDIUM', 'HIGH', '2025-07-16 14:30:00'),
(3, 2, 'status', 'TODO', 'DOING', '2025-07-20 11:00:00'),
(3, 2, 'description', 'Créer les maquettes', 'Créer les maquettes de l''interface utilisateur', '2025-07-21 15:20:00'),
(5, 1, 'status', 'TODO', 'DOING', '2025-08-05 09:45:00'),
(5, 1, 'due_date', '2025-08-25', '2025-08-30', '2025-08-10 13:15:00');