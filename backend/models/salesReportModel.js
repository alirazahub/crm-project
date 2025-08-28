import mongoose from "mongoose";
const SalesReportSchema = {
  id: "string", // UUID
  platform: "enum[WhatsApp, Instagram, Facebook]", // required
  salesCount: "number", // required, min: 0
  revenue: "number", // required, min: 0
  date: "string", // required, ISO date format
  notes: "string", // optional
  createdAt: "string", // ISO timestamp
  updatedAt: "string", // ISO timestamp
  status: "enum[draft, submitted, approved, rejected]",
};
export default mongoose.model(
  "SalesReport",
  new mongoose.Schema(SalesReportSchema, { timestamps: true })
);
