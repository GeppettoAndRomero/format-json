import type { ToolContent } from './types';

// Español. Transcreación basada en el vocabulario que usan las herramientas de
// formateo de JSON en español, no traducción literal. Sin palabras publicitarias
// (fácil / rápido / perfecto…); la privacidad se explica de forma estructural,
// no como promesa. Español pan-regional (BRAND-OPERATING-MODEL / I18N-SEO-GUIDELINE).

export const es: ToolContent = {
  htmlLang: 'es',

  meta: {
    title: 'Formatear JSON — Embellecer, minificar y validar, sin subir nada | runlocally',
    description:
      'Formatea (embellece), minifica o valida JSON directamente en tu navegador. Un JSON inválido muestra la línea y columna donde falla. Nada se sube — código abierto, funciona sin conexión.',
    ogTitle: 'Formatear JSON — Embellecer, minificar y validar',
    ogDescription:
      'Formatea, minifica o valida JSON en tu navegador. Los errores muestran la línea y columna exactas. Nada se sube.',
  },

  hero: {
    h1: 'Formatear JSON',
    tagline:
      'Embellece, minifica o valida JSON en tu navegador. Si es inválido, se muestra exactamente dónde falla. Nada se sube.',
  },

  intro: {
    h2: 'Formatea, minifica o valida JSON sin salir del navegador',
    paras: [
      'Pega el JSON, escríbelo directamente, o elige un archivo .json. Elige Formatear para embellecerlo con 2 espacios, 4 espacios o una tabulación; Minificar para eliminar todo espacio y salto de línea no esenciales; o Validar para comprobar únicamente si se puede analizar, sin reescribir nada.',
      "El análisis usa el JSON.parse propio del navegador — el mismo analizador que usa tu código en tiempo de ejecución —, así que un JSON válido aquí es válido en cualquier parte. Cuando no lo es, se muestra el error que tu navegador realmente lanzó, junto con la línea y columna a las que apunta, sin adivinar nada.",
    ],
  },

  privacy: {
    h2: 'Por qué tu JSON no sale de tu dispositivo',
    lead: 'La privacidad aquí es estructural, no una promesa. No hay paso de subida porque no hay servidor al que subir nada — esto importa especialmente aquí, ya que el JSON que se pega en un formateador suele ser una respuesta real de una API, un archivo de configuración, o datos con tokens que no querrías enviar a ningún sitio:',
    points: [
      'Analizar, formatear, minificar y validar ocurre por completo en tu navegador.',
      'La página se sirve como archivos estáticos y no hace ninguna petición con tu JSON.',
      'El código fuente es abierto y cualquiera puede leerlo (MIT).',
      'Funciona sin conexión, algo posible solo porque nada sale del dispositivo.',
    ],
    note: 'Si quieres comprobarlo tú mismo, abre el panel de red de tu navegador mientras formateas — ninguna petición transporta tus datos.',
    sourceLinkText: 'Ver el código fuente.',
  },

  howto: {
    h2: 'Cómo usarlo',
    steps: [
      {
        h3: 'Añade tu JSON',
        p: 'Pégalo en el cuadro de texto, escríbelo directamente, o haz clic para elegir un archivo .json. Soltar un archivo en cualquier parte de la página también funciona.',
      },
      {
        h3: 'Elige un modo',
        p: 'Formatear embellece con la sangría elegida (2 espacios, 4 espacios o una tabulación). Minificar elimina todo el espacio en blanco no esencial. Validar solo comprueba si se puede analizar.',
      },
      {
        h3: 'Corrige los errores si los hay',
        p: 'Si el JSON no es válido, se muestra la línea y columna exactas que reportó tu navegador, junto con la línea afectada, para que puedas encontrar y corregir el problema rápidamente.',
      },
      {
        h3: 'Copia o descarga el resultado',
        p: 'Copia el resultado formateado o minificado al portapapeles, o descárgalo como archivo .json. Se muestra el tamaño en bytes de la entrada y la salida, para ver exactamente cuánto ahorró la minificación.',
      },
    ],
  },

  faqHeading: 'Preguntas frecuentes',
  faq: [
    {
      q: '¿Mi JSON se sube a algún sitio?',
      a: 'No. Analizar, formatear, minificar y validar ocurre por completo en tu navegador. No hay ningún componente de servidor, así que tus datos no tienen forma de salir de tu dispositivo. El código fuente es abierto y puedes comprobarlo tú mismo en el panel de red de tu navegador.',
    },
    {
      q: '¿Cuál es la diferencia entre Formatear, Minificar y Validar?',
      a: 'Formatear embellece tu JSON con una sangría uniforme (2 espacios, 4 espacios o una tabulación). Minificar hace lo contrario: elimina todo espacio, tabulación y salto de línea que el JSON no necesita, produciendo la salida válida más pequeña posible. Validar no hace ninguna de las dos cosas — solo analiza la entrada y reporta si es JSON válido y, si no lo es, dónde falla.',
    },
    {
      q: '¿Cómo se calcula la ubicación del error?',
      a: 'Proviene directamente del propio analizador JSON del navegador, JSON.parse — se muestra el mensaje exacto que lanza, con la línea y columna derivadas de a qué parte del texto apunta. Distintos navegadores redactan estos mensajes de forma diferente, y algunos no exponen una posición precisa en absoluto; en ese caso se muestra el mensaje tal cual, en lugar de adivinar una ubicación.',
    },
    {
      q: '¿Formatear o minificar cambia los datos en sí?',
      a: 'No. Solo cambian los espacios en blanco. El orden de las claves de los objetos y cada valor se conservan exactamente como los lee el analizador JSON del navegador — nunca se reordena, añade ni elimina nada.',
    },
    {
      q: '¿Hay un límite de tamaño de archivo?',
      a: 'No hay un límite fijo. Como todo ocurre en tu navegador, el límite práctico depende de la memoria de tu dispositivo — los archivos muy grandes pueden tardar más en analizarse o formatearse.',
    },
    {
      q: '¿Funciona sin conexión?',
      a: 'Sí. Es una PWA. Tras la primera visita queda en caché, así que formatear y validar funcionan sin conexión a internet. También puedes instalarla en tu pantalla de inicio.',
    },
  ],

  footer: {
    openSourceLabel: 'Código abierto (MIT)',
    partOf: 'parte de',
    brandTail: '— pequeñas herramientas que funcionan localmente en tu dispositivo.',
    colophon:
      'Creado y mantenido por Geppetto. Parte del código se escribe con asistencia de IA; toda revisión y decisión es del mantenedor.',
    securityText: 'Seguridad',
  },
};
