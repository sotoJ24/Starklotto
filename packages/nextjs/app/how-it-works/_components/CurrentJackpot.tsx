"use client"

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const CurrentJackpot = () => {

  const router = useRouter();

  const handleParticipate = () => {
    router.push('/play');
  };

  return (
    <div className="flex flex-col items-center text-white px-6 py-16 rounded-lg shadow-lg">
      <Image src="/jackpot.png" alt="Trophy" width={512} height={402} />
      
      <h2 className="text-3xl font-bold mb-4">🔥 CURRENT JACKPOT 🔥</h2>
      <p className="text-xl mb-4 text-yellow-500 font-bold">15 ETH + NFT EXCLUSIVE</p>
      <button onClick={handleParticipate} className="bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700 transition">
        PARTICIPATE NOW
      </button>
      <div className="mt-4">
        <Image src="/trophy.png" alt="Trophy" width={191} height={191} />
      </div>
    </div>
  );
};

export default CurrentJackpot; 