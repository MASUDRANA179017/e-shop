import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      if (product.isService && product.bookingDate && product.bookingTime) {
        const exists = prevItems.some(
          (item) =>
            item.isService &&
            item.id === product.id &&
            item.bookingDate === product.bookingDate &&
            item.bookingTime === product.bookingTime
        );
        if (exists) {
          toast.dismiss();
          toast.info("This time slot is already in your cart", { toastId: "cart-toast" });
          return prevItems;
        }
        toast.dismiss();
        toast.success("Service booking added to cart!", { toastId: "cart-toast" });
        return [...prevItems, { ...product, quantity: 1 }];
      }
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        toast.dismiss();
        toast.info("Item quantity updated in cart", { toastId: "cart-toast" });
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.dismiss();
      toast.success("Product added to cart!", { toastId: "cart-toast" });
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId, bookingDate, bookingTime) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => {
        if (item.isService && bookingDate && bookingTime) {
          return !(
            item.id === productId &&
            item.bookingDate === bookingDate &&
            item.bookingTime === bookingTime
          );
        }
        return item.id !== productId;
      })
    );
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? item.isService && item.bookingTime
            ? { ...item, quantity: 1 }
            : { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
