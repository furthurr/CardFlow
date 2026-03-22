# CardFlow — Pantalla 6: Detalle de Card

## 1. Identificador
`screen_card_detail`

## 2. Objetivo
Permitir editar la información completa de una card y gestionar comentarios activos e históricos.

---

## 3. Forma recomendada de implementación
- modal amplio
o
- panel lateral

### Recomendación MVP
Preferir modal o panel lateral para no sacar al usuario del tablero.

---

## 4. Funciones del MVP
- editar `title`
- editar `description`
- cambiar `status`
- cambiar `assigned_user_id`
- ver comentarios activos
- crear comentario
- archivar comentario
- ver histórico de comentarios archivados

---

## 5. Componentes mínimos
- campo título editable
- campo descripción editable
- selector de estado
- selector de responsable
- metadata básica
- lista de comentarios activos
- formulario de nuevo comentario
- acción `Archivar comentario`
- acción `Ver histórico`

---

## 6. Reglas de negocio
- título obligatorio
- responsable debe ser miembro del proyecto
- comentario no puede guardarse vacío
- comentarios archivados no se muestran en lista activa
- usuarios del proyecto pueden editar cards en MVP

---

## 7. Endpoints sugeridos
```http
GET /api/cards/:id
PUT /api/cards/:id
GET /api/cards/:id/comments
POST /api/cards/:id/comments
PUT /api/comments/:id/archive
GET /api/cards/:id/comments/history
```

---

## 8. Criterios de aceptación
- se puede abrir desde el tablero
- se puede editar título y descripción
- se puede cambiar estado
- se puede cambiar responsable
- se puede crear comentario
- se puede archivar comentario
- se puede consultar histórico

---

## 9. Restricciones para implementación
- no agregar adjuntos
- no agregar menciones
- no agregar rich text
- mantener edición simple y directa
