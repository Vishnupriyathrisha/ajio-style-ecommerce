const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      enum: ["Men", "Women", "Kids", "Beauty", "AJIO Luxe"],
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    sizes: {
      type: [String],
      default: [],
    },

    color: {
      type: String,
      trim: true,
      default: "",
    },

    seller: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Seller",
  default: null,
},

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ isActive: 1, category: 1, createdAt: -1 });

module.exports = mongoose.model("Product", productSchema);