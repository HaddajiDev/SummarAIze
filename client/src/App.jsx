import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./Home/home"
import Landing from "./Landing/landing"
import usePDFStore from "./store/PDFStore"
import Nav from "./Nav/nav";

function App() {
  const pdfUrl = usePDFStore(state=>state.pdfUrl);
  return (
    <div id='app'>
      <Nav />
      <Routes>
        <Route path='/' element={<Landing />} />
        {/* <Route path='/view' element={pdfUrl != null ? <Home /> : <Navigate to="/" />} /> */}
        <Route path='/view' element={<Home />} />
      </Routes>
    </div>
  )
}

export default App;
