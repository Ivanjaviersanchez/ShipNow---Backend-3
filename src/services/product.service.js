import { productRepository } from "../repositories/product.repository.js";
import { PRODUCT_STATUS } from "../constants/index.js";

class ProductService {
  async getAllProducts() {
    const products = await productRepository.getAll();

    return products;
  }

  async getProductById(id) {
    const product = await productRepository.getById(id);

    if (!product) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return product;
  }

  async createProduct(productData) {
    const { name, description, price, stock } = productData;

    if (!name || price === undefined || stock === undefined) {
      const error = new Error(
        "Los campos name, price y stock son obligatorios"
      );

      error.statusCode = 400;
      throw error;
    }

    if (price < 0) {
      const error = new Error("El precio no puede ser negativo");
      error.statusCode = 400;
      throw error;
    }

    if (stock < 0) {
      const error = new Error("El stock no puede ser negativo");
      error.statusCode = 400;
      throw error;
    }

    const status =
      stock > 0
        ? PRODUCT_STATUS.AVAILABLE
        : PRODUCT_STATUS.OUT_OF_STOCK;

    const newProduct = await productRepository.create({
      name,
      description,
      price,
      stock,
      status
    });

    return newProduct;
  }

  async updateProduct(id, productData) {
    const existingProduct = await productRepository.getById(id);

    if (!existingProduct) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const updateData = { ...productData };

    if (updateData.price !== undefined && updateData.price < 0) {
      const error = new Error("El precio no puede ser negativo");
      error.statusCode = 400;
      throw error;
    }

    if (updateData.stock !== undefined) {
      if (updateData.stock < 0) {
        const error = new Error("El stock no puede ser negativo");
        error.statusCode = 400;
        throw error;
      }

      updateData.status =
        updateData.stock > 0
          ? PRODUCT_STATUS.AVAILABLE
          : PRODUCT_STATUS.OUT_OF_STOCK;
    }

    return productRepository.updateById(id, updateData);
  }

  async deleteProduct(id) {
    const existingProduct = await productRepository.getById(id);

    if (!existingProduct) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }

    await productRepository.deleteById(id);

    return {
      message: "Producto eliminado correctamente"
    };
  }
}

export const productService = new ProductService();