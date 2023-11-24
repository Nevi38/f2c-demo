import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import PrivateRoute from "./utils/PrivateRoute.js";
import Chat from "./pages/Chat.jsx";
import Profile from "./pages/Profile.jsx";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route element={<HomePage />} path="/" />
        <Route element={<Chat />} path="/chat" />
        <Route element={<Profile />} path="/profile" />
      </Route>

      <Route element={<Login />} path="/login" />
      <Route element={<Register />} path="/register" />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
