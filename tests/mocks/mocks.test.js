
import { expect } from "chai";
import request from "supertest";

import app from "../../src/app.js";

describe("Pruebas funcionales de mocks", function () {
  describe("GET /api/mocks/users", function () {
    it("debe responder 400 si la cantidad es cero", async function () {
      const response = await request(app)
        .get("/api/mocks/users?qty=0");

      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal("error");
      expect(response.body.error).to.equal(
        "INVALID_MOCK_AMOUNT"
      );
      expect(response.body.message).to.equal(
        "La cantidad debe ser un número entero mayor a 0"
      );
    });

    it("debe responder 400 si la cantidad supera el máximo permitido", async function () {
      const response = await request(app)
        .get("/api/mocks/users?qty=51");

      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal("error");
      expect(response.body.error).to.equal(
        "INVALID_MOCK_AMOUNT"
      );
      expect(response.body.message).to.equal(
        "La cantidad máxima permitida es 50"
      );
    });
  });
});
