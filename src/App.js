import React, { Suspense } from "react";
import Login from "../src/pages/Login";
import UserDetail from "../src/pages/UserDetail";
import ProductDetail from "../src/pages/ProductDetail";
import { Route, Routes } from "react-router-dom";
import { MainLayout } from "./pages/MainLayout";
import ManageUser from "./pages/ ManageUser";
import ManageRestaurant from "./pages/ManageRestaurant";
import ManageBooking from "./pages/ManageBooking";
import LoginSuccess from "./pages/LoginSuccess";
import ManagerContributeIdeas from "./pages/ManagerContributeIdeas";
import Middleware from "./components/Middleware";
const Home = React.lazy(() => import("./pages/Home"));

const App = () => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Middleware>
        <Routes>
          {/* MainLayout sẽ dùng chung cho các page */}
          <Route path="" element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login mode="dn" />} />
            <Route path="/signup" element={<Login mode="dk" />} />
            <Route path="/forgot-password" element={<Login mode="fgp" />} />
            <Route path="/user" element={<UserDetail />} />
            <Route path="/product-detail" element={<ProductDetail />} />
            <Route path="/manage-user" element={<ManageUser />} />
            <Route path="/manage-restaurant" element={<ManageRestaurant />} />
            <Route path="/manage-booking" element={<ManageBooking />} />
            <Route
              path="/manage-contributeIdeas"
              element={<ManagerContributeIdeas />}
            />
            <Route path="/login-success" element={<LoginSuccess />} />
            <Route path="/reset-password" element={<Login mode="rs" />} />
          </Route>
        </Routes>
      </Middleware>
    </Suspense>
  );
};

export default App;
