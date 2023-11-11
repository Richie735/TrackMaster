"use server";

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDatabase } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { checkHighestPrice, checkLowestPrice, getAveragePrice } from "../utils";

export async function scrapeAndSaveProduct(productUrl: string) {
   if (!productUrl) return;

   try {
      connectToDatabase();

      const scrapedProduct = await scrapeAmazonProduct(productUrl);

      if (!scrapedProduct) return;

      let product = scrapedProduct;

      const existingProduct = await Product.findOne({
         url: scrapedProduct.url,
      });

      if (existingProduct) {
         const updatedPriceHistory: any = [
            ...existingProduct.priceHistory,
            {
               price: scrapedProduct.currentPrice,
            },
         ];

         product = {
            ...scrapedProduct,
            priceHistory: updatedPriceHistory,
            highestPrice: checkHighestPrice(updatedPriceHistory),
            lowestPrice: checkLowestPrice(updatedPriceHistory),
            averagePrice: getAveragePrice(updatedPriceHistory),
         };

         const newProduct = await Product.findOneAndUpdate(
            { url: scrapedProduct.url },
            product,
            { upsert: true, new: true }
         );

         revalidatePath(`/products/${newProduct._id}`);
      }
   } catch (error: any) {
      throw new Error(`Failed to create/update product: ${error.message}`);
   }
}

export async function getProductById(productId: string) {
   try {
      connectToDatabase();

      const product = await Product.findOne({ _id: productId });

      if (!product) return null;

      return product;
   } catch (error) {
      console.log(error);
   }
}
