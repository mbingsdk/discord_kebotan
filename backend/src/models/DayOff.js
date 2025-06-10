import mongoose from "mongoose";

const schema = new mongoose.Schema({
  tahun: { type: String, required: true, unique: true },
  bulan: { type: Object }
}, { timestamps: true })

export default mongoose.model('DayOff', schema)