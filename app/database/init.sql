CREATE DATABASE taskflow_db;
CREATE USER taskflow_user WITH ENCRYPTED PASSWORD 'taskflow_pass';
GRANT ALL PRIVILEGES ON DATABASE taskflow_db TO taskflow_user;