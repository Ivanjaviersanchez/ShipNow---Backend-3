import {
  DELIVERY_STATUS
} from "../constants/index.js";

const getRandomElement = (array) => {
  return array[
    Math.floor(Math.random() * array.length)
  ];
};

export const generateMockDelivery = (
  orderId,
  driverId
) => {
  return {
    order: orderId,
    driver: driverId,
    status: DELIVERY_STATUS.PENDING
  };
};

export const generateMockDeliveries = (
  orderIds,
  driverIds,
  quantity = 10
) => {
  const deliveries = [];

  for (let i = 0; i < quantity; i++) {
    const orderId = getRandomElement(orderIds);
    const driverId = getRandomElement(driverIds);

    deliveries.push(
      generateMockDelivery(
        orderId,
        driverId
      )
    );
  }

  return deliveries;
};