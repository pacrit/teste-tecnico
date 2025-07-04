import { TaskAPI } from './modules/api.js';
import { TaskUI } from './modules/ui.js';
import { TaskManager } from './modules/taskManager.js';

class App {
    constructor() {
        this.api = new TaskAPI();
        this.ui = new TaskUI();
        this.taskManager = new TaskManager(this.api, this.ui);

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.taskManager.loadTasks();
    }

    setupEventListeners() {
        // Evento do botão Nova Tarefa
        document.getElementById('newTaskBtn')?.addEventListener('click', () => {
            this.taskManager.clearForm();
            const modal = new bootstrap.Modal(document.getElementById('taskModal'));
            modal.show();
        });

        // Eventos do formulário
        document.getElementById('saveTaskBtn').addEventListener('click', () => {
            this.taskManager.saveTask();
        });

        // Eventos dos filtros
        document.querySelectorAll('input[name="statusFilter"]').forEach(filter => {
            filter.addEventListener('change', (e) => {
                this.taskManager.filterTasks(e.target.value);
            });
        });

        // Evento do modal - limpar formulário ao fechar
        document.getElementById('taskModal').addEventListener('hidden.bs.modal', () => {
            this.taskManager.clearForm();
        });

        // Evento de confirmação de exclusão
        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.taskManager.confirmDelete();
        });

        // Validação em tempo real
        this.setupFormValidation();

        // Toggle Dark Mode
        const darkModeBtn = document.getElementById('toggleDarkMode');
        if (darkModeBtn) {
            darkModeBtn.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                // Salvar preferência no localStorage
                localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
            });
        }

        // Restaurar tema escuro se estava ativo
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }

    setupFormValidation() {
        const titleInput = document.getElementById('taskTitle');
        const descriptionInput = document.getElementById('taskDescription');

        titleInput?.addEventListener('input', () => {
            this.validateTitle(titleInput);
        });

        descriptionInput?.addEventListener('input', () => {
            this.validateDescription(descriptionInput);
        });
    }

    validateTitle(input) {
        const value = input.value.trim();
        const feedback = input.nextElementSibling;

        if (value.length < 3) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            feedback.textContent = 'O título deve ter pelo menos 3 caracteres';
            return false;
        } else if (value.length > 255) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            feedback.textContent = 'O título deve ter no máximo 255 caracteres';
            return false;
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            return true;
        }
    }

    validateDescription(input) {
        const value = input.value.trim();
        const feedback = input.parentElement.querySelector('.invalid-feedback');

        if (value.length > 1000) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            feedback.textContent = 'A descrição deve ter no máximo 1000 caracteres';
            return false;
        } else {
            input.classList.remove('is-invalid');
            if (value.length > 0) {
                input.classList.add('is-valid');
            }
            return true;
        }
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new App();
});