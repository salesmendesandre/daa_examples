import { Schema, model, InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ["user", "admin", "editor"],
      default: "user"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export type IUser = InferSchemaType<typeof UserSchema>;
export const UserModel = model<IUser>("User", UserSchema);
