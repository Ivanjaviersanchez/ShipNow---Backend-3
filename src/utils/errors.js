export const ERROR_DEFINITIONS = Object.freeze({

  USER_NOT_FOUND: {
    code: "USER_NOT_FOUND",
    statusCode: 404,
    message: "No se encontró el usuario solicitado"
  },

  USER_ALREADY_EXISTS: {
    code: "USER_ALREADY_EXISTS",
    statusCode: 409,
    message: "Ya existe un usuario registrado con ese email"
  },

  INVALID_USER_ROLE: {
    code: "INVALID_USER_ROLE",
    statusCode: 400,
    message: "El rol de usuario no es válido"
  },

  VALIDATION_ERROR: {
    code: "VALIDATION_ERROR",
    statusCode: 400,
    message: "Los datos enviados no son válidos"
  },

  FORBIDDEN: {
    code: "FORBIDDEN",
    statusCode: 403,
    message: "No tenés permisos para realizar esta operación"
  },

  PRODUCT_NOT_FOUND: {
    code: "PRODUCT_NOT_FOUND",
    statusCode: 404,
    message: "No se encontró el producto solicitado"
  },

  PRODUCT_VALIDATION_ERROR: {
    code: "PRODUCT_VALIDATION_ERROR",
    statusCode: 400,
    message: "Los datos del producto no son válidos"
  },

  ORDER_NOT_FOUND: {
    code: "ORDER_NOT_FOUND",
    statusCode: 404,
    message: "No se encontró el pedido solicitado"
  },

  INVALID_ORDER_STATUS: {
    code: "INVALID_ORDER_STATUS",
    statusCode: 400,
    message: "El estado indicado no es válido para un pedido"
  },

  ORDER_ITEMS_REQUIRED: {
    code: "ORDER_ITEMS_REQUIRED",
    statusCode: 400,
    message: "El pedido debe contener al menos un producto"
  },

  DELIVERY_NOT_FOUND: {
    code: "DELIVERY_NOT_FOUND",
    statusCode: 404,
    message: "No se encontró la entrega solicitada"
  },

  INVALID_DELIVERY_STATUS: {
    code: "INVALID_DELIVERY_STATUS",
    statusCode: 400,
    message: "El estado de la entrega no es válido"
  },

  INVALID_MOCK_AMOUNT: {
    code: "INVALID_MOCK_AMOUNT",
    statusCode: 400,
    message: "La cantidad de registros a generar no es válida"
  },

  DATABASE_ERROR: {
    code: "DATABASE_ERROR",
    statusCode: 500,
    message: "Ocurrió un error al acceder a la base de datos"
  },

  INTERNAL_SERVER_ERROR: {
    code: "INTERNAL_SERVER_ERROR",
    statusCode: 500,
    message: "Ocurrió un error interno del servidor"
  },

  ROUTE_NOT_FOUND: {
    code: "ROUTE_NOT_FOUND",
    statusCode: 404,
    message: "La ruta solicitada no existe"
  }

});

export class AppError extends Error {

  constructor(
    message,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR"
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }

}

export const createAppError = (
  errorKey,
  customMessage = null
) => {

  const definition = ERROR_DEFINITIONS[errorKey];

  if (!definition) {
    return new AppError(
      ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR.message,
      ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR.statusCode,
      ERROR_DEFINITIONS.INTERNAL_SERVER_ERROR.code
    );
  }

  return new AppError(
    customMessage || definition.message,
    definition.statusCode,
    definition.code
  );

};