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
    const { firstName, lastName, email, role } = userData;

    // 1. Validar campos obligatorios
    if (!firstName || !lastName || !email) {
      const error = new Error(
        "Los campos firstName, lastName y email son obligatorios"
      );

      error.statusCode = 400;
      throw error;
    }

    // 2. Normalizar email
    const normalizedEmail = email.trim().toLowerCase();

    // 3. Verificar si ya existe un usuario con ese email
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

    // 4. Validar role
    const userRole = role || USER_ROLES.USER;

    if (!Object.values(USER_ROLES).includes(userRole)) {
      const error = new Error("El rol de usuario no es válido");
      error.statusCode = 400;
      throw error;
    }

    // 5. Crear usuario
    const newUser = await userRepository.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      role: userRole
    });

    return newUser;
  }

  async updateUser(id, userData) {
    // 1. Verificar que el usuario exista
    const existingUser = await userRepository.getById(id);

    if (!existingUser) {
      const error = new Error("Usuario no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const updateData = { ...userData };

    // 2. Normalizar email si se está modificando
    if (updateData.email !== undefined) {
      const normalizedEmail = updateData.email.trim().toLowerCase();

      // Verificar que el nuevo email no pertenezca a otro usuario
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

    // 3. Validar role si se está modificando
    if (updateData.role !== undefined) {
      if (!Object.values(USER_ROLES).includes(updateData.role)) {
        const error = new Error("El rol de usuario no es válido");
        error.statusCode = 400;
        throw error;
      }
    }

    // 4. Limpiar nombres
    if (updateData.firstName !== undefined) {
      updateData.firstName = updateData.firstName.trim();
    }

    if (updateData.lastName !== undefined) {
      updateData.lastName = updateData.lastName.trim();
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