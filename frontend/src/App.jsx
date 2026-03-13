import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Singup from "./pages/Singup.jsx";
import Singin from "./pages/Singin";
import { currentUser } from "./funtions/auth.js";
import { useDispatch } from "react-redux";
import { login, setLoading } from "./store/usergettoken.js";
import UserRoutes from "./routes/UserRoutes.jsx";
import { Home } from "./pages/Home.jsx";
import { Homeuser } from "./pages/customer/Home.jsx";
import Hotel from "./pages/Hotel.jsx";
import Hotelroom from "./layout/Hotelroom.jsx";
import Roomonsub from "./layout/Roomonsub.jsx";
import Qrcode_Test from "./pages/Qrcode_Test.jsx";
import ListCheck from "./pages/ListCheck.jsx";


function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  if (token && token !== "null") {
    currentUser(token)
      .then((re) => {
        const user = re.data[0];
        if (user) {
          dispatch(
            login({
              id:user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              number: user.phone,
              token: token,
            }),
          );
        }else {
          dispatch(setLoading(false))
        }
      })
      .catch((err) => {
        console.log("Token error or expired:", err);
        dispatch(setLoading(false))
        localStorage.removeItem("token");
      });
  } else {
    dispatch(setLoading(false));
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Singup" element={<Singup />} />
        <Route path="/Singin" element={<Singin />} />
        <Route path="/" element={<Home />} />
        <Route path="/Hotels" element={<Hotel/>} />
        <Route path="/qrcode" element={<Qrcode_Test/>} />
    
        <Route path="/Hotels/:id" element={<Hotelroom/>} />
        <Route element={<UserRoutes />}>
          <Route path="/Home" element={<Homeuser />} />
          <Route path="/Hotels/rooms/:idhotel/:id" element={<Roomonsub />} />
          <Route path="/listcheck" element={<ListCheck />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
