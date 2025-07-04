export class TaskManager {
    constructor(api, ui) {
        this.api = api;
        this.ui = ui;
        this.tasks = [];
        this.currentFilter = 'all';
        this.editingTaskId = null;
        this.taskToDelete = null;
        
        // Expor métodos globalmente para os event handlers inline
        this.exposeGlobalMethods();
    }
    
    exposeGlobalMethods() {
        window.editTask = (id) => this.editTask(id);
        window.deleteTask = (id) => this.deleteTask(id);
        window.changeTaskStatus = (id, status) => this.changeTaskStatus(id, status);
    }
    
    async loadTasks() {
        try {
            this.ui.showLoading();
            const response = await this.api.getAllTasks();
            console.log('Tarefas carregadas:', response);
            
            if (response.success) {
                this.tasks = response.data;
                this.filterTasks(this.currentFilter);
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            this.ui.showAlert(`Erro ao carregar tarefas: ${error.message}`, 'danger');
            this.ui.showEmptyState();
        } finally {
            this.ui.hideLoading();
        }
    }
    
    filterTasks(filter) {
        this.currentFilter = filter;
        
        let filteredTasks = this.tasks;
        
        if (filter !== 'all') {
            filteredTasks = this.tasks.filter(task => task.status === filter);
        }
        
        this.ui.renderTasks(filteredTasks);
    }
    
    async saveTask() {
        try {
            const formData = this.getFormData();
            
            if (!this.validateForm(formData)) {
                return;
            }


            console.log('Salvando tarefa:', formData);
            
            const saveBtn = document.getElementById('saveTaskBtn');
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Salvando...';
            saveBtn.disabled = true;
            
            let response;
            
            if (this.editingTaskId) {
                response = await this.api.updateTask(this.editingTaskId, formData);
            } else {
                response = await this.api.createTask(formData);
            }
            
            if (response.success) {
                this.ui.showAlert(response.message, 'success');
                
                // Fechar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
                modal.hide();
                
                // Recarregar tarefas
                await this.loadTasks();
                
                this.editingTaskId = null;
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            this.ui.showAlert(`Erro ao salvar tarefa: ${error.message}`, 'danger');
        } finally {
            const saveBtn = document.getElementById('saveTaskBtn');
            saveBtn.innerHTML = '<i class="fas fa-save me-1"></i>Salvar';
            saveBtn.disabled = false;
        }
    }
    
    getFormData() {
        return {
            title: document.getElementById('taskTitle').value.trim(),
            description: document.getElementById('taskDescription').value.trim(),
            status: document.getElementById('taskStatus').value
        };
    }
    
    validateForm(data) {
        let isValid = true;
        
        // Validar título
        if (!data.title || data.title.length < 3) {
            this.setFieldError('taskTitle', 'O título deve ter pelo menos 3 caracteres');
            isValid = false;
        } else if (data.title.length > 255) {
            this.setFieldError('taskTitle', 'O título deve ter no máximo 255 caracteres');
            isValid = false;
        } else {
            this.clearFieldError('taskTitle');
        }
        
        // Validar descrição
        if (data.description && data.description.length > 1000) {
            this.setFieldError('taskDescription', 'A descrição deve ter no máximo 1000 caracteres');
            isValid = false;
        } else {
            this.clearFieldError('taskDescription');
        }
        
        return isValid;
    }
    
    setFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const feedback = field.parentElement.querySelector('.invalid-feedback');
        
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        feedback.textContent = message;
    }
    
    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        field.classList.remove('is-invalid');
        
        if (field.value.trim()) {
            field.classList.add('is-valid');
        }
    }
    
    async editTask(id) {
        try {
            const task = this.tasks.find(t => t.id == id);
            
            if (!task) {
                throw new Error('Tarefa não encontrada');
            }
            
            this.editingTaskId = id;
            this.ui.setModalTitle('Editar Tarefa');
            this.ui.populateForm(task);
            
            const modal = new bootstrap.Modal(document.getElementById('taskModal'));
            modal.show();
        } catch (error) {
            this.ui.showAlert(`Erro ao editar tarefa: ${error.message}`, 'danger');
        }
    }
    
    deleteTask(id) {
        this.taskToDelete = id;
        const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
        modal.show();
    }
    
    async confirmDelete() {
        try {
            if (!this.taskToDelete) return;
            
            const confirmBtn = document.getElementById('confirmDeleteBtn');
            confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Excluindo...';
            confirmBtn.disabled = true;
            
            const response = await this.api.deleteTask(this.taskToDelete);
            
            if (response.success) {
                this.ui.showAlert(response.message, 'success');
                
                // Fechar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
                modal.hide();
                
                // Recarregar tarefas
                await this.loadTasks();
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            this.ui.showAlert(`Erro ao excluir tarefa: ${error.message}`, 'danger');
        } finally {
            const confirmBtn = document.getElementById('confirmDeleteBtn');
            confirmBtn.innerHTML = '<i class="fas fa-trash me-1"></i>Excluir';
            confirmBtn.disabled = false;
            this.taskToDelete = null;
        }
    }
    
    async changeTaskStatus(id, newStatus) {
        try {
            const task = this.tasks.find(t => t.id == id);
            
            if (!task) {
                throw new Error('Tarefa não encontrada');
            }
            
            const response = await this.api.updateTask(id, { status: newStatus });
            
            if (response.success) {
                const statusLabels = {
                    'pendente': 'reaberta',
                    'em_andamento': 'iniciada',
                    'concluida': 'concluída'
                };
                
                this.ui.showAlert(`Tarefa ${statusLabels[newStatus]} com sucesso!`, 'success');
                await this.loadTasks();
            } else {
                throw new Error(response.error);
            }
        } catch (error) {
            this.ui.showAlert(`Erro ao alterar status: ${error.message}`, 'danger');
        }
    }
    
    clearForm() {
        this.editingTaskId = null;
        this.ui.setModalTitle('Nova Tarefa');
        this.ui.clearForm();
    }
}