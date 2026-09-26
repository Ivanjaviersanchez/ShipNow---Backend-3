import { deliveryService } from "../services/delivery.service.js";

class DeliveriesController {
  async getAll(req, res, next) {
    try {
      const deliveries =
        await deliveryService.getAllDeliveries();

      res.status(200).json({
        status: "success",
        payload: deliveries
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const delivery =
        await deliveryService.getDeliveryById(id);

      res.status(200).json({
        status: "success",
        payload: delivery
      });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const delivery =
        await deliveryService.createDelivery(
          req.body
        );

      res.status(201).json({
        status: "success",
        message: "Entrega creada correctamente",
        payload: delivery
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const delivery =
        await deliveryService.updateDeliveryStatus(
          id,
          status
        );

      res.status(200).json({
        status: "success",
        message:
          "Estado de la entrega actualizado correctamente",
        payload: delivery
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      const result =
        await deliveryService.deleteDelivery(id);

      res.status(200).json({
        status: "success",
        ...result
      });
    } catch (error) {
      next(error);
    }
  }
}

export const deliveriesController =
  new DeliveriesController();