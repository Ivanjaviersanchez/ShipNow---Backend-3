
import { expect } from "chai";
import request from "supertest";

import app from "../../src/app.js";

describe("Pruebas funcionales de mocks", function () {

  describe("GET /api/mocks/users", function () {

    it("debe generar correctamente la cantidad solicitada de usuarios", async function () {

      const quantity = 3;

      const response = await request(app)
        .get(`/api/mocks/users?qty=${quantity}`);

      expect(response.status).to.equal(200);

      expect(response.body.status).to.equal("success");

      expect(response.body.message).to.equal(
        "Usuarios mock generados correctamente"
      );

      expect(response.body.quantity).to.equal(quantity);

      expect(response.body.payload).to.be.an("array");

      expect(response.body.payload).to.have.lengthOf(quantity);

      response.body.payload.forEach((user) => {
        expect(user).to.be.an("object");
        expect(user).to.have.property("email");
        expect(user).to.have.property("firstName");
        expect(user).to.have.property("lastName");
        expect(user).to.have.property("role");
      });
    });

    it("debe responder 400 si la cantidad es cero", async function () {

      const response = await request(app)
        .get("/api/mocks/users?qty=0");

      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal("error");

      expect(response.body.error).to.equal(
        "INVALID_MOCK_AMOUNT"
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
    });

  });

});
