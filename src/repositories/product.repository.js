import ProductModel from "../models/product.model.js";

class ProductRepository {
  async getAll() {
    return ProductModel.find({}).lean();
  }

  async getById(id) {
    return ProductModel.findById(id).lean();
  }

  async create(productData) {
    return ProductModel.create(productData);
  }

  async updateById(id, productData) {
    return ProductModel.findByIdAndUpdate(
      id,
      productData,
      {
        new: true,
        runValidators: true
      }
    ).lean();
  }

  async deleteById(id) {
    return ProductModel.findByIdAndDelete(id);
  }
}

export const productRepository = new ProductRepository();