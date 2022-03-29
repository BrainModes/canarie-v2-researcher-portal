import React from "react";

const Footer = (props) => {
  const { theme } = props;
  const color = theme === "dark" ? "white" : "";
  return (
    <div
      style={{
        textAlign: "center",
        fontSize: "12px",
        padding: "10px",
        color: `${color}`,
      }}
    >
      Copyright © {new Date().getFullYear()},{" "}
      <a
        href="https://www.indocresearch.org/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Indoc Research
      </a>
      . All Rights Reserved.
    </div>
  );
};
export default Footer;
