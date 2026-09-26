import { userRepository } from "../repositories/user.repository.js";
import { USER_ROLES } from "../constants/index.js";

class UserService {
  async getAllUsers() {
    const users = await userRepository.getAll();

    return users;
  }

  async getUserById(id) {
    const user = await userRepository.getById(id);

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return user;
  }

  async createUser(userData) {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      isAvailable
    } = userData;

    if (!firstName || !lastName || !email) {
      const error = new Error(
        "Los campos firstName, lastName y email son obligatorios"
      );

      error.statusCode = 400;
      throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await userRepository.getByEmail(
      normalizedEmail
    );

    if (existingUser) {
      const error = new Error(
        "Ya existe un usuario registrado con ese email"
      );

      error.statusCode = 409;
      throw error;
    }

    const userRole = role || USER_ROLES.CUSTOMER;

    if (!Object.values(USER_ROLES).includes(userRole)) {
      const error = new Error("El rol de usuario no es válido");
      error.statusCode = 400;
      throw error;
    }

    const newUser = await userRepository.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password,
      role: userRole,
      isAvailable:
        userRole === USER_ROLES.DRIVER
          ? Boolean(isAvailable)
          : false
    });

    return newUser;
  }

  async updateUser(id, userData) {
    const existingUser = await userRepository.getById(id);

    if (!existingUser) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const updateData = { ...userData };

    if (updateData.email !== undefined) {
      const normalizedEmail = updateData.email.trim().toLowerCase();

      const userWithEmail = await userRepository.getByEmail(
        normalizedEmail
      );

      if (
        userWithEmail &&
        userWithEmail._id.toString() !== id
      ) {
        const error = new Error(
          "Ya existe otro usuario registrado con ese email"
        );

        error.statusCode = 409;
        throw error;
      }

      updateData.email = normalizedEmail;
    }

    if (updateData.role !== undefined) {
      if (!Object.values(USER_ROLES).includes(updateData.role)) {
        const error = new Error("El rol de usuario no es válido");
        error.statusCode = 400;
        throw error;
      }

      if (updateData.role !== USER_ROLES.DRIVER) {
        updateData.isAvailable = false;
      }
    }

    if (updateData.firstName !== undefined) {
      updateData.firstName = updateData.firstName.trim();
    }

    if (updateData.lastName !== undefined) {
      updateData.lastName = updateData.lastName.trim();
    }

    if (updateData.isAvailable !== undefined) {
      updateData.isAvailable = Boolean(updateData.isAvailable);
    }

    return userRepository.updateById(id, updateData);
  }

  async deleteUser(id) {
    const existingUser = await userRepository.getById(id);

    if (!existingUser) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    await userRepository.deleteById(id);

    return {
      message: "Usuario eliminado correctamente"
    };
  }
}

export const userService = new UserService();