import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
   {
      url: { type: String, required: true },
      currency: { type: String, required: true },
      image: { type: String, required: true },
      title: { type: String, required: true },
      category: { type: String },
      numberOfReviews: { type: Number },
      rating: { type: Number },
      description: { type: String },
      isOutOfStock: { type: Boolean, default: false },
      currentPrice: { type: Number, required: true },
      originalPrice: { type: Number, required: true },
      priceHistory: [
         {
            price: { type: Number, required: true },
            date: { type: Date, default: Date.now },
         },
      ],
      highestPrice: { type: Number },
      lowestPrice: { type: Number },
      averagePrice: { type: Number },
      discountRate: { type: Number },
      users: [{ email: { type: String, required: true } }],
      default: [],
   },
   { timestamps: true }
);

const Product =
   mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
