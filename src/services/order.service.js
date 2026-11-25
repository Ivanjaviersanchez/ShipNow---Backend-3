import { orderRepository } from "../repositories/order.repository.js";

import { ORDER_STATUS, DELIVERY_PRIORITY } from "../constants/index.js";

import { createAppError } from "../utils/errors.js";
import { removeUploadedFile } from "../utils/files.js";
import logger from "../utils/logger.js";

import { parsePagination, buildPagination } from "../utils/pagination.js";

class OrderService {
  async getAllOrders(query = {}) {
    const { page, limit, skip } = parsePagination(query);

    const { data, total } = await orderRepository.getAll({
      skip,
      limit
    });

    return {
      data,
      pagination: buildPagination(page, limit, total)
    };
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
      throw createAppError("ORDER_ITEMS_REQUIRED");
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

      if (item.price === undefined || item.price < 0) {
        throw createAppError(
          "VALIDATION_ERROR",
          "El precio de cada producto no puede ser negativo"
        );
      }
    }

    const orderPriority = priority || DELIVERY_PRIORITY.NORMAL;

    if (!Object.values(DELIVERY_PRIORITY).includes(orderPriority)) {
      throw createAppError(
        "VALIDATION_ERROR",
        "La prioridad del pedido no es válida"
      );
    }

    return orderRepository.create({
      customer,
      items,
      deliveryAddress: deliveryAddress.trim(),
      total: Number(total),
      status: ORDER_STATUS.CREATED,
      priority: orderPriority
    });
  }

  async updateOrderStatus(id, status) {
    const existingOrder = await orderRepository.getById(id);

    if (!existingOrder) {
      throw createAppError("ORDER_NOT_FOUND");
    }

    if (!Object.values(ORDER_STATUS).includes(status)) {
      throw createAppError("INVALID_ORDER_STATUS");
    }

    return orderRepository.updateById(id, { status });
  }

  async deleteOrder(id) {
    const existingOrder = await orderRepository.getById(id);

    if (!existingOrder) {
      throw createAppError("ORDER_NOT_FOUND");
    }

    await orderRepository.deleteById(id);

    return {
      message: "Pedido eliminado correctamente"
    };
  }

  async addProof(id, file) {
    if (!file) {
      throw createAppError("FILE_REQUIRED");
    }

    try {
      const existingOrder = await orderRepository.getById(id);

      if (!existingOrder) {
        throw createAppError("ORDER_NOT_FOUND");
      }

      const proofMetadata = {
        originalName: file.originalname,
        filename: file.filename,
        path: `/uploads/proofs/${file.filename}`,
        mimetype: file.mimetype,
        size: file.size,
        uploadedAt: new Date()
      };

      const updatedOrder = await orderRepository.updateById(
        id,
        { proof: proofMetadata }
      );

      if (!updatedOrder) {
        throw createAppError("ORDER_NOT_FOUND");
      }

      logger.info("Comprobante asociado al pedido", {
        orderId: id,
        filename: file.filename,
        size: file.size
      });

      return updatedOrder;
    } catch (error) {
      try {
        await removeUploadedFile(file.path);
      } catch (cleanupError) {
        logger.error("No se pudo eliminar un archivo temporal", {
          filename: file.filename,
          message: cleanupError.message
        });
      }

      logger.warning("Falló la carga de un comprobante de pedido", {
        orderId: id,
        filename: file.filename,
        error: error.code ?? error.message
      });

      throw error;
    }
  }
}

export const orderService = new OrderService();
