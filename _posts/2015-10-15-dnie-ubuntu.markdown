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
<p>Mi lector es un Sveon SCT011, un dispositivo muy sencillo, barato y que compré en grandes superficies, aquí una imagen:</p>
<img src="/img/post/post_dnie/sct011.jpg" alt="Sveon SCT011" />
<span class="caption text-muted">Sveon SCT011</span>
<p>La mayoría de dispositivos son compatibles en Ubuntu, de todas formas instalaremos una serie de paquetes (controladores) para garanzitar su funcionamiento.</p>
<hr />
<h2 class="section-heading">Instalación de Java</h2>
<hr />
<p>Para llevar a cabo nuestos trámites es necesario tener instalado Java. Usaremos la versión 8, aunque si prefieres la versión 7 también puedes instalarla, abriremos un terminal y ejecutaremos los siguientes comandos:</p>
<p><strong><pre>sudo add-apt-repository ppa:webupd8team/java</pre></strong></p>
<p><strong><pre>sudo apt-get update</pre></strong></p>
<p><strong><pre>sudo apt-get install oracle-java8-installer</pre></strong></p>
<p><strong><pre>sudo update-java-alternatives -s java-8-oracle</pre></strong></p>
<hr />
<h2 class="section-heading">Instalación de controladores, librerías y bibliotecas</h2>
<hr />
<p>Primero comprobaremos que nuestro sistema reconoce el lector, en la terminal ejecutamos el siguiente comando:</p>
<p><strong><pre>lsusb</pre></strong></p>
<p>Ahora crearemos dos directorios, están relacionados con la compilación de la versión modificada de OpenSC para el DNIe:</p>
<p><strong><pre>sudo mkdir /usr/lib/pkcs11</pre></strong></p>
<p><strong><pre>sudo mkdir /etc/opensc</pre></strong></p>
<p>Finalmente instalaremos los controladores, librerías, bibliotecas y paquetes complementarios para que funcione todo correctamente:</p>
<p><strong><pre>sudo apt-get install libccid pcscd</pre></strong></p>
<p><strong><pre>sudo apt-get install libacr38u</pre></strong></p>
<p><strong><pre>sudo apt-get install pinentry-gtk2 pcsc-tools libpcsclite1 libpcsclite-dev libreadline6 libreadline-dev coolkey</pre></strong></p>
<p><strong><pre>sudo apt-get install pcscd pcsc-tools</pre></strong></p>
<p>Y por último si queremos comprobar que reconoce correctamente la tarjeta:</p>
<p><strong><pre>pcsc_scan</pre></strong></p>
<hr />
<h2 class="section-heading">Instalación de los certificados en Firefox</h2>
<hr />
<p>Lo primero de todo será descargar los certificados correspondientes. Los puedes encontrar <a href="http://www.dnielectronico.es/PortalDNIe/PRF1_Cons02.action?pag=REF_077" title="Certificados DNIe" target="_blank">aquí</a></p>
<p>Son AC Raíz (archivo: "pkcs1-sha256WithRSAEncryption") y AV DNIE FNMT (archivo: "pkcs1-sha256WithRSAEncryption").</p>
<p>Descomprimimos los archivos .zip descargados y en Firefox vamos a Editar -> Preferencias -> Avanzado -> Cifrado -> Ver certificados y en la pestaña "Autoridades" pulsamos "Importar" y elegimos ACRAIZ-SHA2.crt. En la pestaña
"Servidores" también utilizamos "Importar" con AVDNIEFNMTSHA2.cer.</p>
<hr />
<h2 class="section-heading">Descarga, compilación e instalación de OpenSC modificado</h2>
<hr />
<p>Creamos un directorio oculto para almacenar el código fuente y luego accederemos al directorio:</p>
<p><strong><pre>mkdir .openscDNIe</pre></strong></p>
<p><strong><pre>cd .openscDNIe</pre></strong></p>
<p>Descargamos el código fuente con el siguiente comando:</p>
<p><strong><pre>msvn checkout --username anonsvn https://forja.cenatic.es/svn/opendnie/opensc-opendnie/trunk</pre></strong></p>
<p>Para iniciar la descarga requiere una contraseña, es: anonsvn. Tras la descarga debemos acceder a uno de los directorios descargados:</p>
<p><strong><pre>cd trunk</pre></strong></p>
<p>Antes compilar hay que añadir la ruta de la librería "libltdl.la" en el archivo "src/tools/Makefile.am" del código fuente, en "trunk". La ruta variará dependiendo de la arquitectura, 32 o 64 bits, de nuestro sistema. Para ver la ruta ejecutamos:</p>
<p><strong><pre>sudo find / -name libltdl.la</pre></strong></p>
<p>Suele tardar un poco en realizar la búsqueda pero nos devolverá la ruta exacta, para finalizar el proceso pulsa Ctrl+ C. Este por ejemplo sería para 64 bits:</p>
<p><strong><pre>/usr/lib/x86_64-linux-gnu/libltdl.la</pre></strong></p>
<p>Editamos el archivo Makefile.am, puedes utilizar nano o gedit (u otro), y buscamos la siguiente línea:</p>
<p><strong><pre>
        LIBS = $(top_builddir)/src/common/libcompat.la \
            $(top_builddir)/src/libopensc/libopensc.la
</pre></strong></p>
<p>Añadimos la ruta que hemos obtenido quedando así:</p>
<p><strong><pre>
        LIBS = $(top_builddir)/src/common/libcompat.la \
            $(top_builddir)/src/libopensc/libopensc.la \
            /usr/lib/x86_64-linux-gnu/libltdl.la
</pre></strong></p>
<p>Para finalizar compilamos ejecutando estos comandos:</p>
<p><strong><pre>
      ./bootstrap
      ./configure --prefix=/usr --sysconfdir=/etc/opensc
      make
      sudo make install
</pre></strong></p>
<hr />
<h2 class="section-heading">Configurando + parámetros</h2>
<hr />
<p></p>
<hr />
<h2 class="section-heading">Conclusión</h2>
