import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const CandidateSchema = new mongoose.Schema(
  {
    hr: { type: mongoose.Schema.Types.ObjectId, ref: "Hr", required: true }, 
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    team: { type: String }, 
    offerLetter: { type: String }, 
    attendance: [{ date: Date, status: String }], 
    socialMedia: { type: String }, 
    offboardingStatus: { type: Boolean, default: false }, 
  },
  { timestamps: true }
);

CandidateSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

CandidateSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Candidate = mongoose.model("Candidate", CandidateSchema);
export default Candidate;
