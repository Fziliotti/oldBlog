---
layout: post
title: "Dica rápida #1"
date: 2015-01-07 21:31:05
description: "Detalhes fazem a diferença, vamos falar sobre Favicons, Touch Icons e Tile Icons e como eles fazem a diferença."
main-class: 'dev'
color: '#637a91'
tags:
- "dicarapida"
introduction: "Qual a importância dos favicons, touch icons e tile icons. Como criá-los automáticamente e como usá-los em seu site."
---


### Como coloco o Favicon?

Basta adicionar a seguinte `meta tag` no `head`:

{% highlight html %}
<link rel="shortcut icon" href="/img/icons/favicon.ico" type="image/x-icon">
{% endhighlight %}

Você pode utilizar o favicon no formato png, mas não suporte para todos os browsers, como o IE por exemplo =(:

{% highlight html %}
<link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
<link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96">
{% endhighlight %}



#### Não sou designer! E agora!?

Existem geradores de favicons, seguem os links abaixo:

* [Real Favicon Generator](http://realfavicongenerator.net/)
* [Iconogen](http://iconogen.com/)

E tem suporte para Iphone?

{% highlight html %}
<link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png">
<link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png">
<link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png">
<link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png">
<link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png">
<link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png">
<link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png">
<link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png">
{% endhighlight %}



