import React from "react";
import FinancialChatBot from "@/components/financial-chatbot";

const MainLayout = ({ children }) => {
  return (
    <div className="container mx-auto my-32">
      {children}
      <FinancialChatBot />
    </div>
  );
};

export default MainLayout;
