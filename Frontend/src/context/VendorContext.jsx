import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { useEffect } from "react";

const VendorContext = createContext();

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const VendorProvider = ({ children }) => {
  const [packages, setPackages] = useState([]);
  const [connects, setConnects] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);
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

      // MOCK DATA (replace with API later)
      setRequests([
        {
          _id: "1",
          title: "Custom T-Shirts Order",
          description: "Need 500 custom printed t-shirts",
          category: "Custom T-Shirts",
          quantity: 500,
          budget_min: 2000,
          budget_max: 4000,
          deadline: "2025-03-01",
          delivery_location: "Karachi",
        },
      ]);

      setConnects({ available: 10 });
    } catch (err) {
      console.error("Vendor data error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Load Connect Packages ---------------- */
  const getConnectPackages = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/connect-packages`);
      const data = await res.json();

      if (data.success) {
        setPackages(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Load Vendor Connects ---------------- */
  const getMyConnects = async () => {
    try {
      const res = await fetch(`${BASE_URL}/connects/me`, {
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setConnects(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* ---------------- Purchase Connect Package ---------------- */
  const purchaseConnects = async (packageId) => {
    try {
      const res = await fetch(`${BASE_URL}/connects/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ packageId }),
      });

      const data = await res.json();

      if (data.success) {
        await getMyConnects(); // refresh connects
        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <VendorContext.Provider
      value={{
        requests,
        packages,
        connects,
        loading,
        getConnectPackages,
        getMyConnects,
        purchaseConnects,
        filters,
        setFilters,
        showFilters,
        setShowFilters,
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
