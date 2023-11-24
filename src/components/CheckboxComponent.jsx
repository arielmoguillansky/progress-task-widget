import { useState } from "react";

export const CheckboxComponent = ({ handleChange, isChecked }) => {
  return (
    <label>
      <input type="checkbox" />
      <svg
        className={`checkbox ${isChecked ? "checkbox--active" : ""}`}
        // This element is purely decorative so
        // we hide it for screen readers
        aria-hidden="true"
        viewBox="0 0 15 11"
        fill="none"
      >
        <path
          d="M1 4.5L5 9L14 1"
          strokeWidth="2"
          stroke={isChecked ? "#fff" : "none"}
        />
      </svg>
    </label>
  );
};
