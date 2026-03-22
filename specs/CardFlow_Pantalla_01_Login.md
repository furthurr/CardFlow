# CardFlow — Pantalla 1: Login

## 1. Identificador
`screen_login`

## 2. Objetivo
Autenticar a un usuario activo del sistema mediante `username` y `password`.

---

## 3. Reglas del MVP
- solo login por `username`
- no usar correo
- no permitir registro público
- no permitir recuperación de contraseña
- misma pantalla para `admin` y `user`

---

## 4. Entradas
Campos requeridos:
- `username`
- `password`

---

## 5. Componentes mínimos
- logo o nombre del producto
- input `username`
- input `password`
- botón `Iniciar sesión`
- área de error
- estado de carga

---

## 6. Comportamiento esperado
1. mostrar formulario vacío
2. validar campos requeridos en frontend
3. enviar credenciales al backend
4. si credenciales son válidas:
   - crear sesión
   - redirigir a `screen_projects_dashboard`
5. si credenciales son inválidas:
   - mostrar error
   - permanecer en la pantalla

---

## 7. Validaciones
### Frontend
- `username` requerido
- `password` requerido

### Backend
- usuario existe
- contraseña correcta
- usuario activo

---

## 8. Casos de error
- campos vacíos
- credenciales inválidas
- cuenta inactiva
- error de servidor

---

## 9. Endpoint sugerido
```http
POST /api/auth/login
```

### Request
```json
{
  "username": "pedro",
  "password": "123456"
}
```

### Response éxito
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Pedro Gómez",
    "username": "pedro",
    "role": "admin"
  }
}
```

### Response error
```json
{
  "success": false,
  "message": "Las credenciales no son válidas"
}
```

---

## 10. Criterios de aceptación
- debe existir input de usuario
- debe existir input de contraseña
- no debe enviar con campos vacíos
- debe redirigir al dashboard al autenticarse
- debe mostrar error claro si falla el login

---

## 11. Restricciones para implementación
- no agregar login social
- no agregar recuperación de contraseña
- no agregar login por correo
- UI simple, centrada y limpia
