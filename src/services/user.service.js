import { userRepository } from "../repositories/user.repository.js";

import { USER_ROLES } from "../constants/index.js";

import { createAppError } from "../utils/errors.js";

class UserService {
  async getAllUsers() {
    const users = await userRepository.getAll();

    return users;
  }

  async getUserById(id) {
    const user = await userRepository.getById(id);

    if (!user) {
      throw createAppError("USER_NOT_FOUND");
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
      throw createAppError(
        "VALIDATION_ERROR",
        "Los campos firstName, lastName y email son obligatorios"
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser =
      await userRepository.getByEmail(
        normalizedEmail
      );

    if (existingUser) {
      throw createAppError(
        "USER_ALREADY_EXISTS"
      );
    }

    const userRole =
      role || USER_ROLES.CUSTOMER;

    if (
      !Object.values(USER_ROLES).includes(userRole)
    ) {
      throw createAppError(
        "INVALID_USER_ROLE"
      );
    }

    const newUser =
      await userRepository.create({
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
    const existingUser =
      await userRepository.getById(id);

    if (!existingUser) {
      throw createAppError(
        "USER_NOT_FOUND"
      );
    }

    const updateData = {
      ...userData
    };

    if (updateData.email !== undefined) {
      const normalizedEmail =
        updateData.email.trim().toLowerCase();

      const userWithEmail =
        await userRepository.getByEmail(
          normalizedEmail
        );

      if (
        userWithEmail &&
        userWithEmail._id.toString() !== id
      ) {
        throw createAppError(
          "USER_ALREADY_EXISTS"
        );
      }

      updateData.email =
        normalizedEmail;
    }

    if (updateData.role !== undefined) {
      if (
        !Object.values(USER_ROLES).includes(
          updateData.role
        )
      ) {
        throw createAppError(
          "INVALID_USER_ROLE"
        );
      }

      if (
        updateData.role !==
        USER_ROLES.DRIVER
      ) {
        updateData.isAvailable = false;
      }
    }

    if (
      updateData.firstName !== undefined
    ) {
      updateData.firstName =
        updateData.firstName.trim();
    }

    if (
      updateData.lastName !== undefined
    ) {
      updateData.lastName =
        updateData.lastName.trim();
    }

    if (
      updateData.isAvailable !== undefined
    ) {
      updateData.isAvailable =
        Boolean(
          updateData.isAvailable
        );
    }

    return userRepository.updateById(
      id,
      updateData
    );
  }

  async deleteUser(id) {
    const existingUser =
      await userRepository.getById(id);

    if (!existingUser) {
      throw createAppError(
        "USER_NOT_FOUND"
      );
    }

    await userRepository.deleteById(id);

    return {
      message:
        "Usuario eliminado correctamente"
    };
  }
}

export const userService =
  new UserService();