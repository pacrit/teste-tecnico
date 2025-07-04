export class TaskAPI {
    constructor() {
        this.baseURL = '/api';
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }
    
    async makeRequest(url, options = {}) {
        try {
            const response = await fetch(`${this.baseURL}${url}`, {
                headers: this.headers,
                ...options
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    async getAllTasks() {
        return this.makeRequest('/tasks');
    }
    
    async getTask(id) {
        return this.makeRequest(`/tasks/${id}`);
    }
    
    async createTask(taskData) {
        return this.makeRequest('/tasks', {
            method: 'POST',
            body: JSON.stringify(taskData)
        });
    }
    
    async updateTask(id, taskData) {
        return this.makeRequest(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(taskData)
        });
    }
    
    async deleteTask(id) {
        return this.makeRequest(`/tasks/${id}`, {
            method: 'DELETE'
        });
    }
}