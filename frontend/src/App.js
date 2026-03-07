import React, { useContext } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import AuthContext, { AuthProvider } from "./context/AuthContext";
import CartContext, { CartProvider } from "./context/CartContext";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";

function AppContent() {
	const { token, user, loading } = useContext(AuthContext);

	// Don't render routes until we have user data after login
	if (token && !user) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	const getLoginRedirect = () => {
		if (user?.role === "admin") {
			return "/admin";
		}
		return "/products";
	};

	return (
		<Router>
			{!window.location.pathname.startsWith("/admin") && <Navigation />}
			<Routes>
				<Route path="/" element={<Home />} />
				<Route
					path="/register"
					element={
						!token ? (
							<Register />
						) : (
							<Navigate to={getLoginRedirect()} />
						)
					}
				/>
				<Route
					path="/login"
					element={
						!token ? (
							<Login />
						) : (
							<Navigate to={getLoginRedirect()} />
						)
					}
				/>
				<Route
					path="/products"
					element={token ? <Products /> : <Navigate to="/login" />}
				/>
				<Route
					path="/products/:productId"
					element={
						token ? <ProductDetail /> : <Navigate to="/login" />
					}
				/>
				<Route
					path="/cart"
					element={token ? <Cart /> : <Navigate to="/login" />}
				/>
				<Route
					path="/orders"
					element={token ? <Orders /> : <Navigate to="/login" />}
				/>
				<Route
					path="/profile"
					element={token ? <Profile /> : <Navigate to="/login" />}
				/>

				{/* Admin Routes */}
				<Route
					path="/admin"
					element={
						token && user?.role === "admin" ? (
							<AdminDashboard />
						) : (
							<Navigate to="/" />
						)
					}
				/>
				<Route
					path="/admin/users"
					element={
						token && user?.role === "admin" ? (
							<AdminUsers />
						) : (
							<Navigate to="/" />
						)
					}
				/>
				<Route
					path="/admin/products"
					element={
						token && user?.role === "admin" ? (
							<AdminProducts />
						) : (
							<Navigate to="/" />
						)
					}
				/>
				<Route
					path="/admin/orders"
					element={
						token && user?.role === "admin" ? (
							<AdminOrders />
						) : (
							<Navigate to="/" />
						)
					}
				/>
			</Routes>
		</Router>
	);
}

function App() {
	return (
		<AuthProvider>
			<CartProvider>
				<AppContent />
			</CartProvider>
		</AuthProvider>
	);
}

export default App;
