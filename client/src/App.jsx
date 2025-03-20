import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./Home/home"
import Landing from "./Landing/landing"
// import usePDFStore from "./store/PDFStore"
import Nav from "./Nav/nav";
import ForgotPassword from "./Auth/forgotPassword";
import { useEffect } from "react";
import useAuthStore from "./store/AuthStore";
import View from "./Home/view";
import usePDFStore from "./store/PDFStore";

function App() {
  const user = useAuthStore((state) => state.user);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const pdfUrl = usePDFStore((state) => state.pdfUrl);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div id="app">
      <Routes>
        <Route path="/" element={user ? <Home /> : <Landing />} />
        <Route
          path="/view"
          element={user && pdfUrl ? <View /> : <Navigate to="/" />}
        />
        <Route
          path="/forgot-password"
          element={user ? <Navigate to="/view" /> : <ForgotPassword />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
