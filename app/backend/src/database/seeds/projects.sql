INSERT INTO projects (id, name, description, owner_id, color) VALUES 
('660e8400-e29b-41d4-a716-446655440001', 'Marketing Website', 'New company website redesign project', '550e8400-e29b-41d4-a716-446655440002', '#3B82F6'),
('660e8400-e29b-41d4-a716-446655440002', 'Mobile App', 'iOS and Android mobile application development', '550e8400-e29b-41d4-a716-446655440002', '#10B981'),
('660e8400-e29b-41d4-a716-446655440003', 'Internal Tools', 'Employee productivity tools and dashboards', '550e8400-e29b-41d4-a716-446655440001', '#F59E0B');

INSERT INTO project_members (project_id, user_id, role) VALUES 
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'manager'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'member'),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'member'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'manager'),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'member'),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'admin');