import axios from "axios";
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginClient from "./Client/LoginClient";
import LoginAdmin from "./Admin/LoginAdmin";
import CreerClient from "./Admin/CreerClient";

function App() {
  useEffect(()=>{


  },[])
  return (
    <div className="App">
      <Router>
          <Routes>
            <Route path="/client" element={<LoginClient />} />
            <Route path="/admin/login" element={<LoginAdmin />} />
            <Route path="/admin/creerclient" element={<CreerClient />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;
