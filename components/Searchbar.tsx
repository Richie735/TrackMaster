"use client";

import { FormEvent, useState } from "react";

const isValidAmazonUrl = (url: string) => {
   try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;

      if (
         hostname.includes("amazon.com") ||
         hostname.includes("amazon.") ||
         hostname.endsWith("amznon")
      ) {
         return true;
      }
   } catch (error) {
      return false;
   }

   return false;
};

const Searchbar = () => {
   const [searchPrompt, setSearchPrompt] = useState("");
   const [isLoading, setIsLoading] = useState(false);

   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const isValidLink = isValidAmazonUrl(searchPrompt);

      if (!isValidLink) {
         return alert("Please enter a valid Amazon link");
      }

      try {
         setIsLoading(true);

         // TODO: Scrape the product page
      } catch (error) {
         console.log(error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
         <input
            type="text"
            value={searchPrompt}
            onChange={(e) => setSearchPrompt(e.target.value)}
            placeholder="Enter a product link"
            className="searchbar-input"
         />

         <button
            type="submit"
            className="searchbar-btn"
            disabled={searchPrompt === "" || isLoading}
         >
            {isLoading ? "Loading..." : "Search"}
         </button>
      </form>
   );
};

export default Searchbar;
