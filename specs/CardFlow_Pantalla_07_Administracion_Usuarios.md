# CardFlow — Pantalla 7: Administración de Usuarios

## 1. Identificador
`screen_users_admin`

## 2. Objetivo
Permitir a un `admin` gestionar usuarios del sistema.

---

## 3. Acceso
- solo `admin`

---

## 4. Funciones del MVP
- listar usuarios
- crear usuario
- editar nombre
- editar username
- cambiar rol
- activar o inactivar usuario

---

## 5. Datos mínimos de usuario
- `id`
- `name`
- `username`
- `role`
- `is_active`

---

## 6. Reglas de negocio
- `username` debe ser único
- solo existen roles `admin` y `user`
- usuario inactivo no puede iniciar sesión
- al inactivar usuario no se elimina su historial

---

## 7. Componentes mínimos
- listado de usuarios
- botón `Crear usuario`
- acción `Editar`
- control de rol
- control de estado

---

## 8. Endpoints sugeridos
```http
GET /api/users
POST /api/users
PUT /api/users/:id
```

---

## 9. Criterios de aceptación
- solo admin puede entrar
- se puede listar usuarios
- se puede crear usuario
- se puede editar rol y estado
- no se puede duplicar `username`

---

## 10. Restricciones para implementación
- no agregar invitaciones por correo
- no agregar permisos granulares
- no agregar recuperación automática de contraseña
