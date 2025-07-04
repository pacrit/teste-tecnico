<?php

class TaskValidator {
    private $validStatuses = ['pendente', 'em_andamento', 'concluida'];
    
    public function validateTaskData($data, $required = true) {
        $errors = [];
        
        // Validar título
        if ($required && (!isset($data['title']) || empty(trim($data['title'])))) {
            $errors[] = 'Título é obrigatório';
        } elseif (isset($data['title'])) {
            if (strlen(trim($data['title'])) < 3) {
                $errors[] = 'Título deve ter pelo menos 3 caracteres';
            }
            if (strlen(trim($data['title'])) > 255) {
                $errors[] = 'Título deve ter no máximo 255 caracteres';
            }
        }
        
        // Validar descrição
        if (isset($data['description']) && strlen($data['description']) > 1000) {
            $errors[] = 'Descrição deve ter no máximo 1000 caracteres';
        }
        
        // Validar status
        if (isset($data['status']) && !in_array($data['status'], $this->validStatuses)) {
            $errors[] = 'Status deve ser: ' . implode(', ', $this->validStatuses);
        }
        
        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
    
    public function validateId($id) {
        return is_numeric($id) && $id > 0;
    }
    
    public function sanitizeString($string) {
        return htmlspecialchars(trim($string), ENT_QUOTES, 'UTF-8');
    }
}