import { productService } from "../services/product.service.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();

    res.status(200).json({
      status: "success",
      payload: products
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await productService.getProductById(id);

    res.status(200).json({
      status: "success",
      payload: product
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);

    res.status(201).json({
      status: "success",
      message: "Producto creado correctamente",
      payload: product
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await productService.updateProduct(
      id,
      req.body
    );

    res.status(200).json({
      status: "success",
      message: "Producto actualizado correctamente",
      payload: product
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await productService.deleteProduct(id);

    res.status(200).json({
      status: "success",
      ...result
    });
  } catch (error) {
    next(error);
  }
};