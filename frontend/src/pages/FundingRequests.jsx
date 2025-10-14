// src/pages/FundingRequests.jsx
import React from "react";
import DashboardHeader from "../components/layout/DashboardHeader";
import DashboardFooter from "../components/layout/DashboardFooter";

const FundingRequests = ({ auth, setAuth }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader auth={auth} setAuth={setAuth} />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Funding Requests</h1>
        <p className="text-gray-700">This is a placeholder page for supervisor funding requests.</p>
      </main>

      <DashboardFooter />
    </div>
  );
};

export default FundingRequests;
