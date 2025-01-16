import React from 'react';
import { WalletIcon, CheckCircleIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const HowItWorks = () => {
  return (
    <div className="py-12 px-6 rounded-xl max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold text-center text-white mb-8">
        How It Works
      </h2>

      <ol className="space-y-6">
        <li className="flex items-start space-x-4">
          <WalletIcon className="h-8 w-8 text-white" />
          <div>
            <span className="text-lg font-semibold text-white">1. Connect Your Web3 Wallet:</span>
            <p className="text-gray-300 mt-1">Connect using Braavos or another compatible wallet.</p>
          </div>
        </li>

        <li className="flex items-start space-x-4">
          <DocumentTextIcon className="h-8 w-8 text-white" />
          <div>
            <span className="text-lg font-semibold text-white">2. Choose Your Numbers:</span>
            <p className="text-gray-300 mt-1">Select your favorite numbers or let the system pick them automatically.</p>
          </div>
        </li>

        <li className="flex items-start space-x-4">
          <CheckCircleIcon className="h-8 w-8 text-white" />
          <div>
            <span className="text-lg font-semibold text-white">3. Confirm Your Participation:</span>
            <p className="text-gray-300 mt-1">Complete the transaction on the blockchain.</p>
          </div>
        </li>

        <li className="flex items-start space-x-4">
          <ChartBarIcon className="h-8 w-8 text-white" />
          <div>
            <span className="text-lg font-semibold text-white">4. Check the Results:</span>
            <p className="text-gray-300 mt-1">Review the real-time results and automatically claim your prizes.</p>
          </div>
        </li>
      </ol>



      <div className="text-center mt-10">
        <button
          className="border-2 border-white px-6 py-2 rounded-md font-semibold hover:bg-white hover:text-[#1a0505] transition"
        >
          Watch Video Tutorial
        </button>
      </div>
    </div>
  );
};

export default HowItWorks;
