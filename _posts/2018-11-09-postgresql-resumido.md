---
layout: post
comments: true
title: "PostgreSQL Resumido"
date: 2018-11-09 00:57:54
image: '/assets/img/'
description: "Um simples resumo dos comandos do SGBD que aprendi na graduação."
main-class: 'comp'
color:
tags: ['computação', 'dev']
categories:
twitter_text:
introduction: "Um simples resumo dos comandos do SGBD que aprendi na graduação."
---

## Introdução

Esse post tem como objetivo principal, servir de recordação e divulgação dos principais conceitos que foram ensinados na matéria de Sistema de Banco de dados sobre o SGBD, no curso de Ciência da Computação da Univesidade Federal de Uberlândia.


## O que é PostgreSQL?
O PostgreSQL, mais conhecido popularmente como Postgres, é um sistema de gerenciamento de banco de dados relacional de objetos (ORDBMS) com ênfase em extensibilidade e conformidade com padrões. Ele pode lidar com cargas de trabalho que variam desde pequenos aplicativos de uma única máquina a grandes aplicativos voltados para a Internet (ou para armazenamento de dados) com muitos usuários simultâneos. Para mais informações acesse [Site Oficial do PostGreSQL](https://www.postgresql.org/)

![Logo Postgresql](/BlogFziliotti/assets/img/comp/postgresql.png)

## SQL
Structured Query Language, ou Linguagem de Consulta Estruturada ou SQL, é a linguagem de pesquisa declarativa padrão para banco de dados relacional. Muitas das características originais do SQL foram inspiradas na álgebra relacional. 

Os comandos de SQL podem ser agrupados em 3 classes: 
1. DDL - Comandos para a Definição de Dados
2. DML - Comandos para a Manipulação de Dados
3. DCL - Comandos para o controle do Gerenciador, Conexão e Usuário

> Irei comentar apenas sobre as 2 primeiras classes para não extender muito o post.



### 1 - SQL DDL (Linguagem de definição de dados):

```sql
-- Cria um esquema de BD relacional
CREATE SCHEMA <nomeSCHEMA>; 

-- Remove um esquema de BD relacional
DROP SCHEMA <nomeSCHEMA>;

-- Alterar o caminho de pesquisa para o esquema 
SET search_path TO <nomeSCHEMA>;

-- Comandos para criar/remover/alterar tabelas
CREATE TABLE <nomeTabela> (
    atributos | tipos de dados | especificacoes | restricoes
)

-- Deleta a Tabela
DROP TABLE <nomeTabela>;

-- Altera a tabela, inserindo, removendo e alterando propriedades
ALTER TABLE <nome da tabela>
ADD <definicao de Coluna>
ADD <Restricao de integridade> -- Chaves primárias, Estrangeiras
ALTER <definicao de Coluna>
ALTER <definicao de Coluna> DEFAULT <default-value>
ALTER <definicao de Coluna> [ NOT ] NULL
DROP <definicao de Coluna>
DROP CONSTRAINT <nome da restricao> -- Remove uma restricao
RENAME TO <novo nome> -- Renomeia a tabela
RENAME <Atributo> TO <novo atributo>


```


### 2 - SQL DML (Linguagem de manipulação de dados):
```sql
-- Insere tupla na tabela
INSERT INTO <nomeTabela>
VALUES ( V1, V2, V3..)
 
--Atualiza tupla da tabela obedecendo critérios
UPDATE tabela
SET novovalor
WHERE criterios;

--Deleta tupla(s) da tabela obedecendo critérios
DELETE
FROM tabela
WHERE criterios;

-- Comando mais utilizado, irá selecionar as tuplas da tabela de acordo com especificações
SELECT <lista de atributos e funcoes>
FROM <lista de tabelas>
[ WHERE predicado ]
[ GROUP BY <atributos de agrupamento> ]
[ HAVING <condicao para agrupamento> ]
[ ORDER BY <lista de atributos> ] ;


```

### Exemplo prático de uso dos comandos de uma locadora com clientes e filmes:
```sql

CREATE SCHEMA locadora; --cria o schema da locadora
SET search_path TO locadora;

CREATE TABLE cliente (
	numcliente numeric NOT NULL,
	nome       varchar(64) NOT NULL,
	endereco   varchar(64) NOT NULL,
	foneres    varchar(64) NOT NULL,
	fonecel    varchar(64) NOT NULL,
	CONSTRAINT num_cliente PRIMARY KEY (numcliente)
);

CREATE TABLE classificacao (
	cod   integer NOT NULL,
	nome  varchar(16) NOT NULL,
	preco money NOT NULL,
	CONSTRAINT cod_classificacao PRIMARY KEY (cod),
	CONSTRAINT nomes_classificacao CHECK (nome = 'super lançamento' OR nome = 'lançamento' OR nome = 'acervo')
);

CREATE TABLE filme (
	numfilme        numeric NOT NULL,
	titulo_original varchar(64) NOT NULL,
	titulo_pt       varchar(7) NOT NULL,
	duracao         integer NOT NULL,
	data_lancamento date NOT NULL,
	direcao         varchar(256) NOT NULL,
	categoria       varchar(64) NOT NULL,
	classificacao   integer NOT NULL,
	CONSTRAINT num_filme PRIMARY KEY (numfilme),
	CONSTRAINT filme_categoria FOREIGN KEY (classificacao)
			REFERENCES classificacao(cod),
	CONSTRAINT tipos_titulos CHECK --A restrição check garante que os valores sejam validos
			(titulo_pt = 'drama'   OR
			titulo_pt = 'romance' OR
			titulo_pt = 'ação'    OR
			titulo_pt = 'comédia')
);


--INSERCOES NA TABELA CLIENTE
INSERT INTO CLIENTE VALUES (1, 'Bosco Calcido das Cruzes', 'Rua da Curva, 10, Pelorinho', '(71) 3984-5566', '(71) 9287-5566');
INSERT INTO CLIENTE VALUES (2, 'Delfim Vieira Neto', 'Av. Dr. Roberto Luzitano, 5543, Ala Oeste', '(55) 3218-7138', '(55) 8671-7138');
INSERT INTO CLIENTE VALUES (3, 'Gabriela Bochelli Soviersovisk', 'Av. Atlantica, 1111, Orla', '(98) 3285-4712', '(98) 8137-4712');

--INSERCOES NA TABELA CLASSIFICACAO
INSERT INTO CLASSIFICACAO VALUES (1,'Super-lancamento',15.00);
INSERT INTO CLASSIFICACAO VALUES (2,'Lancamento',10.00);
INSERT INTO CLASSIFICACAO VALUES (3,'Acervo',5.00);

--INSERCOES NA TABELA FILME
INSERT INTO FILME VALUES (1, 'Citizen Kane', 'Cidadao Kane', 119, '24/01/1942', 'Orson Welles', 'Drama/Misterio', 3); 
INSERT INTO FILME VALUES (2, 'The Shining', 'O Iluminado', 146, '25/12/1980', 'Stanley Kubrick', 'Terror/Misterio', 3);
INSERT INTO FILME VALUES (3, 'World War Z', 'Guerra Mundial Z', 116, '21/06/2013', 'Marc Forster', 'Acao/Drama/Terror', 1);
INSERT INTO FILME VALUES (4, 'Django Unchained', 'Django Livre', 165, '18/01/2013', 'Quentin Tarantino', 'Aventura/Velho-Oeste', 1);


-- Seleciona os titulos de filmes com categoria Romance:
SELECT titulo_original, titulo_pt FROM filme WHERE categoria LIKE '%Romance%';

-- Seleciona todas as tuplas da tabela cliente:
SELECT * FROM cliente;

```


## ASSUNTOS RELACIONADOS

Existem muitos assuntos importantes para estudar e vou citar os principais que estão diretamente ou indiretamente relacionados:

1. Modelos Entidade Relacionamento (MER)
2. Entidade Relacionamento Extendido (MERX)
3. Modelo Relacional
4. Mapeamento MER e MERX para o Modelo Relacional
5. Normalização
6. Algebra Relacional (Matemática por trás do SQL)
    - Seleção
    - Projeção
    - Produto Cartesiano
    - Junção
    - Divisão
    - Operação sobre Conjuntos
7. SQL
    - Views
    - Sequences
    - Stored Procedures
    - Triggers
    - Joins (Inner, Left, Right, Outter..)
    - Distinct, All
    - Cascade, Restrict, SET NULL, NO ACTION
    - e muitos outros assuntos
    
## CONCLUSÃO    
Bom, o intuito desse post é apenas fazer uma breve demonstração dos comandos SQL do Postgres e servir de recordação. Se errei alguma coisa ou faltou algo muito importante, comenta aí em baixo. =)
