import React, { useState } from "react";

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
}

const Collapsible: React.FC<CollapsibleProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="collapsible-container">
      <div
        className="collapsible-trigger"
        onClick={toggleCollapse}
        style={{
          cursor: "pointer",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "5px",
          marginBottom: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{title}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <div className="collapsible-content" style={{ padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "5px" }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Collapsible;
