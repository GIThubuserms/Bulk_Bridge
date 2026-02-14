import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const VendorContext = createContext();
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const VendorProvider = ({ children }) => {
  const [connects, setConnects] = useState(0);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);

  const [filters, setFilters] = useState({
    category: "All Categories",
    search: "",
    minQuantity: "",
    maxQuantity: "",
    location: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadVendorData();
  }, []);

  const loadVendorData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        getVendorProfile(),
        getVendorDashboard(),
        getAvailableRequests(),
      ]);
    } catch (err) {
      console.log("Error : ", err);
    } finally {
      setLoading(false);
    }
  };

  const getVendorProfile = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/vendor/profile`, {
      method: "GET",
      credentials: "include",
    });

    console.log("Vendor Profile : ", res);
    const data = await res.json();


    setConnects(data.data.connects);
    
  };

  const getVendorDashboard = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/vendor/dashboard`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (data.success) {
      setDashboardStats(data.data);
    }
  };

  const getAvailableRequests = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/orders/getallorders`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    setRequests(data.data);
  };

  const getMyBids = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/bid/mybids`, {
      credentials: "include",
    });

    const data = await res.json();
    return data.data;
  };

  const submitBid = async (orderId, bidData) => {
    console.log("ORDER ID  : ",orderId);
    console.log("BID DATA  : ",bidData);
    
    const res = await fetch(`${BASE_URL}/api/v1/bid/postbid/${orderId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(bidData),
    });

    const data = await res.json();

    console.log("DATA : ",data)
    await getVendorProfile(); 
    
    return data;
  };

  const purchaseConnects = async (amount) => {
    const res = await fetch(`${BASE_URL}/api/v1/vendor/connects/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ amount }),
    });

    const data = await res.json();

    if (data.success) {
      setConnects(data.data);
    }

    return data;
  };

  const clearFilters = () => {
    setFilters({
      category: "All Categories",
      search: "",
      minQuantity: "",
      maxQuantity: "",
      location: "",
    });
  };

  return (
    <VendorContext.Provider
      value={{
        requests,
        connects,
        dashboardStats,
        loading,
        filters,
        setFilters,
        clearFilters,
        showFilters,
        setShowFilters,
        getMyBids,
        submitBid,
        purchaseConnects,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
};

export const useVendor = () => useContext(VendorContext);

VendorProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
