"use client";
import ArrowIcon from "@/assets/arrow-right.svg";
import DragElements from "@/components/fancy/drag-elements";
import LetterSwapPingPong from "@/components/fancy/letter-swap-pingpong-anim";
import { useScroll } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export const Hero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={heroRef}
      className="pt-8 pb-20 md:pt-5 md:pb-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#183EC2,#EAEEFE_100%)] overflow-x-clip"
    >
      <div className="container">
        <div className="md:flex items-center">
          <div className="md:w-[478px]">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-6">
              Pathway to productivity
            </h1>
            <p className="text-xl text-[#010D3E] tracking-tight mt-6">
              Celebrate the joy of accomplishment with an app designed to track
              your progress, motivate your efforts, and celebrate your
              successes.
            </p>
            <div className="flex gap-1 items-center mt-[30px]">
              <Link href="/dashboard" className="btn btn-primary">
                <LetterSwapPingPong label="Get for free" staggerFrom={"last"} />
              </Link>
              <button className="btn btn-text gap-1 hover:text-white">
                <span>Learn more</span>
                <ArrowIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative">
            <div className="w-full h-full relative">
              <DragElements dragMomentum={true} className="p-30 md:p-40">
                <div className="text-2xl md:text-6xl px-6 py-3 md:px-8 md:py-4 rounded-full bg-[#183EC2] shadow-lg rotate-[-2deg] justify-center items-center">
                  super fun ✿
                </div>
                <div className="text-2xl md:text-5xl px-6 py-3 md:px-8 md:py-4 rounded-full bg-[#183EC2] shadow-lg rotate-[2deg] justify-center items-center">
                  funky time! ✴
                </div>
                <div className="text-2xl md:text-6xl px-6 py-3 md:px-8 md:py-4 rounded-full bg-[#E794DA] shadow-lg rotate-[-4deg] justify-center items-center">
                  awesome ✺
                </div>
              </DragElements>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
