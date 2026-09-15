import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const getProductId = (product) => {
    return product._id || product.id;
  };

  const addToCart = (product, quantity = 1) => {
  console.log("CART CONTEXT PRODUCT:", product);

  const productId = product._id || product.id;

  console.log("PRODUCT ID:", productId);

  setCartItems((prev) => {
    console.log("BEFORE CART ITEMS:", prev);

    const existingProduct = prev.find(
      (item) => (item._id || item.id) === productId
    );

    if (existingProduct) {
      return prev.map((item) =>
        (item._id || item.id) === productId
          ? {
              ...item,
              quantity: item.quantity + quantity,
            }
          : item
      );
    }

    const newItems = [
      ...prev,
      {
        ...product,
        quantity,
      },
    ];

    console.log("AFTER CART ITEMS:", newItems);

    return newItems;
  });
};
  const removeFromCart = (id) => {
    setCartItems((prev) =>
      prev.filter((item) => getProductId(item) !== id)
    );
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        getProductId(item) === id
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};