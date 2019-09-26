---
layout: post
comments: true
title: Snippets PWA
date: 2019-09-25 00:00:00 -0300
image: ''
description: Principais snippets de uma PWA em um único post =)
main-class: dev
color: ''
tags:
- pwa
- dev
categories: ''
twitter_text: ''
introduction: Principais snippets e referências que você precisa para começar a desenvolver
  sua PWA.

---
## Snippets interessantes para implementação de uma PWA

A ideia desse post é reunir alguns exemplos de uso recorrente ao se trabalhar com PWA's, além de servir como base para futuros estudos mais aprofundados sobre o tema e referências que eu acho interessantes.

----------

### Exemplo de um arquivo Manifesto de seu PWA

```json
{
  "lang": "pt-BR",
  "name": "Aplicativo",
  "short_name": "APP",
  "display": "standalone",
  "background_color": "#666",
  "theme_color": "#0f1419",
  "description": "Essa é a descrição! =)",
  "orientation": "portrait",
  "icons": [
    {
      "src": "imgs/launcher-icon-1x.png",
      "type": "image/png",
      "sizes": "48x48"
    },
    {
      "src": "imgs/launcher-icon-2x.png",
      "type": "image/png",
      "sizes": "96x96"
    },
    {
      "src": "imgs/launcher-icon-512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": "./index.html"
}
```

Com o arquivo acima, o robô do google já consegue identificar que o seu site se trata de um app instalável, com a splashscreen personalizada de acordo com as informações dentro desse arquivo json, além de outras informações que norteam a instalação e comportamento do seu WebApp.

Se quiser entender melhor ou conhecer mais configurações que podem ser colocadas nesse arquivo, depois da uma olhada na [Referência do manifest segundo a Mozilla](https://developer.mozilla.org/pt-BR/docs/Web/Manifest).

----------

### Instalação do service worker e verificação do suporte do browser:

```js
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").then(reg => {
    console.info("Service Worker registration successful with scope: ", reg.scope);
  }).catch(err => {
    console.error("Service Worker registration failed: ", err);
  });
}

// OU TAMBÉM

if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(reg => {
        console.info("Service Worker registration successful with scope: ", reg.scope);
      }).catch(err => {
      console.error("Service Worker registration failed: ", err);
    });
  });
}
```

> Você deve ter um arquivo do service worker na pasta do seu site e especificar o caminho correto ao invés de './sw.js'

> Para quem não sabe o que é um service worker, é basicamente um script que roda em background, separado da thread principal do seu browser(para não afetar a renderização e atrapalhar a experiência do usuário). Ele consegue interceptar as requisições feitas pelo browser, escutar eventos de notificações e varias outras coisas interessantes.

----------

### Criação de um botão de instalação do APP

Antes do script, você vai precisar de um botão no seu arquivo html

```html
	<button class="add-button">Instalar o APP</button>
```

Agora a *magia* do javascript:

```js
let deferredPrompt;
const installButton = document.querySelector('.add-button');
installButton.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {

  // Previne que o Chrome nas versões anteriores ao 67 disparem o antigo prompt padrão.
  e.preventDefault();

  // Armazena a referência do evento para disparar futuramente
  deferredPrompt = e;

  // O botão de instalação vão ser mostrado na tela
  installButton.style.display = 'block';

  installButton.addEventListener('click', e => {
    addBtn.style.display = 'none';

    // Dispara o evento do propt que foi deferido anteriormente
    deferredPrompt.prompt();

    // 
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Você instalou nosso aplicativo =)');
      } else {
        console.log('Você infelizmente recusou =(');
      }

      // Referência para o prompt agora pode ser limpa
      deferredPrompt = null;
    });
  });
});
```

> As versões anteriores ao Chrome 67 disparavam um prompt padrão no final da página.

----------

### Envio de notificação push pelo próprio cliente

```js
Notification.requestPermission(function (status) {
  console.log('Notification permission status:', status);

  displayNotification()
});


function displayNotification() {
  if (Notification.permission == 'granted') {
    navigator.serviceWorker.getRegistration().then(function(reg) {
      var options = {
        body: 'Here is a notification body!',
        icon: 'imgs/apple-touch-icon-152x152.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
        }
      };
      reg.showNotification('Hello world!', options);
    });
  }
}
```

Não pode esquecer de acrescentar no service worker o código para interceptar os eventos da notificação:

```js
self.addEventListener('notificationclose', function(e) {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;
    console.log('Notificação Fechada! ' + primaryKey);
});


self.addEventListener('notificationclick', function(e) {
    var notification = e.notification;
    var primaryKey = notification.data.primaryKey;
    var action = e.action;

    if (action === 'close') {
        notification.close();
    } else {
        clients.openWindow('https://fziliotti.github.io/');
        notification.close();
    }
});
```

> Certifique-se que o service worker foi instalado corretamente para esse snippet funcionar.

Se quiser aprofundar os conhecimentos na API de Notificação, dá uma olhada nessa [postagem do Vladislav Stepanov](https://codeburst.io/understanding-the-notification-api-804fb5c1ae9c)

Na maioria dos casos você vai precisar configurar uma forma de enviar as notificações de forma dinâmica pelo servidor, para isso você pode estudar o [Google Cloud Messaging](https://firebase.google.com/docs/cloud-messaging?hl=pt-br)

----------

### Uso do IndexedDB usando bibliotecas

Dexie é uma biblioteca pra facilitar o uso do IndexedDB, a api nativa dele é bem verbosa e as vezes pode ser confusa para quem está no início, além disso, a biblioteca ja realiza o processo de configurar o fallback quando o navegador não tem suporte ao IndexedDB (geralmente usando o localstorage) =).

```js
import Dexie from 'dexie';

// Instanciando a classe Dexie responsável pelo IndexedDB
const db = new Dexie("FriendDatabase");

db.version(1).stores({ friends: "++id,name,age" });

db.transaction('rw', db.friends, async() => {

    // Adicionando um objeto de testes no banco de dados
    if ((await db.friends.where({name: 'Josephine'}).count()) === 0) {
        const id = await db.friends.add({name: "Josephine", age: 21});
        alert (`Addded friend with id ${id}`);
    }

    // Consulta que retorna uma promise:
    const youngFriends = await db.friends.where("age").below(25).toArray();

}).catch(e => {
    console.error(e.stack || e);
});
```

Você também pode usar a biblioteca LocalForage que é muito parecida com a utilização do localStorage, entregando o mesmo valor da biblioteca Dexie e até com mais funcionalidades. Lembrando que ela implementa o uso de [promises](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Promise), mas se você quiser continuar com o uso de callbacks para a realização do processamento assíncrono, também é possível.

```js
// Renomeando o banco de dados
localforage.config({
    name: 'NovoNomeAqui',
    description: 'Uma descrição para ajudar os desenvolvedores'
});

// Alterando a ordem dos drivers utilizados, quando der erro ou não ser possível utilizar um dos tipos de banco de dados
localforage.config({
    driver: [localforage.WEBSQL,
             localforage.INDEXEDDB,
             localforage.LOCALSTORAGE],
    name: 'WebSQL-Rox'
});

// Você pode adicionar tipos que não sejam strings, diferente do localStorage.
localforage.setItem('my array', [1, 2, 'three']).then(function(value) {
    console.log(value[0]); // saída: 1
}).catch(function(err) {
    console.log(err);
});

// Versão da função de acessar um elemento usando Promise
localforage.getItem('somekey').then(function(value) {
    console.log(value);
}).catch(function(err) {
    console.log(err);
});

// Versão da função de acessar um elemento usando callback
localforage.getItem('somekey', function(err, value) {
    console.log(value);
});

```
Para mais informações, o site da [Dexie](https://dexie.org/docs/) e do [LocalForage](https://localforage.github.io/localForage/) oferecem uma documentação bem completa e interessante =)

> É importante lembrar que o armazenamento utilizando LocalStorage, SessionStorage ou através de cookies são síncronos, não são compatíveis com web workers e possuem limitações de tamanho e tipo (somente strings).

> É preferível utilizar o IndexedDB por exemplo atrelado aos web workers ou service worker, uma vez que sua API é assincrona e não irá bloquer o Document Object Model (DOM), dessa forma maximizando a interoperabilidade com a IU.  

Para entender mais sobre os bancos de dados dos navegadores (WebStorage, IndexedDB e LocalStorage), dá uma olhada nesse site de
[Comparação dos bancos de dados](http://nolanlawson.github.io/database-comparison/)

----------

### Snippet rápido para usar o Workbox

> Workbox é um conjunto de bibliotecas e módulos Node que facilitam o armazenamento em cache dos assets e aproveitar ao máximo os recursos usados para criar Progressive Web Apps.

Geralmente pra configurar o service worker utilizando as funções nativas, é necessário detalhar bem o ciclo de vida dele (eventos install, activate e principalmente o fetch que intercepta as Requests do browser).
E esse código geralmente se repete muito na construção de PWA's além de alguns serem um pouco complexos.
O Workbox meio que abstrai isso tudo e deixa bem mais amigável para o desenvolvedor por exemplo configurar as estratégias de cache e outras coisas mostradas no snippet abaixo.

```js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

// Registro de uma rota para configurar a strategia de cacheamento para arquivos terminados em .js
workbox.routing.registerRoute(
  /\.js$/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'js-cache'
  })
);


workbox.routing.registerRoute(
  /\.css$/,
  // Verifica se está em cache, mas atualiza em background.
  new workbox.strategies.StaleWhileRevalidate({
    // Modificando o nome do cache.
    cacheName: 'css-cache',
  })
);

//Cacheando os recursos estáticos, alternativa aos dois de cima
workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

workbox.routing.registerRoute(
  // Cache para imagens do site.
  /\.(?:png|jpg|jpeg|svg|gif)$/,
  // Verifica se está em cache primeiramente.
  new workbox.strategies.CacheFirst({
    // Use a custom cache name.
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // Apenas 20 imagens devem ser cacheadas
        maxEntries: 20,
        // Tempo de duração das imagens em cache
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ],
  })
);

//Habilitar o Google Analytics mesmo offline
workbox.googleAnalytics.initialize();


//Cacheamento das fontes do site usando o googleapi
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Adicionando um fallback para requisições não atendidas 


workbox.routing.setCatchHandler(({event}) => {
 
  // https://medium.com/dev-channel/service-worker-caching-strategies-based-on-request-types-57411dd7652c
  switch (event.request.destination) {
    case 'document':
      return caches.match(FALLBACK_HTML_URL);
    break;

    case 'image':
      return caches.match(FALLBACK_IMAGE_URL);
    break;

    case 'font':
      return caches.match(FALLBACK_FONT_URL);
    break;

    default:
      // If we don't have a fallback, just return an error response.
      return Response.error();
  }
});

```

> Para mais informações, dá uma olhada no site do [Workbox](https://developers.google.com/web/tools/workbox/)

----------

### Uma forma de criar um arquivo Manifest dinâmico com vanilla javascript

```js
const meuManifestDinamico = {
  "name": "Nome do aplicativo",
  "short_name": "APP name",
  "theme_color": "#5bd1d7",
  "background_color": "#f6f5f5",
  "display": "standalone",
  "start_url": window.location.href,
  "icons": [
    {
      "src": `${window.location.origin}/imgs/android-chrome-192x192.png`,
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": `${window.location.origin}/imgs/android-chrome-512x512.png`,
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "splash_pages": null
}
const stringManifest = JSON.stringify(meuManifestDinamico);
const blob = new Blob([stringManifest], {type: 'application/json'});
const manifestURL = URL.createObjectURL(blob);
document.querySelector('#manifest').setAttribute('href', manifestURL);
			
```
> Esse snippet é útil para a criação de um manifest dinâmico, que possui o start URL baseado no endereço corrente do navegador.

> Definição de blob: Um objeto **Blob** representa um objeto do tipo arquivo, com  dados brutos imutáveis. Blobs representam dados que não estão necessariamente em um formato JavaScript nativo. O único jeito de ler o conteúdo de um Blob é usando FileReader.


### Conclusão

Bom, a ideia desse post é apenas reunir alguns snippets que geralmente utilizo ou já utilizei para a construção de PWA's.. Espero ajudar quem talvez precise e esteja estudando essa beleza.

Para quem não conhece muito sobre PWA's e quer entender melhor como funciona essa belezinha, pode me chamar nas redes sociais ou também dar uma olhada nos slides do minicurso que apresentei na FACOM Techweek 2019, presente no [site do minicurso](https://fziliotti.github.io/minicursopwa/).

Ahh, e se alguém tiver dúvida ou sugestões para acrescentar,  comenta aí embaixo.. =)