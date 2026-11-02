import { expect } from "chai";
import request from "supertest";

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
});