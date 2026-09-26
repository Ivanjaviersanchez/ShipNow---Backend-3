import { deliveryRepository } from "../repositories/delivery.repository.js";

import {
  DELIVERY_STATUS
} from "../constants/index.js";

class DeliveryService {
  async getAllDeliveries() {
    return deliveryRepository.getAll();
  }

  async getDeliveryById(id) {
    const delivery = await deliveryRepository.getById(id);

    if (!delivery) {
      const error = new Error("Entrega no encontrada");
      error.statusCode = 404;
      throw error;
    }

    return delivery;
  }

  async createDelivery(deliveryData) {
    const {
      order,
      driver
    } = deliveryData;

    // Validar pedido
    if (!order) {
      const error = new Error(
        "El pedido es obligatorio"
      );
      error.statusCode = 400;
      throw error;
    }

    // Validar repartidor
    if (!driver) {
      const error = new Error(
        "El repartidor es obligatorio"
      );
      error.statusCode = 400;
      throw error;
    }

    const newDelivery = await deliveryRepository.create({
      order,
      driver,
      status: DELIVERY_STATUS.PENDING
    });

    return newDelivery;
  }

  async updateDeliveryStatus(id, status) {
    const existingDelivery =
      await deliveryRepository.getById(id);

    if (!existingDelivery) {
      const error = new Error(
        "Entrega no encontrada"
      );
      error.statusCode = 404;
      throw error;
    }

    if (
      !Object.values(DELIVERY_STATUS).includes(status)
    ) {
      const error = new Error(
        "El estado de la entrega no es válido"
      );
      error.statusCode = 400;
      throw error;
    }

    return deliveryRepository.updateById(id, {
      status
    });
  }

  async deleteDelivery(id) {
    const existingDelivery =
      await deliveryRepository.getById(id);

    if (!existingDelivery) {
      const error = new Error(
        "Entrega no encontrada"
      );
      error.statusCode = 404;
      throw error;
    }

    await deliveryRepository.deleteById(id);

    return {
      message: "Entrega eliminada correctamente"
    };
  }
}

export const deliveryService = new DeliveryService();