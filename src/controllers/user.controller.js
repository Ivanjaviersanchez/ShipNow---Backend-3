import { userService } from "../services/user.service.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      status: "success",
      payload: users
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await userService.getUserById(id);

    res.status(200).json({
      status: "success",
      payload: user
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      status: "success",
      message: "Usuario creado correctamente",
      payload: user
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await userService.updateUser(
      id,
      req.body
    );

    res.status(200).json({
      status: "success",
      message: "Usuario actualizado correctamente",
      payload: user
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await userService.deleteUser(id);

    res.status(200).json({
      status: "success",
      ...result
    });
  } catch (error) {
    next(error);
  }
};