import DeliveryModel from "../models/delivery.model.js";

class DeliveryRepository {
  async getAll() {
    return DeliveryModel.find({})
      .populate("order")
      .populate(
        "driver",
        "firstName lastName email role isAvailable"
      )
      .lean();
  }

  async getById(id) {
    return DeliveryModel.findById(id)
      .populate("order")
      .populate(
        "driver",
        "firstName lastName email role isAvailable"
      )
      .lean();
  }

  async create(deliveryData) {
    return DeliveryModel.create(deliveryData);
  }

  async insertMany(deliveries) {
    return DeliveryModel.insertMany(deliveries);
  }

  async updateById(id, deliveryData) {
    return DeliveryModel.findByIdAndUpdate(
      id,
      deliveryData,
      {
        new: true,
        runValidators: true
      }
    )
      .populate("order")
      .populate(
        "driver",
        "firstName lastName email role isAvailable"
      )
      .lean();
  }

  async deleteById(id) {
    return DeliveryModel.findByIdAndDelete(id);
  }
}

export const deliveryRepository = new DeliveryRepository();