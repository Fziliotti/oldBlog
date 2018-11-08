let versao = 1

const filesToCache = [
  '/cursos/',
  '/series/',
  '/about/',
  '/tags/',
  '/offline/index.html',
  '/proporção-Áurea/',
  '/curso-fast-mba/',
  '/assets/js/main.js',
];

self.addEventListener("install", function(){
  console.log("Instalou service worker!")
})

self.addEventListener("activate", function(){
  caches.open("blog-arquivos-" + versao).then(cache => {
      cache.addAll(arquivos)
          .then(function(){
              caches.delete("blog-arquivos-" + (versao - 1 ))   
              caches.delete("blog-arquivos")   
          })
      
  })
})


self.addEventListener("fetch", function(event){

  let pedido = event.request
  let promiseResposta = caches.match(pedido).then(respostaCache => {
      let resposta = respostaCache ? respostaCache : fetch(pedido)
      return resposta
  })

  event.respondWith(promiseResposta)

})


