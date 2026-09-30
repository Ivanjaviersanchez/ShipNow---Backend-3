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

class MocksService {

  validateQuantity(quantity) {
    const parsedQuantity = Number(quantity);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 1
    ) {
      throw createAppError(
        "INVALID_MOCK_AMOUNT",
        "La cantidad debe ser un número entero mayor a 0"
      );
    }

    if (parsedQuantity > MOCKING_PARAMETERS.MAX) {
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

    const users =
      generateMockUsers(validQuantity);

    return users.map(sanitizeMockUser);
  }

  generateUsersForSeed(quantity) {
    const validQuantity =
      this.validateQuantity(quantity);

    if (validQuantity < 2) {
      throw createAppError(
        "INVALID_MOCK_AMOUNT",
        "La carga completa necesita al menos 2 usuarios"
      );
    }

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
      throw createAppError(
        "VALIDATION_ERROR",
        "Se necesita al menos un customerId para generar pedidos"
      );
    }

    const validQuantity =
      this.validateQuantity(quantity);

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
      throw createAppError(
        "VALIDATION_ERROR",
        "Se necesita al menos un orderId para generar entregas"
      );
    }

    if (
      !Array.isArray(driverIds) ||
      driverIds.length === 0
    ) {
      throw createAppError(
        "VALIDATION_ERROR",
        "Se necesita al menos un driverId para generar entregas"
      );
    }

    const validQuantity =
      this.validateQuantity(quantity);

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
      return await userRepository.insertMany(users);
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
    } catch (error) {
      throw createAppError("DATABASE_ERROR");
    }

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
      return await orderRepository.insertMany(
        orders
      );
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
      return await deliveryRepository.insertMany(
        deliveries
      );
    } catch (error) {
      throw createAppError("DATABASE_ERROR");
    }
  }
}

export const mocksService =
  new MocksService();