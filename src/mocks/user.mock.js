import {
  USER_ROLES,
  MOCKING_PARAMETERS
} from "../constants/index.js";

const firstNames = [
  "Juan",
  "Carlos",
  "Maria",
  "Laura",
  "Lucas",
  "Sofia",
  "Martin",
  "Ana",
  "Diego",
  "Valentina"
];

const lastNames = [
  "Perez",
  "Gomez",
  "Rodriguez",
  "Fernandez",
  "Lopez",
  "Martinez",
  "Sanchez",
  "Gonzalez",
  "Diaz",
  "Romero"
];

const getRandomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];

const getRandomRole = () => {
  const roles = [
    USER_ROLES.CUSTOMER,
    USER_ROLES.CUSTOMER,
    USER_ROLES.CUSTOMER,
    USER_ROLES.DRIVER,
    USER_ROLES.STORE
  ];

  return getRandomElement(roles);
};

export const generateMockUser = (index = 0) => {
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  const role = getRandomRole();

  return {
    firstName,
    lastName,
    email: `mock.user.${Date.now()}.${index}@shipnow.test`,
    password: MOCKING_PARAMETERS.DEFAULT_PASSWORD,
    role,
    isAvailable:
      role === USER_ROLES.DRIVER
        ? Math.random() >= 0.5
        : false
  };
};

export const generateMockUsers = (
  quantity = MOCKING_PARAMETERS.DEFAULT
) => {
  const users = [];

  for (let i = 0; i < quantity; i++) {
    users.push(generateMockUser(i));
  }

  return users;
};

export const generateMockUsersForSeed = (
  quantity = MOCKING_PARAMETERS.DEFAULT
) => {
  const users = [];

  users.push({
    ...generateMockUser(0),
    role: USER_ROLES.CUSTOMER,
    isAvailable: false
  });

  users.push({
    ...generateMockUser(1),
    role: USER_ROLES.DRIVER,
    isAvailable: true
  });

  for (let i = 2; i < quantity; i++) {
    users.push(generateMockUser(i));
  }

  return users;
};

/**
 * Genera una versión pública del usuario mock.
 *
 * Se utiliza para respuestas HTTP donde
 * no debemos exponer el password.
 */
export const sanitizeMockUser = (user) => {
  const {
    password,
    ...safeUser
  } = user;

  return safeUser;
};