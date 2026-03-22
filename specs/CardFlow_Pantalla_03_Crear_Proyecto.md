# CardFlow — Pantalla 3: Crear Proyecto

## 1. Identificador
`screen_project_create`

## 2. Objetivo
Permitir a un `admin` crear un proyecto nuevo con información básica.

---

## 3. Acceso
- solo `admin`

---

## 4. Entradas
- `name` requerido
- `description` opcional
- `is_active` requerido, default `true`

---

## 5. Componentes mínimos
- título de pantalla
- input `name`
- textarea `description`
- control de estado inicial
- botón `Guardar proyecto`
- botón `Cancelar`

---

## 6. Comportamiento esperado
1. validar nombre
2. guardar proyecto
3. registrar `created_by`
4. redirigir a `screen_project_manage` o al dashboard

### Decisión recomendada
Después de crear proyecto, redirigir a `screen_project_manage`.

---

## 7. Endpoint sugerido
```http
POST /api/projects
```

### Request
```json
{
  "name": "Proyecto Alpha",
  "description": "Seguimiento interno",
  "is_active": true
}
```

---

## 8. Criterios de aceptación
- solo `admin` puede entrar
- nombre obligatorio
- proyecto debe persistirse correctamente
- debe guardarse el usuario creador
- cancelar debe regresar sin guardar

---

## 9. Restricciones para implementación
- no agregar configuraciones avanzadas
- no agregar plantillas
- formulario corto y directo
