import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Singup from "../pages/Singup";
import Singin from "../pages/Singin";
import { currentUser } from "../funtions/auth";
import { useDispatch } from "react-redux";
import { login } from "../store/usergettoken.js";
import { Home } from "../pages/Home.jsx";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const idtoken = localStorage.getItem("token");
    if (!idtoken) return;
    currentUser(idtoken)
      .then((res) => {
        console.log("USER:", res.data);

        dispatch(
          login({
            email: res.data.payload.email,
            name: res.data.payload.name,
            role: res.data.payload.role,
            token: idtoken,
          }),
        );
      })
      .catch((err) => console.log(err));
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Singup" element={<Singup />} />
        <Route path="/Singin" element={<Singin />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
