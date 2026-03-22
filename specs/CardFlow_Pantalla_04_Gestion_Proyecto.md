# CardFlow — Pantalla 4: Gestión de Proyecto

## 1. Identificador
`screen_project_manage`

## 2. Objetivo
Permitir a un `admin` editar datos básicos del proyecto y administrar usuarios asignados.

---

## 3. Acceso
- solo `admin`

---

## 4. Funciones del MVP
- editar `name`
- editar `description`
- cambiar `is_active`
- listar miembros asignados
- agregar usuario al proyecto
- remover usuario del proyecto

---

## 5. Componentes mínimos
- encabezado con nombre del proyecto
- formulario de datos generales
- lista de miembros
- selector o buscador de usuario para agregar
- acción de remover usuario
- botón `Guardar cambios`

---

## 6. Reglas de negocio
- no duplicar asignaciones
- remover usuario debe quitar acceso al proyecto
- solo se pueden asignar usuarios existentes
- `admin` puede ver y modificar cualquier proyecto

---

## 7. Endpoints sugeridos
```http
GET /api/projects/:id
GET /api/projects/:id/users
PUT /api/projects/:id
POST /api/projects/:id/users
DELETE /api/projects/:id/users/:userId
```

---

## 8. Criterios de aceptación
- la pantalla muestra datos actuales del proyecto
- la pantalla muestra miembros actuales
- se puede agregar miembro
- se puede remover miembro
- no se puede duplicar miembro
- los cambios persisten en SQLite

---

## 9. Restricciones para implementación
- no mezclar esta pantalla con el tablero operativo
- no introducir permisos granulares todavía
