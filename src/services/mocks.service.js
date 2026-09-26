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

class MocksService {
  validateQuantity(quantity) {
    const parsedQuantity = Number(quantity);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < 1
    ) {
      const error = new Error(
        "La cantidad debe ser un número entero mayor a 0"
      );

      error.statusCode = 400;

      throw error;
    }

    if (parsedQuantity > MOCKING_PARAMETERS.MAX) {
      const error = new Error(
        `La cantidad máxima permitida es ${MOCKING_PARAMETERS.MAX}`
      );

      error.statusCode = 400;

      throw error;
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
      const error = new Error(
        "La carga completa necesita al menos 2 usuarios"
      );

      error.statusCode = 400;

      throw error;
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
      const error = new Error(
        "Se necesita al menos un customerId para generar pedidos"
      );

      error.statusCode = 400;

      throw error;
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
      const error = new Error(
        "Se necesita al menos un orderId para generar entregas"
      );

      error.statusCode = 400;

      throw error;
    }

    if (
      !Array.isArray(driverIds) ||
      driverIds.length === 0
    ) {
      const error = new Error(
        "Se necesita al menos un driverId para generar entregas"
      );

      error.statusCode = 400;

      throw error;
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

    return userRepository.insertMany(users);
  }

  async seedAll(
    quantity = MOCKING_PARAMETERS.DEFAULT
  ) {
    const validQuantity =
      this.validateQuantity(quantity);

    if (validQuantity < 2) {
      const error = new Error(
        "La carga completa necesita al menos 2 usuarios"
      );

      error.statusCode = 400;

      throw error;
    }

    const mockUsers =
      this.generateUsersForSeed(validQuantity);

    const savedUsers =
      await userRepository.insertMany(
        mockUsers
      );

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

    const savedOrders =
      await orderRepository.insertMany(
        mockOrders
      );

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

    const savedDeliveries =
      await deliveryRepository.insertMany(
        mockDeliveries
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

    return orderRepository.insertMany(
      orders
    );
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

    return deliveryRepository.insertMany(
      deliveries
    );
  }
}

export const mocksService =
  new MocksService();