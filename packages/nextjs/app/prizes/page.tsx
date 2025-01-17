"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PrizesPage = () => {
  const router = useRouter();

  const getNextDrawTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 2);
    return now;
  };

  const calculateTimeLeft = (targetDate: Date) => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    let timeLeft = {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
    };

    if (difference > 0) {
      timeLeft = {
        days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, "0"),
        hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
        minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, "0"),
        seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, "0"),
      };
    }

    return timeLeft;
  };

  const [targetDate, setTargetDate] = useState(getNextDrawTime());
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTime = calculateTimeLeft(targetDate);
      setTimeLeft(updatedTime);

      if (
        updatedTime.days === "00" &&
        updatedTime.hours === "00" &&
        updatedTime.minutes === "00" &&
        updatedTime.seconds === "00"
      ) {
        setTargetDate(getNextDrawTime());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen text-white pt-8 px-4">
      {/* ✅ Título Principal Corregido */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 drop-shadow-lg animate-fade-in mt-6 md:mt-12 mb-10 pb-2 text-center">
        🎉 Discover the Prizes!
      </h1>

      
      <div className="flex flex-col md:flex-row justify-center items-center w-full max-w-7xl gap-8">
        {/* 🔥 Sección Izquierda - Lotería */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-center mb-4">🔥 Current Award 🔥</h2>
          <div className="w-80 p-6 bg-gradient-to-b from-red-600 to-orange-500 rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-bold mb-2 text-center">House Lottery</h2>
            <p className="text-sm text-center mb-2">Bet 2 $Clotta and choose 5 numbers</p>
            <p className="text-sm text-center mb-4">💰 Prize: Accumulated Jackpot.</p>

            <p className="text-center text-lg font-semibold text-cyan-200 mb-2">
              Next Draw In
            </p>

            
            <div className="flex justify-center space-x-2 mb-4">
              {Object.entries(timeLeft).map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-col items-center justify-center w-14 h-20 bg-gray-900 bg-opacity-70 text-white rounded-lg shadow-md"
                >
                  <span className="text-2xl font-extrabold text-green-400">{value}</span>
                  <span className="text-xs capitalize text-gray-300">{key}</span>
                </div>
              ))}
            </div>

            
            <button
              onClick={() => router.push("/play")}
              className="w-full py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition"
            >
              Play Now!
            </button>
          </div>
        </div>

        
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-center mb-4">📅 Draw Results 📅</h2>
          <div className="bg-gray-900 bg-opacity-30 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full">
            <table className="w-full text-left text-white border-collapse">
              <thead>
                <tr className="bg-gray-800">
                  <th className="px-4 py-3">Draw #</th>
                  <th className="px-4 py-3">Winning Numbers</th>
                  <th className="px-4 py-3">Prize Pool</th>
                  <th className="px-4 py-3">Winners</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-800 transition">
                  <td className="px-4 py-2">#1234</td>
                  <td className="px-4 py-2">05, 12, 23, 34, 40</td>
                  <td className="px-4 py-2">$1,500</td>
                  <td className="px-4 py-2">3</td>
                  <td className="px-4 py-2">16/01/2025</td>
                  <td className="px-4 py-2 text-green-400">Completed</td>
                </tr>
                <tr className="hover:bg-gray-800 transition">
                  <td className="px-4 py-2">#1235</td>
                  <td className="px-4 py-2">08, 14, 22, 30, 45</td>
                  <td className="px-4 py-2">$2,000</td>
                  <td className="px-4 py-2">2</td>
                  <td className="px-4 py-2">17/01/2025</td>
                  <td className="px-4 py-2 text-yellow-400">Pending</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizesPage;
