---
layout:     	post
title:      	"¡Desactiva las búsquedas comerciales en el dash de Unity!"
subtitle:   	"¿Un vigilante de nuestros datos en GNU/Linux Ubuntu?"
description:	Desactiva las búsquedas comerciales en el dash de Unity
date:       	2015-11-20 12:00:00
sitemap:
  lastmod: 2019-03-02
tag:			[informatica,linux]
author:     	Ramses
image: 	"img/post/post_busq_com/unity_busq_com.jpg"
permalink: /:title/
comments: true
rating: 3
---
<h2 class="section-heading">Introducción</h2>
<hr />
<p>En este post mostraremos como desactivar las búsquedas comerciales que aparecen en el dash de Unity. También repasaremos la polémica que generó esta característica en la comunidad del software libre.</p>
<hr />
<h2 class="section-heading">La Polémica</h2>
<hr />
<p>La inclusión de las búsquedas en línea mediante el dash provocó un terremoto en la comunidad del software libre. Líderes destacados, como por ejemplo <strong>Richard M. Stallman (fundador del proyecto GNU y la Free Software Foundation</strong>), mostraron su preocupación por el movimiento llevado a cabo por Canonical.</p>
<p>Otro problema que añadió más leña al fuego fue que el usuario no tenía opción a desactivar estas búsquedas, es decir, los datos del usuario se envíaban a los servidores de Canonical sin su conocimiento y consentimiento.</p>
<p>Algunas de las frases que dejó Stallman sobre este tema:</p>
<p>
<blockquote>
Ubuntu, una distribución GNU/Linux ampliamente utilizada e influyente, ha instalado un código de vigilancia. Cuando el usuario busca en sus archivos locales introduciendo una cadena en el escritorio de Ubuntu, Ubuntu envía esa cadena a uno de los servidores de Canonical.
</blockquote>
<blockquote>
Esto es igual que la primera práctica de vigilancia, que pudimos ver en Windows. Mi difunto amigo Fravia me dijo que cuando él buscaba una cadena en los archivos de su sistema en Windows, éste enviaba un paquete a otro servidor, que era detectado por el firewall. Teniendo en cuenta esto, aprendió acerca de la propensión del software propietario para convertirse en malware. Tal vez no sea coincidencia que Ubuntu haga lo mismo.
</blockquote>
<blockquote>
Para proteger la privacidad de los usuarios, los sistemas deben hacer fácil la prudencia: cuando un programa de búsqueda local tiene una función de búsqueda online, ésta sólo debería realizarse cuando el usuario lo elija de forma explícita cada vez. Esto es fácil: todo lo que se necesita es tener botones separados para las búsquedas online y las búsquedas locales, incluso algunas versiones anteriores de Ubuntu lo implementaron. Una función de búsqueda online también debe informar al usuario de forma clara y concreta acerca de quién recibirá su información personal, siempre y cuando se utilice la función.
</blockquote>
<p>Tras las quejas de la comunidad Canonical incluyó una opción para activar/desactivar las búsquedas. Este tema sigue aún candente aunque es evidente que el problema surgió por <strong>como implementaron esta característica</strong>.</p>
<hr />
<h2 class="section-heading">Desactivación de las búsquedas</h2>
<hr />
<p><h3>Opción nº 1</h3></p>
<p>Gráficamente: <i>Configuración del Sistema</i> -> <i>Seguridad y privacidad</i> -> <i>Búsqueda</i>. Desactiva la opción que aparece en la imagen:</p>
<img src="/img/post/post_busq_com/desactivar_busq_panel.jpg" alt="¡Desactivación de forma gráfica!" />
<span class="caption text-muted">¡Rápido y sencillo!</span>
<p><h3>Opción nº 2</h3></p>
<p>Desde una terminal basta con ejecutar la siguiente instrucción:</p>
<p><strong><pre>
gsettings set com.canonical.Unity.Lenses disabled-scopes "['more_suggestions-amazon.scope', 'more_suggestions-u1ms.scope', 'more_suggestions-populartracks.scope', 'music-musicstore.scope', 'more_suggestions-ebay.scope', 'more_suggestions-ubuntushop.scope', 'more_suggestions-skimlinks.scope']"
</pre></strong></p>
<p>Este sencillo comando permite desactivar <strong>TODOS LOS SCOPES</strong> (Amazon, eBay, Music Store, Popular Tracks Online, Skimlinks, Ubuntu One Music Search y Ubuntu Shop).</p>
<hr />
<h2 class="section-heading">Conclusión</h2>
<hr />
<p>Se especula con que en Unity 8 las búsquedas serán eliminadas completamente. Si deseas desactivar éstas búsquedas te recomiendo este tutorial, salu2! </p>
