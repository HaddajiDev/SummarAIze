import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./Home/home"
import Landing from "./Landing/landing"
import { usePDFStore } from "./store/PDFStore"

function App() {
  const pdfUrl = usePDFStore(state=>state.pdfUrl);
  return (
    <div id='app'>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/view' element={pdfUrl != null ? <Home /> : <Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App;
