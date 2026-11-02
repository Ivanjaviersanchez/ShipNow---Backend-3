
import mongoose from "mongoose";
import { USER_ROLES, DOCUMENT_TYPES } from "../constants/index.js";

const documentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        DOCUMENT_TYPES.USER_DOCUMENT,
        DOCUMENT_TYPES.DRIVER_LICENSE
      ],
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

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
    },
    documents: {
      type: [documentSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
