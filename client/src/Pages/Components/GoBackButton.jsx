import React from "react";
import { useNavigate } from "react-router-dom";

const GoBackButton = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <button className="go-back btn" onClick={handleGoBack}>
      Go Back
    </button>
  );
};

export default GoBackButton;
