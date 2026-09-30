import { deliveryRepository } from "../repositories/delivery.repository.js";

import {
  DELIVERY_STATUS
} from "../constants/index.js";

import { createAppError } from "../utils/errors.js";

class DeliveryService {
  async getAllDeliveries() {
    return deliveryRepository.getAll();
  }

  async getDeliveryById(id) {
    const delivery =
      await deliveryRepository.getById(id);

    if (!delivery) {
      throw createAppError(
        "DELIVERY_NOT_FOUND"
      );
    }

    return delivery;
  }

  async createDelivery(deliveryData) {
    const {
      order,
      driver
    } = deliveryData;

    if (!order) {
      throw createAppError(
        "VALIDATION_ERROR",
        "El pedido es obligatorio"
      );
    }

    if (!driver) {
      throw createAppError(
        "VALIDATION_ERROR",
        "El repartidor es obligatorio"
      );
    }

    const newDelivery =
      await deliveryRepository.create({
        order,
        driver,
        status: DELIVERY_STATUS.PENDING
      });

    return newDelivery;
  }

  async updateDeliveryStatus(
    id,
    status
  ) {
    const existingDelivery =
      await deliveryRepository.getById(id);

    if (!existingDelivery) {
      throw createAppError(
        "DELIVERY_NOT_FOUND"
      );
    }

    if (
      !Object.values(
        DELIVERY_STATUS
      ).includes(status)
    ) {
      throw createAppError(
        "INVALID_DELIVERY_STATUS"
      );
    }

    return deliveryRepository.updateById(
      id,
      {
        status
      }
    );
  }

  async deleteDelivery(id) {
    const existingDelivery =
      await deliveryRepository.getById(id);

    if (!existingDelivery) {
      throw createAppError(
        "DELIVERY_NOT_FOUND"
      );
    }

    await deliveryRepository.deleteById(id);

    return {
      message:
        "Entrega eliminada correctamente"
    };
  }
}

export const deliveryService =
  new DeliveryService();