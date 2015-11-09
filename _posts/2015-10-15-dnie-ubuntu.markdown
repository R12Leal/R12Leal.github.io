---
layout:     	post
title:      	"¡Instalar el DNIe electrónico en GNU/Linux Ubuntu (14.04+)!"
subtitle:   	"Tus trámites telemáticos también con GNU/Linux Ubuntu"
description:	Tus trámites telemáticos también con GNU/Linux Ubuntu
date:       	2015-10-15 12:00:00
tag:			[informatica,linux]
author:     	"@R12Leal"
header-img: 	"img/post/post_dnie/dnie-linux.jpg"
---
<h2 class="section-heading">Introducción</h2>
<hr />
<p>El DNIe (DNI electrónico) es una herramienta que todavía no ha terminado de despegar en España pero que poco a poco va sumando adeptos ya que nos permite ahorrarnos los típicos, y tediosos, desplazamientos a las oficinas de las principales administraciones públicas de nuestra zona.</p>
<p>La causa principal, del poco uso por parte de la población, es porque la administración no ofrece un buen soporte a los ciudadanos. Incluso en sistemas operativos de Microsoft también es un poco complicado su instalación y uso.</p>
<p>En este post veremos como instalar y usar el DNIe en Ubuntu (versión 14.04 o posteriores), ya sean de 32 o 64 bits. No he probado la instalación en el resto de distribuciones de Linux pero debería funcionar igualmente, sobre todo las que son derivadas de Debian.</p>
<hr />
<h2 class="section-heading">Lector</h2>
<hr />
<p>Mi lector es un Sveon SCT011, un dispositivo muy sencillo, barato y que compré en grandes superfícies, aquí una imagen:</p>
<img src="/img/post/post_dnie/sct011.jpg" alt="Sveon SCT011" />
<span class="caption text-muted">Sveon SCT011</span>
<p>La mayoría de dispositivos son compatibles en Ubuntu, de todas formas instalaremos una serie de paquetes (controladores) para garanzitar su funcionamiento.</p>
<hr />
<h2 class="section-heading">Instalación de Java</h2>
<hr />
<p>Para llevar a cabo nuestos trámites es necesario tener instalado Java. Usaremos la versión 8, aunque si prefieres la versión 7 también puedes instalarla, abriremos un terminal y ejecutaremos los siguientes comandos:</p>
<p><strong><code>sudo add-apt-repository ppa:webupd8team/java</code></strong></p>
<p><strong><code>sudo apt-get update</code></strong></p>
<p><strong><code>sudo apt-get install oracle-java8-installer</code></strong></p>
<p><strong><code>sudo update-java-alternatives -s java-8-oracle</code></strong></p>
<hr />
<h2 class="section-heading">Instalación de liberías, bibliotecas y controladores</h2>
<hr />
<p>En contrucción</p>
<hr />
<h2 class="section-heading">Instalación de los certificados en Firefox</h2>
<hr />
<p>En contrucción</p>
<hr />
<h2 class="section-heading">Descarga, compilación e instalación de OpenSC modificado</h2>
<hr />
<p>En contrucción</p>
<hr />
<h2 class="section-heading">Configurando + parámetros</h2>
<hr />
<p>En contrucción</p>
<hr />
<h2 class="section-heading">Conclusión</h2>
