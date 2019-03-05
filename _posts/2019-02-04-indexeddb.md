---
layout: post
comments: true
title: "IndexedDB"
date: 2019-02-04 04:00:00
image: "/assets/img/"
description: "O banco de dados transacional dos navegadores."
main-class: 'dev'
color:
tags: ['dev','banco de dados']
categories:
twitter_text:
introduction: "Conheça o banco de dados dos navegadores, utilizando javascript!!"
---

# Introdução

Estava estudando Javascript nesses últimos dias e acabei me deparando com o Indexed DB. Achei interessante e resolvi compartilhar um pouco do que aprendi com vocês 😃

# O que é?

Bom para responder essa pergunta, abaixo vou listar algumas definições que encontrei em sites como MDN, Wikipedia e outros.

> IndexedDB é uma API para armazenamento client-side de quantidades significantes de informações e buscas com alta performance por índices. Enquanto DOM Storage é útil para armazenamento de pequenas quantidade de dados, IndexedDB é a solução para grande porção de dados estruturados.

> IndexedDB é um sistema de tabela indexada.

> O IndexedDB permite armazenar e recuperar objetos indexados com uma "chave". Todas as alterações feitas no banco de dados ocorrem dentro de transações.

Resumindo: O indexedDB é um banco de dados dos navegadores que você utiliza acessando o **window.indexedDB**. Com javascript você consegue armazenar grandes quantidades de dados de uma maneira mais organizada.

# Exemplos de código comentados:

Primeiro vamos supor que temos a seguinte classe em nosso projeto:

```js
required = () => new Error("Atributo não foi informado.");

class Produto {
  constructor(nome = required(), quantidade = required(), valor = required()) {
    this._nome = nome;
    this._quantidade = quantidade;
    this._valor = valor;
  }
}
```

O código de criação do indexedDB do ObjectStorage produtos fica assim:

```js
//check for support
if (!("indexedDB" in window)) {
  console.log("This browser doesn't support IndexedDB");
}

var connection;
var openRequest = window.indexedDB.open("produtos", 3); // 3 é a versao atual

//Tríade de eventos disparados quando requisitamos uma abertura de conexão com o banco:
//1
openRequest.onupgradeneeded = e => {
  var minhaConnection = e.target.result;

  if (minhaConnection.objectStoreNames.contains("produtos"))
    minhaConnection.deleteObjectStore("produtos");
 
  minhaConnection.createObjectStore("produtos", { autoIncrement: true });
};

//2
openRequest.onsuccess = e => {
  connection = e.target.result;
  console.log("Conexão com banco realizada com sucesso! com o IDBDatabase: " + connection);
};

//3
openRequest.onerror = e => console.log(e.target.error);
```

Exemplos de funções de inserção e listagem das informações do banco criado:

```js
var adicionaProduto = (nome, quantidade, valorUnitario) => {
  let transaction = connection.transaction(["produtos"], "readwrite");
  let store = transaction.objectStore("produtos");

  let produto = new Produto(nome, quantidade, valorUnitario);
  let request = store.add(produto);

  request.onsuccess = e => console.log("Produto incluida com sucesso");
  request.onerror = e => console.log("Não foi possível incluir o produto");
};

var listaTodos = () => {
  let transaction = connection.transaction(["produtos"], "readwrite");
  let store = transaction.objectStore("produtos");
  let cursor = store.openCursor();
  let produtos = [];

  cursor.onsuccess = e => {
    let atual = e.target.result;
    if (atual) {
      let dado = atual.value;
      produtos.push(new Produto(dado._nome, dado._quantidade, dado._valor));
      atual.continue();
    } else {
      console.log("Terminou de listar os produtos:" + JSON.stringify(produtos));
    }
  };

  cursor.onerror = e => console.log(e.target.error.name);
};
```

# Conclusão

Sem dúvidas o IndexedDB é uma API muito interessante e legal de aprender. Além disso, vem sendo atualizada constantemente pelos desenvolvedores da Google e ao redor do mundo. Abaixo segue links interessantes para aprofundar no assunto:

> [Teoria sobre IndexedDB feita pela MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Basic_Concepts_Behind_IndexedDB)

> [Tutorial completo da Google](https://developers.google.com/web/ilt/pwa/working-with-indexeddb)

> [IndexedDB usando Promises, facilita muito!!](https://www.npmjs.com/package/idb)

> [Biblioteca Dexie.js](https://dexie.org/)

> [Biblioteca Db.js](http://aaronpowell.github.io/db.js/)

Enfim, a minha ideia foi mostrar o código e funcionamento do IndexedDB na prática, mas é claro que o código procedural não é a melhor solução, podemos por exemplo definir as regras em uma FactoryDB em nosso projeto, e deixar mais organizado e legível.
