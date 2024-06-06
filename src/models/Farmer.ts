import { Schema, model } from "mongoose";

const farmerSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    landSize: { type: Number, required: true, min: 0.1 }, 
    cropTypes: [{ type: String }], 
  },
  {
    timestamps: true, 
  }
);

const Farmer = model("Farmer", farmerSchema);
export default Farmer;
