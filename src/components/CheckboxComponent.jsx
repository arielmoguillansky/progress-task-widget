export const CheckboxComponent = ({ checked }) => {
  if (checked) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <rect width="16" height="16" rx="4" fill="#00B797" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.49574 10.1007L3.888 7.30201L3 8.24832L6.49574 12L13 4.94631L12.1182 4L6.49574 10.1007Z"
          fill="white"
        />
      </svg>
    );
  } else {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <rect
          x="0.5"
          y="0.5"
          width="15"
          height="15"
          rx="3.5"
          stroke="#999999"
        />
      </svg>
    );
  }
};
