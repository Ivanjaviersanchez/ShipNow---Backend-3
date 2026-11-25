import OrderModel from "../models/order.model.js";

class OrderRepository {
  async getAll({ skip = 0, limit = 10 } = {}) {
    const [orders, total] = await Promise.all([
      OrderModel.find({})
        .populate(
          "customer",
          "firstName lastName email role"
        )
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      OrderModel.countDocuments({})
    ]);

    return { data: orders, total };
  }

  async getById(id) {
    return OrderModel.findById(id)
      .populate(
        "customer",
        "firstName lastName email role"
      )
      .lean();
  }

  async create(orderData) {
    return OrderModel.create(orderData);
  }

  async insertMany(orders) {
    return OrderModel.insertMany(orders);
  }

  async updateById(id, orderData) {
    return OrderModel.findByIdAndUpdate(
      id,
      orderData,
      {
        new: true,
        runValidators: true
      }
    )
      .populate(
        "customer",
        "firstName lastName email role"
      )
      .lean();
  }

  async deleteById(id) {
    return OrderModel.findByIdAndDelete(id);
  }
}

export const orderRepository = new OrderRepository();
