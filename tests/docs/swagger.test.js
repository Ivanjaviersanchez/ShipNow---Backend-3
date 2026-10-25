
import { expect } from "chai";
import request from "supertest";

import app from "../../src/app.js";

describe("Pruebas funcionales de Swagger", function () {
  describe("GET /api/docs/", function () {
    it("debe responder 200 y mostrar la documentación de la API", async function () {
      const response = await request(app)
        .get("/api/docs/");

      expect(response.status).to.equal(200);
      expect(response.text).to.include("swagger-ui");
      expect(response.text.toLowerCase()).to.include("swagger");
    });
  });
});
