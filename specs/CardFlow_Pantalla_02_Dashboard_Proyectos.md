# CardFlow — Pantalla 2: Dashboard de Proyectos

## 1. Identificador
`screen_projects_dashboard`

## 2. Objetivo
Listar los proyectos visibles para el usuario autenticado y servir como punto de entrada principal al sistema.

---

## 3. Reglas de visibilidad
- `admin` ve todos los proyectos
- `user` solo ve proyectos asignados
- usuarios no autorizados no deben poder entrar a proyectos aunque conozcan la URL

---

## 4. Datos mínimos por proyecto
- `id`
- `name`
- `description`
- `is_active`

---

## 5. Componentes mínimos
- encabezado con nombre de usuario y acción de logout
- título de pantalla
- listado o grid de proyectos
- botón `Entrar` por proyecto
- buscador simple opcional
- para `admin`:
  - botón `Crear proyecto`
  - acceso a `Administración de usuarios`
  - acceso a `Gestión de proyecto`

---

## 6. Comportamiento esperado
1. cargar proyectos visibles
2. renderizar listado
3. permitir entrar a un proyecto
4. si es admin, mostrar acciones administrativas
5. si no hay proyectos, mostrar estado vacío

---

## 7. Estados
- cargando
- con proyectos
- sin proyectos
- error

---

## 8. Endpoint sugerido
```http
GET /api/projects
```

### Response
```json
{
  "success": true,
  "projects": [
    {
      "id": 1,
      "name": "Proyecto Alpha",
      "description": "Portal de seguimiento interno",
      "is_active": true
    }
  ]
}
```

---

## 9. Criterios de aceptación
- el usuario llega aquí después del login
- solo se muestran proyectos autorizados
- cada proyecto tiene acción de entrada
- `admin` ve acciones administrativas
- `user` no ve acciones administrativas

---

## 10. Restricciones para implementación
- no mezclar dashboard con tablero operativo
- mantener UI simple y escaneable
- no exponer proyectos no autorizados
