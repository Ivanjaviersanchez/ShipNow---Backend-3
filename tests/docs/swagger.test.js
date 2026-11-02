import { expect } from "chai";
import request from "supertest";

import app from "../../src/app.js";
import { swaggerSpecs } from "../../src/docs/swagger.config.js";

describe("Pruebas funcionales y documentación de Swagger", function () {
  describe("GET /api/docs/", function () {
    it("debe responder 200 y mostrar Swagger UI", async function () {
      const response = await request(app).get("/api/docs/");

      expect(response.status).to.equal(200);
      expect(response.text).to.include("swagger-ui");
      expect(response.text.toLowerCase()).to.include("swagger");
    });
  });

  describe("Definiciones OpenAPI", function () {
    it("debe documentar USER_ALREADY_EXISTS con HTTP 409", function () {
      const response =
        swaggerSpecs.paths["/api/users"].post.responses["409"];

      expect(response.content["application/json"].example.error)
        .to.equal("USER_ALREADY_EXISTS");
    });

    it("debe documentar INVALID_USER_ROLE con HTTP 400", function () {
      const response =
        swaggerSpecs.paths["/api/users"].post.responses["400"];

      expect(
        response.content["application/json"].examples.invalidRole.value.error
      ).to.equal("INVALID_USER_ROLE");
    });

    it("debe documentar ORDER_ITEMS_REQUIRED con HTTP 400", function () {
      const response =
        swaggerSpecs.paths["/api/orders"].post.responses["400"];

      expect(
        response.content["application/json"].examples.itemsRequired.value.error
      ).to.equal("ORDER_ITEMS_REQUIRED");
    });

    it("debe documentar la consulta de un pedido por ID", function () {
      const responses =
        swaggerSpecs.paths["/api/orders/{id}"].get.responses;

      expect(responses["200"]).to.exist;
      expect(responses["404"]).to.exist;
    });

    it("debe documentar la actualización del estado de un pedido", function () {
      const responses =
        swaggerSpecs.paths["/api/orders/{id}/status"].patch.responses;

      expect(responses["200"]).to.exist;
      expect(responses["400"]).to.exist;
      expect(responses["404"]).to.exist;
    });

    it("debe documentar FORBIDDEN con HTTP 403 en los mocks", function () {
      const response =
        swaggerSpecs.paths["/api/mocks/users"].get.responses["403"];

      expect(response.content["application/json"].example.error)
        .to.equal("FORBIDDEN");
    });
  });
});