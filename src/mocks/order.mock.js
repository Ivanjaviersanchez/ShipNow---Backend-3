import {
  ORDER_STATUS,
  DELIVERY_PRIORITY
} from "../constants/index.js";

const productNames = [
  "Caja mediana",
  "Paquete express",
  "Documento",
  "Electrodoméstico",
  "Ropa",
  "Accesorios",
  "Producto tecnológico",
  "Paquete frágil"
];

const addresses = [
  "Av. Independencia 1250",
  "Av. Colón 850",
  "Calle San Martín 430",
  "Av. Constitución 2150",
  "Calle Belgrano 720",
  "Av. Libertad 1560"
];

const getRandomElement = (array) => {
  return array[
    Math.floor(Math.random() * array.length)
  ];
};

const getRandomNumber = (min, max) => {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
};

const generateMockItem = () => {
  const price = getRandomNumber(1000, 50000);
  const quantity = getRandomNumber(1, 4);

  return {
    name: getRandomElement(productNames),
    quantity,
    price
  };
};

export const generateMockOrder = (
  customerId,
  index = 0
) => {
  const itemCount = getRandomNumber(1, 3);

  const items = [];

  for (let i = 0; i < itemCount; i++) {
    items.push(generateMockItem());
  }

  const total = items.reduce(
    (accumulator, item) => {
      return accumulator + item.price * item.quantity;
    },
    0
  );

  return {
    customer: customerId,
    items,
    deliveryAddress: getRandomElement(addresses),
    total,
    status: ORDER_STATUS.CREATED,
    priority: getRandomElement(
      Object.values(DELIVERY_PRIORITY)
    )
  };
};

export const generateMockOrders = (
  customerIds,
  quantity = 10
) => {
  const orders = [];

  for (let i = 0; i < quantity; i++) {
    const customerId = getRandomElement(
      customerIds
    );

    orders.push(
      generateMockOrder(customerId, i)
    );
  }

  return orders;
};