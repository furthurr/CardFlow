# CardFlow — Pantalla 5: Tablero del Proyecto

## 1. Identificador
`screen_project_board`

## 2. Objetivo
Mostrar el tablero Kanban del proyecto y permitir operar cards por estado.

---

## 3. Acceso
- `admin` puede entrar a cualquier proyecto
- `user` solo a proyectos asignados

---

## 4. Columnas obligatorias
- `datos_importantes`
- `por_definir`
- `por_hacer`
- `haciendo`
- `en_revision`
- `finalizados`
- `archivados`

---

## 5. Datos mínimos de card visibles en tablero
- `id`
- `title`
- `description` resumida
- `assigned_user_id` o nombre del responsable
- `status`

---

## 6. Funciones del MVP
- listar cards por columna
- crear card
- abrir detalle de card
- mover card entre estados

### Nota técnica
El movimiento puede ser:
- drag and drop
- cambio manual de estado

### Recomendación MVP
Si se busca simplicidad, comenzar con cambio manual de estado. Drag and drop es opcional.

---

## 7. Componentes mínimos
- encabezado con nombre del proyecto
- acción para volver al dashboard
- columnas del tablero
- cards visibles
- acción de crear card

---

## 8. Reglas de negocio
- toda card pertenece a un proyecto
- toda card tiene un estado válido
- cualquier miembro del proyecto puede crear y mover cards
- responsable debe pertenecer al proyecto
- columna `archivados` se muestra en el MVP

---

## 9. Endpoints sugeridos
```http
GET /api/projects/:id/board
GET /api/projects/:id/cards
POST /api/projects/:id/cards
PUT /api/cards/:id/status
```

---

## 10. Criterios de aceptación
- se muestran todas las columnas definidas
- se muestran cards agrupadas por estado
- usuario autorizado puede crear card
- usuario autorizado puede abrir card
- usuario autorizado puede mover card
- usuario no autorizado no puede entrar

---

## 11. Restricciones para implementación
- no agregar filtros avanzados en MVP
- no agregar tiempo real
- no agregar etiquetas o subtareas
- mantener foco en simplicidad del board
