
import { expect } from "chai";
import request from "supertest";
import fs from "node:fs/promises";
import path from "node:path";

import app from "../../src/app.js";
import UserModel from "../../src/models/user.model.js";

describe("Pruebas funcionales de usuarios", function () {
  describe("GET /api/users", function () {
    it("debe responder 200 y devolver una lista de usuarios", async function () {
      const response = await request(app).get("/api/users");

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal("success");
      expect(response.body.payload).to.be.an("array");
    });

    it("debe responder 404 cuando el usuario no existe", async function () {
      const nonExistentId = "68f3a5b2c9d4e7f102938475";

      const response = await request(app).get(
        `/api/users/${nonExistentId}`
      );

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
      expect(response.body.payload.email).to.equal(userData.email);
      expect(response.body.payload.role).to.equal("customer");
      expect(response.body.payload).to.not.have.property("password");

      const savedUser = await UserModel.findOne({
        email: userData.email
      });

      expect(savedUser).to.not.equal(null);
      expect(savedUser.firstName).to.equal("Usuario");
    });

    it("debe responder 409 cuando se intenta registrar un email duplicado", async function () {
      const userData = {
        firstName: "Usuario",
        lastName: "Original",
        email: "duplicado@shipnow.test",
        password: "Test123456"
      };

      await request(app)
        .post("/api/users")
        .send(userData);

      const response = await request(app)
        .post("/api/users")
        .send({
          ...userData,
          firstName: "Otro"
        });

      expect(response.status).to.equal(409);
      expect(response.body.status).to.equal("error");
      expect(response.body.error).to.equal("USER_ALREADY_EXISTS");
      expect(response.body.message).to.equal(
        "Ya existe un usuario registrado con ese email"
      );

      const users = await UserModel.find({
        email: userData.email
      });

      expect(users).to.have.lengthOf(1);
    });

    it("debe responder 400 cuando se envía un rol inválido", async function () {
      const response = await request(app)
        .post("/api/users")
        .send({
          firstName: "Usuario",
          lastName: "RolInvalido",
          email: "rol.invalido@shipnow.test",
          password: "Test123456",
          role: "superadmin"
        });

      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal("error");
      expect(response.body.error).to.equal("INVALID_USER_ROLE");
      expect(response.body.message).to.equal(
        "El rol de usuario no es válido"
      );

      const savedUser = await UserModel.findOne({
        email: "rol.invalido@shipnow.test"
      });

      expect(savedUser).to.equal(null);
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

  describe("POST /api/users/:id/documents", function () {
    const createTestUser = async () => {
      const response = await request(app)
        .post("/api/users")
        .send({
          firstName: "Usuario",
          lastName: "Upload",
          email: `upload.${Date.now()}@shipnow.test`,
          password: "Test123456"
        });

      expect(response.status).to.equal(201);

      return response.body.payload;
    };

    const removeTestDocument = async (filename) => {
      if (!filename) return;

      const filePath = path.join(
        process.cwd(),
        "uploads",
        "documents",
        filename
      );

      await fs.rm(filePath, { force: true });
    };

    it("debe subir un documento PDF y guardar sus metadatos", async function () {
      const user = await createTestUser();
      let uploadedFilename;

      try {
        const pdfBuffer = Buffer.from(
          "%PDF-1.4\nDocumento de prueba ShipNow"
        );

        const response = await request(app)
          .post(`/api/users/${user._id}/documents`)
          .field("type", "user_document")
          .attach("document", pdfBuffer, {
            filename: "documento-prueba.pdf",
            contentType: "application/pdf"
          });

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");

        const savedUser = await UserModel.findById(user._id);

        expect(savedUser).to.not.equal(null);
        expect(savedUser.documents).to.have.lengthOf(1);

        const document = savedUser.documents[0];

        expect(document.originalName).to.equal("documento-prueba.pdf");
        expect(document.mimetype).to.equal("application/pdf");
        expect(document.path).to.include("/uploads/documents/");
        expect(document.size).to.equal(pdfBuffer.length);

        uploadedFilename = document.filename;
      } finally {
        await removeTestDocument(uploadedFilename);
      }
    });

    it("debe responder FILE_REQUIRED cuando no se adjunta un documento", async function () {
      const user = await createTestUser();

      const response = await request(app)
        .post(`/api/users/${user._id}/documents`)
        .field("type", "user_document");

      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal("error");
      expect(response.body.error).to.equal("FILE_REQUIRED");

      const savedUser = await UserModel.findById(user._id);

      expect(savedUser.documents ?? []).to.have.lengthOf(0);
    });

    it("debe rechazar un documento con tipo MIME no permitido", async function () {
      const user = await createTestUser();

      const response = await request(app)
        .post(`/api/users/${user._id}/documents`)
        .field("type", "user_document")
        .attach("document", Buffer.from("Archivo de texto"), {
          filename: "documento.txt",
          contentType: "text/plain"
        });

      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal("error");
      expect(response.body.error).to.equal("INVALID_FILE_TYPE");

      const savedUser = await UserModel.findById(user._id);

      expect(savedUser.documents ?? []).to.have.lengthOf(0);
    });

    it("debe rechazar un documento que supere los 5 MB", async function () {
      const user = await createTestUser();
      const largeBuffer = Buffer.alloc(5 * 1024 * 1024 + 1);

      const response = await request(app)
        .post(`/api/users/${user._id}/documents`)
        .field("type", "user_document")
        .attach("document", largeBuffer, {
          filename: "documento-grande.pdf",
          contentType: "application/pdf"
        });

      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal("error");
      expect(response.body.error).to.equal("FILE_TOO_LARGE");

      const savedUser = await UserModel.findById(user._id);

      expect(savedUser.documents ?? []).to.have.lengthOf(0);
    });
  });
});
