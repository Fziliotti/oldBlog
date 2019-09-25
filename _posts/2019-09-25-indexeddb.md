---
layout: post
comments: true
title: Snippets para PWA
date: 2019-09-25 02:00:00 -0300
image: "/assets/img/"
description: Agilizando o desenvolvimento de PWA's
main-class: dev
color: 
tags:
- dev
- pwa
categories: 
twitter_text: 
introduction: Alguns snippets que uso durante meus estudos e desenvolvimento de PWA's.

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

Com o arquivo acima, você ja consegue instalar um aplicativo com a splash screen personalizada de acordo com as informações dentro desse arquivo json.

Se quiser entender melhor ou conhecer mais configurações que podem ser colocadas tem a [Referência do manifest Mozilla](https://developer.mozilla.org/pt-BR/docs/Web/Manifest).

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

### Uso do IndexedDB usando a biblioteca Dexie

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
Para mais informações, o site da [Dexie](https://dexie.org/docs/) oferece uma documentação bem legal =)

> É importante lembrar que o armazenamento utilizando LocalStorage, SessionStorage ou através de cookies são síncronos, não são compatíveis com web workers e possuem limitações de tamanho e tipo (somente strings).

> É preferível utilizar o IndexedDB por exemplo atrelado aos web workers ou service worker, uma vez que sua API é assincrona e não irá bloquer o Document Object Model (DOM), dessa forma maximizando a interoperabilidade com a IU.  

Para entender mais sobre os bancos de dados dos navegadores, aqui vão alguns links legais:
- [Comparação dos bancos de dados](http://nolanlawson.github.io/database-comparison/)
----------

### Snippet rápido para usar o Workbox

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

Bom, a ideia desse post é apenas reunir alguns snippets que geralmente faço uso na construção de PWA's e ajudar quem talvez precise.

Para quem não conhece muito sobre PWA's e quer entender melhor como funciona essa belezinha, pode me chamar nas redes sociais ou também dar uma olhada nos slides do minicurso que apresentei na FACOM Techweek 2019, presente no [site do minicurso](https://fziliotti.github.io/minicursopwa/).

Ahh, e se alguém tiver dúvida ou sugestões para acrescentar,  comenta aí embaixo.. =)
