---
layout:     	post
title:      	"¡Escribir un Script Bash de instalación en GNU/Linux Ubuntu!"
subtitle:   	"Este método se encargará de realizar todo el trabajo por ti"
description:	Escribir un Script Bash de instalación en GNU/Linux Ubuntu
date:       	2017-01-15 12:00:00
sitemap:
  lastmod: 2019-03-02
tag:			[informatica, linux, programacion]
author:     	Ramses
image: 	"img/post/post_script_bash_ubuntu/ubuntu_script_bash.jpg"
permalink: /:title/
comments: true
rating: 4
---
<h2 class="section-heading">Introducción</h2>
<hr />
<p>
Si eres fiel usuario de Linux y estás continuamente probando nuevas distros o bien formateas tu PC cada X tiempo, estarás
harto de volver instalar tus aplicaciones o temas una y otra vez, es un proceso tedioso en el cual se pierde bastante tiempo.
Podemos automatizar estos pasos gracias a los scripts utilizando Bash.
</p>
<hr />
<h2 class="section-heading">Creación y ejecución de un Script</h2>
<hr />
<p>Para crear un script puedes abrir una terminal y escribir el siguiente comando:</p>
<p><pre><code class="language-bash">touch script.sh && chmod +x script.sh</code></pre></p>
<p>
Básicamente creamos el script con <code>touch</code> y seguidamente damos permisos de ejecución utilizando <code>chmod</code>, puedes utilizar
la orden <code>cd</code> para ubicarte en el directorio donde desees almacenar tu script. Es recomendable añadir la extensión <strong>.sh</strong>
a tu archivo, por último no olvides dar los permisos de ejecución. Ya puedes modificar tu script y añadir órdenes.
</p>
<p>Para ejecutar un script existen varias formas, recomiendo estas dos que son las más sencillas:</p>
<p><pre><code class="language-bash">./script.sh</code></pre></p>
<p><pre><code class="language-bash">bash script.sh</code></pre></p>
<hr />
<h2 class="section-heading">Ejemplo - (A)fter (i)nstall Linux - AiLinux</h2>
<hr />
<p>Aquí puedes ver un script creado por mí que tengo almacenado en un repositorio de mi cuenta de GitHub (enlace a mi perfil a final de página):</p>
<pre>
<code class="language-bash">
#! /bin/bash
# Función que realiza las tareas pertinentes.
function ailinux(){
  # Variables.
  let proc=9
  s_null="/dev/null"
  current_user=$(whoami)
  # Texto de introducción.
  echo "================================================================================"
  echo -e " Bienvenido \e[1;34m"$current_user"\e[0m - Script Bash de instalación de recursos básicos tras la "
  echo " instalación de Sistemas Operativos GNU/Linux basados en Debian (Ubuntu - Mint) "
  echo "================================================================================"
  # Indicamos al usuario que comenzamos las tareas.
  echo
  echo "[Realizando tareas, espere un momento por favor (No cierre la terminal)...]"
  echo
  echo "Procesos restantes: "$proc
  # Tareas.
  #
  add-apt-repository -y ppa:tualatrix/ppa &> $s_null #
  let "proc -= 1"
  echo "Procesos restantes: "$proc
  #
  apt-get update &> $s_null #
  let "proc -= 1"
  echo "Procesos restantes: "$proc
  #
  apt-get upgrade -y &> $s_null #
  let "proc -= 1"
  echo "Procesos restantes: "$proc
  #
  apt install ubuntu-restricted-extras -y &> $s_null #
  let "proc -= 1"
  echo "Procesos restantes: "$proc
  #
  apt install rar unace p7zip-full p7zip-rar sharutils mpack arj -y &> $s_null #
  let "proc -= 1"
  echo "Procesos restantes: "$proc
  #
  apt install synaptic -y &> $s_null #
  let "proc -= 1"
  echo "Procesos restantes: "$proc
  #
  apt install aptitude -y &> $s_null #
  let "proc -= 1"
  echo "Procesos restantes: "$proc
  #
  apt install ubuntu-tweak -y &> $s_null #
  let "proc -= 1"
  echo "Procesos restantes: "$proc
  #
  apt-get autoremove -y &> $s_null #
  # Indicamos al usuario que hemos finalizado las tareas.
  echo
  echo "[Tareas finalizadas con éxito]"
  echo
  # Liberamos Variables.
  proc=
  s_null=
  current_user=
}
# Limpiamos terminal de comandos ejecutados anteriormente.
clear
# Comprobamos que el fichero Bash ha sido ejecutado como SuperUsuario - root.
# En caso FALSE informamos al usuario de que ejecute de nuevo como root.
# En caso TRUE se llama a la función AiLinux.
if [ "$(id -u)" != "0" ]; then
   echo
   echo "============================================================================"
   echo "¡Este Script debe ejecutarse como SuperUsuario!" 1>&2
   echo "============================================================================"
   echo
    exit 1
else
  ailinux
    exit 1
fi
</code>
</pre>
<p>
Suelo utilizar este script en ordenadores que han sido formateados. Realiza la actualización de paquetes, instalación de Ubuntu Tweak, plugins (como por ejemplo Flash), codecs de audio e incluso compresores de archivos como <strong>rar</strong> o <strong>zip</strong>. La parte final del script es una sentencia condicional
para obligar al usuario a ejecutar el fichero como <i>SuperUsuario</i>.
</p>
<hr />
<h2 class="section-heading">Conclusión</h2>
<hr />
<p>
Como ves las posibilidades son infinitas y puedes crear un script adecuado a tus necesidades, tengo intención de ampliar el mío para que instale otras herramientas o programas que también uso con asiduidad como por ejemplo Atom, GIMP o PlayOnLinux.
</p>
<p>¡Te animo a probar y crear los tuyos!</p>
