---
layout: post
comments: true
title: Visão geral da navegação na internet
date: 2019-10-10 00:00:00 -0300
image: ''
description: Entendendo o processo de navegação na internet utilizando o navegador
main-class: comp
color: ''
tags:
- dev
- computação
categories: ''
twitter_text: ''
introduction: Entendendo o processo de navegação na internet utilizando o navegador

---
## Introdução

Após estudar o funcionamento da camada de aplicação do modelo Internet na disciplina "Redes 2" no curso Ciência da Computação que estou cursando, achei interessante criar um post aqui no meu blog pessoal para deixar registrado um resumo do funcionamento da navegação no navegador até que o site seja renderizado no dispositivo.

## O que acontece até que o site que a gente digita na URL seja renderizado no nosso dispositivo?

Bom vou tentar resumir de uma forma bem grosseira e superficial o que acontece em termos da camada de aplicação e de transporte:

1. O usuário entra no navegador (Chrome, Mozilla, Safari ou qualquer outro) e digita a URL do site na barra de endereços.
2. Após digitar o endereço do site (www.google.com.br) é feito uma requisição ao servidor DNS.
3. O servidor DNS vai ser responsável por realizar a "resolução de nome", devolvendo o endereço IP do servidor que hospeda o site.
4. Com esse IP em mãos, o browser então abre uma conexão socket TCP com o servidor web.
5. Após a conexão ser aberta com sucesso, o navegador vai analisar a estrutura HTML do site e identificar as possíveis requisições que deverá realizar para a construção do site (imagens, arquivos css e javascript).
   1. Antes de realizar as requisições HTTP, o browser poderá fazer novas requisições aos servidores DNS para obter os IPs das máquinas que contem o objeto desejado. Mas caso todos os objetos estejam na mesma máquina, o IP do servidor web já é conhecido (etapa 3)
6. Dessa forma, após identificar as requisições, o navegador vai enviar as requisições ao servidor, utilizando o protocolo HTTP.
7. Os objetos requeridos ao servidor vão ser retornados ao navegador, e a quantidade de objetos é variável. (Existe o HTTP Pipelining na versão 1.1 do HTTP, mas que foi melhorado na versão HTTP/2);
   1. Paralelamente a isso, o arquivo html (index.html ou pagename.html) e os arquivos de css da página serão analisados para a criação do DOM (Document Object Model) e CSSOM (CSS Object Model).
8. O DOM e CSSOM serão utilizados para a construção da Render Tree, a qual vai ser responsável por renderizar o site no dispositivo, fazendo todos os cálculos de posicionamento e dimensionamento necessários.
9. O javascript geralmente é executado após a renderização e através da API do DOM, manipula os elementos do HTML.

Bom, essa é uma explicação bem simples, e muitos passos foram omitidos e simplificados, além disso, essa sequencia varia de acordo com a implementação dos navegadores.

## Conclusão

Eu acredito que seja interessante ter pelo menos uma visão geral do funcionamento do browser e do processo que ocorre até o site ser renderizado na tela do nosso computador ou celular. 

Também é importante ter esse entendimento principalmente para facilitar a compreensão das otimizações de performance nos sites e WebApps além das otimizações que estão sendo desenvolvidas como por exemplo no protocolo HTTP/2.

Esse post vai ser mais um daqueles que terei que atualizar constantemente. Se tiver alguma sugestão ou crítica fique a vontade para usar os comentários =)