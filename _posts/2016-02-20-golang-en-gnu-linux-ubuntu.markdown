---
layout:     	post
title:      	"¡Instalación de Go (#golang) en GNU/Linux Ubuntu!"
subtitle:   	"Un lenguaje de programación con un magnífico futuro por delante"
description:	Instalación de Go (#golang) en GNU/Linux Ubuntu
date:       	2016-02-20 12:00:00
sitemap:
  lastmod: 2019-03-02
tag:			[informatica, linux, programacion]
author:     	"@R12Leal"
header-img: 	"img/post/post_go/golang.jpg"
permalink: /:title/
comments: true
---
<h2 class="section-heading">Introducción</h2>
<hr />
<p>En este post aprenderemos a instalar Go en GNU/Linux Ubuntu y hablaremos acerca de este potente lenguaje de programación que comienza a ganar una notoria popularidad en el sector tecnológico.</p>
<p>Personalmente me ha llamado mucho la atención su características, así que durante mi aprendizaje seguro que publicaré mis avances y códigos de ejemplos en este blog.</p>
<hr />
<h2 class="section-heading">¿Qué es Go (#golang)?</h2>
<hr />
<p>Go es un lenguaje de programación creado, y mantenido en la actualidad, por Google. Su sintaxis es parecida, y en parte basada, en C. Compilado, con tipado estático, concurrente, imperativo, estructurado e incluso orientado a objetos, aunque planteado de una forma distinta.</p>
<p>Actualmente sólo está disponible en en los S.O. Windows, GNU/Linux y Mac OS X.</p>
<hr />
<h2 class="section-heading">Breve Historia</h2>
<hr />
<p>Go nació en Noviembre de 2009 pero su desarrollo comenzó en septiembre 2007 de la mano de Robert Griesemer, Rob Pike y Ken Thompson. Durante estos últimos años grandes empresas del sector tecnológico han comenzado a incluir Go en sus proyectos, algunos ejemplos son: Docker, Dropbox, Uber, SoundCloud, etc...</p>
<hr />
<h2 class="section-heading">Características</h2>
<hr />
  <ul class="ulposts">
    <li><strong>Compilado</strong>: al igual que C y C++, esto permite que la curva de aprendizaje sea más suave para los programadores que vienen de los anteriores.</li>
    <li><strong>Tipado estático</strong>: cuando definas el tipo de una variable esta mantendra su tipo, es decir, si defines una variable llamada <strong>y</strong> como entera no podrás cambiar su <strong>valor</strong> a un texto.</li>
    <li><strong>Concurrente</strong>: basado en CSP de Sir Charles Antony Richard Hoare, creador del algoritmo de ordenación QuickSort.</li>
    <li><strong>Programación Orientada a Objetos (POO)</strong>: aunque permite el uso de este paradigma de programación funciona de una forma distinta a la tradicional: no hay clases, no hay herencias pero si interfaces y algunas cosas más.</li>
    <li><strong>Otros paradigmas</strong>: también admite programación imperativa y estructurada.</li>
  </ul>
<hr />
<h2 class="section-heading">Instalación</h2>
<hr />
<p>Simplemente abrimos una terminal y seguimos los siguientes pasos:</p>
<pre><strong>$ sudo add-apt-repository ppa:ubuntu-lxc/lxd-stable
$ sudo apt-get update
$ sudo apt-get install golang</strong></pre>
<p>Básicamente con el primer comando añadimos el repositorio, después actualizamos y por último instalamos Go en nuestro sistema. Para comprobar que se ha instalado correctamente puedes obtener la versión mediante la propia terminal:</p>
<pre><strong>go version</strong></pre>
<hr />
<h2 class="section-heading">¿Prefieres probar antes de instalar?</h2>
<hr />
<p>Si no deseas instalar, por ahora, nada en tu sistema operativo podemos utilizar algunas herramientas que nos ofrece la propia de web de <a href="https://golang.org/" title="golang.org" target="_blank">golang</a> para empezar a practicar y escribir código:</p>
  <ul class="ulposts">
      <li><strong>El tour de #golang</strong>: un pequeño tutorial para principiantes donde podrás conocer las características de este lenguaje mediante pequeños códigos que te permitirán comenzar a practicar, puedes encontrarlo <a href="http://tour.golang.org/welcome/1" title="El tour de #golang" target="_blank">aquí</a>.</li>
      <li><strong>Existe una copia de esta aplicación en español</strong>, por si te cuesta un poco el inglés: <a href="http://go-tour-es.appspot.com/#1" title="El tour de #golang en Español" target="_blank">El Tour en Español</a>.</li>
      <li><strong>The Go Playground</strong>: es una consola interactiva en la web donde escribiremos nuestros códigos y ejecutaremos al momento: <a href="https://play.golang.org/" title="The Go Playground" target="_blank">enlace</a>.</li>
  </ul>
<hr />
<h2 class="section-heading">Conclusiones</h2>
<hr />
<p>Go sigue en constante evolución y cada vez gana más adeptos. Si deseas aprender nuevos lenguajes de programación puedes optar por él. En el próximo post haremos una recopilación de distintos recursos (libros, webs, vídeos, etc...) para que os ayude a comenzar a experimentar con este lenguaje. Salu2!</p>
