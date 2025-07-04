FROM php:8.1-apache

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Instalar extensões necessárias do PHP
RUN docker-php-ext-install pdo pdo_mysql mysqli zip

# Habilitar mod_rewrite e headers
RUN a2enmod rewrite headers

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar PHP
RUN echo "memory_limit = 256M" >> /usr/local/etc/php/conf.d/docker-php-memlimit.ini \
    && echo "upload_max_filesize = 50M" >> /usr/local/etc/php/conf.d/docker-php-uploads.ini \
    && echo "post_max_size = 50M" >> /usr/local/etc/php/conf.d/docker-php-uploads.ini

# Definir diretório de trabalho
WORKDIR /var/www/html

# Copiar arquivos da aplicação
COPY src/ /var/www/html/

# Ajustar permissões
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Expor porta 80
EXPOSE 80

# Comando para iniciar o Apache
CMD ["apache2-foreground"]