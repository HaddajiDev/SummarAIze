import { Navigate, redirect, Route, Routes } from "react-router-dom"
import Home from "./Home/home"
import Landing from "./Landing/landing"
// import usePDFStore from "./store/PDFStore"
import Nav from "./Nav/nav";
import ForgotPassword from "./Auth/forgotPassword";
import { useEffect } from "react";
import useAuthStore from "./store/AuthStore";
import View from "./Home/view";

function App() {
  // const pdfUrl = usePDFStore(state=>state.pdfUrl);
  const user = useAuthStore(state=>state.user);
  const checkAuth = useAuthStore(state=>state.checkAuth);

  useEffect(()=>{
    checkAuth();
  },[]);
  return (
    <div id='app'>
      {/* <Nav /> */}
      <Routes>
        <Route path='/' element={user ?<Home /> :<Landing />} />
        {/* <Route path='/' element={<Landing />} /> */}
        <Route path='/view' element={user ?<View /> :redirect("/")} />
        <Route path='/forgot-password' element={user ?redirect("/view") :<ForgotPassword />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </div>
  )
}

export default App;
