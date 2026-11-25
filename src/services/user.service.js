
import { userRepository } from "../repositories/user.repository.js";
import { USER_ROLES, DOCUMENT_TYPES } from "../constants/index.js";
import { createAppError } from "../utils/errors.js";
import { removeUploadedFile } from "../utils/files.js";
import logger from "../utils/logger.js";

import { parsePagination, buildPagination } from "../utils/pagination.js";

class UserService {
  async getAllUsers(query = {}) {
    const { page, limit, skip } = parsePagination(query);

    const { data, total } = await userRepository.getAll({
      skip,
      limit
    });

    return {
      data,
      pagination: buildPagination(page, limit, total)
    };
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
    const existingUser = await userRepository.getByEmail(normalizedEmail);

    if (existingUser) {
      throw createAppError("USER_ALREADY_EXISTS");
    }

    const userRole = role || USER_ROLES.CUSTOMER;

    if (!Object.values(USER_ROLES).includes(userRole)) {
      throw createAppError("INVALID_USER_ROLE");
    }

    return userRepository.create({
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
  }

  async updateUser(id, userData) {
    const existingUser = await userRepository.getById(id);

    if (!existingUser) {
      throw createAppError("USER_NOT_FOUND");
    }

    const updateData = { ...userData };

    if (updateData.email !== undefined) {
      const normalizedEmail = updateData.email.trim().toLowerCase();
      const userWithEmail = await userRepository.getByEmail(normalizedEmail);

      if (
        userWithEmail &&
        userWithEmail._id.toString() !== id
      ) {
        throw createAppError("USER_ALREADY_EXISTS");
      }

      updateData.email = normalizedEmail;
    }

    if (updateData.role !== undefined) {
      if (!Object.values(USER_ROLES).includes(updateData.role)) {
        throw createAppError("INVALID_USER_ROLE");
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
      throw createAppError("USER_NOT_FOUND");
    }

    await userRepository.deleteById(id);

    return {
      message: "Usuario eliminado correctamente"
    };
  }

  async addDocument(id, file, type) {
    if (!file) {
      throw createAppError("FILE_REQUIRED");
    }

    try {
      const allowedTypes = [
        DOCUMENT_TYPES.USER_DOCUMENT,
        DOCUMENT_TYPES.DRIVER_LICENSE
      ];

      if (!allowedTypes.includes(type)) {
        throw createAppError("INVALID_DOCUMENT_TYPE");
      }

      const existingUser = await userRepository.getById(id);

      if (!existingUser) {
        throw createAppError("USER_NOT_FOUND");
      }

      const documentMetadata = {
        type,
        originalName: file.originalname,
        filename: file.filename,
        path: `/uploads/documents/${file.filename}`,
        mimetype: file.mimetype,
        size: file.size,
        uploadedAt: new Date()
      };

      const documents = [
        ...(existingUser.documents ?? []),
        documentMetadata
      ];

      const updatedUser = await userRepository.updateById(
        id,
        { documents }
      );

      if (!updatedUser) {
        throw createAppError("USER_NOT_FOUND");
      }

      logger.info("Documento asociado al usuario", {
        userId: id,
        documentType: type,
        filename: file.filename,
        size: file.size
      });

      return updatedUser;
    } catch (error) {
      try {
        await removeUploadedFile(file.path);
      } catch (cleanupError) {
        logger.error("No se pudo eliminar un archivo temporal", {
          filename: file.filename,
          message: cleanupError.message
        });
      }

      logger.warning("Falló la carga de un documento de usuario", {
        userId: id,
        filename: file.filename,
        error: error.code ?? error.message
      });

      throw error;
    }
  }
}

export const userService = new UserService();
