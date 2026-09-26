# 🚚 ShipNow API

API backend desarrollada con **Node.js, Express y MongoDB** para la gestión de una plataforma de logística y envíos llamada **ShipNow**.

El proyecto forma parte del curso **Backend 3 de Coderhouse** y tiene como objetivo aplicar una arquitectura por capas, separación de responsabilidades, configuración mediante variables de entorno, persistencia con MongoDB y generación de datos de prueba mediante Mocking.

---

## 📌 Objetivo del proyecto

ShipNow permite gestionar diferentes entidades relacionadas con una plataforma logística:

- 👤 Usuarios
- 📦 Productos
- 🛒 Pedidos
- 🚚 Entregas
- 🧪 Datos simulados mediante Mocking

El proyecto está organizado utilizando una arquitectura por capas para separar responsabilidades y facilitar:

- Mantenimiento
- Escalabilidad
- Reutilización de código
- Testeo
- Trabajo en equipo
- Evolución futura de la aplicación

---

# 🏗️ Arquitectura

El proyecto utiliza el siguiente flujo:

```text
Request HTTP
     ↓
   Router
     ↓
 Controller
     ↓
   Service
     ↓
 Repository
     ↓
   Model
     ↓
 MongoDB
```

### Router

Se encarga únicamente de definir las rutas y conectar cada endpoint con su controlador correspondiente.

### Controller

Se encarga de:

- Recibir la petición HTTP.
- Obtener información de `req.params`, `req.query` o `req.body`.
- Llamar al Service correspondiente.
- Construir la respuesta HTTP.
- Delegar los errores al middleware centralizado.

Los controladores no contienen consultas directas a MongoDB ni lógica de negocio compleja.

### Service

Contiene la lógica de negocio de la aplicación.

Entre sus responsabilidades se encuentran:

- Validación de datos.
- Validación de estados y prioridades según las constantes del dominio.
- Reglas de negocio.
- Coordinación de operaciones.
- Preparación de datos antes de enviarlos al Repository.

### Repository

Es la capa encargada de comunicarse con los modelos de Mongoose.

Su objetivo es encapsular las operaciones de persistencia.

### Model

Define la estructura de los documentos almacenados en MongoDB mediante Mongoose.

### Config

Centraliza la configuración de la aplicación y la lectura de variables de entorno.

### Constants

Contiene valores constantes utilizados por las reglas del dominio, evitando valores escritos directamente en diferentes partes del código.

---

# 📁 Estructura del proyecto

```text
ShipNow/
│
├── src/
│   │
│   ├── config/
│   │   ├── index.js
│   │   └── database.js
│   │
│   ├── constants/
│   │   └── index.js
│   │
│   ├── controllers/
│   │   ├── product.controller.js
│   │   ├── user.controller.js
│   │   ├── orders.controller.js
│   │   ├── deliveries.controller.js
│   │   └── mocks.controller.js
│   │
│   ├── middleware/
│   │   ├── error.middleware.js
│   │   └── mocks.middleware.js
│   │
│   ├── mocks/
│   │   ├── user.mock.js
│   │   ├── order.mock.js
│   │   └── delivery.mock.js
│   │
│   ├── models/
│   │   ├── product.model.js
│   │   ├── user.model.js
│   │   ├── order.model.js
│   │   └── delivery.model.js
│   │
│   ├── repositories/
│   │   ├── product.repository.js
│   │   ├── user.repository.js
│   │   ├── order.repository.js
│   │   └── delivery.repository.js
│   │
│   ├── routes/
│   │   ├── product.router.js
│   │   ├── user.router.js
│   │   ├── orders.router.js
│   │   ├── deliveries.router.js
│   │   ├── mocks.router.js
│   │   └── index.js
│   │
│   ├── services/
│   │   ├── product.service.js
│   │   ├── user.service.js
│   │   ├── order.service.js
│   │   ├── delivery.service.js
│   │   └── mocks.service.js
│   │
│   ├── utils/
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
```

---

# 👤 Usuarios

Los usuarios representan a las diferentes personas o entidades que participan dentro de ShipNow.

Los roles disponibles son:

```text
admin
customer
driver
store
```

Los repartidores no poseen un modelo independiente.

Un repartidor es un usuario cuyo `role` es:

```text
driver
```

Los usuarios con rol `driver` además pueden tener el campo:

```text
isAvailable
```

que permite representar si están disponibles para recibir entregas.

---

# 📦 Productos

ShipNow también posee una estructura para gestionar productos.

Los productos utilizan estados definidos mediante constantes de dominio:

```text
available
out_of_stock
```

La lógica relacionada con productos está separada en:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Model
```

---

# 🛒 Pedidos

Los pedidos representan las órdenes que deben ser procesadas y posteriormente entregadas.

Cada pedido posee:

- Cliente
- Productos/items
- Dirección de entrega
- Total
- Estado
- Prioridad
- Fecha de creación
- Fecha de actualización

Los estados disponibles son:

```text
created
assigned
picked_up
in_transit
delivered
cancelled
```

Las prioridades disponibles son:

```text
low
normal
high
```

El campo `customer` referencia a un documento de la colección de usuarios.

Los pedidos utilizan referencias de MongoDB mediante:

```text
ObjectId
```

y posteriormente pueden ser obtenidos mediante `populate`.

---

# 🚚 Entregas

Las entregas representan el proceso de distribución de un pedido.

Cada entrega contiene:

- Pedido asociado
- Repartidor asociado
- Estado
- Fecha de creación
- Fecha de actualización

Los estados disponibles son:

```text
pending
assigned
in_transit
delivered
```

El campo `order` referencia al pedido correspondiente.

El campo `driver` referencia a un usuario.

En el flujo de Mocking, el campo `driver` se asigna utilizando usuarios con rol:

```text
driver
```

Las entregas utilizan `populate` para obtener información relacionada del pedido y del repartidor.

---

# 🧪 Mocking

El proyecto incorpora un módulo de **Mocking** para generar datos de prueba sin necesidad de crearlos manualmente.

El módulo permite:

- Generar usuarios simulados.
- Generar pedidos simulados.
- Generar entregas simuladas.
- Insertar usuarios en MongoDB.
- Insertar pedidos en MongoDB.
- Insertar entregas en MongoDB.
- Cargar un conjunto completo de datos relacionados.

La lógica de generación está ubicada en:

```text
src/mocks/
```

Actualmente existen:

```text
user.mock.js
order.mock.js
delivery.mock.js
```

La lógica de coordinación se encuentra en:

```text
src/services/mocks.service.js
```

y los endpoints son administrados por:

```text
src/controllers/mocks.controller.js
```

---

# ⚙️ Parámetros de Mocking

El módulo utiliza las siguientes constantes:

```text
MAX = 50
DEFAULT = 10
DEFAULT_PASSWORD = coder123
```

### Cantidad máxima

Los endpoints de Mocking permiten generar hasta:

```text
50 registros
```

Si se solicita una cantidad superior, la API devuelve un error HTTP `400`.

Por ejemplo:

```text
GET /api/mocks/users?qty=51
```

devuelve un error indicando que la cantidad máxima permitida es 50.

---

# 👤 Generar usuarios simulados

### Endpoint

```http
GET /api/mocks/users
```

Por defecto genera:

```text
10 usuarios
```

También puede especificarse la cantidad:

```http
GET /api/mocks/users?qty=5
```

Ejemplo de respuesta:

```json
{
  "status": "success",
  "message": "Usuarios mock generados correctamente",
  "quantity": 5,
  "payload": [
    {
      "firstName": "Juan",
      "lastName": "Perez",
      "email": "mock.user.123.0@shipnow.test",
      "role": "customer",
      "isAvailable": false
    }
  ]
}
```

Estos datos son simulados y **no se guardan en MongoDB**.

El password no se expone en la respuesta.

---

# 💾 Guardar usuarios simulados

### Endpoint

```http
POST /api/mocks/users
```

Ejemplo:

```http
POST /api/mocks/users?qty=10
```

Este endpoint:

1. Genera usuarios.
2. Los envía al Service.
3. El Service utiliza el Repository.
4. El Repository realiza la inserción en MongoDB.

Los usuarios quedan almacenados en la base de datos.

---

# 🛒 Generar pedidos simulados

### Endpoint

```http
POST /api/mocks/orders
```

Ejemplo:

```http
POST /api/mocks/orders?qty=5
```

Debe recibir los IDs de clientes mediante el body.

Ejemplo:

```json
{
  "customerIds": [
    "ID_CLIENTE_1",
    "ID_CLIENTE_2",
    "ID_CLIENTE_3"
  ]
}
```

El Service utiliza esos IDs para generar pedidos relacionados con usuarios existentes.

Los pedidos generados incluyen:

- Cliente
- Items
- Cantidades
- Precios
- Total
- Dirección
- Estado
- Prioridad

El total se calcula a partir de:

```text
precio × cantidad
```

Los datos generados mediante este endpoint **no se guardan en MongoDB**.

---

# 💾 Guardar pedidos simulados

### Endpoint

```http
POST /api/mocks/orders/seed
```

Ejemplo:

```http
POST /api/mocks/orders/seed?qty=5
```

Body:

```json
{
  "customerIds": [
    "ID_CLIENTE_1",
    "ID_CLIENTE_2",
    "ID_CLIENTE_3"
  ]
}
```

Los pedidos generados son almacenados en MongoDB.

---

# 🚚 Generar entregas simuladas

### Endpoint

```http
POST /api/mocks/deliveries
```

Ejemplo:

```http
POST /api/mocks/deliveries?qty=5
```

Body:

```json
{
  "orderIds": [
    "ID_PEDIDO_1",
    "ID_PEDIDO_2"
  ],
  "driverIds": [
    "ID_DRIVER_1",
    "ID_DRIVER_2"
  ]
}
```

Las entregas generadas relacionan:

```text
Delivery
   ↓
Order
   ↓
Customer
```

y:

```text
Delivery
   ↓
Driver
```

Las entregas generadas mediante este endpoint **no se guardan en MongoDB**.

---

# 💾 Guardar entregas simuladas

### Endpoint

```http
POST /api/mocks/deliveries/seed
```

Ejemplo:

```http
POST /api/mocks/deliveries/seed?qty=5
```

Body:

```json
{
  "orderIds": [
    "ID_PEDIDO_1",
    "ID_PEDIDO_2"
  ],
  "driverIds": [
    "ID_DRIVER_1",
    "ID_DRIVER_2"
  ]
}
```

Las entregas generadas son almacenadas en MongoDB.

---

# 🌱 Seed completo

Para facilitar las pruebas del proyecto existe un endpoint que genera un conjunto completo de información relacionada.

### Endpoint

```http
POST /api/mocks/seed
```

Ejemplo:

```http
POST /api/mocks/seed?qty=10
```

El proceso genera:

```text
Usuarios
   ↓
Clientes + Drivers
   ↓
Pedidos
   ↓
Entregas
```

Es decir, las relaciones se generan de forma coherente.

Por ejemplo:

```text
User
 ├── role: customer
 │
 └── Order
      │
      └── Delivery
            │
            └── User
                 role: driver
```

El endpoint devuelve la cantidad de registros creados:

```json
{
  "status": "success",
  "message": "Datos mock cargados correctamente",
  "quantity": {
    "users": 10,
    "orders": 10,
    "deliveries": 10
  }
}
```

Además, los datos quedan persistidos en MongoDB.

---

# 🔗 Relaciones del Seed

El proceso de carga completa mantiene las relaciones entre las entidades.

### Usuarios

Se generan usuarios con diferentes roles:

```text
customer
driver
store
```

### Pedidos

Cada pedido utiliza un usuario con rol:

```text
customer
```

como cliente.

### Entregas

Cada entrega utiliza:

```text
order
```

para identificar el pedido correspondiente.

Y:

```text
driver
```

para identificar el usuario que realiza la entrega.

El usuario utilizado como repartidor posee:

```text
role: driver
```

---

# 🔒 Protección del módulo Mocking

El módulo de Mocking está protegido mediante un middleware.

Archivo:

```text
src/middleware/mocks.middleware.js
```

Cuando la aplicación funciona en:

```text
NODE_ENV=production
```

los endpoints de Mocking quedan deshabilitados.

Por ejemplo:

```http
GET /api/mocks/users?qty=2
```

devuelve:

```text
403 Forbidden
```

con el mensaje:

```text
El módulo de mocks está deshabilitado en producción
```

Esto evita que los endpoints destinados a pruebas puedan utilizarse accidentalmente en un entorno productivo.

---

# ⚙️ Variables de entorno

La aplicación utiliza variables de entorno para evitar colocar configuraciones sensibles o específicas del entorno directamente en el código.

Archivo:

```text
.env
```

Ejemplo:

```env
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/shipnow
NODE_ENV=development
```

El archivo `.env` no debe subirse al repositorio.

Para indicar las variables necesarias se utiliza:

```text
.env.example
```

Ejemplo:

```env
PORT=
MONGODB_URI=
NODE_ENV=
```

---

# 🗄️ MongoDB

La aplicación utiliza:

```text
MongoDB
```

con:

```text
Mongoose
```

para la definición de modelos y operaciones sobre la base de datos.

La conexión se encuentra centralizada en:

```text
src/config/database.js
```

La URI de conexión se obtiene desde:

```text
process.env.MONGODB_URI
```

o, mediante la configuración central:

```text
config.mongoUri
```

---

# 🧩 Configuración centralizada

El archivo:

```text
src/config/index.js
```

se encarga de:

- Cargar `dotenv`.
- Validar variables de entorno obligatorias.
- Convertir el puerto a número.
- Exportar la configuración utilizada por la aplicación.

Variables obligatorias:

```text
PORT
MONGODB_URI
NODE_ENV
```

Si alguna de estas variables no está configurada, la aplicación genera un error durante el inicio.

---

# 🚨 Manejo centralizado de errores

ShipNow utiliza un middleware centralizado:

```text
src/middleware/error.middleware.js
```

Los Controllers utilizan:

```js
next(error);
```

para delegar los errores al middleware.

El middleware determina el código HTTP utilizando:

```text
error.statusCode
```

Cuando no se especifica un código, utiliza:

```text
500
```

De esta forma se evita repetir lógica de manejo de errores en cada Controller.

---

# 🌐 Rutas principales

Todas las rutas se centralizan en:

```text
src/routes/index.js
```

La aplicación utiliza el prefijo:

```text
/api
```

Por lo tanto, las rutas principales son:

```text
/api/products
/api/users
/api/orders
/api/deliveries
/api/mocks
```

---

# 📋 Endpoints

## Productos

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

---

## Usuarios

```text
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

---

## Pedidos

```text
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PUT    /api/orders/:id
DELETE /api/orders/:id
```

---

## Entregas

```text
GET    /api/deliveries
GET    /api/deliveries/:id
POST   /api/deliveries
PUT    /api/deliveries/:id
DELETE /api/deliveries/:id
```

---

## Mocking

### Generar usuarios sin persistir

```text
GET /api/mocks/users
```

### Guardar usuarios

```text
POST /api/mocks/users
```

### Generar pedidos sin persistir

```text
POST /api/mocks/orders
```

### Guardar pedidos

```text
POST /api/mocks/orders/seed
```

### Generar entregas sin persistir

```text
POST /api/mocks/deliveries
```

### Guardar entregas

```text
POST /api/mocks/deliveries/seed
```

### Seed completo

```text
POST /api/mocks/seed
```

---

# 🧪 Pruebas realizadas

Durante el desarrollo se probaron diferentes escenarios.

### Generación de usuarios

```text
GET /api/mocks/users?qty=5
```

Resultado esperado:

```text
5 usuarios generados
```

---

### Cantidad máxima

```text
GET /api/mocks/users?qty=51
```

Resultado:

```text
400 Bad Request
```

---

### Cantidad inválida

Ejemplos:

```text
GET /api/mocks/users?qty=0
GET /api/mocks/users?qty=abc
```

Resultado:

```text
400 Bad Request
```

---

### Generación de pedidos

```text
POST /api/mocks/orders?qty=5
```

Se verificó:

- Cliente válido.
- Items.
- Cantidades.
- Precios.
- Total calculado.
- Dirección.
- Estado.
- Prioridad.

---

### Persistencia de pedidos

```text
POST /api/mocks/orders/seed?qty=5
```

Se verificó que los pedidos fueran almacenados correctamente en MongoDB.

---

### Generación de entregas

```text
POST /api/mocks/deliveries?qty=5
```

Se verificó:

- Pedido válido.
- Driver válido.
- Estado de entrega.

---

### Persistencia de entregas

```text
POST /api/mocks/deliveries/seed?qty=5
```

Se verificó que las entregas fueran almacenadas correctamente.

---

### Seed completo

```text
POST /api/mocks/seed?qty=10
```

Se verificó la creación de:

```text
10 usuarios
10 pedidos
10 entregas
```

y la coherencia de sus relaciones.

---

### Populate

También se verificó que:

```text
GET /api/orders
```

devuelva los datos del cliente asociado.

Y que:

```text
GET /api/deliveries
```

devuelva:

- Información del pedido.
- Información del cliente.
- Información del repartidor.

---

### Protección en producción

Se verificó que:

```text
NODE_ENV=production
```

deshabilite los endpoints de Mocking.

El resultado fue:

```text
403 Forbidden
```

---

# 🛠️ Instalación

Clonar o descargar el proyecto.

Ingresar al directorio:

```bash
cd ShipNow
```

Instalar dependencias:

```bash
npm install
```

Crear el archivo:

```text
.env
```

a partir de:

```text
.env.example
```

Configurar:

```env
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/shipnow
NODE_ENV=development
```

---

# ▶️ Ejecución

Para iniciar el servidor:

```bash
npm start
```

Para trabajar en modo desarrollo:

```bash
npm run dev
```

El servidor se ejecuta por defecto en:

```text
http://localhost:8080
```

---

# ❤️ Health Check

La API posee una ruta raíz para comprobar que la aplicación está funcionando correctamente.

### Endpoint

```http
GET /
```

Respuesta:

```json
{
  "status": "success",
  "message": "ShipNow API funcionando correctamente"
}
```

---

# 📦 Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- dotenv
- Nodemon

---

# 📜 Scripts disponibles

### Desarrollo

```bash
npm run dev
```

Utiliza Nodemon para reiniciar automáticamente el servidor cuando se detectan cambios.

### Producción / ejecución normal

```bash
npm start
```

Ejecuta:

```text
node server.js
```

---

# 🔐 Buenas prácticas aplicadas

El proyecto aplica diferentes principios de desarrollo backend:

### Separación de responsabilidades

Cada capa posee una responsabilidad específica.

```text
Router
Controller
Service
Repository
Model
```

---

### Variables de entorno

Las configuraciones específicas del entorno se almacenan en:

```text
.env
```

y no directamente en el código.

---

### `.gitignore`

Se excluyen archivos y carpetas que no deben versionarse:

```text
node_modules/
.env
.env.local
.env.*.local
npm-debug.log*
errors.log
```

---

### Constantes de dominio

Los estados y roles se centralizan en:

```text
src/constants/index.js
```

Por ejemplo:

```text
USER_ROLES
PRODUCT_STATUS
ORDER_STATUS
DELIVERY_STATUS
DELIVERY_PRIORITY
DOCUMENT_TYPES
MOCKING_PARAMETERS
```

Esto evita repetir strings directamente en diferentes partes de la aplicación.

---

### Manejo centralizado de errores

Los errores son enviados mediante:

```js
next(error);
```

al middleware:

```text
error.middleware.js
```

---

### Reutilización

La lógica de acceso a MongoDB se concentra en los Repositories.

Esto permite que los Services no dependan directamente de Mongoose.

---

# 🔄 Flujo de una petición

Ejemplo:

```text
POST /api/orders
```

La petición sigue el siguiente flujo:

```text
Cliente
   ↓
Express
   ↓
Router
   ↓
orders.controller.js
   ↓
order.service.js
   ↓
order.repository.js
   ↓
order.model.js
   ↓
MongoDB
```

La respuesta realiza el camino inverso:

```text
MongoDB
   ↓
Repository
   ↓
Service
   ↓
Controller
   ↓
HTTP Response
   ↓
Cliente
```

---

# 🧪 Flujo del Mocking

Para un seed completo:

```text
POST /api/mocks/seed
```

el flujo es:

```text
Request
   ↓
mocks.router.js
   ↓
mocks.middleware.js
   ↓
mocks.controller.js
   ↓
mocks.service.js
   ↓
user.mock.js
order.mock.js
delivery.mock.js
   ↓
Repositories
   ↓
MongoDB
```

Los datos se generan respetando las relaciones entre:

```text
Users
Orders
Deliveries
```

---

# 🎯 Objetivos académicos

Este proyecto fue desarrollado como parte del proceso de aprendizaje de **Backend 3 de Coderhouse**.

Los principales objetivos son aplicar:

- Arquitectura por capas.
- Separación de responsabilidades.
- Configuración centralizada.
- Variables de entorno.
- Constantes de dominio.
- Repositories.
- Services.
- Controllers.
- Routers.
- Models con Mongoose.
- MongoDB.
- Mocking.
- Carga de datos de prueba.
- Relaciones entre documentos.
- Middleware.
- Manejo centralizado de errores.

---

# 🚀 Estado actual del proyecto

Actualmente ShipNow cuenta con:

- ✅ Arquitectura por capas.
- ✅ Configuración mediante variables de entorno.
- ✅ Conexión a MongoDB.
- ✅ Gestión de usuarios.
- ✅ Gestión de productos.
- ✅ Gestión de pedidos.
- ✅ Gestión de entregas.
- ✅ Constantes de dominio.
- ✅ Repositories.
- ✅ Services.
- ✅ Controllers.
- ✅ Routers.
- ✅ Middleware de errores.
- ✅ Middleware de protección para Mocking.
- ✅ Generación de usuarios mock.
- ✅ Generación de pedidos mock.
- ✅ Generación de entregas mock.
- ✅ Persistencia de datos mock.
- ✅ Seed completo de usuarios, pedidos y entregas.
- ✅ Relaciones entre usuarios, pedidos y entregas.
- ✅ Populate de relaciones.
- ✅ Validación de cantidades.
- ✅ Límite máximo de 50 registros para Mocking.
- ✅ Protección de Mocking en producción.
- ✅ README documentado.

---

# 👨‍💻 Autor

**Ivan Sanchez**

Proyecto académico desarrollado para:

**Coderhouse — Backend 3**

Proyecto:

**ShipNow — API de logística**