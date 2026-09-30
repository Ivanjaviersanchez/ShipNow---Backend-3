import { orderRepository } from "../repositories/order.repository.js";

import {
  ORDER_STATUS,
  DELIVERY_PRIORITY
} from "../constants/index.js";

import { createAppError } from "../utils/errors.js";

class OrderService {
  async getAllOrders() {
    return orderRepository.getAll();
  }

  async getOrderById(id) {
    const order = await orderRepository.getById(id);

    if (!order) {
      throw createAppError("ORDER_NOT_FOUND");
    }

    return order;
  }

  async createOrder(orderData) {
    const {
      customer,
      items,
      deliveryAddress,
      total,
      priority
    } = orderData;

    if (!customer) {
      throw createAppError(
        "VALIDATION_ERROR",
        "El cliente es obligatorio"
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      throw createAppError(
        "ORDER_ITEMS_REQUIRED"
      );
    }

    if (!deliveryAddress) {
      throw createAppError(
        "VALIDATION_ERROR",
        "La dirección de entrega es obligatoria"
      );
    }

    if (total === undefined || total === null) {
      throw createAppError(
        "VALIDATION_ERROR",
        "El total del pedido es obligatorio"
      );
    }

    if (Number(total) < 0) {
      throw createAppError(
        "VALIDATION_ERROR",
        "El total no puede ser negativo"
      );
    }

    for (const item of items) {
      if (!item.name) {
        throw createAppError(
          "VALIDATION_ERROR",
          "Cada producto debe tener un nombre"
        );
      }

      if (!item.quantity || item.quantity < 1) {
        throw createAppError(
          "VALIDATION_ERROR",
          "La cantidad de cada producto debe ser mayor a 0"
        );
      }

      if (
        item.price === undefined ||
        item.price < 0
      ) {
        throw createAppError(
          "VALIDATION_ERROR",
          "El precio de cada producto no puede ser negativo"
        );
      }
    }

    const orderPriority =
      priority || DELIVERY_PRIORITY.NORMAL;

    if (
      !Object.values(DELIVERY_PRIORITY).includes(
        orderPriority
      )
    ) {
      throw createAppError(
        "VALIDATION_ERROR",
        "La prioridad del pedido no es válida"
      );
    }

    const newOrder =
      await orderRepository.create({
        customer,
        items,
        deliveryAddress:
          deliveryAddress.trim(),
        total: Number(total),
        status: ORDER_STATUS.CREATED,
        priority: orderPriority
      });

    return newOrder;
  }

  async updateOrderStatus(id, status) {
    const existingOrder =
      await orderRepository.getById(id);

    if (!existingOrder) {
      throw createAppError(
        "ORDER_NOT_FOUND"
      );
    }

    if (
      !Object.values(ORDER_STATUS).includes(status)
    ) {
      throw createAppError(
        "INVALID_ORDER_STATUS"
      );
    }

    return orderRepository.updateById(
      id,
      { status }
    );
  }

  async deleteOrder(id) {
    const existingOrder =
      await orderRepository.getById(id);

    if (!existingOrder) {
      throw createAppError(
        "ORDER_NOT_FOUND"
      );
    }

    await orderRepository.deleteById(id);

    return {
      message:
        "Pedido eliminado correctamente"
    };
  }
}

export const orderService =
  new OrderService();