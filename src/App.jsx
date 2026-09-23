import { Routes, Route } from "react-router-dom";

// Layouts
import UserLayout from "./components/layout/UserLayout";
import SellerLayout from "./components/layout/SellerLayout";
import AdminLayout from "./components/layout/AdminLayout";

// User Pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";
import Support from "./pages/Support";
import SupportDetails from "./pages/SupportDetails";

// Seller Pages
import SellerRegister from "./pages/SellerRegister";
import SellerLogin from "./pages/SellerLogin";
import SellerProfile from "./pages/SellerProfile";
import SellerDashboard from "./pages/SellerDashboard";
import SellerProducts from "./pages/SellerProducts";
import SellerAddProduct from "./pages/SellerAddProduct";
import SellerEditProduct from "./pages/SellerEditProduct";
import SellerOrders from "./pages/SellerOrders";
import SellerSalesSummary from "./pages/SellerSalesSummary";
import SellerSupport from "./pages/SellerSupport";

const App = () => {
  return (
    <Routes>

      {/* ================= USER ROUTES ================= */}

      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/products" element={<Products />} />

        <Route
          path="/product-details"
          element={<ProductDetails />}
        />

        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/orders" element={<Orders />} />

        <Route
          path="/orders/:id"
          element={<OrderDetails />}
        />

        <Route path="/profile" element={<Profile />} />

        <Route path="/support" element={<Support />} />

        <Route
          path="/support/:id"
          element={<SupportDetails />}
        />
      </Route>


      {/* ================= SELLER AUTH ROUTES ================= */}

      <Route
        path="/seller/register"
        element={<SellerRegister />}
      />

      <Route
        path="/seller/login"
        element={<SellerLogin />}
      />


      {/* ================= SELLER ROUTES ================= */}

      <Route element={<SellerLayout />}>

        <Route
          path="/seller/dashboard"
          element={<SellerDashboard />}
        />

        <Route
          path="/seller/products"
          element={<SellerProducts />}
        />

        <Route
          path="/seller/products/add"
          element={<SellerAddProduct />}
        />

        <Route
          path="/seller/products/:id/edit"
          element={<SellerEditProduct />}
        />

        <Route
          path="/seller/orders"
          element={<SellerOrders />}
        />

        <Route
          path="/seller/sales-summary"
          element={<SellerSalesSummary />}
        />

        <Route
          path="/seller/profile"
          element={<SellerProfile />}
        />

        <Route
          path="/seller/support"
          element={<SellerSupport />}
        />

      </Route>


      {/* ================= ADMIN ROUTES ================= */}

      <Route element={<AdminLayout />}>

        {/* Admin pages will be added later */}

      </Route>

    </Routes>
  );
};

export default App;