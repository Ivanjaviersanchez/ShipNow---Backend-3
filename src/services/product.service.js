import { productRepository } from "../repositories/product.repository.js";

import { PRODUCT_STATUS } from "../constants/index.js";

import { createAppError } from "../utils/errors.js";

class ProductService {

  async getAllProducts() {
    const products = await productRepository.getAll();

    return products;
  }

  async getProductById(id) {
    const product = await productRepository.getById(id);

    if (!product) {
      throw createAppError("PRODUCT_NOT_FOUND");
    }

    return product;
  }

  async createProduct(productData) {
    const {
      name,
      description,
      price,
      stock
    } = productData;

    if (
      !name ||
      price === undefined ||
      stock === undefined
    ) {
      throw createAppError(
        "PRODUCT_VALIDATION_ERROR",
        "Los campos name, price y stock son obligatorios"
      );
    }

    if (price < 0) {
      throw createAppError(
        "PRODUCT_VALIDATION_ERROR",
        "El precio no puede ser negativo"
      );
    }

    if (stock < 0) {
      throw createAppError(
        "PRODUCT_VALIDATION_ERROR",
        "El stock no puede ser negativo"
      );
    }

    const status =
      stock > 0
        ? PRODUCT_STATUS.AVAILABLE
        : PRODUCT_STATUS.OUT_OF_STOCK;

    const newProduct =
      await productRepository.create({
        name,
        description,
        price,
        stock,
        status
      });

    return newProduct;
  }

  async updateProduct(id, productData) {
    const existingProduct =
      await productRepository.getById(id);

    if (!existingProduct) {
      throw createAppError("PRODUCT_NOT_FOUND");
    }

    const updateData = {
      ...productData
    };

    if (
      updateData.price !== undefined &&
      updateData.price < 0
    ) {
      throw createAppError(
        "PRODUCT_VALIDATION_ERROR",
        "El precio no puede ser negativo"
      );
    }

    if (updateData.stock !== undefined) {

      if (updateData.stock < 0) {
        throw createAppError(
          "PRODUCT_VALIDATION_ERROR",
          "El stock no puede ser negativo"
        );
      }

      updateData.status =
        updateData.stock > 0
          ? PRODUCT_STATUS.AVAILABLE
          : PRODUCT_STATUS.OUT_OF_STOCK;
    }

    return productRepository.updateById(
      id,
      updateData
    );
  }

  async deleteProduct(id) {
    const existingProduct =
      await productRepository.getById(id);

    if (!existingProduct) {
      throw createAppError("PRODUCT_NOT_FOUND");
    }

    await productRepository.deleteById(id);

    return {
      message: "Producto eliminado correctamente"
    };
  }

}

export const productService =
  new ProductService();