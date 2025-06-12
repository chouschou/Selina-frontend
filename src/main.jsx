import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"
import AuthProvider from "./contexts/AuthContext/AuthProvider.jsx"
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LocalizationProvider>
  </React.StrictMode>
);
