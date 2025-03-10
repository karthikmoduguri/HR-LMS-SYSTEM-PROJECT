import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const HrSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      companyName: { type: String},
  
      candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidate" }],
    },
    { timestamps: true }
  );
  HrSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
  HrSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  const Hr = mongoose.model("Hr", HrSchema);
  export default Hr;