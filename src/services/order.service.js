import { orderRepository } from "../repositories/order.repository.js";

import {
  ORDER_STATUS,
  DELIVERY_PRIORITY
} from "../constants/index.js";

class OrderService {
  async getAllOrders() {
    return orderRepository.getAll();
  }

  async getOrderById(id) {
    const order = await orderRepository.getById(id);

    if (!order) {
      const error = new Error("Pedido no encontrado");
      error.statusCode = 404;
      throw error;
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

    // Validar cliente
    if (!customer) {
      const error = new Error(
        "El cliente es obligatorio"
      );
      error.statusCode = 400;
      throw error;
    }

    // Validar productos
    if (!Array.isArray(items) || items.length === 0) {
      const error = new Error(
        "El pedido debe contener al menos un producto"
      );
      error.statusCode = 400;
      throw error;
    }

    // Validar dirección
    if (!deliveryAddress) {
      const error = new Error(
        "La dirección de entrega es obligatoria"
      );
      error.statusCode = 400;
      throw error;
    }

    // Validar total
    if (total === undefined || total === null) {
      const error = new Error(
        "El total del pedido es obligatorio"
      );
      error.statusCode = 400;
      throw error;
    }

    if (Number(total) < 0) {
      const error = new Error(
        "El total no puede ser negativo"
      );
      error.statusCode = 400;
      throw error;
    }

    // Validar cada producto del pedido
    for (const item of items) {
      if (!item.name) {
        const error = new Error(
          "Cada producto debe tener un nombre"
        );
        error.statusCode = 400;
        throw error;
      }

      if (!item.quantity || item.quantity < 1) {
        const error = new Error(
          "La cantidad de cada producto debe ser mayor a 0"
        );
        error.statusCode = 400;
        throw error;
      }

      if (item.price === undefined || item.price < 0) {
        const error = new Error(
          "El precio de cada producto no puede ser negativo"
        );
        error.statusCode = 400;
        throw error;
      }
    }

    // Validar prioridad
    const orderPriority =
      priority || DELIVERY_PRIORITY.NORMAL;

    if (
      !Object.values(DELIVERY_PRIORITY).includes(
        orderPriority
      )
    ) {
      const error = new Error(
        "La prioridad del pedido no es válida"
      );
      error.statusCode = 400;
      throw error;
    }

    const newOrder = await orderRepository.create({
      customer,
      items,
      deliveryAddress: deliveryAddress.trim(),
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
      const error = new Error(
        "Pedido no encontrado"
      );
      error.statusCode = 404;
      throw error;
    }

    if (!Object.values(ORDER_STATUS).includes(status)) {
      const error = new Error(
        "El estado del pedido no es válido"
      );
      error.statusCode = 400;
      throw error;
    }

    return orderRepository.updateById(id, {
      status
    });
  }

  async deleteOrder(id) {
    const existingOrder =
      await orderRepository.getById(id);

    if (!existingOrder) {
      const error = new Error(
        "Pedido no encontrado"
      );
      error.statusCode = 404;
      throw error;
    }

    await orderRepository.deleteById(id);

    return {
      message: "Pedido eliminado correctamente"
    };
  }
}

export const orderService = new OrderService();