# 📐 Reglas de Diseño de Interfaz y Usabilidad (LitMusical Workspace)

Este documento define las directrices y restricciones de UI/UX para el desarrollo de la aplicación didáctica infantil LitMusical. Los agentes de desarrollo deben seguir estas reglas estrictamente para garantizar una experiencia de usuario premium, frictionless y adaptada a niños de 9 años.

---

## 1. Alturas Máximas y Contención de Scroll (Anti-Viewport Overflow)
* **Regla**: Ninguna acción en la interfaz debe empujar los elementos principales fuera de la ventana del navegador (viewport), forzando scroll general en la página.
* **Implementación**: 
  * Los paneles principales (como el karaoke de lectura y la tarjeta de retos) deben usar límites de altura fija/máxima (`maxHeight` acotado a un máximo de `520px`).
  * Utilizar scroll interno (`overflowY: 'auto'`) dentro de cada panel para absorber el crecimiento de contenido largo.
  * Mantener el reproductor de audio y el panel superior siempre visibles en pantalla.

## 2. Wizard de Reemplazo en Caliente (Evitar Despliegue de Campos Ocultos)
* **Regla**: Está prohibido expandir verticalmente tarjetas o componentes mostrando campos que antes estaban ocultos (`display: block` dinámico sobre listas acumulativas), ya que desplaza los controles y desorienta al usuario.
* **Implementación**:
  * Implementar transiciones mediante **reemplazo completo de contenido** (wizard limpio).
  * Cada paso de la experiencia (Paso 1: Lectura, Paso 2: Trivia de Comprensión, Paso 3: Identificación de Figura, Paso 4: Éxito) debe sustituir en caliente el contenido interno del contenedor activo de la tarjeta, manteniendo el tamaño del contenedor lo más estable posible.

## 3. Clara Diferenciación de Fases (Lectura vs. Reto Activo)
* **Regla**: El usuario debe distinguir visualmente e instantáneamente cuándo la app está en modo "Lectura Sincronizada" (cantar/escuchar la música) y cuándo está en modo "Reto Intelectual" (resolver trivias o identificar figuras).
* **Implementación**:
  * **Fase de Lectura (Paso 1)**: Fondo del reproductor enfocado, estrofa limpia sin botones distractores.
  * **Fase de Reto (Pasos 2 y 3)**: Modificar el contraste de la tarjeta derecha utilizando un fondo con tonalidades del paso (ej: gradiente cyan oscuro para trivia de comprensión, gradiente rosa/morado oscuro para figuras), desactivando interacciones de audio secundarias para centrar la atención.

## 4. Aislamiento del Ruido Didáctico (Mochila de Logros / Álbum)
* **Regla**: El progreso a largo plazo (placas de logros, rango de detective) no debe interferir con las tareas de atención focalizada en tiempo real (cantar y analizar versos).
* **Implementación**:
  * Retirar el Álbum de Placas de la columna de lectura.
  * Colocar el Álbum en un modal secundario de tipo "Mochila de Detective" (cajón emergente o popup interactivo) accesible a demanda desde la Navbar.
  * Mostrar el progreso de logros únicamente en momentos de celebración/recompensa de finalización de retos (Paso 4), donde el usuario ya completó el esfuerzo y busca feedback de progreso.

---

## 🔄 Persistencia en Git
Este archivo de reglas reside en `.agents/rules/design-system.md` en el repositorio del proyecto. Se guarda en Git y se importa automáticamente en cualquier ordenador cuando otro desarrollador o IA clona el espacio de trabajo.
