import { mocksService } from "../services/mocks.service.js";
import { MOCKING_PARAMETERS } from "../constants/index.js";

class MocksController {
  generateUsers(req, res, next) {
    try {
      const quantity =
        req.query.qty !== undefined
          ? req.query.qty
          : MOCKING_PARAMETERS.DEFAULT;

      const users =
        mocksService.generateUsers(quantity);

      res.status(200).json({
        status: "success",
        message: "Usuarios mock generados correctamente",
        quantity: users.length,
        payload: users
      });
    } catch (error) {
      next(error);
    }
  }

  generateOrders(req, res, next) {
    try {
      const { customerIds } = req.body;

      const quantity =
        req.query.qty !== undefined
          ? req.query.qty
          : MOCKING_PARAMETERS.DEFAULT;

      const orders =
        mocksService.generateOrders(
          customerIds,
          quantity
        );

      res.status(200).json({
        status: "success",
        message: "Pedidos mock generados correctamente",
        quantity: orders.length,
        payload: orders
      });
    } catch (error) {
      next(error);
    }
  }

  generateDeliveries(req, res, next) {
    try {
      const {
        orderIds,
        driverIds
      } = req.body;

      const quantity =
        req.query.qty !== undefined
          ? req.query.qty
          : MOCKING_PARAMETERS.DEFAULT;

      const deliveries =
        mocksService.generateDeliveries(
          orderIds,
          driverIds,
          quantity
        );

      res.status(200).json({
        status: "success",
        message: "Entregas mock generadas correctamente",
        quantity: deliveries.length,
        payload: deliveries
      });
    } catch (error) {
      next(error);
    }
  }

  async seedUsers(req, res, next) {
    try {
      const quantity =
        req.query.qty !== undefined
          ? req.query.qty
          : MOCKING_PARAMETERS.DEFAULT;

      const users =
        await mocksService.seedUsers(quantity);

      res.status(201).json({
        status: "success",
        message: "Usuarios mock cargados correctamente",
        quantity: users.length,
        payload: users
      });
    } catch (error) {
      next(error);
    }
  }

  async seedOrders(req, res, next) {
    try {
      const { customerIds } = req.body;

      const quantity =
        req.query.qty !== undefined
          ? req.query.qty
          : MOCKING_PARAMETERS.DEFAULT;

      const orders =
        await mocksService.seedOrders(
          customerIds,
          quantity
        );

      res.status(201).json({
        status: "success",
        message: "Pedidos mock cargados correctamente",
        quantity: orders.length,
        payload: orders
      });
    } catch (error) {
      next(error);
    }
  }

  async seedDeliveries(req, res, next) {
    try {
      const {
        orderIds,
        driverIds
      } = req.body;

      const quantity =
        req.query.qty !== undefined
          ? req.query.qty
          : MOCKING_PARAMETERS.DEFAULT;

      const deliveries =
        await mocksService.seedDeliveries(
          orderIds,
          driverIds,
          quantity
        );

      res.status(201).json({
        status: "success",
        message: "Entregas mock cargadas correctamente",
        quantity: deliveries.length,
        payload: deliveries
      });
    } catch (error) {
      next(error);
    }
  }

  async seedAll(req, res, next) {
    try {
      const quantity =
        req.query.qty !== undefined
          ? req.query.qty
          : MOCKING_PARAMETERS.DEFAULT;

      const result =
        await mocksService.seedAll(quantity);

      res.status(201).json({
        status: "success",
        message: "Datos mock cargados correctamente",
        quantity: {
          users: result.users.length,
          orders: result.orders.length,
          deliveries: result.deliveries.length
        },
        payload: result
      });
    } catch (error) {
      next(error);
    }
  }
}

export const mocksController =
  new MocksController();