// Variables globales y elementos del DOM
// Se asume que estos elementos existen en el HTML.
const canvas = document.getElementById('ruleta');
const ctx = canvas ? canvas.getContext('2d') : null; // Obtener el contexto 2D del canvas
const resultadoDiv = document.getElementById('resultado');
const historialDiv = document.getElementById('historial');
const nombreInput = document.getElementById('nombre');
const botonGirar = document.getElementById('botonGirar');
const loadingSpinner = document.getElementById('historial-loading-spinner'); // Referencia al spinner

// Validación de elementos esenciales del DOM al inicio
if (!canvas || !ctx || !resultadoDiv || !historialDiv || !nombreInput || !botonGirar || !loadingSpinner) { // Incluir spinner en la validación
  // En un entorno de producción, se usaría un modal o mensaje en el DOM en lugar de alert.
  alert("Error: Elementos esenciales no encontrados en la página. Asegúrate de que el HTML esté completo.");
  throw new Error("Faltan elementos del DOM necesarios para iniciar la aplicación.");
}

// Lista de opciones (Pokémon) para la ruleta
const opciones = [
  "Fósil Domo",
  "Fósil Helix",
  "Ámbar Viejo",
  "Fósil Raíz",
  "Fósil Garra",
  "Fósil Cráneo",
  "Fósil Coraza",
  "Fósil Tapa",
  "Fósil Pluma",
  "Fósil Mandíbula",
  "Fósil Aleta"
];

// Colores para los segmentos de la ruleta
const colores = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
  '#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360',
  '#2ecc71', '#1abc9c', '#e67e22', '#e74c3c', '#8e44ad',
  '#2980b9', '#f1c40f', '#d35400', '#7f8c8d', '#34495e',
  '#9b59b6', '#27ae60', '#c0392b', '#16a085', '#bdc3c7'
];

// --- FUNCIÓN PARA DIBUJAR LA RULETA EN EL CANVAS ---
function dibujarRuleta() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia todo el canvas

  const centroX = canvas.width / 2;
  const centroY = canvas.height / 2;
  const radio = Math.min(centroX, centroY) - 5; // Radio de la ruleta, con un pequeño margen

  const anguloPorOpcion = (2 * Math.PI) / opciones.length; // Ángulo en radianes por cada opción

  opciones.forEach((nombre, i) => {
    const anguloInicio = i * anguloPorOpcion;
    const anguloFin = anguloInicio + anguloPorOpcion;

    ctx.beginPath();
    ctx.moveTo(centroX, centroY); // Mueve al centro del círculo
    ctx.arc(centroX, centroY, radio, anguloInicio, anguloFin); // Dibuja el segmento del círculo
    ctx.closePath();

    ctx.fillStyle = colores[i % colores.length]; // Asigna el color del segmento
    ctx.fill(); // Rellena el segmento
    ctx.stroke(); // Dibuja el borde del segmento

    // Dibuja el texto (nombre del Pokémon)
    ctx.save(); // Guarda el estado actual del canvas (transformaciones, estilos)

    ctx.translate(centroX, centroY); // Mueve el origen de coordenadas al centro del canvas
    // Rota el contexto para que el texto esté alineado con el centro del segmento
    ctx.rotate(anguloInicio + anguloPorOpcion / 2);
    ctx.textAlign = "right"; // Alinea el texto a la derecha del punto de dibujo
    ctx.fillStyle = "white"; // Color del texto
    ctx.font = "bold 14px sans-serif"; // Fuente del texto

    // Añade sombra al texto para mejorar la legibilidad
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Dibuja el texto. `radio - 10` lo coloca cerca del borde exterior del círculo.
    ctx.fillText(nombre, radio - 10, 5);

    ctx.restore(); // Restaura el estado del canvas al punto guardado
  });
}

// --- FUNCIÓN PARA FORMATEAR FECHAS ISO A UN FORMATO LEGIBLE ---
function formatearFechaISO(isoString) {
  const fecha = new Date(isoString);
  // Verifica si la fecha es válida. 'Invalid Date' puede ocurrir si el isoString no es parseable.
  if (isNaN(fecha.getTime())) {
      return "Fecha Inválida"; // Retorna un mensaje si la fecha no es válida
  }
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const dia = fecha.getDate();
  const mes = meses[fecha.getMonth()];
  const anio = fecha.getFullYear();
  const horas = fecha.getHours().toString().padStart(2, '0');
  const minutos = fecha.getMinutes().toString().padStart(2, '0');
  return `${dia} ${mes} ${anio} - ${horas}:${minutos}`;
}

// --- FUNCIÓN PARA AGREGAR RESULTADOS AL HISTORIAL (AHORA COMO ACORDEÓN) ---
function agregarHistorial(nombre, resultado, timestamp) {
  // Genera un ID único para el acordeón de este jugador
  const jugadorId = `accordion-jugador-${nombre.replace(/\s+/g, '-')}`;
  let jugadorAccordionItem = document.getElementById(jugadorId);
  let accordionContent;

  // Si el acordeón del jugador no existe, lo creamos
  if (!jugadorAccordionItem) {
    jugadorAccordionItem = document.createElement('div');
    jugadorAccordionItem.classList.add('accordion-item');
    jugadorAccordionItem.id = jugadorId; // Asigna el ID para poder encontrarlo

    // Crea la cabecera del acordeón para el jugador
    const header = document.createElement('div');
    header.classList.add('accordion-header');
    header.textContent = nombre; // La cabecera es el nombre del jugador

    // Crea el contenido del acordeón donde irán los resultados de este jugador
    accordionContent = document.createElement('div');
    accordionContent.classList.add('accordion-content');

    // Añade un evento de clic a la cabecera para alternar la clase 'active'
    header.addEventListener('click', () => {
      // Cierra cualquier otro item de acordeón abierto (opcional: si solo quieres uno abierto a la vez)
      const openItems = historialDiv.querySelectorAll('.accordion-item.active');
      openItems.forEach(openItem => {
        if (openItem !== jugadorAccordionItem) { // Evita cerrar el que se acaba de cliquear
          openItem.classList.remove('active');
        }
      });
      // Alterna la clase 'active' para el item actual (lo expande/colapsa)
      jugadorAccordionItem.classList.toggle('active');
    });

    jugadorAccordionItem.appendChild(header);
    jugadorAccordionItem.appendChild(accordionContent);
    historialDiv.prepend(jugadorAccordionItem); // Añade el nuevo acordeón de jugador al principio
  } else {
    // Si el acordeón del jugador ya existe, obtenemos su contenido
    accordionContent = jugadorAccordionItem.querySelector('.accordion-content');
  }

  // Crea el elemento para el nuevo resultado
  const nuevoResultadoItem = document.createElement('p');
  nuevoResultadoItem.classList.add('resultado-item'); // Clase para estilos de resultados individuales
  const fechaFormateada = formatearFechaISO(timestamp);
  nuevoResultadoItem.innerHTML = `<strong>${resultado}</strong> <small>(${fechaFormateada})</small>`;

  // Añade el nuevo resultado al principio del contenido del acordeón del jugador
  accordionContent.prepend(nuevoResultadoItem);
}

// --- FUNCIONES PARA INTERACTUAR CON GOOGLE SHEETS ---
// NOTA: Las URLs de los scripts de Google Apps deben ser actualizadas con tus propias URLs.
// Estas son URLs de ejemplo y no funcionarán sin tu propio despliegue.

async function guardarEnGoogleSheets(nombre, resultado, timestamp) {
  // SUSTITUYE ESTA URL con la URL de tu script de Google Apps para guardar datos
  const url = "https://script.google.com/macros/s/AKfycbx8Nk9NY0amspU4ha-yjlkceOln3crhClBDXDGiLuezDNcVKmU8qNW5mI4SYJUSuqvjoA/exec";
  const data = { nombre, resultado, timestamp };

  try {
    await fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    console.log("Datos enviados a Google Sheets (respuesta no disponible debido a 'no-cors').");
  } catch (err) {
    console.error("Error al guardar en Google Sheets:", err);
  }
}

async function cargarHistorialDesdeSheets() {
  // Mostrar el spinner
  loadingSpinner.style.display = 'block';

  // Ocultar todos los items del acordeón existentes para que solo se vea el spinner
  historialDiv.querySelectorAll('.accordion-item').forEach(item => {
      item.style.display = 'none'; // Oculta cada item individualmente
  });


  // SUSTITUYE ESTA URL con la URL de tu script de Google Apps para leer datos
  // Asegúrate de que tu script de Google Apps maneje el parámetro 'action=read'
  const url = "https://script.google.com/macros/s/AKfycbx8Nk9NY0amspU4ha-yjlkceOln3crhClBDXDGiLuezDNcVKmU8qNW5mI4SYJUSuqvjoA/exec?action=read";

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Error de red: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();

    console.log("Respuesta de Google Sheets (depuración):", data); // Mantener para futura depuración

    // Si tu script de Google Apps devuelve directamente un array de registros
    if (Array.isArray(data)) {
      // Limpiar el historial completamente antes de añadir los nuevos datos cargados
      // Esto es necesario para evitar duplicados si se llama varias veces
      // y para asegurar que el spinner sea el único elemento visible antes de la carga.
      historialDiv.innerHTML = ''; // Limpia todo el contenido, incluyendo el spinner
      // Volver a añadir el spinner después de limpiar el historial, pero oculto inicialmente
      historialDiv.appendChild(loadingSpinner);


      data.forEach(record => {
        // CORRECCIÓN: Usamos 'record.nombre', 'record.resultado', 'record.timestamp' (todo en minúsculas)
        // basándonos en la salida de depuración que proporcionaste.
        agregarHistorial(record.nombre, record.resultado, record.timestamp);
      });
    } else {
      console.error("Respuesta inesperada de Google Sheets:", data);
      alert("No se pudo cargar el historial. Formato de datos inesperado.");
    }
  } catch (err) {
    console.error("Error cargando historial desde Google Sheets:", err);
    alert("No se pudo cargar el historial, intenta recargar la página.");
  } finally {
    // Ocultar el spinner una vez que la carga ha terminado (éxito o error)
    loadingSpinner.style.display = 'none';
    // Mostrar los ítems del acordeón una vez que la carga ha terminado
    historialDiv.querySelectorAll('.accordion-item').forEach(item => {
        item.style.display = ''; // Restaura la visibilidad de los items
    });
  }
}

// --- FUNCIÓN PRINCIPAL PARA GIRAR LA RULETA ---
function girarRuleta() {
  const nombre = nombreInput.value.trim();
  if (!nombre || nombre.length < 2) {
    alert("Por favor, escribe un nombre válido antes de girar la ruleta.");
    return;
  }

  botonGirar.disabled = true; // Deshabilita el botón mientras la ruleta gira

  const indice = Math.floor(Math.random() * opciones.length); // Índice de la opción seleccionada
  const resultado = opciones[indice]; // Nombre de la opción seleccionada

  const vueltas = Math.floor(Math.random() * 3) + 3; // Número de vueltas completas (3 a 5)
  const anguloPorOpcion = 360 / opciones.length; // Ángulo en grados que ocupa cada opción

  // *** CÁLCULO DEL ÁNGULO DE DESTINO ***
  // Calcula el ángulo para que la opción seleccionada quede en la parte superior del indicador.
  // (indice * anguloPorOpcion + anguloPorOpcion / 2): Calcula el centro del sector de la opción.
  // 360 - (...): Ajusta la rotación para que la ruleta gire en la dirección correcta (sentido horario).
  // + 270: Este es el ajuste de desfase final. Compensa la diferencia entre el "cero"
  //        de tu dibujo (a la derecha) y la posición "arriba" de tu indicador.
  const anguloDestino = 360 - (indice * anguloPorOpcion + anguloPorOpcion / 2) + 270;

  // Normaliza el anguloDestino para que siempre esté entre 0 y 360 grados.
  // Esto es crucial para el reseteo visual después del giro.
  const anguloDestinoNormalizado = anguloDestino % 360;

  // Calcula la rotación total que incluirá las vueltas completas y el ángulo final normalizado.
  // Esta es la rotación que se animará.
  const nuevaRotacion = (360 * vueltas) + anguloDestinoNormalizado;

  // Aplica la rotación al estilo 'transform' del canvas.
  // La propiedad 'transition' en tu CSS (ruleta.css) es la que hace que el giro sea animado.
  canvas.style.transition = "transform 4s cubic-bezier(0.33, 1, 0.68, 1)";
  canvas.style.transform = `rotate(${nuevaRotacion}deg)`;

  // Establece un temporizador para ejecutar acciones una vez que la animación de giro haya terminado.
  setTimeout(() => {
    const ahora = new Date();
    const timestamp = ahora.toISOString();

    // Muestra el resultado de la ruleta en la interfaz de usuario.
    resultadoDiv.textContent = `Resultado: ${resultado} (${nombre})`;
    resultadoDiv.setAttribute("aria-live", "polite"); // Mejora la accesibilidad para lectores de pantalla.

    // Añade el resultado al historial (ahora como un item de acordeón) y lo guarda en Google Sheets.
    agregarHistorial(nombre, resultado, timestamp);
    guardarEnGoogleSheets(nombre, resultado, timestamp);

    botonGirar.disabled = false; // Vuelve a habilitar el botón para permitir otro giro.

    // Resetea la rotación del canvas instantáneamente (sin transición) a la posición final normalizada.
    // Esto es crucial para evitar que el valor de 'transform' crezca indefinidamente con cada giro,
    // y asegura que el siguiente giro comience desde la posición correcta (la opción que salió).
    canvas.style.transition = "none"; // Deshabilita la transición para que el cambio sea instantáneo.
    canvas.style.transform = `rotate(${anguloDestinoNormalizado}deg)`; // Establece la rotación a la posición final real.
  }, 4200); // El tiempo de espera debe ser ligeramente mayor que la duración de la transición CSS (4s).
}

// --- EVENT LISTENERS Y LLAMADAS INICIALES ---
// Dibuja la ruleta al cargar la página
dibujarRuleta();

// Se ejecuta cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
  // Deshabilita el botón de girar al cargar la página si no hay un jugador seleccionado.
  // Esto asume que la primera opción del select tiene un valor vacío.
  botonGirar.disabled = (nombreInput.value.trim().length < 2);

  // Añade un event listener para el cambio en la selección del jugador
  nombreInput.addEventListener('change', () => {
    botonGirar.disabled = (nombreInput.value.trim().length < 2);
  });

  // Carga el historial desde Google Sheets al inicio (si está configurado)
  // Asegúrate de que las URLs de Google Sheets en las funciones `guardarEnGoogleSheets`
  // y `cargarHistorialDesdeSheets` sean las correctas para tu despliegue.
  cargarHistorialDesdeSheets();

  // Asigna el evento de clic al botón de girar
  botonGirar.addEventListener('click', girarRuleta);
});