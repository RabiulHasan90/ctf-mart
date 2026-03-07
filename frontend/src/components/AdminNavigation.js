import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const AdminNavigation = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { user, logout } = useContext(AuthContext);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	const isActive = (path) => location.pathname === path;

	return (
		<nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
			<div className="max-w-7xl mx-auto px-4 py-4">
				<div className="flex justify-between items-center">
					{/* Logo/Brand */}
					<Link
						to="/admin"
						className="text-2xl font-bold text-teal-400 hover:text-teal-300 transition-colors"
					>
						🛡️ Admin Panel
					</Link>

					{/* Desktop Menu */}
					<div className="hidden md:flex items-center gap-6">
						<Link
							to="/admin"
							className={`py-2 px-4 rounded-lg transition-colors ${
								isActive("/admin")
									? "bg-teal-500 text-white"
									: "hover:bg-gray-700"
							}`}
						>
							Dashboard
						</Link>
						<Link
							to="/admin/users"
							className={`py-2 px-4 rounded-lg transition-colors ${
								isActive("/admin/users")
									? "bg-teal-500 text-white"
									: "hover:bg-gray-700"
							}`}
						>
							Users
						</Link>
						<Link
							to="/admin/products"
							className={`py-2 px-4 rounded-lg transition-colors ${
								isActive("/admin/products")
									? "bg-teal-500 text-white"
									: "hover:bg-gray-700"
							}`}
						>
							Products
						</Link>
						<Link
							to="/admin/orders"
							className={`py-2 px-4 rounded-lg transition-colors ${
								isActive("/admin/orders")
									? "bg-teal-500 text-white"
									: "hover:bg-gray-700"
							}`}
						>
							Orders
						</Link>
						<Link
							to="/"
							className="py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
						>
							← Back to Site
						</Link>
						<button
							onClick={handleLogout}
							className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg transition-colors font-semibold"
						>
							Logout
						</button>
					</div>

					{/* Mobile Menu Toggle */}
					<button
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						className="md:hidden focus:outline-none"
					>
						<svg
							className={`w-6 h-6 transition-transform ${
								isMobileMenuOpen ? "rotate-90" : ""
							}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				</div>

				{/* Mobile Menu */}
				{isMobileMenuOpen && (
					<div className="md:hidden mt-4 space-y-2 pb-4">
						<Link
							to="/admin"
							onClick={() => setIsMobileMenuOpen(false)}
							className={`block py-2 px-4 rounded-lg ${
								isActive("/admin")
									? "bg-teal-500 text-white"
									: "hover:bg-gray-700"
							}`}
						>
							Dashboard
						</Link>
						<Link
							to="/admin/users"
							onClick={() => setIsMobileMenuOpen(false)}
							className={`block py-2 px-4 rounded-lg ${
								isActive("/admin/users")
									? "bg-teal-500 text-white"
									: "hover:bg-gray-700"
							}`}
						>
							Users
						</Link>
						<Link
							to="/admin/products"
							onClick={() => setIsMobileMenuOpen(false)}
							className={`block py-2 px-4 rounded-lg ${
								isActive("/admin/products")
									? "bg-teal-500 text-white"
									: "hover:bg-gray-700"
							}`}
						>
							Products
						</Link>
						<Link
							to="/admin/orders"
							onClick={() => setIsMobileMenuOpen(false)}
							className={`block py-2 px-4 rounded-lg ${
								isActive("/admin/orders")
									? "bg-teal-500 text-white"
									: "hover:bg-gray-700"
							}`}
						>
							Orders
						</Link>
						<Link
							to="/"
							onClick={() => setIsMobileMenuOpen(false)}
							className="block py-2 px-4 rounded-lg hover:bg-gray-700"
						>
							← Back to Site
						</Link>
						<button
							onClick={() => {
								handleLogout();
								setIsMobileMenuOpen(false);
							}}
							className="w-full text-left bg-red-600 hover:bg-red-700 py-2 px-4 rounded-lg font-semibold"
						>
							Logout
						</button>
					</div>
				)}
			</div>
		</nav>
	);
};

export default AdminNavigation;
