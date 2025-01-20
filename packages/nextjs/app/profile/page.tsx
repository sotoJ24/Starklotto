"use client";

import React, { useEffect } from "react";
import { Page } from "~~/interfaces/global";
import { useContractFnStore } from "~~/services/store/contractFn";
import { ContractProfileUI } from "../_components/contractByApp/ContractProfileUI";
import { LOTT_CONTRACT_NAME } from "~~/utils/Constants";

const Profile = () => {
  const setCurrentPage = useContractFnStore((state) => state.setCurrentPage);

  useEffect(() => {
    setCurrentPage(Page.Profile);
  }, [setCurrentPage]);

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg shadow-md mt-36">
      <div className="flex flex-col items-center">
        <h1 className="mt-4 text-2xl font-semibold">Hello there!</h1>
        <p className="mt-2 text-gray-600 italic">
          This is a brief of your tickets.
        </p>
      </div>
      <ContractProfileUI contractName={LOTT_CONTRACT_NAME} />
    </div>
  );
};

export default Profile;
