import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { PurchaseProvider } from "./context/PurchaserContext.jsx";
import { VendorProvider } from "./context/VendorContext.jsx";

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
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<RoleSelection />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/signup/:role" element={<Signup />} />

      {/* Protected */}
      <Route path="/app" element={<ProtectedLayout />}>
        <Route path="profile" element={<Profile />} />
        <Route path="chat/:id" element={<Chat />} />

        {/* Purchaser */}
        <Route
          path="purchaser"
          element={
            <PurchaseProvider>
              <Outlet />
            </PurchaseProvider>
          }
        >
          <Route path="dashboard" element={<PurchaserDashboard />} />
          <Route path="create-request" element={<CreateRequest />} />
          <Route path="request/:requestId" element={<RequestDetail />} />
          <Route path="my-requests" element={<PurchaserDashboard />} />
        </Route>

        <Route
          path="vendor"
          element={
            <VendorProvider>
              <Outlet />
            </VendorProvider>
          }
        >
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="request/:requestId" element={<VendorRequestDetail />} />
          <Route path="my-bids" element={<VendorDashboard />} />
          <Route path="connects" element={<ConnectPage />} />
        </Route>

        {/* App fallback */}
        <Route path="*" element={<Navigate to="profile" replace />} />
      </Route>

      {/* Global fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
