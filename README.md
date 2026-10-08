# 🚚 ShipNow API

API backend desarrollada con **Node.js, Express y MongoDB** para la gestión de una plataforma de logística y envíos llamada **ShipNow**.

El proyecto forma parte del curso **Backend 3 de Coderhouse** y tiene como objetivo aplicar:

- Arquitectura por capas.
- Separación de responsabilidades.
- Configuración mediante variables de entorno.
- Persistencia con MongoDB y Mongoose.
- Repositories y Services.
- Controllers y Routers.
- Mocking y generación de datos de prueba.
- Manejo centralizado de errores.
- Logging profesional mediante Winston.
- Documentación de API mediante OpenAPI y Swagger UI.

---

# 📌 Objetivo del proyecto

ShipNow permite gestionar diferentes entidades relacionadas con una plataforma logística:

- 👤 Usuarios
- 📦 Productos
- 🛒 Pedidos
- 🚚 Entregas
- 🧪 Datos simulados mediante Mocking
- 📋 Logs de aplicación y errores

El proyecto utiliza una arquitectura por capas para facilitar:

- Mantenimiento.
- Escalabilidad.
- Reutilización de código.
- Testeo.
- Trabajo en equipo.
- Evolución futura de la aplicación.
- Separación clara de responsabilidades.

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

## Router

Se encarga de definir las rutas y conectar cada endpoint con el controlador correspondiente.

Los Routers no contienen lógica de negocio ni consultas directas a MongoDB.

---

## Controller

Se encarga de:

- Recibir la petición HTTP.
- Obtener información de `req.params`, `req.query` o `req.body`.
- Llamar al Service correspondiente.
- Construir la respuesta HTTP.
- Delegar los errores al middleware centralizado mediante `next(error)`.

Los Controllers no contienen consultas directas a MongoDB ni lógica de negocio compleja.

---

## Service

Contiene la lógica de negocio de la aplicación.

Entre sus responsabilidades se encuentran:

- Validación de datos.
- Validación de estados y prioridades.
- Aplicación de reglas de negocio.
- Coordinación de operaciones.
- Preparación de datos antes de enviarlos al Repository.
- Detección y generación de errores de dominio.
- Generación de logs relacionados con operaciones importantes cuando corresponde.

Los Services utilizan `createAppError()` para generar errores controlados.

---

## Repository

Es la capa encargada de comunicarse con los modelos de Mongoose.

Su objetivo es encapsular las operaciones de persistencia y evitar que los Services dependan directamente de Mongoose.

---

## Model

Define la estructura de los documentos almacenados en MongoDB mediante Mongoose.

---

## Config

Centraliza la configuración de la aplicación y la lectura de variables de entorno.

---

## Constants

Contiene valores constantes utilizados por las reglas del dominio, evitando valores escritos directamente en diferentes partes del código.

---

## Logger

ShipNow utiliza **Winston** como sistema centralizado de logging.

El logger se encuentra en:

```text
src/utils/logger.js
```

Permite:

- Diagnóstico durante el desarrollo.
- Seguimiento de operaciones.
- Registro de errores.
- Registro de eventos importantes.
- Persistencia de errores.
- Rotación automática de archivos de log.
- Diferenciación de niveles según el entorno.
- Diferenciación visual de los niveles mediante colores en la salida de consola.

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
│   │   ├── mocks.controller.js
│   │   └── logger.controller.js
│   │
│   ├── docs/
│   │   ├── swagger.config.js
│   │   ├── schemas.yaml
│   │   ├── users.yaml
│   │   ├── orders.yaml
│   │   ├── deliveries.yaml
│   │   ├── mocks.yaml
│   │   └── logger.yaml
│   │
│   ├── middleware/
│   │   ├── error.middleware.js
│   │   ├── mocks.middleware.js
│   │   └── notFound.middleware.js
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
│   │   ├── logger.router.js
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
│   │   ├── errors.js
│   │   └── logger.js
│   │
│   └── app.js
│
├── logs/
│   └── error-YYYY-MM-DD.log
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

> La carpeta `logs/` se genera automáticamente cuando la aplicación necesita persistir registros. Los archivos generados no se versionan en Git.

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

- Cliente.
- Productos/items.
- Dirección de entrega.
- Total.
- Estado.
- Prioridad.
- Fecha de creación.
- Fecha de actualización.

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

Los pedidos utilizan referencias de MongoDB mediante `ObjectId`.

---

# 🚚 Entregas

Las entregas representan el proceso de distribución de un pedido.

Cada entrega contiene:

- Pedido asociado.
- Repartidor asociado.
- Estado.
- Fecha de creación.
- Fecha de actualización.

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

Las relaciones pueden ser obtenidas mediante `populate`.

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

## Cantidad máxima

Los endpoints de Mocking permiten generar hasta:

```text
50 registros
```

Si se solicita una cantidad superior, la API devuelve un error HTTP `400`.

Ejemplo:

```http
GET /api/mocks/users?qty=51
```

---

# 👤 Generar usuarios simulados

## Endpoint

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

Estos datos son simulados y no se guardan en MongoDB.

---

# 💾 Guardar usuarios simulados

## Endpoint

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

## Endpoint

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

Los pedidos generados incluyen:

- Cliente.
- Items.
- Cantidades.
- Precios.
- Total.
- Dirección.
- Estado.
- Prioridad.

Los datos generados mediante este endpoint no se guardan en MongoDB.

---

# 💾 Guardar pedidos simulados

## Endpoint

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

## Endpoint

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

Las entregas generadas mediante este endpoint no se guardan en MongoDB.

---

# 💾 Guardar entregas simuladas

## Endpoint

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

## Endpoint

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

Las relaciones se generan de forma coherente.

---

# 🔒 Protección del módulo Mocking

El módulo de Mocking está protegido mediante:

```text
src/middleware/mocks.middleware.js
```

Cuando la aplicación funciona en:

```text
NODE_ENV=production
```

los endpoints de Mocking quedan deshabilitados.

La API devuelve HTTP `403` con una respuesta centralizada.

Ejemplo:

```json
{
  "status": "error",
  "error": "FORBIDDEN",
  "message": "No tenés permisos para realizar esta operación"
}
```

Esto evita que los endpoints destinados a pruebas puedan utilizarse accidentalmente en un entorno productivo.

---

# 🚨 Manejo centralizado de errores

A partir de la Pre-entrega 3, ShipNow incorpora un sistema centralizado para el manejo de errores.

La arquitectura utiliza:

```text
Service / Middleware
        ↓
    AppError
        ↓
    next(error)
        ↓
error.middleware.js
        ↓
      Logger
        ↓
 HTTP Response
```

El middleware principal se encuentra en:

```text
src/middleware/error.middleware.js
```

---

# 🧩 Errores personalizados

Los errores personalizados se encuentran centralizados en:

```text
src/utils/errors.js
```

Este archivo contiene:

- `AppError`
- `ERROR_DEFINITIONS`
- `createAppError()`

Los Services utilizan `createAppError()` para generar errores controlados.

Ejemplo:

```js
throw createAppError("USER_NOT_FOUND");
```

---

# 📚 Diccionario de errores

## Usuarios

```text
USER_NOT_FOUND
USER_ALREADY_EXISTS
INVALID_USER_ROLE
```

## Productos

```text
PRODUCT_NOT_FOUND
PRODUCT_VALIDATION_ERROR
```

## Pedidos

```text
ORDER_NOT_FOUND
ORDER_ITEMS_REQUIRED
INVALID_ORDER_STATUS
```

## Entregas

```text
DELIVERY_NOT_FOUND
INVALID_DELIVERY_STATUS
```

## Mocking

```text
INVALID_MOCK_AMOUNT
```

## Sistema

```text
DATABASE_ERROR
INTERNAL_SERVER_ERROR
ROUTE_NOT_FOUND
FORBIDDEN
```

---

# 📋 Formato estándar de errores

Las respuestas de error utilizan un formato uniforme:

```json
{
  "status": "error",
  "error": "ERROR_CODE",
  "message": "Mensaje claro para el cliente"
}
```

En entorno `development` pueden incluir información adicional para facilitar el diagnóstico.

---

# 🌐 Rutas inexistentes

ShipNow posee un middleware específico para manejar rutas que no existen.

Archivo:

```text
src/middleware/notFound.middleware.js
```

Cuando se solicita una ruta inexistente, el middleware genera:

```text
ROUTE_NOT_FOUND
```

La respuesta utiliza HTTP `404`.

---

# 📋 Logging con Winston

A partir de la Pre-entrega 4, ShipNow incorpora un sistema profesional de logging mediante **Winston**.

El objetivo del logging es permitir:

- Observar el comportamiento de la aplicación.
- Facilitar el diagnóstico de problemas.
- Conservar información importante sobre errores.
- Registrar operaciones relevantes.
- Mantener archivos de errores históricos.
- Diferenciar visualmente los niveles de log en consola.

El logger está centralizado en:

```text
src/utils/logger.js
```

---

# 🧰 Dependencias de Logging

Las dependencias utilizadas son:

```text
winston
winston-daily-rotate-file
```

---

# 📊 Niveles de Logging

ShipNow utiliza seis niveles personalizados:

```text
debug
http
info
warning
error
fatal
```

## `debug`

Información detallada útil durante el desarrollo.

## `http`

Información relacionada con solicitudes y operaciones HTTP.

## `info`

Información general del funcionamiento de la aplicación.

Ejemplos:

```text
MongoDB conectado correctamente
ShipNow corriendo en puerto 8080
Entorno: development
```

## `warning`

Situaciones que requieren atención pero no representan un error crítico.

## `error`

Errores que afectan una operación determinada.

## `fatal`

Errores críticos que requieren especial atención.

---

# 🎨 Colores del Logger

Durante el desarrollo, los niveles del logger se muestran con colores diferenciados en la consola para facilitar su identificación visual.

La configuración se realiza mediante `winston.format.colorize()` y colores personalizados para los niveles:

```text
fatal
error
warning
info
http
debug
```

Los colores se aplican únicamente a la salida de consola.

Los archivos persistidos mantienen el formato JSON para facilitar su procesamiento y análisis.

---

# 🌎 Logging según el entorno

El comportamiento del logger depende de:

```text
NODE_ENV
```

## Development

Se permiten los seis niveles:

```text
debug
http
info
warning
error
fatal
```

## Production

El logger de consola comienza desde:

```text
info
```

De esta forma los niveles:

```text
debug
http
```

no se muestran normalmente en consola en producción.

---

# 📝 Persistencia de logs

Los errores importantes se almacenan mediante:

```text
winston-daily-rotate-file
```

Los archivos se generan dentro de:

```text
logs/
```

Formato:

```text
logs/error-YYYY-MM-DD.log
```

Los archivos contienen los niveles:

```text
error
fatal
```

Los archivos se rotan diariamente.

La retención configurada es de 14 días.

La carpeta `logs/` está incluida en `.gitignore` y no se versiona en Git.

---

# 🔒 Protección de información sensible

El sistema de logging no debe registrar:

```text
Passwords
Tokens
JWT
Secretos
Credenciales
Datos privados innecesarios
```

Los logs deben contener únicamente información útil para diagnóstico, monitoreo y seguimiento.

---

# 🚨 Integración del Logger con los errores

El logger está integrado con:

```text
src/middleware/error.middleware.js
```

Cuando ocurre un error se registra información relevante como:

```text
Código del error
Mensaje
Método HTTP
URL
Status Code
Stack Trace
Timestamp
```

Esto permite mantener un registro centralizado de los errores de la API.

---

# 🧪 Endpoint de prueba del Logger

Para verificar el funcionamiento del sistema de logging existe:

```http
GET /api/loggerTest
```

Este endpoint se utiliza como herramienta de validación del logger y no representa una funcionalidad de negocio.

La prueba ejecuta los diferentes niveles:

```text
debug
http
info
warning
error
fatal
```

Respuesta HTTP real:

```json
{
  "status": "success",
  "message": "Logger test ejecutado correctamente",
  "levels": [
    "debug",
    "http",
    "info",
    "warning",
    "error",
    "fatal"
  ]
}
```

---

# 📚 Documentación de la API con Swagger

A partir de la Pre-entrega 5, ShipNow incorpora documentación interactiva mediante **OpenAPI 3.0 y Swagger UI**.

La documentación permite consultar y probar los principales endpoints de la API desde el navegador.

La configuración se encuentra separada de las rutas en:

```text
src/docs/swagger.config.js
```

Los archivos de documentación OpenAPI se encuentran en:

```text
src/docs/
```

Incluyen:

```text
swagger.config.js
schemas.yaml
users.yaml
orders.yaml
deliveries.yaml
mocks.yaml
logger.yaml
```

---

# 🌐 Swagger UI

La documentación interactiva está disponible en:

```text
http://localhost:8080/api/docs
```

Swagger documenta los siguientes grupos:

```text
Users
Orders
Deliveries
Mocks
Logger
```

La documentación incluye:

- Métodos HTTP.
- Rutas.
- Parámetros.
- Request bodies.
- Respuestas exitosas.
- Respuestas de error.
- Ejemplos.
- Schemas reutilizables.
- Estados y valores permitidos.

---

# 👤 Documentación de Users

Endpoints documentados:

```text
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

---

# 🛒 Documentación de Orders

Endpoints documentados:

```text
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PATCH  /api/orders/:id/status
DELETE /api/orders/:id
```

El endpoint de actualización utiliza:

```http
PATCH /api/orders/:id/status
```

y recibe:

```json
{
  "status": "in_transit"
}
```

Estados válidos:

```text
created
assigned
picked_up
in_transit
delivered
cancelled
```

---

# 🚚 Documentación de Deliveries

Endpoints documentados:

```text
GET    /api/deliveries
GET    /api/deliveries/:id
POST   /api/deliveries
PATCH  /api/deliveries/:id/status
DELETE /api/deliveries/:id
```

El endpoint de actualización utiliza:

```http
PATCH /api/deliveries/:id/status
```

y recibe:

```json
{
  "status": "in_transit"
}
```

Estados válidos:

```text
pending
assigned
in_transit
delivered
```

---

# 🧪 Documentación de Mocks

Swagger documenta las operaciones de generación y persistencia de datos de prueba:

```text
GET  /api/mocks/users
POST /api/mocks/users
POST /api/mocks/orders
POST /api/mocks/orders/seed
POST /api/mocks/deliveries
POST /api/mocks/deliveries/seed
POST /api/mocks/seed
```

Los endpoints utilizan el parámetro:

```text
qty
```

con:

```text
DEFAULT = 10
MAX = 50
```

Los errores relacionados con cantidades inválidas utilizan:

```text
INVALID_MOCK_AMOUNT
```

---

# 🧩 Schemas reutilizables

Swagger utiliza schemas OpenAPI reutilizables para evitar duplicación y mantener consistencia.

Entre ellos:

```text
User
CreateUserRequest
UpdateUserRequest
OrderItem
Order
CreateOrderRequest
UpdateOrderStatusRequest
Delivery
CreateDeliveryRequest
UpdateDeliveryStatusRequest
SuccessResponse
UserSuccessResponse
UserListResponse
OrderSuccessResponse
OrderListResponse
DeliverySuccessResponse
DeliveryListResponse
ErrorResponse
```

Los schemas se encuentran en:

```text
src/docs/schemas.yaml
```

Las referencias reutilizables utilizan `$ref` de OpenAPI.

Ejemplo:

```yaml
$ref: "#/components/schemas/ErrorResponse"
```

---

# 🧪 Consistencia de la documentación

La documentación Swagger fue realizada sobre las rutas reales de la aplicación.

Se documentan:

- Paths existentes.
- Métodos HTTP reales.
- Parámetros reales.
- Request bodies utilizados por los Controllers.
- Respuestas reales.
- Estados válidos.
- Errores definidos por `errors.js`.
- Schemas reutilizables.
- Ejemplos de respuestas.

No se agregan endpoints ficticios únicamente para documentación.

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

La conexión se encuentra centralizada en:

```text
src/config/database.js
```

Por defecto, en desarrollo se utiliza:

```text
mongodb://127.0.0.1:27017/shipnow
```

---

# ⚙️ Variables de entorno

La configuración utiliza:

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

# 🌐 Rutas principales

Todas las rutas se centralizan en:

```text
src/routes/index.js
```

La API utiliza el prefijo:

```text
/api
```

Las principales rutas son:

```text
/api/products
/api/users
/api/orders
/api/deliveries
/api/mocks
/api/loggerTest
```

La documentación se encuentra fuera del prefijo general de la API:

```text
/api/docs
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

## Usuarios

```text
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

## Pedidos

```text
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PATCH  /api/orders/:id/status
DELETE /api/orders/:id
```

## Entregas

```text
GET    /api/deliveries
GET    /api/deliveries/:id
POST   /api/deliveries
PATCH  /api/deliveries/:id/status
DELETE /api/deliveries/:id
```

## Mocking

```text
GET  /api/mocks/users
POST /api/mocks/users
POST /api/mocks/orders
POST /api/mocks/orders/seed
POST /api/mocks/deliveries
POST /api/mocks/deliveries/seed
POST /api/mocks/seed
```

## Logger

```text
GET /api/loggerTest
```

---

# 🔍 Populate

Las relaciones entre documentos utilizan referencias de MongoDB y pueden ser obtenidas mediante `populate`.

Los pedidos pueden obtener información relacionada con el cliente.

Las entregas pueden obtener información relacionada con:

- Pedido.
- Cliente.
- Repartidor.

Esto permite trabajar con documentos relacionados sin perder la separación entre los diferentes modelos.

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

Crear:

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

Verificar que MongoDB se encuentre disponible.

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

Swagger UI:

```text
http://localhost:8080/api/docs
```

---

# ❤️ Health Check

La API posee una ruta raíz para comprobar que la aplicación funciona correctamente.

## Endpoint

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
- Winston
- winston-daily-rotate-file
- swagger-jsdoc
- swagger-ui-express
- OpenAPI 3.0

---

# 📜 Scripts disponibles

## Desarrollo

```bash
npm run dev
```

Utiliza Nodemon para reiniciar automáticamente el servidor cuando se detectan cambios.

## Ejecución normal

```bash
npm start
```

Ejecuta:

```text
node server.js
```

---

# 🔧 Buenas prácticas aplicadas

## Separación de responsabilidades

```text
Router
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Model
```

## Variables de entorno

Las configuraciones específicas del entorno se almacenan en:

```text
.env
```

y no directamente en el código.

## `.gitignore`

Se excluyen archivos y carpetas que no deben versionarse:

```text
node_modules/
.env
.env.local
.env.*.local
npm-debug.log*
errors.log
logs/
```

Los archivos generados por Winston dentro de `logs/` no se suben al repositorio.

## Constantes de dominio

Se centralizan en:

```text
src/constants/index.js
```

Incluyendo:

```text
USER_ROLES
PRODUCT_STATUS
ORDER_STATUS
DELIVERY_STATUS
DELIVERY_PRIORITY
DOCUMENT_TYPES
MOCKING_PARAMETERS
```

## Manejo centralizado de errores

Los errores se envían mediante:

```js
next(error);
```

al middleware:

```text
error.middleware.js
```

Los errores de dominio se crean mediante:

```js
createAppError()
```

## Logging centralizado

El sistema de logging se encuentra centralizado en:

```text
src/utils/logger.js
```

Los niveles utilizados son:

```text
debug
http
info
warning
error
fatal
```

La salida de consola utiliza colores diferenciados por nivel para facilitar la lectura durante el desarrollo.

## Documentación centralizada

La documentación OpenAPI se encuentra separada de las rutas de Express:

```text
src/docs/
```

Swagger UI permite consultar y probar la API desde:

```text
/api/docs
```

---

# 🔄 Flujo de una petición

Ejemplo:

```http
POST /api/orders
```

La petición sigue:

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

---

# 🚨 Flujo de errores

Cuando ocurre un error de negocio:

```text
Service
   ↓
createAppError()
   ↓
Controller
   ↓
next(error)
   ↓
error.middleware.js
   ↓
Logger
   ↓
HTTP Error Response
```

Cuando se solicita una ruta inexistente:

```text
Request
   ↓
notFound.middleware.js
   ↓
createAppError("ROUTE_NOT_FOUND")
   ↓
error.middleware.js
   ↓
Logger
   ↓
HTTP 404
```

---

# 🧪 Flujo del Mocking

Para un seed completo:

```http
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
   ↓
Orders
   ↓
Deliveries
```

---

# 📋 Flujo del Logging

El logging centralizado sigue:

```text
Aplicación
   ↓
Logger
   ↓
Winston
   ↓
Console / File Transport
   ↓
logs/
```

Para errores:

```text
Error
   ↓
error.middleware.js
   ↓
logger.error()
   ↓
Winston
   ↓
logs/error-YYYY-MM-DD.log
```

---

# 🧪 Pruebas realizadas

Durante el desarrollo se verificaron diferentes escenarios.

## Logger

```http
GET /api/loggerTest
```

Se verificó la ejecución de:

```text
debug
http
info
warning
error
fatal
```

También se verificó la diferenciación visual de los niveles mediante colores en la consola.

Respuesta real:

```json
{
  "status": "success",
  "message": "Logger test ejecutado correctamente",
  "levels": [
    "debug",
    "http",
    "info",
    "warning",
    "error",
    "fatal"
  ]
}
```

## Ruta inexistente

```http
GET /api/ruta-que-no-existe
```

Resultado:

```text
ROUTE_NOT_FOUND
```

## Cantidad inválida de Mocking

```http
GET /api/mocks/users?qty=0
```

Resultado:

```text
INVALID_MOCK_AMOUNT
```

## Cantidad superior al máximo

```http
GET /api/mocks/users?qty=51
```

Resultado:

```text
INVALID_MOCK_AMOUNT
```

## Mocking protegido en producción

Con:

```env
NODE_ENV=production
```

los endpoints de Mocking responden:

```text
403 FORBIDDEN
```

## Manejo centralizado de errores

Se probaron diferentes escenarios relacionados con:

```text
USER_NOT_FOUND
USER_ALREADY_EXISTS
INVALID_USER_ROLE
VALIDATION_ERROR
PRODUCT_NOT_FOUND
PRODUCT_VALIDATION_ERROR
ORDER_NOT_FOUND
ORDER_ITEMS_REQUIRED
INVALID_ORDER_STATUS
DELIVERY_NOT_FOUND
INVALID_DELIVERY_STATUS
INVALID_MOCK_AMOUNT
DATABASE_ERROR
ROUTE_NOT_FOUND
FORBIDDEN
```

---

# 🎯 Pre-entregas implementadas

## Pre-entrega 1

- Arquitectura por capas.
- Configuración centralizada.
- Variables de entorno.
- Constantes de dominio.
- Controllers.
- Services.
- Repositories.
- Models.
- Routers.

## Pre-entrega 2

- Mocking.
- Generación de usuarios.
- Generación de pedidos.
- Generación de entregas.
- Persistencia de datos mock.
- Seed completo.
- Relaciones entre documentos.
- Populate.
- Protección del módulo Mocking.

## Pre-entrega 3

- Manejo centralizado de errores.
- `AppError`.
- Diccionario centralizado de errores.
- `createAppError()`.
- Respuestas de error uniformes.
- Manejo de rutas inexistentes.
- Validación de errores de dominio.

## Pre-entrega 4

- Winston.
- Logging centralizado.
- Seis niveles personalizados.
- Diferenciación visual de niveles mediante colores.
- Persistencia de errores.
- Rotación diaria.
- Retención de 14 días.
- Integración con middleware global de errores.
- Endpoint `/api/loggerTest`.

## Pre-entrega 5

- OpenAPI 3.0.
- Swagger UI.
- `swagger-jsdoc`.
- `swagger-ui-express`.
- Documentación interactiva.
- Tags para Users, Orders, Deliveries, Mocks y Logger.
- Documentación de endpoints.
- Parámetros y request bodies.
- Respuestas exitosas.
- Respuestas de error.
- Schemas reutilizables.
- Documentación de errores.
- Ejemplos de uso.
- Ruta `/api/docs`.
- Consistencia entre documentación y API real.

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
- Errores personalizados.
- Diccionario de errores.
- Respuestas de error uniformes.
- Validación de errores de dominio.
- Manejo de rutas inexistentes.
- Logging centralizado.
- Winston.
- Niveles de logging.
- Colores diferenciados en consola.
- Persistencia de errores.
- Rotación de archivos.
- OpenAPI.
- Swagger UI.
- Documentación profesional de APIs.

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
- ✅ Middleware de rutas inexistentes.
- ✅ Middleware de protección para Mocking.
- ✅ `AppError`.
- ✅ Diccionario centralizado de errores.
- ✅ `createAppError()`.
- ✅ Respuestas de error uniformes.
- ✅ Manejo de errores de dominio.
- ✅ Manejo de errores de base de datos.
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
- ✅ Logger centralizado con Winston.
- ✅ Seis niveles de logging: `debug`, `http`, `info`, `warning`, `error`, `fatal`.
- ✅ Colores diferenciados por nivel en consola.
- ✅ Endpoint `/api/loggerTest`.
- ✅ Integración del logger con el middleware global de errores.
- ✅ Persistencia de errores.
- ✅ Rotación diaria de archivos de log.
- ✅ Retención de logs de errores durante 14 días.
- ✅ Protección de archivos de log mediante `.gitignore`.
- ✅ Documentación OpenAPI 3.0.
- ✅ Swagger UI.
- ✅ Documentación interactiva en `/api/docs`.
- ✅ Schemas reutilizables.
- ✅ Documentación de Users.
- ✅ Documentación de Orders.
- ✅ Documentación de Deliveries.
- ✅ Documentación de Mocks.
- ✅ Documentación de Logger.
- ✅ README actualizado y sincronizado con la API real.

---

# 👨‍💻 Autor

**Ivan Sanchez**

Proyecto académico desarrollado para:

**Coderhouse — Backend 3**

Proyecto:

**ShipNow — API de logística**