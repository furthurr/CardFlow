# CardFlow — Especificación Base del Proyecto

## 1. Propósito
CardFlow es un portal web sencillo para gestión visual de trabajo, inspirado en un tablero tipo Kanban. Su propósito es permitir que usuarios autenticados trabajen dentro de proyectos a los que fueron asignados, mediante cards organizadas por estados.

Este documento está redactado para servir como base de implementación para una IA o equipo técnico.

---

## 2. Objetivo del MVP
Construir una aplicación web funcional con las siguientes capacidades:

- autenticación por usuario y contraseña
- roles `admin` y `user`
- creación de proyectos solo por admin
- asignación de usuarios a proyectos solo por admin
- acceso restringido a proyectos por asignación
- tablero por proyecto con columnas fijas
- creación, edición y movimiento de cards
- un responsable principal por card
- comentarios activos y comentarios archivados
- histórico de comentarios archivados
- persistencia en SQLite

---

## 3. Alcance funcional del MVP

### Incluye
- login
- gestión básica de usuarios
- gestión básica de proyectos
- asignación de usuarios a proyectos
- tablero visual por proyecto
- cards con título, descripción, estado y responsable
- comentarios activos
- archivado de comentarios
- consulta de histórico de comentarios archivados

### No incluye
- recuperación de contraseña
- registro público
- notificaciones
- adjuntos
- etiquetas
- subtareas
- time tracking
- dashboards analíticos
- permisos granulares
- tiempo real con websockets

---

## 4. Roles

### 4.1 Admin
Permisos del rol `admin`:
- crear proyectos
- editar proyectos
- activar o inactivar proyectos
- asignar usuarios a proyectos
- retirar usuarios de proyectos
- administrar usuarios del sistema
- ver todos los proyectos
- entrar a cualquier proyecto
- crear, editar y mover cards
- asignar responsable a cards
- comentar y archivar comentarios

### 4.2 User
Permisos del rol `user`:
- iniciar sesión
- ver únicamente proyectos asignados
- entrar únicamente a proyectos asignados
- crear cards dentro de proyectos asignados
- editar cards dentro de proyectos asignados
- mover cards entre estados
- asignar o reasignar responsable dentro del mismo proyecto
- comentar y archivar comentarios

---

## 5. Reglas de acceso
- Todo usuario debe autenticarse.
- Solo `admin` puede crear proyectos.
- Solo `admin` puede asignar usuarios a proyectos.
- Solo usuarios asignados al proyecto pueden entrar a un proyecto.
- `admin` puede ver y entrar a todos los proyectos.
- Solo usuarios activos pueden iniciar sesión.
- Un usuario no asignado no debe poder acceder a un proyecto, incluso si conoce la URL.

---

## 6. Estados del tablero
Estados fijos del MVP:

1. `datos_importantes`
2. `por_definir`
3. `por_hacer`
4. `haciendo`
5. `en_revision`
6. `finalizados`
7. `archivados`

### Regla de implementación
- Estos estados deben ser tratados como un conjunto controlado.
- No permitir estados libres definidos por usuarios.
- Para el MVP, el estado `archivados` se mostrará como columna visible del tablero.

---

## 7. Definición de entidades

### 7.1 Usuario
Campos mínimos:
- id
- name
- username
- password_hash
- role
- is_active
- created_at
- updated_at

### 7.2 Proyecto
Campos mínimos:
- id
- name
- description
- created_by
- is_active
- created_at
- updated_at

### 7.3 Relación proyecto-usuario
Relación muchos a muchos:
- id
- project_id
- user_id
- assigned_at

### 7.4 Card
Campos mínimos:
- id
- project_id
- title
- description
- status
- created_by
- assigned_user_id
- position
- is_archived
- created_at
- updated_at

### 7.5 Comentario
Campos mínimos:
- id
- card_id
- user_id
- content
- is_archived
- created_at
- updated_at
- archived_at

---

## 8. Decisiones funcionales ya cerradas

### 8.1 Login
- solo por `username` + `password`
- no se permite login con correo
- no existe registro público
- no existe recuperación de contraseña en MVP

### 8.2 Proyectos
- usuarios normales solo ven proyectos asignados
- admin ve todos los proyectos

### 8.3 Cards
- una card tiene un solo responsable principal en MVP
- cualquier miembro del proyecto puede reasignar la card a otro miembro del mismo proyecto
- cualquier miembro del proyecto puede crear y mover cards

### 8.4 Comentarios
- existen comentarios activos y comentarios archivados
- comentarios archivados no se muestran por defecto
- comentarios archivados deben poder consultarse desde histórico
- comentarios archivados pueden reactivarse en una fase posterior; para MVP basta con archivarlos y mostrarlos en histórico

---

## 9. Reglas de negocio
- una card debe pertenecer siempre a un proyecto
- una card debe tener título obligatorio
- una card puede tener descripción vacía
- una card solo puede asignarse a un usuario del mismo proyecto
- un comentario siempre pertenece a una card
- un comentario archivado no debe mostrarse en la vista principal
- un proyecto inactivo puede consultarse, pero no debe aceptar nuevas cards si así se implementa la regla de negocio
- al inactivar un usuario, su historial de trabajo debe conservarse

---

## 10. Navegación principal
Flujo principal:

1. Login
2. Dashboard de proyectos
3. Tablero del proyecto
4. Detalle de card

Flujo admin:
1. Login
2. Dashboard de proyectos
3. Crear proyecto o gestionar proyecto
4. Administración de usuarios

---

## 11. Lista de pantallas del MVP
1. Login
2. Dashboard de proyectos
3. Crear proyecto
4. Gestión de proyecto
5. Tablero del proyecto
6. Detalle de card
7. Administración de usuarios
8. Perfil / cuenta

---

## 12. Modelo técnico recomendado
Stack recomendado para el MVP:

- frontend: HTML + CSS + JavaScript vanilla
- backend: Node.js + Express
- base de datos: SQLite
- autenticación: sesión con cookie o JWT simple
- persistencia: acceso a SQLite con librería ligera o driver nativo

### Justificación
Este stack minimiza complejidad y es suficiente para el alcance del MVP.

---

## 13. Restricciones para la IA implementadora
La IA que genere el proyecto debe respetar estas restricciones:

- no introducir frameworks innecesarios si no aportan valor real
- no introducir microservicios
- no introducir base de datos externa en MVP
- no introducir TypeScript si no se solicita explícitamente
- no introducir dependencias pesadas para UI
- priorizar claridad, mantenibilidad y simplicidad

---

## 14. Resultado esperado
Se espera una aplicación web simple, funcional y mantenible, con interfaz limpia y flujo de trabajo tipo board, lista para crecer en futuras fases sin sobreingeniería en el MVP.
