<?php
header('Content-Type: application/json');
require_once 'config/Database.php';
require_once 'controllers/TaskController.php';
require_once 'middleware/CorsMiddleware.php';

// Aplicar middleware CORS
CorsMiddleware::handle();

// Configurar cabeçalhos para JSON
header('Content-Type: application/json');

// Capturar método HTTP e URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = trim($uri, '/');

// Roteamento simples mas eficiente
$routes = explode('/', $uri);

try {
    if (count($routes) >= 2 && $routes[1] === 'tasks') {
        $controller = new TaskController();
        
        switch ($method) {
            case 'GET':
                if (isset($routes[2]) && is_numeric($routes[2])) {
                    // GET /api/tasks/{id}
                    echo $controller->getTask($routes[2]);
                } else {
                    // GET /api/tasks
                    echo $controller->getAllTasks();
                }
                break;
                
            case 'POST':
                // POST /api/tasks
                $input = json_decode(file_get_contents('php://input'), true);
                echo $controller->createTask($input);
                break;
                
            case 'PUT':
                if (isset($routes[2]) && is_numeric($routes[2])) {
                    // PUT /api/tasks/{id}
                    $input = json_decode(file_get_contents('php://input'), true);
                    echo $controller->updateTask($routes[2], $input);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID da tarefa é obrigatório']);
                }
                break;
                
            case 'DELETE':
                if (isset($routes[2]) && is_numeric($routes[2])) {
                    // DELETE /api/tasks/{id}
                    echo $controller->deleteTask($routes[2]);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'ID da tarefa é obrigatório']);
                }
                break;
                
            default:
                http_response_code(405);
                echo json_encode(['error' => 'Método não permitido']);
        }
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint não encontrado']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erro interno do servidor',
        'message' => $e->getMessage()
    ]);
}