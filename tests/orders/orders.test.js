
import { expect } from "chai";
import request from "supertest";
import fs from "node:fs/promises";
import path from "node:path";

import app from "../../src/app.js";
import UserModel from "../../src/models/user.model.js";
import OrderModel from "../../src/models/order.model.js";

describe("Pruebas funcionales de pedidos", function () {
  // Cada prueba comienza y termina con sus propios datos.
  beforeEach(async function () {
    await OrderModel.deleteMany({});
    await UserModel.deleteMany({});
  });

  afterEach(async function () {
    await OrderModel.deleteMany({});
    await UserModel.deleteMany({});
  });

  const createCustomer = async () => {
    return UserModel.create({
      firstName: "Cliente",
      lastName: "Prueba",
      email: `cliente.${Date.now()}@shipnow.test`
    });
  };

  const createOrder = async (customer) => {
    return OrderModel.create({
      customer: customer._id,
      items: [
        {
          name: "Producto de prueba",
          quantity: 2,
          price: 1500
        }
      ],
      deliveryAddress: "Calle de prueba 123",
      total: 3000,
      status: "created"
    });
  };

  describe("GET /api/orders", function () {
    it("debe responder 200 y devolver una lista de pedidos", async function () {
      const response = await request(app)
        .get("/api/orders");

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal("success");
      expect(response.body.payload).to.be.an("array");
      expect(response.body.pagination).to.be.an("object");
    });

    it("debe devolver la paginación predeterminada", async function () {
      const customer = await createCustomer();

      await Promise.all(
        Array.from({ length: 12 }, () => createOrder(customer))
      );

      const response = await request(app)
        .get("/api/orders");

      expect(response.status).to.equal(200);
      expect(response.body.payload).to.have.lengthOf(10);

      expect(response.body.pagination).to.deep.equal({
        page: 1,
        limit: 10,
        total: 12,
        totalPages: 2,
        hasPrevPage: false,
        hasNextPage: true
      });
    });

    it("debe permitir consultar una página específica", async function () {
      const customer = await createCustomer();

      await Promise.all(
        Array.from({ length: 12 }, () => createOrder(customer))
      );

      const response = await request(app)
        .get("/api/orders?page=2&limit=5");

      expect(response.status).to.equal(200);
      expect(response.body.payload).to.have.lengthOf(5);

      expect(response.body.pagination).to.deep.equal({
        page: 2,
        limit: 5,
        total: 12,
        totalPages: 3,
        hasPrevPage: true,
        hasNextPage: true
      });
    });

    it("debe limitar el máximo de resultados a 50", async function () {
      const customer = await createCustomer();

      await Promise.all(
        Array.from({ length: 55 }, () => createOrder(customer))
      );

      const response = await request(app)
        .get("/api/orders?limit=100");

      expect(response.status).to.equal(200);
      expect(response.body.payload).to.have.lengthOf(50);
      expect(response.body.pagination.limit).to.equal(50);
      expect(response.body.pagination.total).to.equal(55);
      expect(response.body.pagination.totalPages).to.equal(2);
    });

    it("debe responder 400 cuando page o limit son inválidos", async function () {
      const invalidQueries = [
        "?page=0",
        "?page=-1",
        "?page=abc",
        "?page=1.5",
        "?limit=0",
        "?limit=-5",
        "?limit=abc",
        "?limit=1.5"
      ];

      for (const query of invalidQueries) {
        const response = await request(app)
          .get(`/api/orders${query}`);

        expect(response.status, query).to.equal(400);
        expect(response.body.status, query).to.equal("error");
        expect(response.body.error, query).to.equal("VALIDATION_ERROR");
      }
    });

    it("debe devolver una lista vacía si la página está fuera de rango", async function () {
      const customer = await createCustomer();
      await createOrder(customer);

      const response = await request(app)
        .get("/api/orders?page=5&limit=10");

      expect(response.status).to.equal(200);
      expect(response.body.payload).to.be.an("array").that.is.empty;

      expect(response.body.pagination).to.deep.equal({
        page: 5,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasPrevPage: true,
        hasNextPage: false
      });
    });

    it("debe responder 200 y devolver un pedido existente por ID", async function () {
      const customer = await createCustomer();
      const order = await createOrder(customer);

      const response = await request(app)
        .get(`/api/orders/${order._id}`);

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal("success");
      expect(response.body.payload).to.be.an("object");
      expect(response.body.payload._id).to.equal(
        order._id.toString()
      );
      expect(response.body.payload.deliveryAddress).to.equal(
        "Calle de prueba 123"
      );
    });

    it("debe responder 404 cuando el pedido no existe", async function () {
      const nonExistentId = "68f3a5b2c9d4e7f102938475";

      const response = await request(app)
        .get(`/api/orders/${nonExistentId}`);

      expect(response.status).to.equal(404);
      expect(response.body.status).to.equal("error");
      expect(response.body.error).to.equal("ORDER_NOT_FOUND");
      expect(response.body.message).to.equal(
        "No se encontró el pedido solicitado"
      );
    });
  });

  describe("POST /api/orders", function () {
    it("debe crear un pedido y guardarlo en la base de testing", async function () {
      const customer = await createCustomer();

      const orderData = {
        customer: customer._id.toString(),
        items: [
          {
            name: "Producto de prueba",
            quantity: 2,
            price: 1500
          }
        ],
        deliveryAddress: "Calle de prueba 123",
        total: 3000
      };

      const response = await request(app)
        .post("/api/orders")
        .send(orderData);

      expect(response.status).to.equal(201);
      expect(response.body.status).to.equal("success");
      expect(response.body.message).to.equal(
        "Pedido creado correctamente"
      );

      expect(response.body.payload).to.be.an("object");
      expect(response.body.payload.status).to.equal("created");
      expect(response.body.payload.priority).to.equal("normal");

      const savedOrder = await OrderModel.findById(
        response.body.payload._id
      );

      expect(savedOrder).to.not.equal(null);
      expect(savedOrder.deliveryAddress).to.equal(
        orderData.deliveryAddress
      );
      expect(savedOrder.total).to.equal(3000);
    });

    it("debe responder 400 cuando el pedido está incompleto", async function () {
      const response = await request(app)
        .post("/api/orders")
        .send({});

      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal("error");
      expect(response.body.error).to.equal("VALIDATION_ERROR");
      expect(response.body.message).to.equal(
        "El cliente es obligatorio"
      );
    });

    it("debe responder 400 cuando el pedido no contiene productos", async function () {
      const customer = await createCustomer();

      const response = await request(app)
        .post("/api/orders")
        .send({
          customer: customer._id.toString(),
          items: [],
          deliveryAddress: "Calle de prueba 123",
          total: 3000
        });

      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal("error");
      expect(response.body.error).to.equal("ORDER_ITEMS_REQUIRED");
      expect(response.body.message).to.equal(
        "El pedido debe contener al menos un producto"
      );
    });
  });

  describe("PATCH /api/orders/:id/status", function () {
    it("debe actualizar correctamente el estado de un pedido", async function () {
      const customer = await createCustomer();
      const order = await createOrder(customer);

      const response = await request(app)
        .patch(`/api/orders/${order._id}/status`)
        .send({ status: "assigned" });

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal("success");
      expect(response.body.message).to.equal(
        "Estado del pedido actualizado correctamente"
      );
      expect(response.body.payload.status).to.equal("assigned");

      const updatedOrder = await OrderModel.findById(order._id);

      expect(updatedOrder).to.not.equal(null);
      expect(updatedOrder.status).to.equal("assigned");
    });

    it("debe responder 400 cuando el estado no es válido", async function () {
      const customer = await createCustomer();
      const order = await createOrder(customer);

      const response = await request(app)
        .patch(`/api/orders/${order._id}/status`)
        .send({ status: "estado_inexistente" });

      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal("error");
      expect(response.body.error).to.equal("INVALID_ORDER_STATUS");
      expect(response.body.message).to.equal(
        "El estado indicado no es válido para un pedido"
      );
    });
  });

  describe("POST /api/orders/:id/proof", function () {
    const removeTestProof = async (filename) => {
      if (!filename) return;

      const filePath = path.join(
        process.cwd(),
        "uploads",
        "proofs",
        filename
      );

      await fs.rm(filePath, { force: true });
    };

    it("debe subir un comprobante PDF y guardar sus metadatos", async function () {
      const customer = await createCustomer();
      const order = await createOrder(customer);
      let uploadedFilename;

      try {
        const pdfBuffer = Buffer.from(
          "%PDF-1.4\nComprobante de prueba ShipNow"
        );

        const response = await request(app)
          .post(`/api/orders/${order._id}/proof`)
          .attach("proof", pdfBuffer, {
            filename: "comprobante-prueba.pdf",
            contentType: "application/pdf"
          });

        expect(response.status).to.equal(200);
        expect(response.body.status).to.equal("success");

        const savedOrder = await OrderModel.findById(order._id);

        expect(savedOrder).to.not.equal(null);
        expect(savedOrder.proof).to.be.an("object");

        expect(savedOrder.proof.originalName).to.equal(
          "comprobante-prueba.pdf"
        );
        expect(savedOrder.proof.mimetype).to.equal("application/pdf");
        expect(savedOrder.proof.path).to.include("/uploads/proofs/");
        expect(savedOrder.proof.size).to.equal(pdfBuffer.length);

        uploadedFilename = savedOrder.proof.filename;
      } finally {
        await removeTestProof(uploadedFilename);
      }
    });

    it("debe responder FILE_REQUIRED cuando no se adjunta un comprobante", async function () {
      const customer = await createCustomer();
      const order = await createOrder(customer);

      const response = await request(app)
        .post(`/api/orders/${order._id}/proof`);

      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal("error");
      expect(response.body.error).to.equal("FILE_REQUIRED");

      const savedOrder = await OrderModel.findById(order._id);

      expect(savedOrder.proof).to.equal(null);
    });

    it("debe rechazar un comprobante con tipo MIME no permitido", async function () {
      const customer = await createCustomer();
      const order = await createOrder(customer);

      const response = await request(app)
        .post(`/api/orders/${order._id}/proof`)
        .attach("proof", Buffer.from("Archivo de texto"), {
          filename: "comprobante.txt",
          contentType: "text/plain"
        });

      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal("error");
      expect(response.body.error).to.equal("INVALID_FILE_TYPE");

      const savedOrder = await OrderModel.findById(order._id);

      expect(savedOrder.proof).to.equal(null);
    });

    it("debe rechazar un comprobante que supere los 5 MB", async function () {
      const customer = await createCustomer();
      const order = await createOrder(customer);
      const largeBuffer = Buffer.alloc(5 * 1024 * 1024 + 1);

      const response = await request(app)
        .post(`/api/orders/${order._id}/proof`)
        .attach("proof", largeBuffer, {
          filename: "comprobante-grande.pdf",
          contentType: "application/pdf"
        });

      expect(response.status).to.equal(400);
      expect(response.body.status).to.equal("error");
      expect(response.body.error).to.equal("FILE_TOO_LARGE");

      const savedOrder = await OrderModel.findById(order._id);

      expect(savedOrder.proof).to.equal(null);
    });
  });
});
