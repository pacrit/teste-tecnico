<?php
require_once 'models/Task.php';
require_once 'validators/TaskValidator.php';

class TaskController {
    private $taskModel;
    private $validator;
    
    public function __construct() {
        $this->taskModel = new Task();
        $this->validator = new TaskValidator();
    }
    
    public function getAllTasks() {
        try {
            $tasks = $this->taskModel->getAll();
            return json_encode([
                'success' => true,
                'data' => $tasks,
                'count' => count($tasks)
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Erro ao buscar tarefas: ' . $e->getMessage()
            ]);
        }
    }
    
    public function getTask($id) {
        try {

            
            if (!$this->validator->validateId($id)) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'ID inválido'
                ]);
            }
            
            $task = $this->taskModel->getById($id);
            
            if (!$task) {
                http_response_code(404);
                return json_encode([
                    'success' => false,
                    'error' => 'Tarefa não encontrada'
                ]);
            }
            
            return json_encode([
                'success' => true,
                'data' => $task
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Erro ao buscar tarefa: ' . $e->getMessage()
            ]);
        }
    }
    
    public function createTask($data) {
        try {
            $validation = $this->validator->validateTaskData($data);
            
            if (!$validation['valid']) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'Dados inválidos',
                    'details' => $validation['errors']
                ]);
            }
            
            $taskId = $this->taskModel->create($data);
            $task = $this->taskModel->getById($taskId);
            
            http_response_code(201);
            return json_encode([
                'success' => true,
                'message' => 'Tarefa criada com sucesso',
                'data' => $task
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Erro ao criar tarefa: ' . $e->getMessage()
            ]);
        }
    }
    
    public function updateTask($id, $data) {
        try {
            if (!$this->validator->validateId($id)) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'ID inválido'
                ]);
            }
            
            // Verificar se a tarefa existe
            if (!$this->taskModel->getById($id)) {
                http_response_code(404);
                return json_encode([
                    'success' => false,
                    'error' => 'Tarefa não encontrada'
                ]);
            }
            
            $validation = $this->validator->validateTaskData($data, false);
            
            if (!$validation['valid']) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'Dados inválidos',
                    'details' => $validation['errors']
                ]);
            }
            
            $this->taskModel->update($id, $data);
            $task = $this->taskModel->getById($id);
            
            return json_encode([
                'success' => true,
                'message' => 'Tarefa atualizada com sucesso',
                'data' => $task
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Erro ao atualizar tarefa: ' . $e->getMessage()
            ]);
        }
    }
    
    public function deleteTask($id) {
        try {
            if (!$this->validator->validateId($id)) {
                http_response_code(400);
                return json_encode([
                    'success' => false,
                    'error' => 'ID inválido'
                ]);
            }
            
            if (!$this->taskModel->getById($id)) {
                http_response_code(404);
                return json_encode([
                    'success' => false,
                    'error' => 'Tarefa não encontrada'
                ]);
            }
            
            $this->taskModel->delete($id);
            
            return json_encode([
                'success' => true,
                'message' => 'Tarefa excluída com sucesso'
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            return json_encode([
                'success' => false,
                'error' => 'Erro ao excluir tarefa: ' . $e->getMessage()
            ]);
        }
    }
}