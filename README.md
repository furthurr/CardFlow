# CardFlow

CardFlow es un portal web de gestion visual de trabajo inspirado en un flujo tipo Kanban. Este repositorio representa un **MVP**: una version inicial, funcional y deliberadamente acotada para validar el flujo principal del producto antes de ampliar alcance, complejidad o infraestructura.

## Enfasis del proyecto

CardFlow **no busca ser una suite completa** en esta etapa. La prioridad del proyecto es construir una base clara, mantenible y util para validar el nucleo del producto:

- autenticacion simple por usuario y contrasena
- roles `admin` y `user`
- gestion basica de proyectos
- asignacion de usuarios a proyectos
- tablero por proyecto con columnas fijas
- cards con responsable principal
- comentarios activos y archivados
- persistencia local con SQLite

En otras palabras: este repo esta pensado como un **MVP funcional**, no como una plataforma final con todas las capacidades imaginables.

## Que incluye este MVP

- login para usuarios activos
- dashboard de proyectos segun rol
- creacion y gestion basica de proyectos
- tablero visual por proyecto
- creacion, edicion y movimiento de cards
- detalle de card con comentarios e historico
- administracion basica de usuarios
- frontend en HTML, CSS y JavaScript vanilla
- backend monolitico con Express
- base de datos SQLite

## Que no incluye todavia

Para mantener el alcance controlado, este MVP **no incluye**:

- registro publico
- recuperacion de contrasena
- notificaciones
- adjuntos
- etiquetas
- subtareas
- time tracking
- dashboards analiticos
- permisos granulares
- tiempo real con websockets

## Stack tecnico

- frontend: HTML + CSS + JavaScript vanilla
- backend: Node.js + Express
- base de datos: SQLite
- autenticacion: sesion con `express-session`
- acceso a datos: `better-sqlite3`

## Estructura del proyecto

- `frontend/`: interfaz y logica del cliente
- `backend/`: servidor, endpoints y acceso a datos
- `database/`: esquema y base de datos SQLite
- `design/`: referencias visuales, mockups y propuestas UI
- `specs/`: documentacion funcional y tecnica del MVP

## Scripts disponibles

```bash
npm install
npm run dev
npm start
npm run db:seed
```

## Como ejecutar el proyecto

1. Instala dependencias:

```bash
npm install
```

2. Levanta la aplicacion en desarrollo:

```bash
npm run dev
```

3. O ejecuta en modo normal:

```bash
npm start
```

## Documentacion

La documentacion base del MVP vive en `specs/`.

Archivos clave:

- `specs/CardFlow_Documento_Base.md`
- `specs/CardFlow_Aspectos_Tecnicos.md`
- `specs/CardFlow_Indice_Documentacion.md`
- `specs/CardFlow_Propuesta_Modo_Oscuro.md`

## Estado actual

Este proyecto esta en fase de **MVP inicial**. Eso significa:

- el foco esta en validar el flujo principal
- la arquitectura prioriza simplicidad sobre sobreingenieria
- la UI ya tiene direccion visual definida, pero puede evolucionar
- algunas areas aun deben pulirse, refactorizarse o endurecerse para produccion

## Objetivo del repositorio

El objetivo de CardFlow es servir como una base solida para crecer por fases. Primero se valida el producto minimo funcional; despues se podran incorporar mejoras de experiencia, seguridad, permisos mas finos y capacidades avanzadas.

Si revisas este proyecto, hazlo entendiendo su contexto correcto: **CardFlow hoy es un MVP, intencionalmente limitado, pero ya util y extensible.**
