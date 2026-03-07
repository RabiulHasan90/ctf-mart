import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import CartContext from "../context/CartContext";

const Navigation = () => {
	const { user, token, logout } = useContext(AuthContext);
	const { cart } = useContext(CartContext);
	const navigate = useNavigate();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const closeMobileMenu = () => {
		setIsMobileMenuOpen(false);
	};

	if (!token) return null;

	return (
		<nav
			className="text-white shadow-2xl px-4 py-4"
			style={{
				background: "linear-gradient(to right, #26d4a7, #1fa88f)",
			}}
		>
			<div className="max-w-7xl mx-auto">
				{/* Desktop View - Flex Container */}
				<div className="flex justify-between items-center">
					{/* Logo/Brand */}
					<Link
						to="/"
						className="text-2xl md:text-3xl font-bold hover:text-white hover:opacity-80 transition-all duration-300 whitespace-nowrap"
					>
						CyberBangla Shop
					</Link>

					{/* Hamburger Menu Button - Mobile Only */}
					<button
						onClick={toggleMobileMenu}
						className="md:hidden flex flex-col justify-center items-center gap-1.5 p-2"
						aria-label="Toggle menu"
					>
						<span
							className={`w-6 h-0.5 bg-white transition-all duration-300 ${
								isMobileMenuOpen
									? "rotate-45 translate-y-2"
									: ""
							}`}
						></span>
						<span
							className={`w-6 h-0.5 bg-white transition-all duration-300 ${
								isMobileMenuOpen ? "opacity-0" : ""
							}`}
						></span>
						<span
							className={`w-6 h-0.5 bg-white transition-all duration-300 ${
								isMobileMenuOpen
									? "-rotate-45 -translate-y-2"
									: ""
							}`}
						></span>
					</button>

					{/* Desktop Navigation Links */}
					<div className="hidden md:flex items-center gap-6 lg:gap-8">
						<Link
							to="/products"
							className="hover:text-white hover:opacity-80 transition-all duration-300 font-semibold"
						>
							Products
						</Link>
						<Link
							to="/orders"
							className="hover:text-white hover:opacity-80 transition-all duration-300 font-semibold"
						>
							My Orders
						</Link>
						<Link
							to="/cart"
							className="relative hover:text-white hover:opacity-80 transition-all duration-300 font-semibold"
						>
							Cart
							{cart && cart.length > 0 && (
								<span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold -mr-2 animate-pulse">
									{cart.length}
								</span>
							)}
						</Link>
					</div>

					{/* Desktop User Menu */}
					<div className="hidden md:flex items-center gap-3 lg:gap-6">
						<div className="text-right hidden lg:block">
							<p className="text-sm text-white text-opacity-80">
								Welcome
							</p>
							<p className="text-lg font-bold">
								{user?.name || "User"}
							</p>
						</div>

						{/* Balance Display */}
						<div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 lg:px-4 py-2 border border-white border-opacity-30 text-center">
							<p className="text-xs text-white text-opacity-80">
								Balance
							</p>
							<p
								className="text-lg lg:text-2xl font-bold"
								style={{ color: "#fde047" }}
							>
								${user?.totalBalance?.toFixed(2) || "0.00"}
							</p>
						</div>

						<Link
							to="/profile"
							className="px-4 lg:px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-white text-sm lg:text-base whitespace-nowrap"
							style={{ backgroundColor: "#26d4a7" }}
						>
							👤 Profile
						</Link>

						<button
							onClick={handleLogout}
							className="px-4 lg:px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-white text-sm lg:text-base whitespace-nowrap"
							style={{ backgroundColor: "#dc2626" }}
						>
							Logout
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{isMobileMenuOpen && (
					<div className="md:hidden mt-4 pb-4 border-t border-white border-opacity-20 space-y-3">
						{/* User Info Mobile */}
						<div className="text-center py-3 border-b border-white border-opacity-20">
							<p className="text-sm text-white text-opacity-80">
								Welcome
							</p>
							<p className="text-lg font-bold">
								{user?.name || "User"}
							</p>
						</div>

						{/* Balance Mobile */}
						<div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white border-opacity-30 text-center">
							<p className="text-xs text-white text-opacity-80">
								Your Balance
							</p>
							<p
								className="text-2xl font-bold"
								style={{ color: "#fde047" }}
							>
								${user?.totalBalance?.toFixed(2) || "0.00"}
							</p>
						</div>

						{/* Mobile Navigation Links */}
						<div className="space-y-2">
							<Link
								to="/products"
								onClick={closeMobileMenu}
								className="block py-2 px-3 hover:bg-white hover:bg-opacity-10 rounded transition-all duration-300 font-semibold"
							>
								Products
							</Link>
							<Link
								to="/orders"
								onClick={closeMobileMenu}
								className="block py-2 px-3 hover:bg-white hover:bg-opacity-10 rounded transition-all duration-300 font-semibold"
							>
								My Orders
							</Link>
							<Link
								to="/cart"
								onClick={closeMobileMenu}
								className="block py-2 px-3 hover:bg-white hover:bg-opacity-10 rounded transition-all duration-300 font-semibold relative"
							>
								Cart
								{cart && cart.length > 0 && (
									<span className="absolute top-1 right-3 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold animate-pulse">
										{cart.length}
									</span>
								)}
							</Link>
						</div>

						{/* Mobile Action Buttons */}
						<div className="space-y-2 pt-3 border-t border-white border-opacity-20">
							<Link
								to="/profile"
								onClick={closeMobileMenu}
								className="block py-2 px-4 rounded-lg font-semibold transition-all duration-300 text-white text-center"
								style={{ backgroundColor: "#26d4a7" }}
							>
								👤 Profile
							</Link>
							<button
								onClick={() => {
									handleLogout();
									closeMobileMenu();
								}}
								className="w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 text-white"
								style={{ backgroundColor: "#dc2626" }}
							>
								Logout
							</button>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navigation;
