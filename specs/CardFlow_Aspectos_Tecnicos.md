# CardFlow — Aspectos Técnicos del MVP

## 1. Objetivo de este documento
Definir la arquitectura técnica recomendada para implementar CardFlow de forma simple, estable y adecuada al alcance del MVP.

Este documento está orientado a una IA implementadora.

---

## 2. Respuesta corta
Sí, CardFlow puede construirse únicamente con:

- SQLite para persistencia
- JavaScript para programación
- CSS para estilos
- HTML para estructura de vistas

Sin embargo, para que el proyecto sea realmente funcional también se requiere un backend HTTP que maneje:
- autenticación
- autorización
- lógica de negocio
- acceso a SQLite

### Recomendación del proyecto
Usar:

- **Frontend:** HTML + CSS + JavaScript vanilla
- **Backend:** Node.js + Express
- **Base de datos:** SQLite

---

## 3. Stack recomendado

### 3.1 Frontend
- HTML
- CSS
- JavaScript vanilla

### 3.2 Backend
- Node.js
- Express

### 3.3 Base de datos
- SQLite

### 3.4 Autenticación
Dos opciones válidas para MVP:
- sesión basada en cookie
- JWT simple

### Recomendación
Para simplicidad del MVP, preferir sesión tradicional con cookie o JWT simple de baja complejidad. Cualquiera es válida si la implementación se mantiene clara.

---

## 4. Por qué no basta solo con SQLite + JS + CSS
SQLite por sí sola solo resuelve almacenamiento.  
CSS solo resuelve presentación.  
JavaScript del navegador por sí solo no debe encargarse de:
- validar credenciales directamente contra base de datos
- proteger rutas
- decidir permisos
- ejecutar lógica de acceso
- escribir directamente en SQLite desde el cliente

Por lo tanto, se requiere un backend intermedio.

---

## 5. Arquitectura mínima sugerida

### 5.1 Estructura de capas
- `frontend/`
- `backend/`
- `database/`

### 5.2 Responsabilidades

#### Frontend
- render de pantallas
- formularios
- llamadas HTTP al backend
- navegación entre vistas
- validación básica de campos
- feedback visual

#### Backend
- autenticación
- autorización
- reglas de negocio
- endpoints REST
- acceso a SQLite
- validación segura
- control de sesión o token

#### SQLite
- persistencia de usuarios
- persistencia de proyectos
- persistencia de cards
- persistencia de comentarios
- persistencia de asignaciones

---

## 6. Modelo de desarrollo recomendado
No usar sobreingeniería en MVP.

### Recomendado
- app monolítica
- backend Express simple
- frontend simple
- SQLite local
- rutas REST claras

### No recomendado para MVP
- microservicios
- GraphQL
- websockets
- event sourcing
- CQRS
- arquitectura distribuida
- SSR complejo
- frameworks UI pesados sin necesidad

---

## 7. Estructura de proyecto sugerida
```text
cardflow/
  backend/
    app.js
    routes/
    controllers/
    services/
    middleware/
    db/
    utils/
  frontend/
    index.html
    assets/
    css/
    js/
    pages/
    components/
  database/
    cardflow.sqlite
    schema.sql
  docs/
```

---

## 8. Librerías mínimas sugeridas

### Backend
- `express`
- `sqlite3` o `better-sqlite3`
- `bcrypt` para hash de contraseñas
- `express-session` o `jsonwebtoken` según estrategia elegida
- `cors` si frontend y backend se sirven por separado

### Frontend
No son obligatorias librerías adicionales.  
Puede hacerse en JavaScript vanilla.

---

## 9. Recomendaciones de implementación

### 9.1 Base de datos
- usar SQLite con esquema explícito
- crear script `schema.sql`
- usar claves foráneas
- almacenar contraseñas solo como hash

### 9.2 Backend
- separar rutas, lógica y acceso a datos
- crear middleware de autenticación
- crear middleware de autorización por rol
- validar acceso por proyecto en backend, no solo en frontend

### 9.3 Frontend
- mantener vistas simples
- reutilizar componentes básicos
- centralizar llamadas API
- no mezclar demasiada lógica de negocio en el cliente

---

## 10. Seguridad mínima requerida
- hash de contraseñas con bcrypt
- no almacenar contraseñas en texto plano
- validar sesión en endpoints protegidos
- validar rol admin en endpoints administrativos
- validar pertenencia a proyecto antes de devolver tablero, cards o comentarios

---

## 11. Persistencia y escalabilidad
SQLite es suficiente para el MVP porque:
- no requiere servidor separado
- es simple de desplegar
- es fácil de respaldar
- funciona bien para bajo o mediano volumen

### Limitación
Si CardFlow crece mucho en concurrencia o tamaño, la migración natural futura sería a PostgreSQL.

---

## 12. Decisiones técnicas recomendadas y cerradas
- lenguaje principal: JavaScript
- estilos: CSS
- vistas: HTML
- backend: Node.js + Express
- base de datos: SQLite
- sin framework frontend obligatorio en MVP
- sin TypeScript obligatorio en MVP

---

## 13. Qué debe hacer la IA implementadora
La IA debe generar un proyecto que:
- sea monolítico y simple
- use SQLite correctamente
- respete roles y permisos
- exponga endpoints claros
- implemente las pantallas documentadas
- no agregue complejidad innecesaria
- no cambie el stack sin justificación explícita

---

## 14. Resultado esperado
Se espera un proyecto sencillo, mantenible y funcional, con frontend básico, backend claro y SQLite como persistencia principal, suficiente para cubrir el MVP definido de CardFlow.
