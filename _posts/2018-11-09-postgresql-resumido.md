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

CREATE SCHEMA locadora;
SET search_path TO locadora;
SET datestyle TO 'DMY';

CREATE TABLE cliente (
	numcliente numeric NOT NULL,
	nome       varchar(64) NOT NULL,
	endereco   varchar(64) NOT NULL,
	foneres    varchar(64) NOT NULL,
	fonecel    varchar(64) NOT NULL,
	CONSTRAINT num_cliente PRIMARY KEY (numcliente)
);

CREATE TABLE ATOR (
	cod INTEGER NOT NULL,
	datanasc DATE NOT NULL,
	nacionalidade VARCHAR(50) NOT NULL,
	nomereal VARCHAR(50) NOT NULL,
	nomeartistico VARCHAR(50) NOT NULL,
	CONSTRAINT PK_ATOR
		PRIMARY KEY (cod)
);

CREATE TABLE classificacao (
	cod   integer NOT NULL,
	nome  varchar(16) NOT NULL,
	preco money NOT NULL,
	CONSTRAINT cod_classificacao PRIMARY KEY (cod),
	CONSTRAINT nomes_classificacao CHECK (nome = 'super lançamento' OR nome = 'lançamento' OR nome = 'acervo')
);

CREATE TABLE MIDIA (
	numFilme INTEGER NOT NULL,
	numero INTEGER NOT NULL,
	tipo VARCHAR(50) NOT NULL,
	CONSTRAINT PK_MIDIA
		PRIMARY KEY (numFilme, numero, tipo),
	CONSTRAINT FK_MIDIA
		FOREIGN KEY (numFilme) REFERENCES FILME
		ON UPDATE CASCADE
		ON DELETE CASCADE
);

CREATE TABLE ESTRELA (
	numFilme INTEGER NOT NULL,
	codator INTEGER NOT NULL,
	CONSTRAINT PK_ESTRELA
		PRIMARY KEY (numfilme, codator),
	CONSTRAINT FK_ESTRELA
		FOREIGN KEY (numFilme) REFERENCES FILME
		ON UPDATE CASCADE
		ON DELETE CASCADE,
		FOREIGN KEY (codator) REFERENCES ATOR
		ON UPDATE CASCADE
		ON DELETE CASCADE
);

CREATE TABLE EMPRESTIMO (
	numFilme INTEGER NOT NULL,
	numero INTEGER NOT NULL,
	tipo VARCHAR(50) NOT NULL,
	cliente INTEGER NOT NULL,
	dataret DATE NOT NULL,
	datedev DATE NOT NULL,
	valor_pg FLOAT NOT NULL,
	CONSTRAINT PK_EMPRESTIMO
		PRIMARY KEY (numfilme, numero, tipo, cliente),
	CONSTRAINT FK_EMPRESTIMO
		FOREIGN KEY (numFilme, numero, tipo) REFERENCES MIDIA (numFilme, numero, tipo)
			ON UPDATE CASCADE
			ON DELETE CASCADE,
		FOREIGN KEY (cliente) REFERENCES CLIENTE
			ON UPDATE CASCADE
			ON DELETE CASCADE
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


INSERT INTO CLIENTE VALUES (1, 'João José da Silva', 'Rua das Dores, 1687, Ipiranga', '(91) 3524-4651', '(91) 9254-4651');
INSERT INTO CLIENTE VALUES (2, 'Maria Joaquina Magalhães', 'Av. Litorânia, 5484, Praia do Morro', '(28) 3842-9741', '(28) 9954-9741');
INSERT INTO CLIENTE VALUES (3, 'Abelita Valéria Fernandes', 'Av. Marechal Deodoro da Fonseca, 842, Santa Maria', '(21) 2164-8974', '(21) 9988-8974');
INSERT INTO CLIENTE VALUES (4, 'Belarmino Jhones', 'Rua Joaquim Aníbal, 21, Centro', '(31) 3249-1245', '(31) 8821-1245');
INSERT INTO CLIENTE VALUES (5, 'Bosco Calcido das Cruzes', 'Rua da Curva, 10, Pelorinho', '(71) 3984-5566', '(71) 9287-5566');
INSERT INTO CLIENTE VALUES (6, 'Delfim Vieira Neto', 'Av. Dr. Roberto Luzitano, 5543, Ala Oeste', '(55) 3218-7138', '(55) 8671-7138');
INSERT INTO CLIENTE VALUES (7, 'Gabriela Bochelli Soviersovisk', 'Av. Atlântica, 1111, Orla', '(98) 3285-4712', '(98) 8137-4712');

INSERT INTO CLASSIFICACAO VALUES (1,'Super-lançamento',15.00);
INSERT INTO CLASSIFICACAO VALUES (2,'Lançamento',10.00);
INSERT INTO CLASSIFICACAO VALUES (3,'Acervo',5.00);

INSERT INTO FILME VALUES (1, 'The Godfather', 'O Poderoso Chefão', 175, '24/03/1972', 'Francis Ford Coppola', 'Crime/Drama', 3);
INSERT INTO FILME VALUES (2, 'Over Flew Over The Cuckoos Nest', 'Um Estranho no Ninho', 133, '21/11/1975', 'Millos Forman', 'Drama', 3);
INSERT INTO FILME VALUES (3, 'The Avengers', 'Os Vingadores', 143, '26/04/2012', 'Joss Whedon', 'Ação', 2);
INSERT INTO FILME VALUES (4, 'A Clockwork Orange', 'Laranja Mecânica', 136, '13/01/1972', 'Stanley Kubrick', 'Crime/Drama/Ficção Científica', 3);
INSERT INTO FILME VALUES (5, 'Inception', 'A Origem', 148, '16/07/2010', 'Christopher Nolan', 'Ação/Aventura/Mistério', 2);
INSERT INTO FILME VALUES (6, 'Pulp Fiction', 'Pulp Fiction: Tempo de Violência', 154, '21/10/1994', 'Quentin Tarantino', 'Crime/Drama/Thriller', 3);
INSERT INTO FILME VALUES (7, 'The Hangover Part III', 'Se Beber, Não Case! Parte: 3', 100, '24/05/2013', 'Tood Phillips', 'Comédia', 1);
INSERT INTO FILME VALUES (8, 'The Silence of the Lambs', 'O Silêncio dos Inocentes', 118, '31/05/1991', 'Jonathan Demme', 'Crime/Drama/Thriller', 1);
INSERT INTO FILME VALUES (9, 'Memento', 'Amnésia', 113, '20/10/2000', 'Christopher Nolan', 'Mistério/Thriller', 3);
INSERT INTO FILME VALUES (10, 'Les Misérables', 'Os Miseráveis', 158, '11/01/2013', 'Tom Hooper', 'Drama/Musical/Romance', 1);
INSERT INTO FILME VALUES (11, 'The Pianist', 'O Pianista', 150, '24/01/2003', 'Roman Polanski', 'Biografia/Drama/História', 3);
INSERT INTO FILME VALUES (12, 'Citizen Kane', 'Cidadão Kane', 119, '24/01/1942', 'Orson Welles', 'Drama/Mistério', 3); 
INSERT INTO FILME VALUES (13, 'The Shining', 'O Iluminado', 146, '25/12/1980', 'Stanley Kubrick', 'Terror/Mistério', 3);
INSERT INTO FILME VALUES (14, 'World War Z', 'Guerra Mundial Z', 116, '21/06/2013', 'Marc Forster', 'Ação/Drama/Terror', 1);
INSERT INTO FILME VALUES (15, 'Django Unchained', 'Django Livre', 165, '18/01/2013', 'Quentin Tarantino', 'Aventura/Velho-Oeste', 1);

-- Super-lançamentos
INSERT INTO MIDIA VALUES (7,1,'Blu-ray');
INSERT INTO MIDIA VALUES (7,2,'DVD');
INSERT INTO MIDIA VALUES (10,1,'Blu-ray');
INSERT INTO MIDIA VALUES (14,1,'Blu-ray');
INSERT INTO MIDIA VALUES (14,2,'DVD');
INSERT INTO MIDIA VALUES (14,3,'VHS');
INSERT INTO MIDIA VALUES (15,1,'Blu-ray');

-- Lançamentos
INSERT INTO MIDIA VALUES (3,1,'Blu-ray');
INSERT INTO MIDIA VALUES (3,2,'DVD');
INSERT INTO MIDIA VALUES (3,3,'VHS');
INSERT INTO MIDIA VALUES (5,1,'Blu-ray');
INSERT INTO MIDIA VALUES (5,2,'DVD');

-- Acervo
INSERT INTO MIDIA VALUES (1,1,'DVD');
INSERT INTO MIDIA VALUES (1,2,'DVD');
INSERT INTO MIDIA VALUES (1,3,'VHS');
INSERT INTO MIDIA VALUES (2,1,'VHS');
INSERT INTO MIDIA VALUES (2,2,'VHS');
INSERT INTO MIDIA VALUES (4,1,'VHS');
INSERT INTO MIDIA VALUES (6,1,'DVD');
INSERT INTO MIDIA VALUES (8,1,'VHS');
INSERT INTO MIDIA VALUES (9,1,'DVD');
INSERT INTO MIDIA VALUES (11,1,'DVD');
INSERT INTO MIDIA VALUES (12,1,'VHS');
INSERT INTO MIDIA VALUES (13,1,'DVD');

INSERT INTO EMPRESTIMO VALUES (1,3,'VHS',1,'15/08/1978', '27/06/2013', 63675.00);
INSERT INTO EMPRESTIMO VALUES (2,1,'VHS',2,'12/01/2013', '14/01/2013', 5.00);
INSERT INTO EMPRESTIMO VALUES (3,1,'Blu-ray',3,'29/04/2012', '30/04/2012', 10.00);
INSERT INTO EMPRESTIMO VALUES (4,1,'VHS',4,'01/01/2013', '03/01/2013', 5.00);
INSERT INTO EMPRESTIMO VALUES (5,1,'Blu-ray',5,'30/09/2012', '01/10/2012', 10.00);
INSERT INTO EMPRESTIMO VALUES (6,1,'DVD',6,'04/05/2013', '06/05/2013', 5.00);
INSERT INTO EMPRESTIMO VALUES (7,1,'Blu-ray',7,'27/05/2013', '28/05/2013', 15.00);
INSERT INTO EMPRESTIMO VALUES (8,1,'VHS',1,'16/03/2013', '17/03/2013', 15.00);
INSERT INTO EMPRESTIMO VALUES (9,1,'DVD',2,'24/03/2013', '25/03/2013', 5.00);
INSERT INTO EMPRESTIMO VALUES (10,1,'Blu-ray',3,'22/06/2013', '23/06/2013', 15.00);
INSERT INTO EMPRESTIMO VALUES (11,1,'DVD',4,'12/01/2013', '14/01/2013', 5.00);
INSERT INTO EMPRESTIMO VALUES (12,1,'VHS',5,'12/02/2013', '14/02/2013', 5.00);
INSERT INTO EMPRESTIMO VALUES (13,1,'DVD',6,'12/10/2012', '15/10/2012', 5.00);
INSERT INTO EMPRESTIMO VALUES (14,1,'Blu-ray',7,'23/06/2013', '27/06/2013', 30.00);
INSERT INTO EMPRESTIMO VALUES (15,1,'Blu-ray',1,'15/02/2013', '19/02/2013', 45.00);
INSERT INTO EMPRESTIMO VALUES (1,1,'DVD',2,'02/05/2013', '05/05/2013', 5.00);
INSERT INTO EMPRESTIMO VALUES (2,2,'VHS',3,'09/04/2013', '12/04/2013', 10.00);
INSERT INTO EMPRESTIMO VALUES (3,1,'Blu-ray',4,'19/02/2013', '20/02/2013', 10.00);
INSERT INTO EMPRESTIMO VALUES (4,1,'VHS',5,'07/06/2013', '08/06/2013', 5.00);
INSERT INTO EMPRESTIMO VALUES (5,1,'Blu-ray',6,'14/06/2013', '27/06/2013', 65.00);

INSERT INTO ATOR VALUES (1, '03/04/1923', 'USA', 'Marlon Brando Jr.', 'Marlon Brando');
INSERT INTO ATOR VALUES (2, '25/04/1940', 'USA', 'Alfredo James Pacino', 'Al Pacino');
INSERT INTO ATOR VALUES (3, '26/03/1940', 'USA', 'James Edmund Caan', 'James Caan');
INSERT INTO ATOR VALUES (4, '22/04/1937', 'USA', 'John Joseph Nicholson', 'Jack Nicholson');
INSERT INTO ATOR VALUES (5, '17/11/1944', 'USA', 'Daniel Michae DeVito Jr.', 'Danny DeVito');
INSERT INTO ATOR VALUES (6, '22/10/1938', 'USA', 'Christopher Allen Lloyd', 'Christopher Lloyd');
INSERT INTO ATOR VALUES (7, '04/04/1965', 'USA', 'Robert John Downey Jr.', 'Robert Downey Jr.'); 
INSERT INTO ATOR VALUES (8, '22/12/1967', 'USA', 'Mark Alan Ruffalo', 'Mark Ruffalo');
INSERT INTO ATOR VALUES (9, '22/11/1984', 'USA', 'Scarlett Ingrid Johansson', 'Scarlett Johansson');
INSERT INTO ATOR VALUES (10, '13/06/1943', 'UK', 'Malcolm John Taylor', 'Malcolm McDowell');
INSERT INTO ATOR VALUES (11, '26/04/1947', 'UK', 'Alan Clarke', 'Warren Clarke');
INSERT INTO ATOR VALUES (12, '13/11/1930', 'UK', 'Adrienne Riccoboni', 'Adrienne Corri');
INSERT INTO ATOR VALUES (13, '11/11/1974', 'USA', 'Leonardo Wilhelm DiCaprio', 'Leonardo DiCaprio');
INSERT INTO ATOR VALUES (14, '17/02/1981', 'USA', 'Joseph Leonard Gordon-Levitt', 'Joseph Gordon-Levitt');
INSERT INTO ATOR VALUES (15, '21/02/1987', 'Canadá', 'Ellen Philpotts-Page', 'Ellen Page');
INSERT INTO ATOR VALUES (16, '18/02/1954', 'USA', 'John Joseph Travolta', 'John Travolta');
INSERT INTO ATOR VALUES (17, '21/12/1948', 'USA', 'Samuel Leroy Jackson', 'Samuel L. Jackson');
INSERT INTO ATOR VALUES (18, '19/03/1955', 'Alemanha Ocidental', 'Walter Bruce Willis', 'Bruce Willis');
INSERT INTO ATOR VALUES (19, '05/01/1975', 'USA', 'Bradley Charles Cooper', 'Bradley Cooper');
INSERT INTO ATOR VALUES (20, '24/01/1974', 'USA', 'Edward Paul Helms', 'Ed Helms');
INSERT INTO ATOR VALUES (21, '01/10/1969', 'USA', 'Zacharius Knight Galifianakis', 'Zach Galifianakis');
INSERT INTO ATOR VALUES (22, '31/12/1937', 'UK', 'Philip Anthony Hopkins', 'Anthony Hopkins');
INSERT INTO ATOR VALUES (23, '19/11/1962', 'USA', 'Alicia Christian Foster', 'Jodie Foster');
INSERT INTO ATOR VALUES (24, '25/08/1944', 'USA', 'Philip Anthony Mair Heald', 'Anthony Heald');
INSERT INTO ATOR VALUES (25, '05/10/1967', 'UK', 'Guy Edward Peace', 'Guy Pearce');
INSERT INTO ATOR VALUES (26, '21/08/1967', 'Canadá', 'Carrie-Anne Moss', 'Carrie-Anne Moss');
INSERT INTO ATOR VALUES (27, '12/09/1951', 'USA', 'Joseph Peter Pantoliano', 'Joe Pantoliano');
INSERT INTO ATOR VALUES (28, '12/10/1968', 'Austrália', 'Hugh Michael Jackman', 'Hugh Jackman');
INSERT INTO ATOR VALUES (29, '07/04/1964', 'Nova Zelândia', 'Russel Ira Crowe', 'Russel Crowe');
INSERT INTO ATOR VALUES (30, '03/12/1985', 'USA', 'Amanda Michelle Seyfried', 'Amanda Seyfried');
INSERT INTO ATOR VALUES (31, '14/04/1973', 'USA', 'Adrien Brody', 'Adrien Brody');
INSERT INTO ATOR VALUES (32, '31/07/1964', 'UK', 'Emilia Lydia Rose Fox', 'Emilia Fox');
INSERT INTO ATOR VALUES (33, '06/08/1926', 'UK', 'Francis Finlay', 'Frank Finlay');
INSERT INTO ATOR VALUES (34, '15/05/1905', 'USA', 'Joseph Cheshire Cotten', 'Joseph Cotten');
INSERT INTO ATOR VALUES (35, '24/08/1913', 'USA', 'Margaret Louise Comingore', 'Dorothy Comingore');
INSERT INTO ATOR VALUES (36, '06/12/1900', 'USA', 'Agnes Robertson Moorehead', 'Agnes Moorehead');
INSERT INTO ATOR VALUES (37,'07/07/1949', 'USA', 'Shelley Alexis Duvall', 'Shelley Duvall');
INSERT INTO ATOR VALUES (38, '23/05/1910', 'USA', 'Bejamin Sherman Crothers', 'Scatman Crothers');
INSERT INTO ATOR VALUES (39, '18/12/1963', 'USA', 'William Bradley Pitt', 'Brad Pitt');
INSERT INTO ATOR VALUES (40, '22/09/1975', 'USA', 'Mireille Enos', 'Mireille Enos');
INSERT INTO ATOR VALUES (41, '14/07/1966', 'USA', 'Matthew Chandler Fox', 'Matthew Fox');
INSERT INTO ATOR VALUES (42, '13/12/1967', 'USA', 'Eric Marlon Bishop', 'Jamie Foxx');
INSERT INTO ATOR VALUES (43, '04/10/1956', 'Áustria', 'Christoph Waltz', 'Christoph Waltz');

-- The Godfather
INSERT INTO ESTRELA VALUES (1,1);
INSERT INTO ESTRELA VALUES (1,2);
INSERT INTO ESTRELA VALUES (1,3);

-- Over Flew Over The Cuckoos Nest
INSERT INTO ESTRELA VALUES (2,4);
INSERT INTO ESTRELA VALUES (2,5);
INSERT INTO ESTRELA VALUES (2,6);

-- The Avengers
INSERT INTO ESTRELA VALUES (3,7);
INSERT INTO ESTRELA VALUES (3,8);
INSERT INTO ESTRELA VALUES (3,9);

-- A Clockwork Orange
INSERT INTO ESTRELA VALUES (4,10);
INSERT INTO ESTRELA VALUES (4,11);
INSERT INTO ESTRELA VALUES (4,12);

-- Inception
INSERT INTO ESTRELA VALUES (5,13);
INSERT INTO ESTRELA VALUES (5,14);
INSERT INTO ESTRELA VALUES (5,15);

-- Pulp Fiction
INSERT INTO ESTRELA VALUES (6,16);
INSERT INTO ESTRELA VALUES (6,17);
INSERT INTO ESTRELA VALUES (6,18);

-- The Hangover Part III
INSERT INTO ESTRELA VALUES (7,19);
INSERT INTO ESTRELA VALUES (7,20);
INSERT INTO ESTRELA VALUES (7,21);

-- The Silence of the Lambs
INSERT INTO ESTRELA VALUES (8,22);
INSERT INTO ESTRELA VALUES (8,23);
INSERT INTO ESTRELA VALUES (8,24);

-- Memento
INSERT INTO ESTRELA VALUES (9,25);
INSERT INTO ESTRELA VALUES (9,26);
INSERT INTO ESTRELA VALUES (9,27);

-- Les Misérables
INSERT INTO ESTRELA VALUES (10,28);
INSERT INTO ESTRELA VALUES (10,29);
INSERT INTO ESTRELA VALUES (10,30);

-- The Pianist
INSERT INTO ESTRELA VALUES (11,31);
INSERT INTO ESTRELA VALUES (11,32);
INSERT INTO ESTRELA VALUES (11,33);

-- Citizen Kane
INSERT INTO ESTRELA VALUES (12,34);
INSERT INTO ESTRELA VALUES (12,35);
INSERT INTO ESTRELA VALUES (12,36);

-- The Shining
INSERT INTO ESTRELA VALUES (13,4);
INSERT INTO ESTRELA VALUES (13,37);
INSERT INTO ESTRELA VALUES (13,38);

-- World War Z
INSERT INTO ESTRELA VALUES (14,39);
INSERT INTO ESTRELA VALUES (14,40);
INSERT INTO ESTRELA VALUES (14,41);

-- Django Unchained
INSERT INTO ESTRELA VALUES (15,13);
INSERT INTO ESTRELA VALUES (15,42);
INSERT INTO ESTRELA VALUES (15,43);



-- Seleciona os titulos de filmes com categoria Romance:
SELECT titulo_original, titulo_pt FROM filme WHERE categoria LIKE '%Romance%';

-- Seleciona todas as tuplas da tabela cliente:
SELECT * FROM cliente;

-- Retornar quantos clientes estão cadastrados
SELECT COUNT(*) FROM cliente;

-- Saber qual a classificação mais cara? 
SELECT nome as CLASSIFICACAO, preco as valor_maior
FROM CLASSIFICACAO --função de agregacao
WHERE preco = (SELECT MAX(preco)FROM LIVRO);

--EXERCÍCIOS

-- 1) Qual é a quantidade de filmes alugados antes do dia dd/mm/aaaa (escolha uma data)
SELECT
	COUNT(*) AS quantidade
FROM
	filme f INNER JOIN emprestimo e
		ON f.numfilme = e.numfilme
WHERE
	e.dataret < '01/01/2013'
;

-- 2) Qual a quantidade de filmes de cada categoria a locadora possui (listar o nome da
-- categoria e a quantidade)
SELECT
	COUNT(*) AS quantidade,
	categoria
FROM
	filme
GROUP BY
	categoria

-- 3) Quantos filmes da locadora cada ator estrelou (listar a quantidade juntamente com o
-- nome artístico dos atores em ordem alfabética)
SELECT
	COUNT(*) AS quantidade,
	a.nomeartistico
FROM
	ator a INNER JOIN estrela e
		ON a.cod = e.codator
GROUP BY
	a.cod
ORDER BY
	a.nomeartistico ASC
;

-- 4) Qual é a data de lançamento mais recente entre os filmes disponíveis na locadora?
SELECT
	data_lancamento
FROM
	filme
ORDER BY
	data_lancamento DESC
LIMIT 1;

-- 5) Qual é o título original e a categoria do filme que possui a data de lançamento mais
-- antiga da locadora?
SELECT
	titulo_original, categoria
FROM
	filme
ORDER BY
	data_lancamento ASC
LIMIT 1;

-- 6) Quanto o cliente X (escolha um nome) gastou na locadora em empréstimos até hoje?
SELECT
	SUM(valor_pg) AS gasto
FROM
	emprestimo e INNER JOIN cliente c
		ON c.numCliente = e.cliente
WHERE
	c.nome LIKE 'Belarmino%'
;

-- 7) Qual a duração média dos filmes da classificação ACERVO?
SELECT
	AVG(f.duracao) AS duracao_media
FROM
	filme f INNER JOIN classificacao c
		ON c.cod = f.classificacao
WHERE
	c.nome = 'Acervo'
GROUP BY
	c.cod
;

-- 8) Quais são os nomes das classificações cujo total de filmes do acervo da locadora é
-- maior do que 5?
SELECT
	c.nome
FROM
	filme f INNER JOIN classificacao c
		ON f.classificacao = c.cod
GROUP BY
	c.cod
HAVING
	COUNT(*) > 5
;

-- 9) Quais são os nomes artísticos dos atores que estrelaram mais do que 3 filmes dos
-- disponíveis no acervo da locadora?
SELECT
	a.nomeartistico
FROM
	ator a INNER JOIN estrela e
		ON a.cod = e.codator
GROUP BY
	a.nomeartistico
HAVING
	COUNT(*) > 3
;

-- 10) Quais são os nomes artísticos dos atores que estrelaram mais do que 2 filmes dos
-- disponíveis no acervo da locadora com a classificação LANÇAMENTO?
SELECT
	a.nomeartistico
FROM
	ator a INNER JOIN estrela e
		ON a.cod = e.codator
    INNER JOIN filme f
        ON f.numfilme = e.numfilme
    INNER JOIN classificacao c
        ON c.cod = f.classificacao
WHERE
    c.nome = 'Lançamento'
GROUP BY
	a.nomeartistico
HAVING
	COUNT(*) > 2
;

-- 11) Quantas nacionalidades diferentes existem na tabela ator?
SELECT COUNT(DISTINCT nacionalidade) FROM ator;

-- 12) Qual a nacionalidade que possui o maior número de atores registrados no BD da
-- locadora?
SELECT
    nacionalidade
FROM
    ator
GROUP BY
    nacionalidade
ORDER BY
    COUNT(*) DESC
LIMIT 1;

-- 13) Quantos filmes o cliente Y (escolher um nome) já alugou e devolveu ?
SELECT
    COUNT(*) AS num
FROM
    emprestimo e INNER JOIN cliente c
        ON e.cliente = c.numcliente
WHERE
    e.datedev < NOW() AND
    c.nome LIKE 'Belarmino%'
GROUP BY
    c.numcliente
;

```


### VIEWS, PROCEDURES E TRIGGERS

```sql
	--Stored Procedures
	CREATE [OR REPLACE] FUNCTION function_name
	[([IN | OUT | IN OUT] parameter_name type [, ...])]
	RETURNS type AS 
	{` | $$}
	[DECLARE declarations]
	BEGIN
		-- Corpo da função
		function_body
	END 
	{` | $$}
	LANGUAGE language_name;

	--Exemplo:
	CREATE OR REPLACE FUNCTION FUNC_NRO_CLIENTES
	(IN P_CEP CLIENTE.CEP%TYPE)
	RETURNS NUMERIC AS 
	`
	DECLARE V_CONTA_CEP NUMERIC;
	BEGIN
		SELECT COUNT(CODCLI)
		INTO V_CONTA_CEP
		FROM CLIENTE
		WHERE CEP = P_CEP;
		RETURN V_CONTA_CEP;
	END 
	` 
	LANGUAGE 'plpgsql';
	

	-- Sintaxe triggers
	CREATE TRIGGER trigger_name
	{BEFORE | AFTER} trigger_event ON table_name
	FOR EACH {ROW | STATEMENT}
	[WHEN trigger_condition) ]
	EXECUTE PROCEDURE function_name ( arguments )

	--Exemplo
	CREATE OR REPLACE FUNCTION audit_product_price()
	RETURNS trigger AS 
	$$ 
	BEGIN
		RAISE NOTICE 'product_id = %, old_price = %, new_price = %', old.product_id, old.price, new.price ;
		RAISE NOTICE 'A redução de preço é de mais de 25 porcento';
		-- insert row into the product_price_audit table
		INSERT INTO product_price_audit (product_id, old_price,new_price) 
		VALUES (old.product_id, old.price,new.price);
		RETURN NULL; -- sempre deve ter um retorno
	END 
	$$ 
	language 'plpgsql';

	--criação da trigger
	CREATE TRIGGER before_product_price_update
	BEFORE UPDATE OF price ON products
	FOR EACH ROW WHEN (new.price < old.price * 0.75)
	EXECUTE PROCEDURE audit_product_price();
```


## ASSUNTOS RELACIONADOS

Existem muitos assuntos importantes para estudar e vou citar os principais que foram vistos durante a matéria de Sistemas de Bancos de Dados (SBD) que tive na graduação.

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
7. Transações
    - Controle de concorrência
    - Recuperação do Banco de dados
   	

 
    
## CONCLUSÃO    
Bom, o intuito desse post é apenas fazer uma breve demonstração dos comandos SQL do Postgres e servir de recordação. Se errei alguma coisa ou faltou algo muito importante, comenta aí em baixo. =)
