import React, { useState } from "react";

const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#000",
};

const inputStyle = {
  width: "min(88vw, 280px)",
  padding: "10px 12px",
  borderRadius: "6px",
  border: "1px solid #222",
  backgroundColor: "#050505",
  color: "#111",
  fontSize: "16px",
};

const BlackoutActivatePage = () => {
  const [value, setValue] = useState("");

  const activateBlackout = () => {
    if (value === "1") {
      localStorage.setItem("siteBlackout", "1");
      window.dispatchEvent(new Event("site-blackout-changed"));
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      activateBlackout();
    }
  };

  return (
    <div style={containerStyle}>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        style={inputStyle}
        autoComplete="off"
      />
    </div>
  );
};

export default BlackoutActivatePage;
