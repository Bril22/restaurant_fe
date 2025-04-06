'use client'
import RestaurantCard from "@/components/restaurant-card";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<>...Loading</>}>
      <div className="flex flex-col md:gap-32 gap-16">
        <div className="relative flex items-center justify-center h-[600px]">
          <div className="flex flex-col items-center text-center justify-center gap-4 relative z-10 h-ful text-white">
            <h1 className="md:text-6xl text-4xl font-bold">Restaurant App</h1>
            <p className="md:text-base text-xs mt-4 max-w-2xl">
              Explore a variety of quality restaurants with delicious menus and comfortable ambiance.
              Order your favorite food easily and enjoy the best culinary experience.
            </p>
            <Link href={'/admin/restaurant-list'} aria-label="create-list" className="px-4 py-2 bg-blue-800 text-white rounded-md font-medium text-lg">Create List</Link>
          </div>
          <Image src={'/images/banner-resto.jpg'} alt="banner" width={500} height={600} className="w-full h-full object-cover absolute top-0 left-0" />
          <div className="flex absolute inset-0 w-full h-full bg-black opacity-70" />
        </div>
        <div>
          <RestaurantCard />
        </div>
        <div></div>
      </div>
    </Suspense>
  );
}
