CREATE DATABASE rsti_final;
USE rsti_final;


CREATE TABLE usuario (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    nome VARCHAR(100) NOT NULL, 
    email VARCHAR(100) NOT NULL UNIQUE, 
    senha VARCHAR(255) NOT NULL, 
    telefone VARCHAR(20) UNIQUE, 
    nivel_acesso ENUM('admin', 'colaborador', 'cliente') NOT NULL DEFAULT 'cliente' 
); 

CREATE TABLE cliente (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(55)
);

CREATE TABLE tipo_servico (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE 
);

CREATE TABLE demandas (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45) NOT NULL, 
    tipo_servico_id INT NOT NULL,
    descricao TEXT NOT NULL,
    cliente_id INT NOT NULL,
    orcamento DECIMAL(8,2) NOT NULL,
    prazo DATE NOT NULL,
    data_entrega
    status_servico ENUM('Em andamento', 'Atrasado', 'Concluído', 'Cancelado') NOT NULL DEFAULT 'Em andamento', 
    
    FOREIGN KEY (data_entrega) REFERENCES entregas(id)
    FOREIGN KEY (tipo_servico_id) REFERENCES tipo_servico(id),
    FOREIGN KEY (cliente_id) REFERENCES usuario(id)
);


CREATE TABLE entregas (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(45) NOT NULL,
    tipo_servico_id INT NOT NULL,
    descricao TEXT NPT NULL,
    demanda_id INT NOT NULL UNIQUE, 
    data_entrega DATE NOT NULL,
    
    FOREIGN KEY (orcamento) REFERENCES demandas(id)
    FOREIGN KEY (cliente_id) REFERENCES cliente(id)
    FOREIGN KEY (tipo_servico_id) REFERENCES tipo_servico(id)
    FOREIGN KEY (demanda_id) REFERENCES demandas(id),
    
);
