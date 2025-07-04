<?php

class TaskValidator {
    private $allowedStatus = ['pendente', 'em_andamento', 'concluida'];
    
    public function validateTaskData($data, $requireAll = true) {
        $errors = [];
        
        // Validar título
        if ($requireAll || isset($data['title'])) {
            if (empty($data['title'])) {
                $errors['title'] = 'Título é obrigatório';
            } elseif (strlen($data['title']) < 3) {
                $errors['title'] = 'Título deve ter pelo menos 3 caracteres';
            } elseif (strlen($data['title']) > 255) {
                $errors['title'] = 'Título deve ter no máximo 255 caracteres';
            }
        }
        
        // Validar descrição
        if (isset($data['description']) && strlen($data['description']) > 1000) {
            $errors['description'] = 'Descrição deve ter no máximo 1000 caracteres';
        }
        
        // Validar status
        if (isset($data['status'])) {
            if (!in_array($data['status'], $this->allowedStatus)) {
                $errors['status'] = 'Status deve ser: ' . implode(', ', $this->allowedStatus);
            }
        }
        
        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
    
    public function validateId($id) {
        return is_numeric($id) && $id > 0;
    }
    
    public function validateStatus($status) {
        return in_array($status, $this->allowedStatus);
    }
}