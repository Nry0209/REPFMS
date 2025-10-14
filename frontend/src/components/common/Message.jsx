// src/components/Message.jsx
import React from "react";

const Message = ({ variant = "info", children }) => {
  const colors = {
    success: "bg-green-100 text-green-800 border-green-400",
    danger: "bg-red-100 text-red-800 border-red-400",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-400",
    info: "bg-blue-100 text-blue-800 border-blue-400",
  };

  return (
    <div
      className={`border-l-4 p-4 mb-4 rounded ${colors[variant] || colors.info}`}
      role="alert"
    >
      {children}
    </div>
  );
};

export default Message;
