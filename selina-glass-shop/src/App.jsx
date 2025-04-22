import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import RegisterForm from "./pages/Auth/Register"
import LogIn from "./pages/Auth/LogIn"
import "./App.css"
import { useState } from "react"
import HomePage from "./pages/Homepage"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Order from "./pages/Order"

const theme = createTheme({
  palette: {
    primary: { main: "#1FAB89" },
    secondary: { main: "#FF3366" },
    success: { main: "#1FAB89" },
  },
  typography: { fontFamily: "Roboto, Arial, sans-serif" },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none" },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
})

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app">
          <Header isLoggedIn={isLoggedIn} />
          <main>            
            <Routes>
              <Route
                path="/login"
                element={<LogIn onLoginSuccess={() => setIsLoggedIn(true)} />}
              />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/" element={<HomePage/>}/>
              <Route path="/detail" element={<ProductDetail/>}/>
              <Route path="/cart" element={<Cart/>}/>
              <Route path="/order" element={<Order/>}/>
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
