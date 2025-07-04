-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS taskmanager;
USE taskmanager;

-- Criação da tabela tasks
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pendente', 'em_andamento', 'concluida') DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inserção de dados de exemplo (opcional)
INSERT INTO tasks (title, description, status) VALUES 
('Tarefa de Exemplo 1', 'Esta é uma tarefa de exemplo para testar o sistema', 'pendente'),
('Tarefa de Exemplo 2', 'Outra tarefa para demonstrar diferentes status', 'em_andamento'),
('Tarefa Concluída', 'Exemplo de tarefa finalizada', 'concluida');

-- Criação de índices para melhor performance
CREATE INDEX idx_status ON tasks(status);
CREATE INDEX idx_created_at ON tasks(created_at);

-- Mostrar estrutura da tabela (para verificação)
DESCRIBE tasks;