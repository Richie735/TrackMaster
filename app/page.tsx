import Image from "next/image";

const Home = () => {
   return (
      <>
         <section className="px-6 md:px-20 py-24 border-2">
            <div className="flex mas-xl:flex-col gap-16">
               <div className="flex flex-col justify-center">
                  <p className="small-text">
                     Revolutionize Your Shopping Experience:
                     <Image
                        src="/assets/icons/arrow-right.svg"
                        alt="arrow-right"
                        width={16}
                        height={16}
                     />
                  </p>
                  <h1 className="head-text">
                     Tap into the Strength of
                     <span className="text-primary"> TrackMaster</span>
                  </h1>
                  <p className="mt-6">
                     Effortless tracking, smart analytics. Unlock savings at
                     your fingertips.
                  </p>
                  // TODO: Search bar
               </div>
            </div>
         </section>
      </>
   );
};

export default Home;
