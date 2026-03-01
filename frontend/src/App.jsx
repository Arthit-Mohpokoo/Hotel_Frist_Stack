import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Singup from "../pages/Singup";
import Singin from "../pages/Singin";
import { currentUser } from "../funtions/auth";
import { useDispatch } from "react-redux";
import { login } from "../store/usergettoken.js";
import UserRoutes from "../routes/UserRoutes.jsx";
import { Home } from "../pages/Home.jsx";
function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  currentUser(token)
  .then(re=>{
    dispatch(login({
      email : re.data.email,
      name : re.data.name,
      role : re.data.role,
      token : token,
    }))
    console.log(re.data.role)
  })

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Singup" element={<Singup />} />
        <Route path="/Singin" element={<Singin />} />
        <Route
          path="/"
          element={
            <UserRoutes>
              <Home />
            </UserRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
