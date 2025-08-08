INSERT INTO tasks (id, title, description, status, priority, project_id, assignee_id, creator_id) VALUES 
('770e8400-e29b-41d4-a716-446655440001', 'Design homepage mockup', 'Create wireframes and visual designs for the new homepage', 'in_progress', 'high', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440002', 'Set up development environment', 'Configure build tools and CI/CD pipeline', 'done', 'medium', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440003', 'Write user authentication API', 'Implement login, registration, and password reset endpoints', 'todo', 'high', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440004', 'Create database schema', 'Design and implement the application database structure', 'review', 'urgent', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440005', 'Admin dashboard analytics', 'Build analytics charts and reporting features', 'todo', 'low', '660e8400-e29b-41d4-a716-446655440003', NULL, '550e8400-e29b-41d4-a716-446655440001');

INSERT INTO comments (id, content, task_id, author_id) VALUES 
('880e8400-e29b-41d4-a716-446655440001', 'Looking great so far! Can we try a different color scheme?', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
('880e8400-e29b-41d4-a716-446655440002', 'Sure, I will create a few variations to choose from.', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003'),
('880e8400-e29b-41d4-a716-446655440003', 'Environment is ready for testing. All tests passing.', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004'),
('880e8400-e29b-41d4-a716-446655440004', 'The API structure looks good but needs input validation.', '770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002');