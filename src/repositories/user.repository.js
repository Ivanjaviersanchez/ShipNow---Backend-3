import UserModel from "../models/user.model.js";

class UserRepository {
  async getAll() {
    return UserModel.find({})
      .select("firstName lastName email role isAvailable")
      .lean();
  }

  async getById(id) {
    return UserModel.findById(id)
      .select("firstName lastName email role isAvailable")
      .lean();
  }

  async getByEmail(email) {
    return UserModel.findOne({ email })
      .select("firstName lastName email role isAvailable")
      .lean();
  }

  async create(userData) {
    return UserModel.create(userData);
  }

  async insertMany(users) {
    const createdUsers = await UserModel.insertMany(users);

    return createdUsers.map((user) => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isAvailable: user.isAvailable,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
  }

  async updateById(id, userData) {
    return UserModel.findByIdAndUpdate(
      id,
      userData,
      { new: true, runValidators: true }
    )
      .select("firstName lastName email role isAvailable")
      .lean();
  }

  async deleteById(id) {
    return UserModel.findByIdAndDelete(id);
  }
}

export const userRepository = new UserRepository();