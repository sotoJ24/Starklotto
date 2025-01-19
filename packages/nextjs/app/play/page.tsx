"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Page } from "~~/interfaces/global";
import { usePlayStore } from "~~/services/store/play";
import { useContractFnStore } from "~~/services/store/contractFn";

const PlayPage = () => {
  const router = useRouter();

  // Simulate a draw every 2 minutes
  const getNextDrawTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 2); // Draw every 2 minutes
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
        days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(
          2,
          "0",
        ),
        hours: String(
          Math.floor((difference / (1000 * 60 * 60)) % 24),
        ).padStart(2, "0"),
        minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(
          2,
          "0",
        ),
        seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, "0"),
      };
    }

    return timeLeft;
  };
  const setCurrentPage = useContractFnStore.getState().setCurrentPage;
  const setLoteryId = usePlayStore.getState().setLoteryId;

  const [targetDate, setTargetDate] = useState(getNextDrawTime());
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  const handlePlayNow = (id: string) => {
    router.push("/play/confirmation");
    setLoteryId(id);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTime = calculateTimeLeft(targetDate);
      setTimeLeft(updatedTime);

      //  Reset when countdown reaches zero
      if (
        updatedTime.days === "00" &&
        updatedTime.hours === "00" &&
        updatedTime.minutes === "00" &&
        updatedTime.seconds === "00"
      ) {
        setTargetDate(getNextDrawTime()); // Restart the draw
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  useEffect(() => {
    setLoteryId(null);
    setCurrentPage(Page.Play);
  }, [setLoteryId, setCurrentPage]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen text-white pt-8">
      <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 drop-shadow-lg animate-fade-in mt-6 md:mt-12 mb-6 pb-2">
        Ready to Win Big and Make an Impact?
      </h1>

      <div className="flex flex-wrap justify-center gap-8">
        {[1, 2].map((_, index) => (
          <div
            key={index}
            className="w-72 p-6 bg-gradient-to-b from-red-600 to-orange-500 rounded-xl shadow-2xl hover:scale-105 transition-transform duration-300"
          >
            <h2 className="text-xl font-bold mb-2 text-center">
              House Lottery
            </h2>
            <p className="text-sm text-center mb-4">
              Bet 2 $Clotta and choose 5 numbers
            </p>
            <p className="text-sm text-center mb-4">
              💰 Prize: Accumulated Jackpot.
            </p>

            <p className="text-center text-lg font-semibold text-cyan-200 mb-2">
              Next Draw In
            </p>

            {/*  Live Countdown */}
            <div className="flex justify-center space-x-2 mb-4">
              {Object.entries(timeLeft).map(([key, value]) => (
                <div
                  key={key}
                  className="flex flex-col items-center justify-center w-14 h-20 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg shadow-lg border border-gray-600"
                >
                  <span className="text-2xl font-extrabold text-green-400 animate-pulse">
                    {value}
                  </span>
                  <span className="text-xs capitalize text-gray-300">
                    {key}
                  </span>
                </div>
              ))}
            </div>

            {/*  Button to redirect to confirmation page */}
            <button
              onClick={() => handlePlayNow(index.toString())}
              className="w-full py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition"
            >
              Play Now!
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayPage;
