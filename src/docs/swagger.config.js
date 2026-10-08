import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "ShipNow API",
      version: "1.0.0",
      description:
        "Documentacion de la API ShipNow para la gestion de usuarios, pedidos, entregas, mocks, errores y logging.",
    },

    servers: [
      {
        url: "http://localhost:8080",
        description: "Servidor local",
      },
    ],

    tags: [
      {
        name: "Users",
        description: "Operaciones relacionadas con usuarios",
      },
      {
        name: "Orders",
        description: "Operaciones relacionadas con pedidos",
      },
      {
        name: "Deliveries",
        description: "Operaciones relacionadas con entregas",
      },
      {
        name: "Mocks",
        description: "Generacion y carga de datos de prueba",
      },
      {
        name: "Logger",
        description: "Herramientas de validacion del sistema de logging",
      },
    ],
  },

  apis: ["./src/docs/**/*.yaml"],
};

export const swaggerSpecs = swaggerJSDoc(swaggerOptions);