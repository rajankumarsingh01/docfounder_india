import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import MyDocumentsPage from "./pages/MyDocumentsPage";
import UploadDocumentPage from "./pages/UploadDocumentPage";
import EditDocumentPage from "./pages/EditDocumentPage";
import SearchDocumentsPage from "./pages/SearchDocumentsPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { Toaster } from "react-hot-toast";

import ForgotPasswordPage from "./pages/ForgetPasswordPage";

import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<SearchDocumentsPage />} />
        <Route path="/search" element={<SearchDocumentsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        {/* Protected */}
        <Route path="/dashboard"
          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
        />
        <Route path="/my-documents"
          element={<ProtectedRoute><MyDocumentsPage /></ProtectedRoute>}
        />
        <Route path="/upload"
          element={<ProtectedRoute><UploadDocumentPage /></ProtectedRoute>}
        />
        <Route path="/documents/edit/:id"
          element={<ProtectedRoute><EditDocumentPage /></ProtectedRoute>}
        />
      </Routes>
      <Footer />

         <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f2937",
            color: "#fff",
          },
          success: {
            style: {
              background: "#16a34a",
            },
          },
          error: {
            style: {
              background: "#dc2626",
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;