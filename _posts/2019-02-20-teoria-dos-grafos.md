---
layout: post
comments: true
title: "Teoria dos grafos"
date: 2019-02-20 05:01:11
image: '/assets/img/'
description: 'Trabalho desenvolvido na disciplina Teoria dos Grafos na Universidade Federal de Uberlândia'
main-class: 'comp'
color:
tags: ['computação','dev']
categories:
twitter_text:
introduction: 'Trabalho desenvolvido na disciplina Teoria dos Grafos na Universidade Federal de Uberlândia'
---

# Introdução

Resolvi criar esse post para compartilhar um pouco do que foi aprendido na disciplina Teoria dos Grafos durante a faculdade.

Este trabalho foi desenvolvido para obter informações referentes a grafos de grandes redes complexas, através de funções que extraem informações desses grafos como número de vértices, arestas, componentes, grau médio, densidade, etc. Foram escolhidos três grafos para serem analisados, sendo dois de colaboração e um de email. Uma aplicação web fica responsável para visualizar e realizar os cálculos.

Créditos aos meus companheiros do grupo: **Guilherme Raimondi, Matheus Albano e Marcos Victor.**

## Informações Gerais

Neste trabalho foi desenvolvido uma aplicação web no modelo client-server. Na parte do cliente foi utilizado HTML, CSS e Javascript, o último responsavél por executar as funções para análisar o grafo escolhido.
Já na parte do servidor, foi utilizado apenas Javascript rodando na plataforma Node.js, com uma API para ler os arquivos, inserir os dados em uma estrutura na estrutura grafo e, por fim, executar as funções.
Ademais, a estrutura grafo foi implementados utilizando lista de adjacência, por economia de memória e facilidade de implentação.

## Como foi o projeto

Inicialmente criamos um grafo teste com o intuito de facilitar o desenvolvimento e o teste das funções feitas no trabalho, visto que os grafos que estavam disponíveis para análise tinham uma complexidade maior e necessitavam de um tempo de processamento alto.

### Estrutura de pastas do projeto

![alt](/BlogFziliotti/assets/img/comp/tg2.png)

# Resultado Final

![alt](/BlogFziliotti/assets/img/comp/tg3.png)