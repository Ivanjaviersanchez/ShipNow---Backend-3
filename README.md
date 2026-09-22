# ShipNow 🚚

API de logística desarrollada con Node.js, Express y MongoDB.

Proyecto correspondiente al Backend 3 de Coderhouse.

---

## 📌 Objetivo

ShipNow es una API backend orientada a la gestión de usuarios y productos.

El proyecto está organizado utilizando una arquitectura por capas para separar responsabilidades y facilitar:

- Mantenimiento
- Escalabilidad
- Testeo
- Reutilización de código
- Lectura y comprensión del proyecto

---

## 🏗️ Arquitectura

El proyecto utiliza el siguiente flujo:

Request HTTP → Router → Controller → Service → Repository → Model → MongoDB

### Router

Define los endpoints disponibles y conecta cada ruta con su Controller.

No contiene lógica de negocio ni acceso directo a MongoDB.

### Controller

Es responsable de recibir la petición HTTP, obtener los datos necesarios y devolver la respuesta.

No contiene consultas a MongoDB ni lógica de negocio.

### Service

Contiene la lógica de negocio de la aplicación.

Por ejemplo:

- Validación de datos
- Validación de roles
- Control de emails duplicados
- Determinación del estado de un producto
- Reglas relacionadas con usuarios y productos

El Service no depende de Express (`req` o `res`).

### Repository

Es la única capa que conoce Mongoose y MongoDB.

Su responsabilidad es realizar las operaciones de acceso a datos.

### Model

Define la estructura de los documentos y las reglas propias de Mongoose.

### Config

Centraliza las variables de entorno y valida que las variables críticas estén configuradas.

### Constants

Centraliza valores utilizados por el dominio, como roles y estados.

---

## 📁 Estructura del proyecto

```text
ShipNow/
│
├── src/
│   ├── config/
│   │   ├── index.js
│   │   └── database.js
│   │
│   ├── constants/
│   │   └── index.js
│   │
│   ├── controllers/
│   │   ├── product.controller.js
│   │   └── user.controller.js
│   │
│   ├── middleware/
│   │   └── error.middleware.js
│   │
│   ├── models/
│   │   ├── product.model.js
│   │   └── user.model.js
│   │
│   ├── repositories/
│   │   ├── product.repository.js
│   │   └── user.repository.js
│   │
│   ├── routes/
│   │   ├── product.router.js
│   │   └── user.router.js
│   │
│   ├── services/
│   │   ├── product.service.js
│   │   └── user.service.js
│   │
│   └── app.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js