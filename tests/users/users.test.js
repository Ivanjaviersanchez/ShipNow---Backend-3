
import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";
import UserModel from "../../src/models/user.model.js";

describe("Pruebas funcionales de usuarios", function () {
  describe("GET /api/users", function () {
    it("debe responder 200 y devolver una lista de usuarios", async function () {
      const response = await request(app)
        .get("/api/users");

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal("success");
      expect(response.body.payload).to.be.an("array");
    });

    it("debe responder 404 cuando el usuario no existe", async function () {
      const nonExistentId = "68f3a5b2c9d4e7f102938475";

      const response = await request(app)
        .get(`/api/users/${nonExistentId}`);

      expect(response.status).to.equal(404);
      expect(response.body.status).to.equal("error");
      expect(response.body.error).to.equal("USER_NOT_FOUND");
      expect(response.body.message).to.equal(
        "No se encontró el usuario solicitado"
      );
    });
  });

  describe("POST /api/users", function () {
    it("debe crear un usuario y guardarlo en la base de testing", async function () {
      const userData = {
        firstName: "Usuario",
        lastName: "Prueba",
        email: "usuario.prueba@shipnow.test",
        password: "Test123456"
      };

      const response = await request(app)
        .post("/api/users")
        .send(userData);

      expect(response.status).to.equal(201);
      expect(response.body.status).to.equal("success");
      expect(response.body.message).to.equal(
        "Usuario creado correctamente"
      );
      expect(response.body.payload).to.be.an("object");
      expect(response.body.payload.email).to.equal(
        userData.email
      );
      expect(response.body.payload.role).to.equal("customer");
      expect(response.body.payload).to.not.have.property("password");

      const savedUser = await UserModel.findOne({
        email: userData.email
      });

      expect(savedUser).to.not.equal(null);
      expect(savedUser.firstName).to.equal("Usuario");
    });

    it("debe responder 400 si faltan campos obligatorios", async function () {
      const response = await request(app)
        .post("/api/users")
        .send({
          firstName: "Usuario"
        });

      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal("error");
      expect(response.body.error).to.equal("VALIDATION_ERROR");
      expect(response.body.message).to.equal(
        "Los campos firstName, lastName y email son obligatorios"
      );
    });
  });
});