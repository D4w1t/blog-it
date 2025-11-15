import { Schema, model, Types } from "mongoose";

interface IToken {
  token: string;
  user: Types.ObjectId;
}

const tokenSchema = new Schema<IToken>({
  token: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User", // Reference to User model
    index: true,
  },
});

export default model<IToken>("Token", tokenSchema);
