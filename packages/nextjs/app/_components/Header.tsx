"use client"

import React from 'react';

import SocialLinks from './SocialLinks';
import { useRouter } from 'next/navigation';

function Header() {
  const router = useRouter();

  const handlePlayNow = () => {
    router.push('/play');
  };

  const handleExplorePrizes = () => {
    router.push('/prizes');
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="space-y-6 py-20 pl-24">
        <h1 className="text-5xl font-bold leading-tight mt-0">
          WELCOME TO STARKLOTTO!
        </h1>
        <p className="text-sm opacity-90 max-w-xl">
          THE MOST INNOVATIVE DECENTRALIZED LOTTERY ON THE STARKNET BLOCKCHAIN.
          PLAY, WIN, AND BE PART OF THE FUTURE OF DIGITAL LOTTERIES.
        </p>
        <div className="flex gap-4 pt-4">
          <button
            onClick={handlePlayNow}
            className="bg-white text-[#1a0505] px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition"
          >
            Play Now
          </button>
          <button
            onClick={handleExplorePrizes}
            className="border-2 border-white px-6 py-2 rounded-md font-semibold hover:bg-white hover:text-[#1a0505] transition"
          >
            Explore Prizes
          </button>
        </div>
        
        <div className="pt-8">
          <p className="mb-4">Share Your Experience</p>
          <SocialLinks />
        </div>
      </div>

      <div className="relative">
        <img 
          src="https://s3-alpha-sig.figma.com/img/065c/5108/eaa03db5a906a1d3a0e2e8da9c17a177?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=fY9c1eQPK~LUDgDILP6-jaLxdp4j3s3RRP8~b1BI14rw502IcPse-zJWvt3fxlXYn3c9TFFo3j4iNKde0N8XGLy13RplVbfDpm9Gme5IB6VfjWaL-44znsqbKxKX4PvjYxevv~VDMGNo26~e37qq6GepNhPWNxsYfl~VPuxQOvbe3nPHyR0N~ZPFyTv4LQyldwpbseewNAviHkAFuL5XMgw7f3ZKIXsxRSjzZ1NeXbEJi3qI4BsLQ8t7I-NrAtCJdiYAqe~SQLu96ClE8~rztNmwJigyaQRIdqgF8Vtm-LxrZ0okIq75E3HqqoQ418yGvRVUr8PTPz1j6KFSlHbl1g__" 
          alt="Lottery ticket with coins" 
          className="rounded-[50px] shadow-2xl w-[606px] h-[404px] mt-16"
        />
      </div>
    </div>
  );
}

export default Header;