---
layout:     	post
title:      	"¡Desactiva las búsquedas comerciales en el dash de Unity!"
subtitle:   	"¿Un vigilante de nuestros datos en GNU/Linux Ubuntu?"
description:	Desactiva las búsquedas comerciales en el dash de Unity
date:       	2015-11-20 12:00:00
sitemap:
  lastmod: 2015-11-20
tag:			[informatica,linux]
author:     	"@R12Leal"
header-img: 	"img/post/post_busq_com/background_busq_com.jpg"
---
<h2 class="section-heading">Introducción</h2>
<hr />
<p>En este post mostraremos como desactivar las búsquedas comerciales que aparecen en el dash de Unity, a la vez de molestas ¡polémicas!</p>
<hr />
<h2 class="section-heading">Polémica</h2>
<hr />
<p>La inclusión de las búsquedas en línea mediante el dash provocó un terremoto en la comunidad del software libre. Líderes destacados, como por ejemplo el gran Richard M. Stallman, mostraron su preocupación por el movimiento llevado a cabo por Canonical.</p>
<p>El detonante de la polémica fue que el usuario no tenía OPCIÓN a desactivar estas búsquedas, es decir, los datos del usuario se envíaban a los servidores de Canonical sin su conocimiento y consentimiento.</p>
<p>Tras las quejas de la comunidad Canonical incluyó una opción para activar-desactivar las búsquedas.</p>
<hr />
<h2 class="section-heading">Desactivación de las búsquedas</h2>
<hr />
<p><h3>Opción nº 1</h3></p>
<p>Gráficamente: <i>Configuración del Sistema</i> -> <i>Privacidad y seguridad</i> -> <i>Búsqueda</i>. Desactiva la opción "incluir resultados online":</p>
<img src="/img/post/post_busq_com/desactivar_busq_panel.jpg" alt="¡Desactivación de forma gráfica!" />
<span class="caption text-muted">¡Rápido y sencillo!</span>
<p><h3>Opción nº 2</h3></p>
<p>Desde una terminal basta con ejecutar la siguiente instrucción:</p>
<p><pre>
gsettings set com.canonical.Unity.Lenses disabled-scopes "['more_suggestions-amazon.scope', 'more_suggestions-u1ms.scope', 'more_suggestions-populartracks.scope', 'music-musicstore.scope', 'more_suggestions-ebay.scope', 'more_suggestions-ubuntushop.scope', 'more_suggestions-skimlinks.scope']"
</pre></p>
<hr />
<h2 class="section-heading">Conclusión</h2>
<hr />
<p>Se especula con que en Unity 8 las búsquedas serán eliminadas completamente. En teoría ya deberían de haber desaparecido, pero aquí siguen... </p>
