import { createContext, useRef } from "react";

export const CartIconRefContext = createContext();

export const CartIconRefProvider = ({ children }) => {
  const cartIconRef = useRef(null);
  return (
    <CartIconRefContext.Provider value={{ cartIconRef }}>
      {children}
    </CartIconRefContext.Provider>
  );
};