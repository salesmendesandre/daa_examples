/* EJERCICIOS (punto 5): Catálogo de Productos y Moda */

import { Schema, model, Document as MongooseDocument } from "mongoose";

export interface ICatalogProduct extends MongooseDocument {
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  inStock: boolean;
  createdAt: Date;
}

const catalogProductSchema = new Schema<ICatalogProduct>(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, lowercase: true },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    inStock: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const CatalogProductModel = model<ICatalogProduct>("CatalogProduct", catalogProductSchema);
