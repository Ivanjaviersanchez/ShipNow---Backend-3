import mongoose from "mongoose";

import { USER_ROLES } from "../constants/index.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      select: false
    },

    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.CUSTOMER
    },

    isAvailable: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;