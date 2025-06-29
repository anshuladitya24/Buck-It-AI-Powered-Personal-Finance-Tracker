"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    // Use passive listeners for better mobile performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="pt-40 pb-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title font-black tracking-tight">
          Smart Money Management <br /> Made Simple
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
          Take control of your finances with Buck-It&apos;s intelligent budgeting, 
          expense tracking, and savings goals. Your money, your rules, our smart tools.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" className="buck-it-button-primary px-8 py-4 text-lg shadow-xl">
              Start Saving Today
            </Button>
          </Link>
          <Link href="https://www.youtube.com">
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-green-200 hover:border-green-300 hover:bg-green-50">
              Watch Demo
            </Button>
          </Link>
        </div>
        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/banner.png"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
