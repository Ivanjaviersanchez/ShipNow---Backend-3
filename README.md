# 🚚 ShipNow API

API backend desarrollada con **Node.js, Express y MongoDB** para la
gestión de una plataforma de logística y envíos llamada **ShipNow**. El
proyecto aplica arquitectura por capas, persistencia con Mongoose,
generación de datos de prueba, manejo centralizado de errores, logging,
documentación OpenAPI, pruebas funcionales automatizadas y carga local
de archivos mediante Multer.

El proyecto forma parte del curso **Backend 3 de Coderhouse** y tiene
como objetivo aplicar:

-   Arquitectura por capas.
-   Separación de responsabilidades.
-   Configuración mediante variables de entorno.
-   Persistencia con MongoDB y Mongoose.
-   Repositories y Services.
-   Controllers y Routers.
-   Mocking y generación de datos de prueba.
-   Manejo centralizado de errores.
-   Logging profesional mediante Winston.
-   Documentación de API mediante OpenAPI y Swagger UI.
-   Pruebas funcionales automatizadas con Mocha, Chai y Supertest.
-   Aislamiento de la base de datos de testing respecto de la base de
    desarrollo.
-   Paginación y límites para consultas de listados.
-   Health check y configuración por entorno.
-   Contenerización de la API mediante Docker.

------------------------------------------------------------------------

# 📌 Objetivo del proyecto

ShipNow permite gestionar diferentes entidades relacionadas con una
plataforma logística:

-   👤 Usuarios
-   📦 Productos
-   🛒 Pedidos
-   🚚 Entregas
-   🧪 Datos simulados mediante Mocking
-   📋 Logs de aplicación y errores

El proyecto utiliza una arquitectura por capas para facilitar:

-   Mantenimiento.
-   Escalabilidad.
-   Reutilización de código.
-   Testeo.
-   Trabajo en equipo.
-   Evolución futura de la aplicación.
-   Separación clara de responsabilidades.

------------------------------------------------------------------------

# 🏗️ Arquitectura

El proyecto utiliza el siguiente flujo:

``` text
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

Se encarga de definir las rutas y conectar cada endpoint con el
controlador correspondiente.

Los Routers no contienen lógica de negocio ni consultas directas a
MongoDB.

------------------------------------------------------------------------

## Controller

Se encarga de:

-   Recibir la petición HTTP.
-   Obtener información de `req.params`, `req.query` o `req.body`.
-   Llamar al Service correspondiente.
-   Construir la respuesta HTTP.
-   Delegar los errores al middleware centralizado mediante
    `next(error)`.

Los Controllers no contienen consultas directas a MongoDB ni lógica de
negocio compleja.

------------------------------------------------------------------------

## Service

Contiene la lógica de negocio de la aplicación.

Entre sus responsabilidades se encuentran:

-   Validación de datos.
-   Validación de estados y prioridades.
-   Aplicación de reglas de negocio.
-   Coordinación de operaciones.
-   Preparación de datos antes de enviarlos al Repository.
-   Detección y generación de errores de dominio.
-   Generación de logs relacionados con operaciones importantes cuando
    corresponde.

Los Services utilizan `createAppError()` para generar errores
controlados.

------------------------------------------------------------------------

## Repository

Es la capa encargada de comunicarse con los modelos de Mongoose.

Su objetivo es encapsular las operaciones de persistencia y evitar que
los Services dependan directamente de Mongoose.

------------------------------------------------------------------------

## Model

Define la estructura de los documentos almacenados en MongoDB mediante
Mongoose.

------------------------------------------------------------------------

## Config

Centraliza la configuración de la aplicación y la lectura de variables
de entorno.

------------------------------------------------------------------------

## Constants

Contiene valores constantes utilizados por las reglas del dominio,
evitando valores escritos directamente en diferentes partes del código.

------------------------------------------------------------------------

## Logger

ShipNow utiliza **Winston** como sistema centralizado de logging.

El logger se encuentra en:

``` text
src/utils/logger.js
```

Permite:

-   Diagnóstico durante el desarrollo.
-   Seguimiento de operaciones.
-   Registro de errores.
-   Registro de eventos importantes.
-   Persistencia de errores.
-   Rotación automática de archivos de log.
-   Diferenciación de niveles según el entorno.
-   Diferenciación visual de los niveles mediante colores en la salida
    de consola.

------------------------------------------------------------------------

# 📁 Estructura del proyecto

``` text
ShipNow/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── index.js
│   │   └── multer.js
│   ├── constants/
│   │   └── index.js
│   ├── controllers/
│   │   ├── deliveries.controller.js
│   │   ├── logger.controller.js
│   │   ├── mocks.controller.js
│   │   ├── orders.controller.js
│   │   ├── product.controller.js
│   │   └── user.controller.js
│   ├── docs/
│   │   ├── deliveries.yaml
│   │   ├── logger.yaml
│   │   ├── mocks.yaml
│   │   ├── orders.yaml
│   │   ├── schemas.yaml
│   │   ├── swagger.config.js
│   │   └── users.yaml
│   ├── middleware/
│   │   ├── error.middleware.js
│   │   ├── mocks.middleware.js
│   │   ├── notFound.middleware.js
│   │   └── upload.middleware.js
│   ├── mocks/
│   │   ├── delivery.mock.js
│   │   ├── order.mock.js
│   │   └── user.mock.js
│   ├── models/
│   │   ├── delivery.model.js
│   │   ├── order.model.js
│   │   ├── product.model.js
│   │   └── user.model.js
│   ├── repositories/
│   │   ├── delivery.repository.js
│   │   ├── order.repository.js
│   │   ├── product.repository.js
│   │   └── user.repository.js
│   ├── routes/
│   │   ├── deliveries.router.js
│   │   ├── index.js
│   │   ├── logger.router.js
│   │   ├── mocks.router.js
│   │   ├── orders.router.js
│   │   ├── product.router.js
│   │   └── user.router.js
│   ├── services/
│   │   ├── delivery.service.js
│   │   ├── mocks.service.js
│   │   ├── order.service.js
│   │   ├── product.service.js
│   │   └── user.service.js
│   ├── utils/
│   │   ├── errors.js
│   │   ├── files.js
│   │   ├── logger.js
│   │   └── pagination.js
│   └── app.js
├── tests/
│   ├── docs/swagger.test.js
│   ├── logger/logger.test.js
│   ├── middleware/
│   │   └── error.middleware.test.js
│   ├── mocks/mocks-production.test.js
│   ├── mocks/mocks.test.js
│   ├── orders/orders.test.js
│   ├── routes/
│   │   ├── health.test.js
│   │   └── notFound.test.js
│   ├── setup.js
│   ├── setup.test.js
│   └── users/users.test.js
├── uploads/
│   └── .gitkeep
├── .dockerignore
├── .env.example
├── .env.test.example
├── .gitignore
├── .mocharc.json
├── Dockerfile
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

> **Notas sobre la estructura:**
>
> -   `src/` contiene la aplicación y mantiene la arquitectura por
>     capas.
> -   `src/config/multer.js` configura el almacenamiento local y los
>     límites de carga.
> -   `src/middleware/upload.middleware.js` adapta los errores de Multer
>     al sistema centralizado de errores.
> -   `src/utils/files.js` contiene la utilidad para eliminar archivos
>     temporales cuando falla su asociación con una entidad.
> -   `tests/` contiene las pruebas funcionales automatizadas de las
>     pre-entregas 6 y 7.
> -   `tests/setup.js` valida el entorno, conecta con la base exclusiva
>     de testing, limpia las colecciones utilizadas y cierra la conexión
>     al finalizar la suite.
> -   `.env.test` es un archivo local ignorado por Git;
>     `.env.test.example` permite reproducir su configuración sin
>     compartir credenciales.
> -   `uploads/` almacena los archivos recibidos. Se versiona únicamente
>     `.gitkeep`; los archivos cargados se excluyen mediante
>     `.gitignore`.
> -   Los archivos de logs y los archivos de entorno locales no deben
>     subirse al repositorio.

------------------------------------------------------------------------

# 👤 Usuarios

Los usuarios representan a las diferentes personas o entidades que
participan dentro de ShipNow.

Los roles disponibles son:

``` text
admin
customer
driver
store
```

Los repartidores no poseen un modelo independiente.

Un repartidor es un usuario cuyo `role` es:

``` text
driver
```

Los usuarios con rol `driver` además pueden tener el campo:

``` text
isAvailable
```

que permite representar si están disponibles para recibir entregas.

------------------------------------------------------------------------

# 📦 Productos

ShipNow también posee una estructura para gestionar productos.

Los productos utilizan estados definidos mediante constantes de dominio:

``` text
available
out_of_stock
```

La lógica relacionada con productos está separada en:

``` text
Controller
    ↓
Service
    ↓
Repository
    ↓
Model
```

------------------------------------------------------------------------

# 🛒 Pedidos

Los pedidos representan las órdenes que deben ser procesadas y
posteriormente entregadas.

Cada pedido posee:

-   Cliente.
-   Productos/items.
-   Dirección de entrega.
-   Total.
-   Estado.
-   Prioridad.
-   Fecha de creación.
-   Fecha de actualización.

Los estados disponibles son:

``` text
created
assigned
picked_up
in_transit
delivered
cancelled
```

Las prioridades disponibles son:

``` text
low
normal
high
```

El campo `customer` referencia a un documento de la colección de
usuarios.

Los pedidos utilizan referencias de MongoDB mediante `ObjectId`.

------------------------------------------------------------------------

# 🚚 Entregas

Las entregas representan el proceso de distribución de un pedido.

Cada entrega contiene:

-   Pedido asociado.
-   Repartidor asociado.
-   Estado.
-   Fecha de creación.
-   Fecha de actualización.

Los estados disponibles son:

``` text
pending
assigned
in_transit
delivered
```

El campo `order` referencia al pedido correspondiente.

El campo `driver` referencia a un usuario.

En el flujo de Mocking, el campo `driver` se asigna utilizando usuarios
con rol:

``` text
driver
```

Las relaciones pueden ser obtenidas mediante `populate`.

------------------------------------------------------------------------

# 🧪 Mocking

El proyecto incorpora un módulo de **Mocking** para generar datos de
prueba sin necesidad de crearlos manualmente.

El módulo permite:

-   Generar usuarios simulados.
-   Generar pedidos simulados.
-   Generar entregas simuladas.
-   Insertar usuarios en MongoDB.
-   Insertar pedidos en MongoDB.
-   Insertar entregas en MongoDB.
-   Cargar un conjunto completo de datos relacionados.

La lógica de generación está ubicada en:

``` text
src/mocks/
```

Actualmente existen:

``` text
user.mock.js
order.mock.js
delivery.mock.js
```

La lógica de coordinación se encuentra en:

``` text
src/services/mocks.service.js
```

y los endpoints son administrados por:

``` text
src/controllers/mocks.controller.js
```

------------------------------------------------------------------------

# ⚙️ Parámetros de Mocking

El módulo utiliza las siguientes constantes:

``` text
MAX = 50
DEFAULT = 10
DEFAULT_PASSWORD = coder123
```

## Cantidad máxima

Los endpoints de Mocking permiten generar hasta:

``` text
50 registros
```

Si se solicita una cantidad superior, la API devuelve un error HTTP
`400`.

Ejemplo:

``` http
GET /api/mocks/users?qty=51
```

------------------------------------------------------------------------

# 👤 Generar usuarios simulados

## Endpoint

``` http
GET /api/mocks/users
```

Por defecto genera:

``` text
10 usuarios
```

También puede especificarse la cantidad:

``` http
GET /api/mocks/users?qty=5
```

Estos datos son simulados y no se guardan en MongoDB.

------------------------------------------------------------------------

# 💾 Guardar usuarios simulados

## Endpoint

``` http
POST /api/mocks/users
```

Ejemplo:

``` http
POST /api/mocks/users?qty=10
```

Este endpoint:

1.  Genera usuarios.
2.  Los envía al Service.
3.  El Service utiliza el Repository.
4.  El Repository realiza la inserción en MongoDB.

Los usuarios quedan almacenados en la base de datos.

------------------------------------------------------------------------

# 🛒 Generar pedidos simulados

## Endpoint

``` http
POST /api/mocks/orders
```

Ejemplo:

``` http
POST /api/mocks/orders?qty=5
```

Debe recibir los IDs de clientes mediante el body.

Ejemplo:

``` json
{
  "customerIds": [
    "ID_CLIENTE_1",
    "ID_CLIENTE_2",
    "ID_CLIENTE_3"
  ]
}
```

Los pedidos generados incluyen:

-   Cliente.
-   Items.
-   Cantidades.
-   Precios.
-   Total.
-   Dirección.
-   Estado.
-   Prioridad.

Los datos generados mediante este endpoint no se guardan en MongoDB.

------------------------------------------------------------------------

# 💾 Guardar pedidos simulados

## Endpoint

``` http
POST /api/mocks/orders/seed
```

Ejemplo:

``` http
POST /api/mocks/orders/seed?qty=5
```

Body:

``` json
{
  "customerIds": [
    "ID_CLIENTE_1",
    "ID_CLIENTE_2",
    "ID_CLIENTE_3"
  ]
}
```

Los pedidos generados son almacenados en MongoDB.

------------------------------------------------------------------------

# 🚚 Generar entregas simuladas

## Endpoint

``` http
POST /api/mocks/deliveries
```

Ejemplo:

``` http
POST /api/mocks/deliveries?qty=5
```

Body:

``` json
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

``` text
Delivery
   ↓
Order
   ↓
Customer
```

y:

``` text
Delivery
   ↓
Driver
```

Las entregas generadas mediante este endpoint no se guardan en MongoDB.

------------------------------------------------------------------------

# 💾 Guardar entregas simuladas

## Endpoint

``` http
POST /api/mocks/deliveries/seed
```

Ejemplo:

``` http
POST /api/mocks/deliveries/seed?qty=5
```

Body:

``` json
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

------------------------------------------------------------------------

# 🌱 Seed completo

Para facilitar las pruebas del proyecto existe un endpoint que genera un
conjunto completo de información relacionada.

## Endpoint

``` http
POST /api/mocks/seed
```

Ejemplo:

``` http
POST /api/mocks/seed?qty=10
```

El proceso genera:

``` text
Usuarios
   ↓
Clientes + Drivers
   ↓
Pedidos
   ↓
Entregas
```

Las relaciones se generan de forma coherente.

------------------------------------------------------------------------

# 🔒 Protección del módulo Mocking

El módulo de Mocking está protegido mediante:

``` text
src/middleware/mocks.middleware.js
```

Cuando la aplicación funciona en:

``` text
NODE_ENV=production
```

los endpoints de Mocking quedan deshabilitados.

La API devuelve HTTP `403` con una respuesta centralizada.

Ejemplo:

``` json
{
  "status": "error",
  "error": "FORBIDDEN",
  "message": "No tenés permisos para realizar esta operación"
}
```

Esto evita que los endpoints destinados a pruebas puedan utilizarse
accidentalmente en un entorno productivo.

------------------------------------------------------------------------

# 🚨 Manejo centralizado de errores

A partir de la Pre-entrega 3, ShipNow incorpora un sistema centralizado
para el manejo de errores.

La arquitectura utiliza:

``` text
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

``` text
src/middleware/error.middleware.js
```

------------------------------------------------------------------------

# 🧩 Errores personalizados

Los errores personalizados se encuentran centralizados en:

``` text
src/utils/errors.js
```

Este archivo contiene:

-   `AppError`
-   `ERROR_DEFINITIONS`
-   `createAppError()`

Los Services utilizan `createAppError()` para generar errores
controlados.

Ejemplo:

``` js
throw createAppError("USER_NOT_FOUND");
```

------------------------------------------------------------------------

# 📚 Diccionario de errores

## Usuarios

``` text
USER_NOT_FOUND
USER_ALREADY_EXISTS
INVALID_USER_ROLE
```

## Productos

``` text
PRODUCT_NOT_FOUND
PRODUCT_VALIDATION_ERROR
```

## Pedidos

``` text
ORDER_NOT_FOUND
ORDER_ITEMS_REQUIRED
INVALID_ORDER_STATUS
```

## Entregas

``` text
DELIVERY_NOT_FOUND
INVALID_DELIVERY_STATUS
```

## Mocking

``` text
INVALID_MOCK_AMOUNT
```

## Sistema

``` text
DATABASE_ERROR
INTERNAL_SERVER_ERROR
ROUTE_NOT_FOUND
FORBIDDEN
```

------------------------------------------------------------------------

# 📋 Formato estándar de errores

Las respuestas de error utilizan un formato uniforme:

``` json
{
  "status": "error",
  "error": "ERROR_CODE",
  "message": "Mensaje claro para el cliente"
}
```

En entorno `development` pueden incluir información adicional para
facilitar el diagnóstico.

------------------------------------------------------------------------

# 🌐 Rutas inexistentes

ShipNow posee un middleware específico para manejar rutas que no
existen.

Archivo:

``` text
src/middleware/notFound.middleware.js
```

Cuando se solicita una ruta inexistente, el middleware genera:

``` text
ROUTE_NOT_FOUND
```

La respuesta utiliza HTTP `404`.

------------------------------------------------------------------------

# 📋 Logging con Winston

A partir de la Pre-entrega 4, ShipNow incorpora un sistema profesional
de logging mediante **Winston**.

El objetivo del logging es permitir:

-   Observar el comportamiento de la aplicación.
-   Facilitar el diagnóstico de problemas.
-   Conservar información importante sobre errores.
-   Registrar operaciones relevantes.
-   Mantener archivos de errores históricos.
-   Diferenciar visualmente los niveles de log en consola.

El logger está centralizado en:

``` text
src/utils/logger.js
```

------------------------------------------------------------------------

# 🧰 Dependencias de Logging

Las dependencias utilizadas son:

``` text
winston
winston-daily-rotate-file
```

------------------------------------------------------------------------

# 📊 Niveles de Logging

ShipNow utiliza seis niveles personalizados:

``` text
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

``` text
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

------------------------------------------------------------------------

# 🎨 Colores del Logger

Durante el desarrollo, los niveles del logger se muestran con colores
diferenciados en la consola para facilitar su identificación visual.

La configuración se realiza mediante `winston.format.colorize()` y
colores personalizados para los niveles:

``` text
fatal
error
warning
info
http
debug
```

Los colores se aplican únicamente a la salida de consola.

Los archivos persistidos mantienen el formato JSON para facilitar su
procesamiento y análisis.

------------------------------------------------------------------------

# 🌎 Logging según el entorno

El comportamiento del logger depende de:

``` text
NODE_ENV
```

## Development

Se permiten los seis niveles:

``` text
debug
http
info
warning
error
fatal
```

## Production

El logger de consola comienza desde:

``` text
info
```

De esta forma los niveles:

``` text
debug
http
```

no se muestran normalmente en consola en producción.

------------------------------------------------------------------------

# 📝 Persistencia de logs

Los errores importantes se almacenan mediante:

``` text
winston-daily-rotate-file
```

Los archivos se generan dentro de:

``` text
logs/
```

Formato:

``` text
logs/error-YYYY-MM-DD.log
```

Los archivos contienen los niveles:

``` text
error
fatal
```

Los archivos se rotan diariamente.

La retención configurada es de 14 días.

La carpeta `logs/` está incluida en `.gitignore` y no se versiona en
Git.

------------------------------------------------------------------------

# 🔒 Protección de información sensible

El sistema de logging no debe registrar:

``` text
Passwords
Tokens
JWT
Secretos
Credenciales
Datos privados innecesarios
```

Los logs deben contener únicamente información útil para diagnóstico,
monitoreo y seguimiento.

------------------------------------------------------------------------

# 🚨 Integración del Logger con los errores

El logger está integrado con:

``` text
src/middleware/error.middleware.js
```

Cuando ocurre un error se registra información relevante como:

``` text
Código del error
Mensaje
Método HTTP
URL
Status Code
Stack Trace
Timestamp
```

Esto permite mantener un registro centralizado de los errores de la API.

------------------------------------------------------------------------

# 🧪 Endpoint de prueba del Logger

Para verificar el funcionamiento del sistema de logging existe:

``` http
GET /api/loggerTest
```

Este endpoint se utiliza como herramienta de validación del logger y no
representa una funcionalidad de negocio.

La prueba ejecuta los diferentes niveles:

``` text
debug
http
info
warning
error
fatal
```

Respuesta HTTP real:

``` json
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

------------------------------------------------------------------------

# 📚 Documentación de la API con Swagger

A partir de la Pre-entrega 5, ShipNow incorpora documentación
interactiva mediante **OpenAPI 3.0 y Swagger UI**.

La documentación permite consultar y probar los principales endpoints de
la API desde el navegador.

La configuración se encuentra separada de las rutas en:

``` text
src/docs/swagger.config.js
```

Los archivos de documentación OpenAPI se encuentran en:

``` text
src/docs/
```

Incluyen:

``` text
swagger.config.js
schemas.yaml
users.yaml
orders.yaml
deliveries.yaml
mocks.yaml
logger.yaml
```

------------------------------------------------------------------------

# 🌐 Swagger UI

La documentación interactiva está disponible en:

``` text
http://localhost:8080/api/docs
```

Swagger documenta los siguientes grupos:

``` text
Users
Orders
Deliveries
Mocks
Logger
```

La documentación incluye:

-   Métodos HTTP.
-   Rutas.
-   Parámetros.
-   Request bodies.
-   Respuestas exitosas.
-   Respuestas de error.
-   Ejemplos.
-   Schemas reutilizables.
-   Estados y valores permitidos.

------------------------------------------------------------------------

# 👤 Documentación de Users

Endpoints documentados:

``` text
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

------------------------------------------------------------------------

# 🛒 Documentación de Orders

Endpoints documentados:

``` text
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PATCH  /api/orders/:id/status
DELETE /api/orders/:id
```

El endpoint de actualización utiliza:

``` http
PATCH /api/orders/:id/status
```

y recibe:

``` json
{
  "status": "in_transit"
}
```

Estados válidos:

``` text
created
assigned
picked_up
in_transit
delivered
cancelled
```

------------------------------------------------------------------------

# 🚚 Documentación de Deliveries

Endpoints documentados:

``` text
GET    /api/deliveries
GET    /api/deliveries/:id
POST   /api/deliveries
PATCH  /api/deliveries/:id/status
DELETE /api/deliveries/:id
```

El endpoint de actualización utiliza:

``` http
PATCH /api/deliveries/:id/status
```

y recibe:

``` json
{
  "status": "in_transit"
}
```

Estados válidos:

``` text
pending
assigned
in_transit
delivered
```

------------------------------------------------------------------------

# 🧪 Documentación de Mocks

Swagger documenta las operaciones de generación y persistencia de datos
de prueba:

``` text
GET  /api/mocks/users
POST /api/mocks/users
POST /api/mocks/orders
POST /api/mocks/orders/seed
POST /api/mocks/deliveries
POST /api/mocks/deliveries/seed
POST /api/mocks/seed
```

Los endpoints utilizan el parámetro:

``` text
qty
```

con:

``` text
DEFAULT = 10
MAX = 50
```

Los errores relacionados con cantidades inválidas utilizan:

``` text
INVALID_MOCK_AMOUNT
```

------------------------------------------------------------------------

# 🧩 Schemas reutilizables

Swagger utiliza schemas OpenAPI reutilizables para evitar duplicación y
mantener consistencia.

Entre ellos:

``` text
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

``` text
src/docs/schemas.yaml
```

Las referencias reutilizables utilizan `$ref` de OpenAPI.

Ejemplo:

``` yaml
$ref: "#/components/schemas/ErrorResponse"
```

------------------------------------------------------------------------

# 🧪 Consistencia de la documentación

La documentación Swagger fue realizada sobre las rutas reales de la
aplicación.

Se documentan:

-   Paths existentes.
-   Métodos HTTP reales.
-   Parámetros reales.
-   Request bodies utilizados por los Controllers.
-   Respuestas reales.
-   Estados válidos.
-   Errores definidos por `errors.js`.
-   Schemas reutilizables.
-   Ejemplos de respuestas.

No se agregan endpoints ficticios únicamente para documentación.

------------------------------------------------------------------------

# 🗄️ MongoDB

La aplicación utiliza:

``` text
MongoDB
```

con:

``` text
Mongoose
```

La conexión se encuentra centralizada en:

``` text
src/config/database.js
```

Por defecto, en desarrollo se utiliza:

``` text
mongodb://127.0.0.1:27017/shipnow
```

------------------------------------------------------------------------

# ⚙️ Variables de entorno

La configuración utiliza:

``` text
.env
```

Ejemplo:

``` env
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/shipnow
NODE_ENV=development
LOG_LEVEL=debug
```

`LOG_LEVEL` permite definir el nivel mínimo de logging. Si no se informa,
la configuración centralizada aplica un nivel predeterminado según el
entorno.

El archivo `.env` no debe subirse al repositorio.

Para indicar las variables necesarias se utiliza:

``` text
.env.example
```

Ejemplo:

``` env
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/shipnow
NODE_ENV=development
LOG_LEVEL=debug
```

------------------------------------------------------------------------

# 🌐 Rutas principales

Todas las rutas se centralizan en:

``` text
src/routes/index.js
```

La API utiliza el prefijo:

``` text
/api
```

Las principales rutas son:

``` text
/api/products
/api/users
/api/orders
/api/deliveries
/api/mocks
/api/loggerTest
```

La documentación se encuentra fuera del prefijo general de la API:

``` text
/api/docs
```

------------------------------------------------------------------------

# 📋 Endpoints

## Productos

``` text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

## Usuarios

``` text
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

## Pedidos

``` text
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
PATCH  /api/orders/:id/status
DELETE /api/orders/:id
```

## Entregas

``` text
GET    /api/deliveries
GET    /api/deliveries/:id
POST   /api/deliveries
PATCH  /api/deliveries/:id/status
DELETE /api/deliveries/:id
```

## Mocking

``` text
GET  /api/mocks/users
POST /api/mocks/users
POST /api/mocks/orders
POST /api/mocks/orders/seed
POST /api/mocks/deliveries
POST /api/mocks/deliveries/seed
POST /api/mocks/seed
```

## Logger

``` text
GET /api/loggerTest
```

------------------------------------------------------------------------

# 🔍 Populate

Las relaciones entre documentos utilizan referencias de MongoDB y pueden
ser obtenidas mediante `populate`.

Los pedidos pueden obtener información relacionada con el cliente.

Las entregas pueden obtener información relacionada con:

-   Pedido.
-   Cliente.
-   Repartidor.

Esto permite trabajar con documentos relacionados sin perder la
separación entre los diferentes modelos.

------------------------------------------------------------------------

# 🛠️ Instalación

Clonar o descargar el proyecto.

Ingresar al directorio:

``` bash
cd ShipNow
```

Instalar dependencias:

``` bash
npm install
```

Crear:

``` text
.env
```

a partir de:

``` text
.env.example
```

Configurar:

``` env
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/shipnow
NODE_ENV=development
```

Verificar que MongoDB se encuentre disponible.

------------------------------------------------------------------------

# ▶️ Ejecución

Para iniciar el servidor:

``` bash
npm start
```

Para trabajar en modo desarrollo:

``` bash
npm run dev
```

El servidor se ejecuta por defecto en:

``` text
http://localhost:8080
```

Swagger UI:

``` text
http://localhost:8080/api/docs
```

------------------------------------------------------------------------

# ❤️ Health Check

ShipNow dispone de un endpoint específico para comprobar el estado
básico de la API y conocer información operativa del proceso.

## Endpoint

``` http
GET /health
```

Respuesta verificada en el contenedor Docker con `NODE_ENV=production`:

``` json
{
  "status": "OK",
  "environment": "production",
  "uptime": 15.78,
  "timestamp": "2026-11-23T22:03:33.556Z"
}
```

`uptime` representa el tiempo de actividad del proceso en segundos y
`timestamp` indica el momento en que se generó la respuesta. El valor
numérico de `uptime` y la fecha cambian en cada solicitud.

La ruta raíz `GET /` se conserva como respuesta informativa de la API;
`GET /health` es el endpoint específico de health check.

------------------------------------------------------------------------

# 📦 Tecnologías utilizadas

-   Node.js
-   Express
-   MongoDB
-   Mongoose
-   dotenv
-   Nodemon
-   Winston
-   winston-daily-rotate-file
-   swagger-jsdoc
-   swagger-ui-express
-   OpenAPI 3.0
-   Mocha
-   Chai
-   Supertest
-   cross-env

------------------------------------------------------------------------

# 📜 Scripts disponibles

## Desarrollo

``` bash
npm run dev
```

Utiliza Nodemon para reiniciar automáticamente el servidor cuando se
detectan cambios.

## Ejecución normal

``` bash
npm start
```

Ejecuta:

``` text
node server.js
```

## Pruebas funcionales test

``` bash
npm test
```

Ejecuta la suite de pruebas funcionales automatizadas.

------------------------------------------------------------------------

# 🔧 Buenas prácticas aplicadas

## Separación de responsabilidades

``` text
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

``` text
.env
```

y no directamente en el código.

## `.gitignore`

Se excluyen archivos y carpetas que no deben versionarse:

``` text
node_modules/
.env
.env.local
.env.*.local
npm-debug.log*
errors.log
logs/
```

Los archivos generados por Winston dentro de `logs/` no se suben al
repositorio.

## Constantes de dominio

Se centralizan en:

``` text
src/constants/index.js
```

Incluyendo:

``` text
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

``` js
next(error);
```

al middleware:

``` text
error.middleware.js
```

Los errores de dominio se crean mediante:

``` js
createAppError()
```

## Logging centralizado

El sistema de logging se encuentra centralizado en:

``` text
src/utils/logger.js
```

Los niveles utilizados son:

``` text
debug
http
info
warning
error
fatal
```

La salida de consola utiliza colores diferenciados por nivel para
facilitar la lectura durante el desarrollo.

## Documentación centralizada

La documentación OpenAPI se encuentra separada de las rutas de Express:

``` text
src/docs/
```

Swagger UI permite consultar y probar la API desde:

``` text
/api/docs
```

------------------------------------------------------------------------

# 🔄 Flujo de una petición

Ejemplo:

``` http
POST /api/orders
```

La petición sigue:

``` text
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

------------------------------------------------------------------------

# 🚨 Flujo de errores

Cuando ocurre un error de negocio:

``` text
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

``` text
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

------------------------------------------------------------------------

# 🧪 Flujo del Mocking

Para un seed completo:

``` http
POST /api/mocks/seed
```

el flujo es:

``` text
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

``` text
Users
   ↓
Orders
   ↓
Deliveries
```

------------------------------------------------------------------------

# 📋 Flujo del Logging

El logging centralizado sigue:

``` text
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

``` text
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

------------------------------------------------------------------------

# 🧪 Pruebas realizadas

Durante el desarrollo de ShipNow se verificaron diferentes escenarios
mediante pruebas manuales y pruebas funcionales automatizadas.

## Logger

Endpoint:

``` http
GET /api/loggerTest
```

Se verificó la ejecución de los seis niveles del logger:

``` text
debug
http
info
warning
error
fatal
```

Respuesta esperada:

``` json
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

Se verificó el comportamiento de la API cuando se solicita una ruta que
no existe.

Ejemplo:

``` http
GET /api/ruta-que-no-existe
```

Resultado esperado:

-   HTTP `404`.
-   Código `ROUTE_NOT_FOUND`.
-   Respuesta con el formato centralizado de errores.

## Cantidad inválida de Mocking

Se verificó que la API rechace cantidades iguales a cero.

Ejemplo:

``` http
GET /api/mocks/users?qty=0
```

Resultado esperado:

-   HTTP `400`.
-   Código `INVALID_MOCK_AMOUNT`.
-   Mensaje: `La cantidad debe ser un número entero mayor a 0`.

## Cantidad superior al máximo

Se verificó que la API rechace cantidades superiores al límite permitido
de 50 registros.

Ejemplo:

``` http
GET /api/mocks/users?qty=51
```

Resultado esperado:

-   HTTP `400`.
-   Código `INVALID_MOCK_AMOUNT`.
-   Mensaje: `La cantidad máxima permitida es 50`.

## Mocking protegido en producción

Se verificó que los endpoints de Mocking estén protegidos cuando la
aplicación se ejecuta con:

``` env
NODE_ENV=production
```

Resultado esperado:

-   HTTP `403`.
-   Código `FORBIDDEN`.

## Manejo centralizado de errores

Se verificaron diferentes escenarios de error relacionados con las
entidades y las validaciones del sistema.

Entre los códigos contemplados se encuentran:

``` text
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
INTERNAL_SERVER_ERROR
ROUTE_NOT_FOUND
FORBIDDEN
```

## Pruebas funcionales automatizadas --- Pre-entrega 6

ShipNow incorpora una suite de pruebas funcionales automatizadas para
verificar el comportamiento de los endpoints, los códigos HTTP, la
persistencia de datos y las respuestas de error.

### Herramientas utilizadas

-   **Mocha:** ejecución y organización de las pruebas.
-   **Chai:** aserciones para verificar los resultados esperados.
-   **Supertest:** envío de solicitudes HTTP a la aplicación Express.
-   **Multer:** recepción y almacenamiento local de archivos enviados
    mediante `multipart/form-data`.
-   **MongoDB y Mongoose:** persistencia y consulta de datos durante las
    pruebas.
-   **cross-env:** configuración de `NODE_ENV=test` al ejecutar la
    suite.

### Ejecutar las pruebas

Desde la raíz del proyecto:

``` bash
npm test
```

El script de testing establece `NODE_ENV=test` y ejecuta Mocha.

Las pruebas importan la aplicación desde `src/app.js`, sin iniciar un
servidor HTTP independiente. Supertest realiza las solicitudes
directamente contra la aplicación Express.

### Organización de los tests

``` text
tests/
├── setup.js
├── setup.test.js
├── users/
│   └── users.test.js
├── orders/
│   └── orders.test.js
├── mocks/
│   ├── mocks.test.js
│   └── mocks-production.test.js
├── logger/
│   └── logger.test.js
├── docs/
│   └── swagger.test.js
├── middleware/
└── routes/
    ├── health.test.js
    └── notFound.test.js
```

Responsabilidades:

-   `setup.js`: valida el entorno, conecta con la base de testing,
    prepara las colecciones y cierra la conexión al finalizar.
-   `setup.test.js`: verifica la configuración del entorno de pruebas.
-   `users.test.js`: comprueba consultas, creación de usuarios y
    validaciones.
-   `orders.test.js`: comprueba consultas, creación de pedidos,
    validaciones y estados.
-   `mocks.test.js`: verifica el rechazo de cantidades inválidas y
    superiores al máximo permitido.
-   `logger.test.js`: comprueba el endpoint de prueba del logger.
-   `swagger.test.js`: verifica la disponibilidad de la documentación
    Swagger.
-   `notFound.test.js`: comprueba la respuesta ante rutas inexistentes.

### Base de datos exclusiva para testing

Las pruebas utilizan una base de datos independiente de la utilizada
durante el desarrollo.

**Base de desarrollo:**

``` text
mongodb://127.0.0.1:27017/shipnow
```

**Base de testing:**

``` text
mongodb://127.0.0.1:27017/shipnow_test
```

El entorno de pruebas utiliza un archivo `.env.test` local, excluido del
repositorio mediante `.gitignore`.

Configuración de ejemplo:

``` env
PORT=8081
NODE_ENV=test
MONGODB_URI_TEST=mongodb://127.0.0.1:27017/shipnow_test
```

La configuración centralizada verifica que la URI de testing apunte a la
base `shipnow_test`. El setup limpia las colecciones utilizadas al
iniciar cada ejecución de la suite y cierra la conexión al finalizar. La
configuración de `src/config/index.js` exige `MONGODB_URI_TEST` y
comprueba que el nombre de la base sea exactamente `shipnow_test`.

**Importante:** las pruebas deben ejecutarse mediante `npm test`. La
base `shipnow` corresponde al entorno de desarrollo y no debe utilizarse
para ejecutar la suite.

### Escenarios automatizados cubiertos

#### Usuarios

-   Consulta de usuarios con respuesta HTTP `200`.
-   Búsqueda de un usuario inexistente con respuesta
    `404 USER_NOT_FOUND`.
-   Creación y persistencia de usuarios.
-   Validación de campos obligatorios con respuesta
    `400 VALIDATION_ERROR`.
-   Verificación de que la contraseña no se exponga en la respuesta de
    creación.

#### Pedidos

-   Consulta de pedidos con respuesta HTTP `200`.
-   Búsqueda de un pedido inexistente con respuesta
    `404 ORDER_NOT_FOUND`.
-   Creación y persistencia de pedidos.
-   Rechazo de pedidos incompletos.
-   Rechazo de estados de pedido inválidos con respuesta
    `400 INVALID_ORDER_STATUS`.

#### Mocking

-   Bloqueo de acceso al módulo en entorno de producción con HTTP
    `403 FORBIDDEN`.
-   Rechazo de cantidades iguales a cero.
-   Rechazo de cantidades superiores al máximo permitido.
-   Verificación del código `INVALID_MOCK_AMOUNT` y de los mensajes
    correspondientes.

#### Logger

-   Respuesta HTTP `200` de `/api/loggerTest`.
-   Verificación del mensaje de éxito.
-   Verificación de los seis niveles de logging informados por el
    endpoint.

#### Swagger

-   Verificación de la disponibilidad de `/api/docs/`.
-   Comprobación de la respuesta HTTP `200` y del contenido de Swagger
    UI.

#### Rutas inexistentes

-   Verificación de la respuesta HTTP `404`.
-   Comprobación del código `ROUTE_NOT_FOUND`.
-   Comprobación del mensaje `La ruta solicitada no existe`.

#### Entorno de testing

-   Verificación de `NODE_ENV=test`.
-   Validación de la URI y del nombre de la base de pruebas.
-   Preparación y cierre de la conexión de Mongoose mediante los hooks
    de Mocha.

### Formato de las respuestas de error

Las pruebas comprueban las respuestas de error mediante el formato
centralizado de ShipNow:

``` json
{
  "status": "error",
  "error": "ERROR_CODE",
  "message": "Mensaje del error"
}
```

Se verifican tanto los códigos HTTP como los códigos de error y los
mensajes correspondientes.

### Repetibilidad de las pruebas

La suite se ejecuta mediante:

``` bash
npm test
```

El setup prepara la base de testing y cierra la conexión al finalizar.
La suite debe poder ejecutarse consecutivamente con resultados
consistentes, sin utilizar la base de desarrollo `shipnow`. En la
validación realizada durante la integración de PE8 se obtuvieron
**46 pruebas aprobadas (46 passing) y 0 fallidas**.

------------------------------------------------------------------------

# 📎 Carga de archivos con Multer --- Pre-entrega 7

La Pre-entrega 7 incorpora la carga de archivos locales mediante
**Multer**, manteniendo la separación de responsabilidades: la
configuración del almacenamiento se encuentra en `src/config/multer.js`,
el middleware adapta los errores de carga, los controllers reciben el
archivo y los services validan la entidad y persisten sus metadatos
mediante los repositories.

## Configuración y restricciones

-   Almacenamiento local en disco, dentro de `uploads/`.
-   Nombre de archivo generado con UUID para evitar colisiones y no
    utilizar directamente el nombre original.
-   Tamaño máximo por archivo: **5 MB**.
-   Máximo de **un archivo por solicitud**.
-   Tipos MIME admitidos: `application/pdf`, `image/jpeg`, `image/png` y
    `image/webp`.
-   Extensión asignada a partir del MIME admitido: `.pdf`, `.jpg`,
    `.png` o `.webp`.
-   Las carpetas de destino se crean automáticamente cuando se realiza
    una carga.
-   Los archivos se sirven estáticamente bajo el prefijo `/uploads`.

La validación de tipo implementada se basa en el MIME informado por
Multer; no se debe interpretar como un análisis antivirus o una
inspección profunda del contenido binario.

## Cargar un documento de usuario

**Endpoint**

``` http
POST /api/users/:id/documents
```

La solicitud debe enviarse como `multipart/form-data` con:

  Campo        Tipo      Descripción
  ------------ --------- ---------------------------------------------
  `document`   Archivo   Archivo PDF, JPEG, PNG o WEBP.
  `type`       Texto     Tipo de documento admitido por el servicio.

Valores permitidos para `type`:

-   `user_document`
-   `driver_license`

Ejemplo con cURL:

``` bash
curl -X POST "http://localhost:8080/api/users/USER_ID/documents" \
  -F "type=user_document" \
  -F "document=@./documento.pdf"
```

El service verifica el tipo de documento y la existencia del usuario. Si
la operación es correcta, agrega los metadatos al array `documents` del
usuario.

## Cargar un comprobante de pedido

**Endpoint**

``` http
POST /api/orders/:id/proof
```

La solicitud debe enviarse como `multipart/form-data` y utilizar el
campo de archivo `proof`.

Ejemplo con cURL:

``` bash
curl -X POST "http://localhost:8080/api/orders/ORDER_ID/proof" \
  -F "proof=@./comprobante.png"
```

El service verifica que el pedido exista y guarda los metadatos del
comprobante en el campo `proof` del pedido.

## Metadatos persistidos

Los archivos no se guardan como contenido binario dentro de MongoDB. Se
guarda la información necesaria para identificarlos y acceder a ellos.

Los documentos de usuario almacenan:

-   `type`
-   `originalName`
-   `filename`
-   `path`
-   `mimetype`
-   `size`
-   `uploadedAt`

El comprobante de pedido almacena los mismos metadatos, excepto `type`.

Las rutas públicas generadas tienen este formato:

``` text
/uploads/documents/UUID.ext
/uploads/proofs/UUID.ext
```

El acceso estático se monta en `src/app.js` mediante Express. Por
ejemplo, una URL local de documento tendrá el formato
`http://localhost:8080/uploads/documents/UUID.pdf`.

## Errores de carga

El middleware transforma los errores de Multer en errores de aplicación
estandarizados. Entre los códigos contemplados se encuentran:

  ----------------------------------------------------------------------------
  Código                                            HTTP Situación
  ------------------------- ---------------------------- ---------------------
  `FILE_REQUIRED`                                    400 No se adjuntó un
                                                         archivo.

  `INVALID_FILE_TYPE`                                400 MIME no permitido.

  `FILE_TOO_LARGE`                                   400 Archivo superior a 5
                                                         MB.

  `INVALID_FILE_FIELD`                               400 Nombre de campo de
                                                         archivo inesperado.

  `INVALID_DOCUMENT_TYPE`                            400 Tipo de documento de
                                                         usuario no admitido.

  `UPLOAD_ERROR`                                     400 Otro error de
                                                         procesamiento de la
                                                         carga.

  `USER_NOT_FOUND`                                   404 El usuario asociado
                                                         no existe.

  `ORDER_NOT_FOUND`                                  404 El pedido asociado no
                                                         existe.
  ----------------------------------------------------------------------------

Si falla la asociación del archivo con el usuario o pedido, el service
intenta eliminar el archivo físico recién cargado para evitar archivos
huérfanos. Los fallos de limpieza se registran mediante el logger.

## Archivos y seguridad del repositorio

El directorio `uploads/` se sirve públicamente desde la aplicación. Por
ello, no debe utilizarse para almacenar archivos que requieran
confidencialidad o autorización de acceso. En el repositorio se conserva
`uploads/.gitkeep`, pero se ignoran los archivos cargados. También se
excluyen `.env.test`, logs y archivos de entorno locales.

## Verificaciones manuales realizadas

Durante la implementación se probaron cargas correctas de documentos de
usuario y comprobantes de pedidos, además de los siguientes escenarios
negativos:

-   Solicitud sin archivo (`FILE_REQUIRED`).
-   Tipo de documento no admitido (`INVALID_DOCUMENT_TYPE`).
-   Usuario inexistente (`USER_NOT_FOUND`).
-   Archivo con MIME no permitido (`INVALID_FILE_TYPE`).
-   Archivo superior a 5 MB (`FILE_TOO_LARGE`).
-   Campo de archivo incorrecto (`INVALID_FILE_FIELD`).

------------------------------------------------------------------------

# 🎯 Pre-entregas implementadas

## Pre-entrega 1

-   Arquitectura por capas.
-   Configuración centralizada.
-   Variables de entorno.
-   Constantes de dominio.
-   Controllers.
-   Services.
-   Repositories.
-   Models.
-   Routers.

## Pre-entrega 2

-   Mocking.
-   Generación de usuarios.
-   Generación de pedidos.
-   Generación de entregas.
-   Persistencia de datos mock.
-   Seed completo.
-   Relaciones entre documentos.
-   Populate.
-   Protección del módulo Mocking.

## Pre-entrega 3

-   Manejo centralizado de errores.
-   `AppError`.
-   Diccionario centralizado de errores.
-   `createAppError()`.
-   Respuestas de error uniformes.
-   Manejo de rutas inexistentes.
-   Validación de errores de dominio.

## Pre-entrega 4

-   Winston.
-   Logging centralizado.
-   Seis niveles personalizados.
-   Diferenciación visual de niveles mediante colores.
-   Persistencia de errores.
-   Rotación diaria.
-   Retención de 14 días.
-   Integración con middleware global de errores.
-   Endpoint `/api/loggerTest`.

## Pre-entrega 5

-   OpenAPI 3.0.
-   Swagger UI.
-   `swagger-jsdoc`.
-   `swagger-ui-express`.
-   Documentación interactiva.
-   Tags para Users, Orders, Deliveries, Mocks y Logger.
-   Documentación de endpoints.
-   Parámetros y request bodies.
-   Respuestas exitosas.
-   Respuestas de error.
-   Schemas reutilizables.
-   Documentación de errores.
-   Ejemplos de uso.
-   Ruta `/api/docs`.
-   Consistencia entre documentación y API real.

## Pre-entrega 6

-   Mocha, Chai y Supertest.
-   Configuración de pruebas funcionales automatizadas.
-   Script `npm test`.
-   Separación entre la base de desarrollo y la base de testing.
-   Configuración local mediante `.env.test`.
-   Validación de la URI de testing.
-   Setup y hooks para preparar y cerrar la conexión de Mongoose.
-   Pruebas funcionales de usuarios.
-   Pruebas funcionales de pedidos.
-   Validación de cantidades del módulo Mocking.
-   Prueba del endpoint del logger.
-   Prueba de disponibilidad de Swagger.
-   Prueba de rutas inexistentes.
-   Verificación de códigos HTTP, códigos de error y mensajes.
-   Preparación de la suite para ejecuciones repetibles.

------------------------------------------------------------------------

## Pre-entrega 7

-   Carga local de archivos con Multer.
-   Almacenamiento en disco con UUID y carpetas separadas para
    documentos y comprobantes.
-   Validación de MIME, tamaño máximo de 5 MB y un archivo por
    solicitud.
-   Middleware para traducir errores de Multer al sistema centralizado
    de errores.
-   Carga de documentos de usuarios mediante
    `POST /api/users/:id/documents`.
-   Carga de comprobantes mediante `POST /api/orders/:id/proof`.
-   Persistencia de metadatos de documentos y comprobantes en MongoDB.
-   Publicación estática de archivos bajo `/uploads`.
-   Eliminación de archivos cargados cuando falla la asociación con la
    entidad.
-   Exclusión de los archivos subidos mediante `.gitignore`.

# ⚡ Performance, escalabilidad y Docker --- Pre-entrega 8

La Pre-entrega 8 incorpora mejoras para controlar el volumen de
respuestas, configurar la aplicación según el entorno y ejecutar ShipNow
en un contenedor Docker.

## Paginación de listados

Se incorporó una utilidad compartida en:

``` text
src/utils/pagination.js
```

La utilidad procesa los parámetros `page` y `limit`, calcula `skip` y
construye los metadatos de paginación. Los valores predeterminados son:

| Parámetro | Valor |
| --- | ---: |
| `page` | 1 |
| `limit` | 10 |
| Límite máximo | 50 |

Los parámetros deben ser números enteros mayores que cero. Los valores
de `limit` superiores al máximo se ajustan a 50. Los listados de
usuarios, pedidos y entregas utilizan paginación en sus operaciones de
consulta.

Ejemplo de consulta:

``` http
GET /api/orders?page=2&limit=10
```

La respuesta de los listados incorpora metadatos como página actual,
límite, cantidad total, cantidad de páginas y disponibilidad de página
anterior o siguiente.

## Configuración por entorno

La configuración centralizada se encuentra en:

``` text
src/config/index.js
```

Se contemplan los entornos `development`, `test` y `production`. Entre
las variables utilizadas se encuentran:

| Variable | Función |
| --- | --- |
| `PORT` | Puerto HTTP de la aplicación. |
| `MONGODB_URI` | URI de MongoDB para desarrollo o producción. |
| `MONGODB_URI_TEST` | URI exclusiva para testing. |
| `NODE_ENV` | Entorno de ejecución. |
| `LOG_LEVEL` | Nivel mínimo de logging. |

La configuración valida el entorno, el puerto, las variables requeridas
y el nivel de logging. En testing comprueba además que la URI apunte a
la base `shipnow_test`, evitando utilizar accidentalmente la base de
desarrollo.

Los archivos `.env`, `.env.test` y demás archivos locales con secretos
no deben versionarse. Se proporciona `.env.example` como referencia
para desarrollo y `.env.test.example` como referencia para testing.

## Health check

El endpoint `GET /health` responde con:

- Estado de la API.
- Entorno de ejecución.
- Tiempo de actividad del proceso (`uptime`).
- Fecha y hora de generación de la respuesta (`timestamp`).

No devuelve URI de MongoDB, contraseñas ni secretos de configuración.
Su respuesta se verifica mediante una prueba funcional automatizada.

## Dockerfile

El proyecto incorpora un `Dockerfile` basado en `node:22-alpine`. La
imagen instala dependencias de producción, copia el código de la API,
prepara los directorios `uploads` y `logs` y ejecuta el proceso con el
usuario sin privilegios `node`.

La imagen establece `NODE_ENV=production` y `PORT=8080` como valores
predeterminados. Las variables sensibles y la URI de MongoDB deben
proporcionarse al ejecutar el contenedor, no deben incluirse dentro de
la imagen.

### Construir la imagen

Desde la raíz del proyecto:

``` bash
docker build -t shipnow:pe8 .
```

### Ejecutar el contenedor

Ejemplo de ejecución, reemplazando la URI por la correspondiente al
entorno donde se encuentre MongoDB:

``` bash
docker run --name shipnow-api -p 8080:8080 \
  -e MONGODB_URI="mongodb://host.docker.internal:27017/shipnow" \
  -e NODE_ENV=production \
  -e LOG_LEVEL=info \
  shipnow:pe8
```

Si MongoDB se encuentra en otro host o servicio, debe utilizarse una URI
accesible desde el contenedor. No se debe copiar una URI con credenciales
reales al README ni al repositorio.

Una vez iniciado, pueden verificarse la API, el health check y Swagger
utilizando el puerto publicado en el host:

``` text
http://localhost:8080/
http://localhost:8080/health
http://localhost:8080/api/docs
```

## .dockerignore

El archivo `.dockerignore` reduce el contexto enviado al motor de Docker
y evita copiar elementos que no deben formar parte de la imagen, como:

- `node_modules/` local.
- Archivos `.env` y configuraciones locales.
- `.git/` y `.gitignore`.
- Logs.
- Archivos cargados por usuarios en `uploads/`.
- Tests y archivos de cobertura.
- Archivos temporales y del sistema.
- Documentación README.

Los archivos de entorno, logs, archivos subidos y dependencias locales
no deben incorporarse a la imagen como datos del entorno de desarrollo.

## Verificaciones de PE8

Durante la validación se comprobó que:

- `npm test` finalizó con **46 passing y 0 failing**.
- `docker build -t shipnow:pe8 .` finalizó correctamente.
- La imagen `shipnow:pe8` se generó sin errores.
- El contenedor respondió correctamente al endpoint `/health` con
  `environment: production`.
- Swagger UI se visualizó desde la aplicación ejecutada en Docker.

La construcción de la imagen y la respuesta de health check fueron
verificadas en el entorno local de Docker Desktop.

------------------------------------------------------------------------

# 🎯 Objetivos académicos

Este proyecto fue desarrollado como parte del proceso de aprendizaje de
**Backend 3 de Coderhouse**.

Los principales objetivos son aplicar:

-   Arquitectura por capas.
-   Separación de responsabilidades.
-   Configuración centralizada.
-   Variables de entorno.
-   Constantes de dominio.
-   Repositories.
-   Services.
-   Controllers.
-   Routers.
-   Models con Mongoose.
-   MongoDB.
-   Mocking.
-   Carga de datos de prueba.
-   Relaciones entre documentos.
-   Middleware.
-   Manejo centralizado de errores.
-   Errores personalizados.
-   Diccionario de errores.
-   Respuestas de error uniformes.
-   Validación de errores de dominio.
-   Manejo de rutas inexistentes.
-   Logging centralizado.
-   Winston.
-   Niveles de logging.
-   Colores diferenciados en consola.
-   Persistencia de errores.
-   Rotación de archivos.
-   OpenAPI.
-   Swagger UI.
-   Documentación profesional de APIs.
-   Pruebas funcionales automatizadas.
-   Mocha, Chai y Supertest.
-   Aislamiento de la base de datos de testing.
-   Validación automatizada de respuestas HTTP y errores.
-   Configuración de entornos de prueba.
-   Paginación de listados y límites de resultados.
-   Validación de configuración para development, test y production.
-   Health check con estado, entorno, uptime y timestamp.
-   Construcción y ejecución de la API mediante Docker.
-   Exclusión de archivos locales y sensibles mediante `.dockerignore`.

------------------------------------------------------------------------

# 🚀 Estado actual del proyecto

Actualmente ShipNow cuenta con:

-   ✅ Arquitectura por capas.
-   ✅ Configuración mediante variables de entorno.
-   ✅ Conexión a MongoDB.
-   ✅ Gestión de usuarios.
-   ✅ Gestión de productos.
-   ✅ Gestión de pedidos.
-   ✅ Gestión de entregas.
-   ✅ Constantes de dominio.
-   ✅ Repositories.
-   ✅ Services.
-   ✅ Controllers.
-   ✅ Routers.
-   ✅ Middleware de errores.
-   ✅ Middleware de rutas inexistentes.
-   ✅ Middleware de protección para Mocking.
-   ✅ `AppError`.
-   ✅ Diccionario centralizado de errores.
-   ✅ `createAppError()`.
-   ✅ Respuestas de error uniformes.
-   ✅ Manejo de errores de dominio.
-   ✅ Manejo de errores de base de datos.
-   ✅ Generación de usuarios mock.
-   ✅ Generación de pedidos mock.
-   ✅ Generación de entregas mock.
-   ✅ Persistencia de datos mock.
-   ✅ Seed completo de usuarios, pedidos y entregas.
-   ✅ Relaciones entre usuarios, pedidos y entregas.
-   ✅ Populate de relaciones.
-   ✅ Validación de cantidades.
-   ✅ Límite máximo de 50 registros para Mocking.
-   ✅ Protección de Mocking en producción.
-   ✅ Logger centralizado con Winston.
-   ✅ Seis niveles de logging: `debug`, `http`, `info`, `warning`,
    `error`, `fatal`.
-   ✅ Colores diferenciados por nivel en consola.
-   ✅ Endpoint `/api/loggerTest`.
-   ✅ Integración del logger con el middleware global de errores.
-   ✅ Persistencia de errores.
-   ✅ Rotación diaria de archivos de log.
-   ✅ Retención de logs de errores durante 14 días.
-   ✅ Protección de archivos de log mediante `.gitignore`.
-   ✅ Documentación OpenAPI 3.0.
-   ✅ Swagger UI.
-   ✅ Documentación interactiva en `/api/docs`.
-   ✅ Schemas reutilizables.
-   ✅ Documentación de Users.
-   ✅ Documentación de Orders.
-   ✅ Documentación de Deliveries.
-   ✅ Documentación de Mocks.
-   ✅ Documentación de Logger.
-   ✅ README con documentación de las pre-entregas 1 a 8.
-   ✅ Pruebas funcionales automatizadas con Mocha, Chai y Supertest.
-   ✅ Configuración del entorno de testing.
-   ✅ Base de datos de testing independiente: `shipnow_test`.
-   ✅ Pruebas de consulta, creación y validación de usuarios.
-   ✅ Pruebas de consulta, creación y validación de pedidos.
-   ✅ Pruebas de cantidades inválidas del módulo Mocking.
-   ✅ Prueba funcional del endpoint del logger.
-   ✅ Prueba funcional de disponibilidad de Swagger.
-   ✅ Prueba funcional de rutas inexistentes.
-   ✅ Verificación de respuestas HTTP y errores estandarizados.
-   ✅ Script `npm test`.
-   ✅ Carga de documentos de usuarios y comprobantes de pedidos con
    Multer.
-   ✅ Validación de MIME, tamaño y campo multipart.
-   ✅ Persistencia de metadatos de archivos en MongoDB.
-   ✅ Publicación de archivos mediante `/uploads`.
-   ✅ Limpieza de archivos físicos cuando falla su asociación.
-   ✅ Exclusión de archivos subidos y `.env.test` mediante
    `.gitignore`.
-   ✅ Suite automatizada ejecutada correctamente: 28 pruebas aprobadas
    y 0 fallidas en la última validación.

------------------------------------------------------------------------

# 👨‍💻 Autor

**Ivan Sanchez**

Proyecto académico desarrollado para:

**Coderhouse --- Backend 3**

Proyecto:

**ShipNow --- API de logística**
