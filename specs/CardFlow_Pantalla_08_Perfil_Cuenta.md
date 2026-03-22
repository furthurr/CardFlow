# CardFlow — Pantalla 8: Perfil / Cuenta

## 1. Identificador
`screen_account_profile`

## 2. Objetivo
Permitir que el usuario consulte sus datos básicos y cambie su contraseña.

---

## 3. Funciones del MVP
- mostrar `name`
- mostrar `username`
- mostrar `role`
- mostrar `is_active`
- cambiar contraseña

---

## 4. Reglas
- cada usuario solo edita su propia cuenta
- para cambiar contraseña debe ingresar contraseña actual
- nueva contraseña y confirmación deben coincidir

---

## 5. Componentes mínimos
- bloque de datos básicos
- input `current_password`
- input `new_password`
- input `confirm_new_password`
- botón `Guardar cambios`

---

## 6. Endpoints sugeridos
```http
GET /api/me
PUT /api/me/password
```

---

## 7. Criterios de aceptación
- usuario puede ver sus datos
- usuario puede cambiar contraseña
- no se guarda si la confirmación no coincide
- no se guarda si contraseña actual es inválida

---

## 8. Restricciones para implementación
- no agregar edición compleja de perfil
- no agregar avatar
- no agregar preferencias avanzadas
