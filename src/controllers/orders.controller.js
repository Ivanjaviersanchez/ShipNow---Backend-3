import { orderService } from "../services/order.service.js";

class OrdersController {
  async getAll(req, res, next) {
    try {
      const orders = await orderService.getAllOrders();

      res.status(200).json({
        status: "success",
        payload: orders
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const order = await orderService.getOrderById(id);

      res.status(200).json({
        status: "success",
        payload: order
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const order = await orderService.createOrder(
        req.body
      );

      res.status(201).json({
        status: "success",
        message: "Pedido creado correctamente",
        payload: order
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order =
        await orderService.updateOrderStatus(
          id,
          status
        );

      res.status(200).json({
        status: "success",
        message: "Estado del pedido actualizado correctamente",
        payload: order
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const result =
        await orderService.deleteOrder(id);

      res.status(200).json({
        status: "success",
        ...result
      });
    } catch (error) {
      next(error);
    }
  }
}

export const ordersController =
  new OrdersController();