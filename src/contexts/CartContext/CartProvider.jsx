import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext/AuthContext";
import { getCartsByAccountId } from "../../services/cart/getCartsByAccountId";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
  const { isLoggedIn, account } = useContext(AuthContext); // từ AuthContext
  const [cartChanged, setCartChanged] = useState(0);
  const [carts, setCarts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const refreshCart = () => setCartChanged(prev => prev + 1);

  const fetchCarts = async () => {
    try {
      if (isLoggedIn && account?.ID) {
        const response = await getCartsByAccountId(account.ID);
        setCarts(response.carts || []);
        setTotalItems(response.totalItems || response.length || 0);
      } else {
        setCarts([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, [cartChanged, isLoggedIn, account]);

  return (
    <CartContext.Provider value={{ carts, totalItems, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};