<?php

class Task {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function getAll() {
        $sql = "SELECT * FROM tasks ORDER BY created_at DESC";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll();
    }
    
    public function getById($id) {
        $sql = "SELECT * FROM tasks WHERE id = ?";
        $stmt = $this->db->query($sql, [$id]);
        return $stmt->fetch();
    }
    
    public function create($data) {
        $sql = "INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)";
        
        $params = [
            $this->sanitizeInput($data['title']),
            $this->sanitizeInput($data['description'] ?? ''),
            $data['status'] ?? 'pendente'
        ];
        
        $this->db->query($sql, $params);
        return $this->db->lastInsertId();
    }
    
    public function update($id, $data) {
        $fields = [];
        $params = [];
        
        if (isset($data['title'])) {
            $fields[] = "title = ?";
            $params[] = $this->sanitizeInput($data['title']);
        }
        
        if (isset($data['description'])) {
            $fields[] = "description = ?";
            $params[] = $this->sanitizeInput($data['description']);
        }
        
        if (isset($data['status'])) {
            $fields[] = "status = ?";
            $params[] = $data['status'];
        }
        
        $fields[] = "updated_at = CURRENT_TIMESTAMP";
        $params[] = $id;
        
        $sql = "UPDATE tasks SET " . implode(', ', $fields) . " WHERE id = ?";
        return $this->db->query($sql, $params);
    }
    
    public function delete($id) {
        $sql = "DELETE FROM tasks WHERE id = ?";
        return $this->db->query($sql, [$id]);
    }
    
    public function getByStatus($status) {
        $sql = "SELECT * FROM tasks WHERE status = ? ORDER BY created_at DESC";
        $stmt = $this->db->query($sql, [$status]);
        return $stmt->fetchAll();
    }
    
    private function sanitizeInput($input) {
        return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
    }
}