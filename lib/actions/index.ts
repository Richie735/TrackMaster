"use server";

import { User } from "@/types";
import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDatabase } from "../mongoose";
import { generateEmailContent, sendEmail } from "../nodemailer";
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
            { price: scrapedProduct.currentPrice },
         ];

         product = {
            ...scrapedProduct,
            priceHistory: updatedPriceHistory,
            highestPrice: checkHighestPrice(updatedPriceHistory),
            lowestPrice: checkLowestPrice(updatedPriceHistory),
            averagePrice: getAveragePrice(updatedPriceHistory),
         };
      }

      const newProduct = await Product.findOneAndUpdate(
         { url: scrapedProduct.url },
         product,
         { upsert: true, new: true }
      );

      revalidatePath(`/products/${newProduct._id}`);
   } catch (error: any) {
      console.error(`Failed to create/update product: ${error.message}`);
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

export async function getAllProducts() {
   try {
      connectToDatabase();

      const products = await Product.find({});

      return products;
   } catch (error) {
      console.log(error);
   }
}

export async function getRecomendedProducts(productID: string) {
   try {
      connectToDatabase();

      const currentProduct = await Product.findById(productID);

      if (!currentProduct) return null;

      const recomendedProducts = await Product.find({
         _id: { $ne: productID },
      }).limit(3);

      return recomendedProducts;
   } catch (error) {
      console.log(error);
   }
}

export async function addUserToProduct(productId: string, userEmail: string) {
   try {
      const product = await Product.findById(productId);
      if (!product) return;

      const userExists = product.users.some(
         (user: User) => user.email === userEmail
      );

      if (!userExists) {
         product.users.push({ email: userEmail });
         await product.save();
         const emailContent = await generateEmailContent(product, "WELCOME");
         await sendEmail(emailContent, [userEmail]);
      }
   } catch (error) {
      console.log(error);
   }
}
