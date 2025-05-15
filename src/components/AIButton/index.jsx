import React from "react";
import "./AIButton.scss";
import { useNavigate } from "react-router-dom";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';


const AIButton = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/recommendation");
  };
  return (
    <button className="ai-button" onClick={handleClick}>
      {/* Gợi ý từ AI 🤖 */}
     <AutoAwesomeIcon sx={{"fontSize": "16px"}}/> Gợi ý mẫu kính
    </button>
  );
};

export default AIButton;
