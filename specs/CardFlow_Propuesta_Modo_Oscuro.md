# CardFlow - Propuesta Visual para Modo Oscuro

## 1. Objetivo

Definir una propuesta visual de modo oscuro para CardFlow respetando la identidad ya desarrollada: una interfaz editorial, premium, calida y tactil, con protagonismo del ambar/naranja, superficies por capas y sensacion de profundidad suave.

La intencion no es convertir la interfaz en un dark mode generico, sino trasladar el lenguaje actual a un contexto nocturno mas enfocado, elegante y operativo.

---

## 2. Punto de partida visual detectado

La propuesta actual de CardFlow ya tiene una direccion consistente:

- base cromatica clara con fondo marfil/lila muy suave
- acento principal ambar (`#9f4200`, `#f27121`)
- gradiente calido para acciones principales
- cards blancas o casi blancas sobre fondos de tono suave
- bordes minimizados y jerarquia construida por cambio de superficie
- navbar y overlays con efecto glassmorphism
- tipografia Inter con mezcla editorial: titulares grandes, labels en mayusculas y cuerpos limpios

El modo oscuro debe conservar esos principios.

---

## 3. Concepto visual propuesto

## Nombre conceptual
**Amber After Hours**

CardFlow en modo oscuro debe sentirse como una mesa de trabajo nocturna: fondo profundo, iluminacion calida, paneles flotantes y focos ambar que guian la atencion.

No buscamos negro puro ni contraste agresivo. Buscamos un oscuro mineral con subtono calido para que el naranja siga sintiendose natural y premium.

---

## 4. Principios visuales del modo oscuro

### 4.1 Oscuro calido, no negro puro
El fondo principal no debe ser `#000000`. Se propone una base antracita con matiz cafe/gris para mantener continuidad con la version clara.

### 4.2 Jerarquia por capas
La diferencia entre fondo, panel, tarjeta y modal debe darse por elevacion tonal, no por lineas duras.

### 4.3 Acento ambar como luz funcional
El ambar debe reservarse para:
- CTA principal
- foco
- estados activos
- highlights de navegacion
- metricas o badges prioritarios

### 4.4 Legibilidad operativa
En vistas densas como tablero, administracion y detalle de card, la lectura debe seguir siendo rapida:
- texto principal muy claro
- texto secundario desaturado
- separaciones sutiles
- chips y estados faciles de escanear

### 4.5 Brillo controlado
El gradiente naranja debe mantenerse, pero con menos luminosidad expansiva que en light mode para no generar fatiga visual.

---

## 5. Paleta propuesta

## Tokens base

- `background`: `#161311`
- `surface`: `#1d1917`
- `surface_container_low`: `#241f1c`
- `surface_container`: `#2b2521`
- `surface_container_high`: `#342d28`
- `surface_container_highest`: `#40362f`

- `on_background`: `#f4eee8`
- `on_surface`: `#f3ede7`
- `on_surface_variant`: `#c7b8ac`
- `secondary`: `#a8998d`
- `outline`: `#6f5c4f`
- `outline_variant`: `#4f433b`

## Marca y acentos

- `primary`: `#ff9a52`
- `primary_hover`: `#ffad72`
- `primary_active`: `#e8833f`
- `primary_container`: `#5a2d12`
- `on_primary`: `#1b0e06`
- `on_primary_container`: `#ffd9c2`

## Gradiente hero

- inicio: `#ffb36b`
- fin: `#f27121`

Uso: solo botones principales, highlights hero y acciones de alto valor.

## Estados

- `success`: `#63d39b`
- `success_container`: `#173829`

- `warning`: `#f3b45a`
- `warning_container`: `#4a3314`

- `error`: `#ff7d73`
- `error_container`: `#4b1f1c`

- `info`: `#64b5ff`
- `info_container`: `#16344d`

---

## 6. Superficies y profundidad

### Fondo general
Un fondo oscuro mate con ligero degradado radial:
- parte superior: tono ligeramente mas calido
- parte inferior: tono mas profundo y neutro

### Navbar flotante
Mantener el lenguaje actual de vidrio:
- fondo semitransparente oscuro
- blur suave
- borde fantasma en `outline_variant`
- sombra amplia y difusa, sin negro puro

### Cards
Las cards deben sentirse como piezas fisicas sobre la mesa:
- base en `surface_container_low`
- hover en `surface_container`
- activa en `surface_container_high`
- sombras suaves y cortas
- evitar bordes fuertes salvo casos funcionales

### Modales y panel lateral
El detalle de card debe sentirse mas elevado que el tablero:
- panel en `surface`
- header y footer con una capa levemente distinta
- overlay translucido calido, no gris azulado

---

## 7. Tipografia y tono visual

### Tipografia
Se mantiene Inter para asegurar coherencia con lo ya disenado.

### Jerarquia
- titulares: claros, grandes, con tracking ajustado
- labels: mayusculas, espaciado amplio, tono secundario
- cuerpo: color alto contraste pero no blanco puro

### Sensacion
En oscuro, la interfaz debe verse:
- mas enfocada
- mas premium
- mas silenciosa
- mas orientada al trabajo prolongado

---

## 8. Componentes clave en dark mode

## 8.1 Boton primario
- gradiente ambar
- texto oscuro profundo o blanco calido segun contraste final
- glow muy sutil en hover
- no usar neon

## 8.2 Boton secundario
- fondo `surface_container_low`
- texto claro
- borde fantasma tenue
- hover con elevacion tonal, no solo cambio de borde

## 8.3 Inputs
- fondo `surface_container_low`
- texto `on_surface`
- placeholder `secondary`
- foco con anillo ambar suave
- evitar campos negros planos

## 8.4 Tabs, filtros y navegacion
- inactivo: `on_surface_variant`
- hover: `on_surface`
- activo: ambar + subrayado o capsula tonal

## 8.5 Badges y estados
Cada estado del tablero debe usar una familia tonal coherente:

- `datos_importantes`: ambar quemado
- `por_definir`: gris piedra
- `por_hacer`: azul tecnico desaturado
- `haciendo`: naranja activo
- `en_revision`: dorado calido
- `finalizados`: verde musgo luminoso
- `archivados`: gris humo

## 8.6 Avatares
Mantener avatares e iniciales, pero con fondos mas profundos y letras mas claras para evitar perdida de contraste.

---

## 9. Adaptacion por pantalla

## 9.1 Login
Objetivo visual:
una entrada sobria y elegante, con foco total en el formulario.

Propuesta:
- fondo oscuro con gradientes difusos ambar y azul petroleo muy apagado
- tarjeta de login flotante en `surface_container_low`
- logo y marca con mayor protagonismo
- CTA con gradiente ambar
- enlaces secundarios en tono arena/ambar apagado

Sensacion:
exclusiva, limpia, calmada.

## 9.2 Dashboard de proyectos
Objetivo visual:
mostrar proyectos como piezas curatoriales, no como cards SaaS genericas.

Propuesta:
- fondo oscuro amplio con zonas de respiracion
- proyecto destacado con imagen y overlay calido
- cards secundarias en capas oscuras, con hover ascendente
- metricas, fechas y miembros en tonos secundarios suaves
- accion `Crear proyecto` como principal foco cromatico

Sensacion:
galeria operativa premium.

## 9.3 Crear/Gestionar proyecto
Objetivo visual:
formularios comodos para sesiones largas.

Propuesta:
- bloques de formulario en paneles oscuros elevados
- campos con contraste claro y foco ambar
- secciones administrativas con acentos sutiles
- zona de peligro en rojo terroso, no rojo saturado puro

Sensacion:
control, orden y seguridad.

## 9.4 Tablero del proyecto
Objetivo visual:
mejorar escaneo, concentracion y jerarquia entre columnas.

Propuesta:
- fondo general oscuro continuo
- columnas ligeramente diferenciadas por tono
- cards en superficies mas claras que la columna
- card activa o arrastrable con anillo ambar muy tenue
- contadores de columna como capsulas sobrias
- archivados y finalizados con menor contraste para reducir ruido

Sensacion:
workspace nocturno profesional.

## 9.5 Detalle de card
Objetivo visual:
un panel lateral premium con lectura comoda.

Propuesta:
- overlay translucido calido
- panel lateral oscuro elevado
- titulo muy visible
- metadata dentro de bloques tonales
- comentarios en tarjetas ligeras con hover sutil
- CTA de guardar con ambar solido o gradiente controlado

Sensacion:
herramienta editorial de precision.

## 9.6 Administracion de usuarios
Objetivo visual:
reducir frialdad administrativa sin perder claridad.

Propuesta:
- listas y filas sobre paneles oscuros por capas
- acciones secundarias discretas
- roles y estados con chips cromaticos apagados
- altas, bajas y bloqueos con semantica clara

Sensacion:
administracion limpia y confiable.

## 9.7 Perfil / cuenta
Objetivo visual:
mas intimo y personal.

Propuesta:
- layout compacto
- bloque de informacion base en una tarjeta principal
- formulario de contrasena con foco visual claro
- feedbacks de validacion sobrios y consistentes

Sensacion:
espacio personal seguro.

---

## 10. Motion y microinteracciones

### Motion general
El dark mode debe moverse menos, pero mejor.

Propuesta:
- hover por elevacion tonal y ligera sombra
- focus rings suaves
- panel lateral con entrada lateral breve
- stagger muy sutil en grids del dashboard
- nada de brillos agresivos ni rebotes

Duracion recomendada:
- 160ms a 240ms para interacciones comunes
- 260ms a 320ms para overlays y paneles

---

## 11. Accesibilidad visual

### Contraste
- texto principal: ratio alto sobre todas las superficies
- texto secundario: suficiente para lectura, no decorativo
- badges y estados: distinguibles tambien sin depender solo del color
- foco visible en teclado con anillo ambar suave

### Fatiga visual
- evitar negro puro
- evitar blancos puros intensos
- evitar saturacion excesiva del naranja en areas grandes

---

## 12. Que conservar y que evitar

## Conservar
- el lenguaje editorial actual
- la calidez ambar
- los paneles flotantes
- la sensacion de producto premium
- la jerarquia por superficies

## Evitar
- dark mode azul corporativo
- fondos negros absolutos
- bordes blancos o demasiado visibles
- acentos morados
- saturacion excesiva en todas las acciones
- exceso de glow o estetica neon

---

## 13. Resumen ejecutivo

La propuesta de modo oscuro para CardFlow debe sentirse como una extension natural del sistema visual actual, no como una skin aparte.

La direccion correcta es un oscuro calido, profundo y editorial que:
- preserve el ADN ambar de la marca
- mejore el foco en vistas de trabajo extensas
- mantenga la jerarquia por capas y vidrio
- refuerce la sensacion premium ya presente en los mockups existentes

En una frase:
**CardFlow dark mode debe parecer una mesa de trabajo nocturna iluminada por acentos ambar.**
