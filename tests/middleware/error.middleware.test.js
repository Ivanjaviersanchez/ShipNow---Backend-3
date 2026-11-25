
import { expect } from "chai";

import { errorHandler } from "../../src/middleware/error.middleware.js";
import { config } from "../../src/config/index.js";
import { createAppError } from "../../src/utils/errors.js";

describe("Middleware centralizado de errores", function () {
  let originalNodeEnv;
  let response;
  let statusCode;
  let responseBody;

  beforeEach(function () {
    originalNodeEnv = config.nodeEnv;
    statusCode = null;
    responseBody = null;

    response = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) {
        responseBody = body;
        return this;
      }
    };
  });

  afterEach(function () {
    config.nodeEnv = originalNodeEnv;
  });

  it("debe mostrar detalles técnicos en development", function () {
    config.nodeEnv = "development";

    const error = createAppError(
      "VALIDATION_ERROR",
      "El parámetro page debe ser mayor a 0"
    );

    errorHandler(
      error,
      { method: "GET", originalUrl: "/api/orders" },
      response,
      () => {}
    );

    expect(statusCode).to.equal(400);
    expect(responseBody.status).to.equal("error");
    expect(responseBody.error).to.equal("VALIDATION_ERROR");
    expect(responseBody.message).to.equal(
      "El parámetro page debe ser mayor a 0"
    );
    expect(responseBody.details).to.exist;
    expect(responseBody.details.stack).to.be.a("string");
  });

  it("no debe exponer detalles técnicos en test", function () {
    config.nodeEnv = "test";

    const error = createAppError("VALIDATION_ERROR");

    errorHandler(
      error,
      { method: "GET", originalUrl: "/api/orders" },
      response,
      () => {}
    );

    expect(statusCode).to.equal(400);
    expect(responseBody.error).to.equal("VALIDATION_ERROR");
    expect(responseBody.details).to.be.undefined;
  });

  it("debe conservar los mensajes de validación en production", function () {
    config.nodeEnv = "production";

    const error = createAppError(
      "VALIDATION_ERROR",
      "El parámetro limit debe ser un número entero mayor a 0"
    );

    errorHandler(
      error,
      { method: "GET", originalUrl: "/api/orders" },
      response,
      () => {}
    );

    expect(statusCode).to.equal(400);
    expect(responseBody.error).to.equal("VALIDATION_ERROR");
    expect(responseBody.message).to.equal(
      "El parámetro limit debe ser un número entero mayor a 0"
    );
    expect(responseBody.details).to.be.undefined;
  });

  it("debe ocultar los detalles de errores internos en production", function () {
    config.nodeEnv = "production";

    const error = new Error("Error interno con información sensible");
    error.statusCode = 500;
    error.code = "DATABASE_ERROR";

    errorHandler(
      error,
      { method: "GET", originalUrl: "/api/orders" },
      response,
      () => {}
    );

    expect(statusCode).to.equal(500);
    expect(responseBody.status).to.equal("error");
    expect(responseBody.error).to.equal("INTERNAL_SERVER_ERROR");
    expect(responseBody.message).to.equal(
      "Ocurrió un error interno del servidor"
    );
    expect(responseBody.details).to.be.undefined;
    expect(responseBody.message).not.to.include("información sensible");
  });
});
