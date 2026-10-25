
import { expect } from "chai";
import request from "supertest";

import app from "../../src/app.js";
import UserModel from "../../src/models/user.model.js";
import OrderModel from "../../src/models/order.model.js";

describe("Pruebas funcionales de pedidos", function () {
  describe("GET /api/orders", function () {
    it("debe responder 200 y devolver una lista de pedidos", async function () {
      const response = await request(app)
        .get("/api/orders");

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal("success");
      expect(response.body.payload).to.be.an("array");
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
      const customer = await UserModel.create({
        firstName: "Cliente",
        lastName: "Prueba",
        email: "cliente.pedido@shipnow.test"
      });

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
  });

  describe("PATCH /api/orders/:id/status", function () {
    it("debe responder 400 cuando el estado no es válido", async function () {
      const customer = await UserModel.create({
        firstName: "Cliente",
        lastName: "Estado",
        email: "cliente.estado@shipnow.test"
      });

      const order = await OrderModel.create({
        customer: customer._id,
        items: [
          {
            name: "Producto de prueba",
            quantity: 1,
            price: 1000
          }
        ],
        deliveryAddress: "Calle de prueba 456",
        total: 1000,
        status: "created"
      });

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
});
