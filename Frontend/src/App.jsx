import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";


import Header from "./components/Header.jsx";
import RoleSelection from "./pages/RoleSelection.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

import PurchaserDashboard from "./pages/purchaser/PurchaserDashboard.jsx";
import CreateRequest from "./pages/purchaser/CreateRequest.jsx";
import RequestDetail from "./pages/purchaser/RequestDetail.jsx";

import VendorDashboard from "./pages/vendor/VendorDashboard.jsx";
import VendorRequestDetail from "./pages/vendor/VendorRequestDetail.jsx";
import ConnectPage from "./pages/vendor/ConnectPage.jsx";

import Chat from "./pages/Chat.jsx";
import Profile from "./pages/Profile.jsx";

/* ---------------- Protected Layout ---------------- */
function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Routes>
        <Route path="profile" element={<Profile />} />
        <Route path="chat/:id" element={<Chat />} />

        {/* Purchaser */}
        {user.role === "purchaser" && (
          <>
            <Route path="dashboard" element={<PurchaserDashboard />} />
            <Route path="create-request" element={<CreateRequest />} />
            <Route path="request/:id" element={<RequestDetail />} />
            <Route path="my-requests" element={<PurchaserDashboard />} />
          </>
        )}

        {/* Vendor */}
        {user.role === "vendor" && (
          <>
            <Route path="dashboard" element={<VendorDashboard />} />
            <Route path="request/:id" element={<VendorRequestDetail />} />
            <Route path="my-bids" element={<VendorDashboard />} />
            <Route path="connects" element={<ConnectPage />} />
          </>
        )}

        {/* Fallback inside app */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelection />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/signup/:role" element={<Signup />} />

      <Route path="/app/*" element={<ProtectedLayout />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
