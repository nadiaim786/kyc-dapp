import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import User from "./pages/User";
import AdminDashboard from "./pages/AdminDashboard";
import Otp from "./pages/Otp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<User />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* OTP */}
        <Route path="/otp" element={<Otp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;