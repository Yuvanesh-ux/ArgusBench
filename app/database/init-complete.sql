-- TaskFlow Database Initialization Script
-- Combines all migrations and seed data for Docker setup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'member');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE file_type AS ENUM ('image', 'document', 'archive', 'other');

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ===========================================
-- USERS TABLE (Migration 001)
-- ===========================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'member',
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- PROJECTS TABLE (Migration 002)
-- ===========================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    color VARCHAR(7) DEFAULT '#3B82F6',
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role user_role DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);

CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- TASKS TABLE (Migration 003)
-- ===========================================
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status task_status DEFAULT 'todo',
    priority task_priority DEFAULT 'medium',
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    due_date TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_creator ON tasks(creator_id);
CREATE INDEX idx_tasks_status ON tasks(status);

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- COMMENTS TABLE (Migration 004)
-- ===========================================
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_task ON comments(task_id);
CREATE INDEX idx_comments_author ON comments(author_id);

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- FILES TABLE (Migration 005)
-- ===========================================
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_type file_type NOT NULL,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_files_task ON files(task_id);
CREATE INDEX idx_files_project ON files(project_id);

-- ===========================================
-- SESSIONS & AUDIT LOGS (Migration 006)
-- ===========================================
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token_hash);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- ===========================================
-- SEED DATA
-- ===========================================

-- Insert sample users (password hash for 'password123')
INSERT INTO users (id, email, password_hash, first_name, last_name, role, email_verified) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'admin@taskflow.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeWrBsE', 'Admin', 'User', 'admin', true),
('550e8400-e29b-41d4-a716-446655440002', 'john@taskflow.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeWrBsE', 'John', 'Smith', 'manager', true),
('550e8400-e29b-41d4-a716-446655440003', 'jane@taskflow.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeWrBsE', 'Jane', 'Doe', 'member', true),
('550e8400-e29b-41d4-a716-446655440004', 'bob@taskflow.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeWrBsE', 'Bob', 'Wilson', 'member', true),
('550e8400-e29b-41d4-a716-446655440005', 'alice@taskflow.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeWrBsE', 'Alice', 'Johnson', 'member', true);

-- Insert sample projects
INSERT INTO projects (id, name, description, owner_id, color) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Website Redesign', 'Complete redesign of the company website with modern UI/UX', '550e8400-e29b-41d4-a716-446655440001', '#3B82F6'),
('650e8400-e29b-41d4-a716-446655440002', 'Mobile App Development', 'Development of iOS and Android mobile applications', '550e8400-e29b-41d4-a716-446655440002', '#EF4444'),
('650e8400-e29b-41d4-a716-446655440003', 'Data Analytics Dashboard', 'Create comprehensive analytics dashboard for business insights', '550e8400-e29b-41d4-a716-446655440001', '#10B981');

-- Insert project members
INSERT INTO project_members (project_id, user_id, role) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'manager'),
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'member'),
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'member'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'member'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'member'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'member');

-- Insert sample tasks
INSERT INTO tasks (id, title, description, status, priority, project_id, assignee_id, creator_id, due_date) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Design Homepage Mockup', 'Create initial design mockups for the new homepage layout', 'in_progress', 'high', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '2024-10-30 17:00:00'),
('750e8400-e29b-41d4-a716-446655440002', 'Setup Development Environment', 'Configure local development environment for the project', 'done', 'medium', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '2024-09-20 09:00:00'),
('750e8400-e29b-41d4-a716-446655440003', 'Mobile UI Framework Research', 'Research and evaluate different mobile UI frameworks', 'todo', 'medium', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '2024-11-15 17:00:00'),
('750e8400-e29b-41d4-a716-446655440004', 'Database Schema Design', 'Design database schema for analytics data storage', 'review', 'high', '650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '2024-10-25 12:00:00'),
('750e8400-e29b-41d4-a716-446655440005', 'User Authentication Module', 'Implement secure user authentication and authorization', 'in_progress', 'urgent', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', '2024-10-20 23:59:59');

-- Insert sample comments
INSERT INTO comments (id, content, task_id, author_id) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'Great progress on the mockups! The color scheme looks modern and professional.', '750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'),
('850e8400-e29b-41d4-a716-446655440002', 'Thanks! I''ve incorporated the feedback from the client meeting. Ready for review.', '750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003'),
('850e8400-e29b-41d4-a716-446655440003', 'Development environment is ready. All team members have access now.', '750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004');

-- Create database info view for debugging
CREATE VIEW database_info AS
SELECT 
    'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'projects', COUNT(*) FROM projects
UNION ALL  
SELECT 'tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'comments', COUNT(*) FROM comments
UNION ALL
SELECT 'project_members', COUNT(*) FROM project_members;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO taskflow_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO taskflow_user;