export class TaskUI {
  constructor() {
    this.tasksContainer = document.getElementById("tasksContainer");
    this.loadingSpinner = document.getElementById("loadingSpinner");
    this.emptyState = document.getElementById("emptyState");
    this.alertContainer = document.getElementById("alertContainer");
    this.taskCounter = document.getElementById("taskCounter");

    // Mover statusLabels para fora do construtor ou garantir inicialização
    this.initializeStatusLabels();
  }

  initializeStatusLabels() {
    this.statusLabels = {
      pendente: { label: "Pendente", class: "bg-warning" },
      em_andamento: { label: "Em Andamento", class: "bg-info" },
      concluida: { label: "Concluída", class: "bg-success" },
    };
  }

  showLoading() {
    this.loadingSpinner.classList.remove("d-none");
    this.tasksContainer.classList.add("d-none");
    this.emptyState.classList.add("d-none");
  }

  hideLoading() {
    this.loadingSpinner.classList.add("d-none");
    this.tasksContainer.classList.remove("d-none");
  }

  showEmptyState() {
    this.emptyState.classList.remove("d-none");
    this.tasksContainer.classList.add("d-none");
  }

  hideEmptyState() {
    this.emptyState.classList.add("d-none");
    this.tasksContainer.classList.remove("d-none");
  }

  showAlert(message, type = "info") {
    const alertId = `alert-${Date.now()}`;
    const alertHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" id="${alertId}" role="alert">
                <i class="fas fa-${this.getAlertIcon(type)} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

    this.alertContainer.insertAdjacentHTML("beforeend", alertHTML);

    // Auto-remove após 5 segundos
    setTimeout(() => {
      const alert = document.getElementById(alertId);
      if (alert) {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
      }
    }, 5000);
  }

  getAlertIcon(type) {
    const icons = {
      success: "check-circle",
      danger: "exclamation-triangle",
      warning: "exclamation-circle",
      info: "info-circle",
    };
    return icons[type] || "info-circle";
  }

  renderTasks(tasks) {
    if (!tasks || tasks.length === 0) {
      this.showEmptyState();
      this.updateTaskCounter(0);
      return;
    }

    this.hideEmptyState();

    const tasksHTML = tasks.map((task) => this.createTaskCard(task)).join("");
    this.tasksContainer.innerHTML = tasksHTML;

    this.updateTaskCounter(tasks.length);

    // Adicionar animação
    this.tasksContainer
      .querySelectorAll(".task-card")
      .forEach((card, index) => {
        setTimeout(() => {
          card.classList.add("fade-in");
        }, index * 100);
      });
  }

  createTaskCard(task) {

    if (!this.statusLabels) {
      this.initializeStatusLabels();
    }

    const cleanStatus = task.status ? task.status.trim() : "";
    // console.log("Clean status:", cleanStatus); <-- Usado como teste se de estado atual da variável task.status

    const statusInfo = this.statusLabels[cleanStatus] || {
      label: "Desconhecido",
      class: "bg-secondary",
    };
    // console.log("statusInfo:", statusInfo); <-- Usado como teste de validação de dados

    const formattedDate = this.formatDate(task.created_at);
    const updatedDate =
      task.updated_at !== task.created_at
        ? this.formatDate(task.updated_at)
        : null;

    return `
            <div class="col-md-6 col-lg-4">
                <div class="card task-card status-${cleanStatus}" data-task-id="${
      task.id
    }">
                    <div class="card-body position-relative">
                        <span class="badge ${
                          statusInfo.class
                        } task-status-badge">
                            ${statusInfo.label}
                        </span>
                        
                        <h5 class="task-title">${this.escapeHtml(
                          task.title
                        )}</h5>
                        
                        ${
                          task.description
                            ? `
                            <p class="task-description">${this.escapeHtml(
                              task.description
                            )}</p>
                        `
                            : ""
                        }
                        
                        <div class="d-flex justify-content-between align-items-center task-actions">
                            <div class="btn-group" role="group">
                                <button class="btn btn-outline-primary btn-sm" onclick="window.editTask(${
                                  task.id
                                })">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-outline-danger btn-sm" onclick="window.deleteTask(${
                                  task.id
                                })">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                            
                            <div class="btn-group" role="group">
                                ${this.createStatusButtons({
                                  ...task,
                                  status: cleanStatus,
                                })}
                            </div>
                        </div>
                        
                        <div class="task-meta">
                            <div><i class="fas fa-calendar-plus me-1"></i>Criado: ${formattedDate}</div>
                            ${
                              updatedDate
                                ? `<div><i class="fas fa-calendar-check me-1"></i>Atualizado: ${updatedDate}</div>`
                                : ""
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  createStatusButtons(task) {
    const buttons = [];

    if (task.status === "pendente") {
      buttons.push(`
                <button class="btn btn-info btn-sm" onclick="window.changeTaskStatus(${task.id}, 'em_andamento')" title="Iniciar tarefa">
                    <i class="fas fa-play"></i>
                </button>
            `);
    }

    if (task.status === "em_andamento") {
      buttons.push(`
                <button class="btn btn-success btn-sm" onclick="window.changeTaskStatus(${task.id}, 'concluida')" title="Concluir tarefa">
                    <i class="fas fa-check"></i>
                </button>
            `);
    }

    if (task.status === "concluida") {
      buttons.push(`
                <button class="btn btn-warning btn-sm" onclick="window.changeTaskStatus(${task.id}, 'pendente')" title="Reabrir tarefa">
                    <i class="fas fa-undo"></i>
                </button>
            `);
    }

    return buttons.join("");
  }

  updateTaskCounter(count) {
    const badge = this.taskCounter.querySelector(".badge");
    badge.textContent = count;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  populateForm(task) {
    document.getElementById("taskTitle").value = task.title;
    document.getElementById("taskDescription").value = task.description || "";
    document.getElementById("taskStatus").value = task.status;

    // Limpar validações
    document.querySelectorAll(".form-control").forEach((input) => {
      input.classList.remove("is-valid", "is-invalid");
    });
  }

  clearForm() {
    document.getElementById("taskForm").reset();
    document.querySelectorAll(".form-control").forEach((input) => {
      input.classList.remove("is-valid", "is-invalid");
    });
  }

  setModalTitle(title) {
    document.getElementById("modalTitle").textContent = title;
  }
}
