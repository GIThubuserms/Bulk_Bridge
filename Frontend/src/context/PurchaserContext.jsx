import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types"; // <-- import this

const PurchaseContext = createContext(null);

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const PurchaseProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper fetch wrapper
  const api = async (url, options = {}) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`URL :${BASE_URL}${url}`);
      const res = await fetch(`${BASE_URL}${url}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        ...options,
      });

      const data = await res.json();

      // console.log("DATA : ", data);

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      return data.data;
    } catch (err) {
      console.log("Error :", err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ ORDERS ------------------

  const postOrder = async (orderData) => {
    return await api("/api/v1/orders/postorder", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  };

  const getMyOrders = async () => {
    const data = await api("/api/v1/orders/getmyorders", {
      method: "POST", // must match backend
    });
    console.log("DATA :", data);

    setOrders(data);
    return data;
  };

  const getAllOrders = async () => {
    const data = await api("/api/v1/order/getallorders", {
      method: "POST", // must match backend
    });
    setOrders(data);
    return data;
  };

  const getOrderById = async (orderId) => {
    const data = await api(`/api/v1/orders/getorderbyid/${orderId}`, {
      method: "POST", // must match backend
    });
    setCurrentOrder(data);
    return data;
  };

  // ------------------ BIDS ------------------

  const getBidsOnOrder = async (orderId) => {
    return await api(`/api/v1/orders/getallbids/${orderId}`, {
      method: "POST", // must match backend
    });
  };

  const selectWinningBid = async (orderId, bidId) => {
    return await api(`/api/v1/orders/selectwinningbid/${orderId}/${bidId}`, {
      method: "POST",
    });
  };

  const closeOrder = async (orderId) => {
    return await api(`/api/v1/orders/closeorder/${orderId}`, {
      method: "POST",
    });
  };

  return (
    <PurchaseContext.Provider
      value={{
        orders,
        currentOrder,
        loading,
        error,
        postOrder,
        getMyOrders,
        getAllOrders,
        getOrderById,
        getBidsOnOrder,
        selectWinningBid,
        closeOrder,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};

// Custom hook
export const usePurchase = () => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error("usePurchase must be used inside PurchaseProvider");
  }
  return context;
};

PurchaseProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
