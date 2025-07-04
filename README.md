# Gerenciador de Tarefas

Uma aplicação web completa para gerenciamento de tarefas, desenvolvida com PHP no backend e JavaScript vanilla no frontend, utilizando Bootstrap para interface responsiva.

## 🚀 Funcionalidades

- ✅ **CRUD completo** de tarefas (Criar, Listar, Editar, Excluir)
- 🔄 **Gerenciamento de status** (Pendente, Em Andamento, Concluída)
- 🎯 **Filtros por status** para organização das tarefas
- 📱 **Interface responsiva** com Bootstrap 5
- ⚡ **Comunicação assíncrona** via AJAX
- 🛡️ **Validação de dados** frontend e backend
- 🎨 **Animações suaves** e feedback visual
- 🔒 **Sanitização de dados** para segurança

## 🛠️ Tecnologias Utilizadas

### Backend
- **PHP 8.1** - Linguagem principal
- **MySQL 8.0** - Banco de dados
- **Apache** - Servidor web
- **PDO** - Abstração de banco de dados

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilização personalizada
- **JavaScript ES6+** - Lógica e interatividade
- **Bootstrap 5.3** - Framework CSS
- **Font Awesome** - Ícones

### Infraestrutura
- **Docker** - Containerização
- **Docker Compose** - Orquestração de serviços

## 📋 Pré-requisitos

- Docker
- Docker Compose
- Git

## 🚀 Como executar

### 1. Clone o repositório
```bash
git clone <url-do-repositório>
cd gerenciador-tarefas
```

### 2. Suba os containers
```bash
docker-compose up -d
```

### 3. Acesse a aplicação
Abra seu navegador e acesse: `http://localhost:9000`

## 📁 Estrutura do Projeto

projeto/
├── docker-compose.yml
├── Dockerfile
├── src/
│   ├── api/
│   │   ├── index.php
│   │   ├── config/
│   │   │   └── database.php
│   │   └── endpoints/
│   │       └── tasks.php
│   ├── public/
│   │   ├── index.html
│   │   ├── css/
│   │   ├── js/
│   │   └── assets/
│   └── database/
│       └── init.sql
├── .env
└── README.md