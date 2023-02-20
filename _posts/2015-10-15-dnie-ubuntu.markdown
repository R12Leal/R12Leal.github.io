---
layout:     	post
title:      	"¡Instalar el DNIe electrónico en GNU/Linux Ubuntu (14.04+)!"
subtitle:   	"Tus trámites telemáticos también con GNU/Linux Ubuntu"
description:	Tus trámites telemáticos también con GNU/Linux Ubuntu
date:       	2015-10-15 12:00:00
sitemap:
  lastmod: 2019-03-02
tag:			[informatica,linux]
author:     	Ramses
image: 	"img/post/post_dnie/dnie-linux.jpg"
permalink: /:title/
comments: true
rating: 5
---
<h2 class="section-heading">Introducción</h2>
<hr />
<p>El DNIe (DNI electrónico) es una herramienta que todavía no ha terminado de despegar en España pero que poco a poco va sumando adeptos ya que nos permite ahorrarnos los típicos, y tediosos, desplazamientos a las oficinas de las principales administraciones públicas de nuestra zona.</p>
<p>La causa principal (del poco uso por parte de la población) es porque la administración no ofrece un buen soporte a los ciudadanos. Incluso en sistemas operativos de Microsoft también es un poco complicado su instalación y uso.</p>
<p>En este post veremos como instalar y usar el DNIe en Ubuntu (versión 14.04 o posteriores), ya sean de 32 o 64 bits. No he probado la instalación en el resto de distribuciones de Linux pero debería funcionar igualmente, sobre todo las que son derivadas de Debian.</p>
<hr />
<h2 class="section-heading">Lector o Card Reader</h2>
<hr />
<p>Mi lector es un Sveon SCT011, un dispositivo muy sencillo, barato y que compré en grandes superficies, aquí una imagen:</p>
<img src="/img/post/post_dnie/sct011.jpg" alt="Sveon SCT011" />
<span class="caption text-muted">Sveon SCT011</span>
<p>La mayoría de dispositivos son compatibles en Ubuntu, de todas formas instalaremos una serie de paquetes (controladores) para garantizar su funcionamiento.</p>
<hr />
<h2 class="section-heading">Instalación de Java</h2>
<hr />
<p>Para llevar a cabo nuestros trámites es necesario tener instalado Java en nuestro sistema. Usaremos la versión 8, aunque si prefieres la versión 7 también puedes instalarla. Abriremos una terminal y ejecutaremos los siguientes comandos:</p>
<p><strong><pre>
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
sudo apt-get install oracle-java8-installer
sudo update-java-alternatives -s java-8-oracle
</pre></strong></p>
<hr />
<h2 class="section-heading">Instalación de controladores, librerías o bibliotecas</h2>
<hr />
<p>Primero comprobaremos que nuestro sistema reconoce el lector, en la terminal ejecutamos el siguiente comando:</p>
<p><strong><pre>lsusb</pre></strong></p>
<p>Ahora crearemos dos directorios, están relacionados con la compilación de la versión modificada de OpenSC para el DNIe:</p>
<p><strong><pre>
sudo mkdir /usr/lib/pkcs11
sudo mkdir /etc/opensc
</pre></strong></p>
<p>Finalmente instalaremos los controladores, librerías o bibliotecas y paquetes complementarios para que funcione todo correctamente:</p>
<p><strong><pre>
sudo apt-get install libccid pcscd
sudo apt-get install libacr38u
sudo apt-get install pinentry-gtk2 pcsc-tools libpcsclite1 libpcsclite-dev libreadline6 libreadline-dev coolkey
</pre></strong></p>
<p>Y por último si queremos comprobar que reconoce correctamente la tarjeta ejecutar:</p>
<p><strong><pre>pcsc_scan</pre></strong></p>
<hr />
<h2 class="section-heading">Instalación de los certificados en Firefox</h2>
<hr />
<p>Lo primero de todo será descargar los certificados correspondientes. Los puedes encontrar <a href="http://www.dnielectronico.es/PortalDNIe/PRF1_Cons02.action?pag=REF_077" title="Certificados DNIe" target="_blank">aquí</a></p>
<p>Son AC Raíz (archivo: "pkcs1-sha256WithRSAEncryption") y AV DNIE FNMT (archivo: "pkcs1-sha256WithRSAEncryption").</p>
<p>Descomprimimos los archivos .zip y en Firefox vamos a Editar -> Preferencias -> Avanzado -> Cifrado -> Ver certificados y en la pestaña "Autoridades" pulsamos "Importar" y elegimos ACRAIZ-SHA2.crt. En la pestaña "Servidores" también utilizaremos la opción "Importar" con AVDNIEFNMTSHA2.cer.</p>
<p>Durante la importación del certificado aparecerá una nueva ventana, en esta se pueden observar tres opciones de confianza las cuales debemos marcar:</p>
<img src="/img/post/post_dnie/op-importar.jpg" alt="¡Opciones durante la importación!" />
<span class="caption text-muted">¡RECUERDA: debes marcar las tres opciones!</span>
<hr />
<h2 class="section-heading">Descarga, compilación e instalación de OpenSC modificado para DNIe</h2>
<hr />
<p>Creamos un directorio oculto para almacenar el código fuente y luego accederemos al mismo:</p>
<p><strong><pre>
mkdir .openscDNIe
cd .openscDNIe
</pre></strong></p>
<p>Descargamos el código fuente con el siguiente comando:</p>
<p><strong><pre>svn checkout --username anonsvn https://forja.cenatic.es/svn/opendnie/opensc-opendnie/trunk</pre></strong></p>
<p>Para iniciar la descarga requiere una contraseña, es: anonsvn. Tras descargar el código fuente debemos acceder a uno de los directorios descargados:</p>
<p><strong><pre>cd trunk</pre></strong></p>
<p>Antes compilar hay que añadir la ruta de la librería "libltdl.la" al archivo "src/tools/Makefile.am" del código fuente, en "trunk". La ruta variará dependiendo de la arquitectura, 32 o 64 bits, de nuestro sistema. Para encontrarla ejecutamos:</p>
<p><strong><pre>sudo find / -name libltdl.la</pre></strong></p>
<p>Suele tardar un poco en realizar la búsqueda pero nos devolverá la ruta exacta, para finalizar el proceso pulsa Ctrl+ C. Este por ejemplo sería para 64 bits:</p>
<p><strong><pre>/usr/lib/x86_64-linux-gnu/libltdl.la</pre></strong></p>
<p>Editamos el archivo Makefile.am, puedes utilizar nano o gedit (u otro editor), y buscamos la siguiente línea:</p>
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
<p>Puede demorarse un tiempo la compilación e instalación, cuando finalice el módulo "PKCS11" habrá quedado instalado en la ruta: "/usr/lib/opensc-pkcs11.so". Ahora hay que indicarle esta información a Firefox: vamos a Editar -> Preferencias -> Avanzado -> Cifrado -> Dispositivos de seguridad, pulsamos en "Cargar", y en "Nombre del módulo" escribimos: PKCS11 y en "Archivo del módulo" escribimos la ruta: "/usr/lib/opensc-pkcs11.so".</p>
<img src="/img/post/post_dnie/ds-cargar.jpg" alt="¡Instalación del módulo PKCS11 en Firefox!" />
<span class="caption text-muted">¡Instalación del módulo PKCS11 en Firefox!</span>
<p>Para finalizar reiniciamos el navegador, ya podemos usar nuestro DNIe.</p>
<hr />
<h2 class="section-heading">Configurando + parámetros</h2>
<hr />
<p>El pin del DNIe tiene protección por Token, así que es probable que la identificación falle. Para solucionarlo debemos editar el archivo "opensc.conf". Dependiendo de las distribuciones puede estar ubicado en distintos directorios. Para encontrar la ruta exacta ejecutamos este comando en una terminal:</p>
<p><strong><pre>sudo find / -name opensc.conf</pre></strong></p>
<p>Una vez obtenida la ruta editamos el archivo con nano o gedit (u otro editor) y buscamos estas dos líneas:</p>
<p><strong><pre># enable_pinpad = false;</pre></strong></p>
<p>Basta con borrar el # quedando así:</p>
<p><strong><pre>enable_pinpad = false;</pre></strong></p>
<hr />
<h2 class="section-heading">¿Funciona?</h2>
<hr />
<p>Para probar que funciona podemos acudir al siguiente enlace oficial: <a href="http://www.dnielectronico.es/PortalDNIe/PRF1_Cons02.action?pag=REF_320" title="Verificar DNIe" target="_blank">DNIe</a></p>
<hr />
<h2 class="section-heading">Conclusión</h2>
<hr />
<p>Poco a poco la administración pública va fomentando el uso del DNIe, además ya se están probando futuras versiones como por ejemplo la 3.0 que permitirá el escaneo del DNIe mediante el uso de un smartphones. Con su utilización ganamos todos, sobre todo los funcionarios ;) Salu2! </p>
<p>Fuentes:<br /><a href="http://www.ubuntu-guia.com/2014/04/instalar-dni-electronico-en-ubuntu.html" title="DNIe en GNU/Linux Ubuntu" target="_blank">Ubuntu guia</a><br /><a href="https://lasindias.com/indianopedia/instalar-el-dni-e-en-ubuntu" title="DNIe en GNU/Linux Ubuntu" target="_blank">El correo de las Indias</a></p>
