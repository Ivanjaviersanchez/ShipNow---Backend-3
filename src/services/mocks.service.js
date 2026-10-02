import {
  generateMockUsers,
  generateMockUsersForSeed,
  sanitizeMockUser
} from "../mocks/user.mock.js";

import { generateMockOrders } from "../mocks/order.mock.js";
import { generateMockDeliveries } from "../mocks/delivery.mock.js";

import {
  MOCKING_PARAMETERS,
  USER_ROLES
} from "../constants/index.js";

import { userRepository } from "../repositories/user.repository.js";
import { orderRepository } from "../repositories/order.repository.js";
import { deliveryRepository } from "../repositories/delivery.repository.js";

import { createAppError } from "../utils/errors.js";
import logger from "../utils/logger.js";

class MocksService {

  validateQuantity(quantity) {

    const parsedQuantity = Number(quantity);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 1
    ) {

      logger.warning(
        "Cantidad de mocks inválida",
        {
          quantity
        }
      );

      throw createAppError(
        "INVALID_MOCK_AMOUNT",
        "La cantidad debe ser un número entero mayor a 0"
      );
    }

    if (parsedQuantity > MOCKING_PARAMETERS.MAX) {

      logger.warning(
        "Cantidad de mocks superior al máximo permitido",
        {
          quantity: parsedQuantity,
          max: MOCKING_PARAMETERS.MAX
        }
      );

      throw createAppError(
        "INVALID_MOCK_AMOUNT",
        `La cantidad máxima permitida es ${MOCKING_PARAMETERS.MAX}`
      );
    }

    return parsedQuantity;
  }

  generateUsers(quantity) {

    const validQuantity =
      this.validateQuantity(quantity);

    logger.debug(
      "Generando usuarios mock",
      {
        quantity: validQuantity
      }
    );

    const users =
      generateMockUsers(validQuantity);

    return users.map(sanitizeMockUser);
  }

  generateUsersForSeed(quantity) {

    const validQuantity =
      this.validateQuantity(quantity);

    if (validQuantity < 2) {

      logger.warning(
        "Seed completo solicitado con menos de 2 usuarios",
        {
          quantity: validQuantity
        }
      );

      throw createAppError(
        "INVALID_MOCK_AMOUNT",
        "La carga completa necesita al menos 2 usuarios"
      );
    }

    logger.debug(
      "Generando usuarios para seed completo",
      {
        quantity: validQuantity
      }
    );

    return generateMockUsersForSeed(
      validQuantity
    );
  }

  generateOrders(
    customerIds,
    quantity = MOCKING_PARAMETERS.DEFAULT
  ) {

    if (
      !Array.isArray(customerIds) ||
      customerIds.length === 0
    ) {

      logger.warning(
        "Intento de generar pedidos sin customers",
        {
          customerIdsCount: 0
        }
      );

      throw createAppError(
        "VALIDATION_ERROR",
        "Se necesita al menos un customerId para generar pedidos"
      );
    }

    const validQuantity =
      this.validateQuantity(quantity);

    logger.debug(
      "Generando pedidos mock",
      {
        quantity: validQuantity,
        customerIdsCount: customerIds.length
      }
    );

    return generateMockOrders(
      customerIds,
      validQuantity
    );
  }

  generateDeliveries(
    orderIds,
    driverIds,
    quantity = MOCKING_PARAMETERS.DEFAULT
  ) {

    if (
      !Array.isArray(orderIds) ||
      orderIds.length === 0
    ) {

      logger.warning(
        "Intento de generar entregas sin pedidos",
        {
          orderIdsCount: 0
        }
      );

      throw createAppError(
        "VALIDATION_ERROR",
        "Se necesita al menos un orderId para generar entregas"
      );
    }

    if (
      !Array.isArray(driverIds) ||
      driverIds.length === 0
    ) {

      logger.warning(
        "Intento de generar entregas sin repartidores",
        {
          driverIdsCount: 0
        }
      );

      throw createAppError(
        "VALIDATION_ERROR",
        "Se necesita al menos un driverId para generar entregas"
      );
    }

    const validQuantity =
      this.validateQuantity(quantity);

    logger.debug(
      "Generando entregas mock",
      {
        quantity: validQuantity,
        orderIdsCount: orderIds.length,
        driverIdsCount: driverIds.length
      }
    );

    return generateMockDeliveries(
      orderIds,
      driverIds,
      validQuantity
    );
  }

  async seedUsers(quantity) {

    const validQuantity =
      this.validateQuantity(quantity);

    const users =
      generateMockUsers(validQuantity);

    try {

      const savedUsers =
        await userRepository.insertMany(users);

      logger.info(
        "Seed de usuarios completado",
        {
          quantity: savedUsers.length
        }
      );

      return savedUsers;

    } catch (error) {

      throw createAppError("DATABASE_ERROR");
    }
  }

  async seedAll(
    quantity = MOCKING_PARAMETERS.DEFAULT
  ) {

    const validQuantity =
      this.validateQuantity(quantity);

    if (validQuantity < 2) {

      logger.warning(
        "Seed completo solicitado con menos de 2 usuarios",
        {
          quantity: validQuantity
        }
      );

      throw createAppError(
        "INVALID_MOCK_AMOUNT",
        "La carga completa necesita al menos 2 usuarios"
      );
    }

    const mockUsers =
      this.generateUsersForSeed(validQuantity);

    let savedUsers;

    try {

      savedUsers =
        await userRepository.insertMany(
          mockUsers
        );

      logger.info(
        "Usuarios del seed completo guardados",
        {
          quantity: savedUsers.length
        }
      );

    } catch (error) {

      throw createAppError("DATABASE_ERROR");
    }

    const customerIds =
      savedUsers
        .filter(
          (user) =>
            user.role === USER_ROLES.CUSTOMER
        )
        .map(
          (user) => user._id
        );

    const driverIds =
      savedUsers
        .filter(
          (user) =>
            user.role === USER_ROLES.DRIVER
        )
        .map(
          (user) => user._id
        );

    const mockOrders =
      this.generateOrders(
        customerIds,
        validQuantity
      );

    let savedOrders;

    try {

      savedOrders =
        await orderRepository.insertMany(
          mockOrders
        );

      logger.info(
        "Pedidos del seed completo guardados",
        {
          quantity: savedOrders.length
        }
      );

    } catch (error) {

      throw createAppError("DATABASE_ERROR");
    }

    const orderIds =
      savedOrders.map(
        (order) => order._id
      );

    const mockDeliveries =
      this.generateDeliveries(
        orderIds,
        driverIds,
        validQuantity
      );

    let savedDeliveries;

    try {

      savedDeliveries =
        await deliveryRepository.insertMany(
          mockDeliveries
        );

      logger.info(
        "Entregas del seed completo guardadas",
        {
          quantity: savedDeliveries.length
        }
      );

    } catch (error) {

      throw createAppError("DATABASE_ERROR");
    }

    logger.info(
      "Seed completo de ShipNow finalizado",
      {
        users: savedUsers.length,
        orders: savedOrders.length,
        deliveries: savedDeliveries.length
      }
    );

    return {
      users: savedUsers,
      orders: savedOrders,
      deliveries: savedDeliveries
    };
  }

  async seedOrders(
    customerIds,
    quantity = MOCKING_PARAMETERS.DEFAULT
  ) {

    const validQuantity =
      this.validateQuantity(quantity);

    const orders =
      this.generateOrders(
        customerIds,
        validQuantity
      );

    try {

      const savedOrders =
        await orderRepository.insertMany(
          orders
        );

      logger.info(
        "Seed de pedidos completado",
        {
          quantity: savedOrders.length
        }
      );

      return savedOrders;

    } catch (error) {

      throw createAppError("DATABASE_ERROR");
    }
  }

  async seedDeliveries(
    orderIds,
    driverIds,
    quantity = MOCKING_PARAMETERS.DEFAULT
  ) {

    const validQuantity =
      this.validateQuantity(quantity);

    const deliveries =
      this.generateDeliveries(
        orderIds,
        driverIds,
        validQuantity
      );

    try {

      const savedDeliveries =
        await deliveryRepository.insertMany(
          deliveries
        );

      logger.info(
        "Seed de entregas completado",
        {
          quantity: savedDeliveries.length
        }
      );

      return savedDeliveries;

    } catch (error) {

      throw createAppError("DATABASE_ERROR");
    }
  }
}

export const mocksService =
  new MocksService();