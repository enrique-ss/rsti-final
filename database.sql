-- Cria o banco de dados se não existir
CREATE DATABASE IF NOT EXISTS rsti_final;
USE rsti_final;

-- Tabela: usuario (Melhoria: Tipos de dados mais adequados e restrições)
CREATE TABLE usuario (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, -- UNSIGNED para IDs
    nome VARCHAR(100) NOT NULL, -- Aumentado o tamanho para nomes completos
    email VARCHAR(100) NOT NULL UNIQUE, -- Aumentado o tamanho
    senha_hash VARCHAR(255) NOT NULL, -- MELHORIA CRÍTICA: Use HASHES (como SHA-256) e não armazene senhas em texto puro. Aumentado o tamanho.
    telefone VARCHAR(20) UNIQUE, -- MELHORIA: Use VARCHAR para telefones (permite parênteses, traços, códigos de país)
    nivel_acesso ENUM('admin', 'colaborador', 'cliente') NOT NULL DEFAULT 'cliente' -- MELHORIA: Use ENUM ou defina valores padronizados
); 

-- Tabela: tipo_servico
CREATE TABLE tipo_servico (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE -- Adicionado UNIQUE para garantir tipos de serviço distintos
);

-- Tabela: demandas (Melhoria: Relacionamentos e tipos de dados)
CREATE TABLE demandas (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    descricao TEXT NOT NULL,
    tipo_servico_id INT UNSIGNED NOT NULL, -- Chave estrangeira para o tipo de serviço
    cliente_id INT UNSIGNED NOT NULL, -- Chave estrangeira para o usuário que fez a demanda
    orcamento DECIMAL(8,2) NOT NULL, -- MELHORIA: Aumentado o tamanho para o orçamento (ex: R$ 999999.99)
    data_solicitacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Adicionado timestamp de criação
    prazo DATE NOT NULL,
    status_servico ENUM('pendente', 'em_progresso', 'concluido', 'cancelado') NOT NULL DEFAULT 'pendente', -- MELHORIA: Uso de ENUM para status
    
    -- Definição das Chaves Estrangeiras
    FOREIGN KEY (tipo_servico_id) REFERENCES tipo_servico(id),
    FOREIGN KEY (cliente_id) REFERENCES usuario(id)
);

-- Tabela: relatorio (Melhoria: Adicionado campos de data e quem criou o relatório)
CREATE TABLE relatorio(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    demanda_id INT UNSIGNED NOT NULL UNIQUE, -- Deve ser UNIQUE se um relatório for 1:1 com a demanda
    data_criacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    conteudo TEXT, -- Campo para o corpo do relatório
    usuario_responsavel_id INT UNSIGNED, -- Quem criou/aprovou o relatório
    
    -- Definição das Chaves Estrangeiras
    FOREIGN KEY (demanda_id) REFERENCES demandas(id),
    FOREIGN KEY (usuario_responsavel_id) REFERENCES usuario(id)
);