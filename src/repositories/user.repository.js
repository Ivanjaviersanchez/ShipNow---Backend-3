import UserModel from "../models/user.model.js";

class UserRepository {
  async getAll() {
    return UserModel.find({})
      .select("firstName lastName email role")
      .lean();
  }

  async getById(id) {
    return UserModel.findById(id)
      .select("firstName lastName email role")
      .lean();
  }

  async getByEmail(email) {
    return UserModel.findOne({ email })
      .select("firstName lastName email role")
      .lean();
  }

  async create(userData) {
    return UserModel.create(userData);
  }

  async updateById(id, userData) {
    return UserModel.findByIdAndUpdate(
      id,
      userData,
      {
        new: true,
        runValidators: true
      }
    )
      .select("firstName lastName email role")
      .lean();
  }

  async deleteById(id) {
    return UserModel.findByIdAndDelete(id);
  }
}

export const userRepository = new UserRepository();