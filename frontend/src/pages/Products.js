import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import CartContext from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/api";

const Products = () => {
	const [products, setProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const { user, token } = useContext(AuthContext);
	const { cart, addToCart } = useContext(CartContext);

	// Filter states
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
	const [showFilters, setShowFilters] = useState(false);

	// Categories available
	const categories = [
		"All",
		"Electronics",
		"Clothing",
		"Books",
		"Home",
		"Sports",
		"Other",
	];

	// Fetch products on mount
	useEffect(() => {
		fetchProducts();
	}, []);

	// Filter products whenever search, category, or price changes
	useEffect(() => {
		applyFilters();
	}, [searchQuery, selectedCategory, priceRange, products]);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			setError("");
			const response = await getProducts();
			if (response.data.success) {
				setProducts(response.data.products);
			}
		} catch (error) {
			setError("Failed to load products. Please try again.");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const applyFilters = () => {
		let filtered = products;

		// Search filter
		if (searchQuery.trim()) {
			filtered = filtered.filter(
				(product) =>
					product.name
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					product.description
						.toLowerCase()
						.includes(searchQuery.toLowerCase()),
			);
		}

		// Category filter
		if (selectedCategory !== "All") {
			filtered = filtered.filter(
				(product) => product.category === selectedCategory,
			);
		}

		// Price range filter
		filtered = filtered.filter(
			(product) =>
				product.price >= priceRange.min &&
				product.price <= priceRange.max,
		);

		setFilteredProducts(filtered);
	};

	const handlePriceChange = (e, type) => {
		const value = parseFloat(e.target.value);
		setPriceRange({
			...priceRange,
			[type]: value,
		});
	};

	const resetFilters = () => {
		setSearchQuery("");
		setSelectedCategory("All");
		setPriceRange({ min: 0, max: 1000 });
	};

	if (loading)
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
					<p className="text-gray-600 text-lg">Loading products...</p>
				</div>
			</div>
		);

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="max-w-7xl mx-auto px-4 py-8">
				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
						{error}
					</div>
				)}

				{/* Header */}
				<div className="mb-8">
					<h2 className="text-4xl font-bold text-gray-800 mb-2">
						Discover Products
					</h2>
					<p className="text-gray-600">
						Browse our collection of {products.length} products
					</p>
				</div>

				{/* Search Bar */}
				<div className="mb-8">
					<div className="bg-white rounded-lg shadow-md p-4">
						<div className="flex gap-4">
							<input
								type="text"
								placeholder="Search products by name or description..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
							/>
							<button
								onClick={() => setShowFilters(!showFilters)}
								className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold transition-colors"
							>
								{showFilters ? "Hide" : "Show"} Filters
							</button>
							{(searchQuery ||
								selectedCategory !== "All" ||
								priceRange.min !== 0 ||
								priceRange.max !== 1000) && (
								<button
									onClick={resetFilters}
									className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded font-semibold transition-colors"
								>
									Reset
								</button>
							)}
						</div>
					</div>
				</div>

				{/* Filters Section */}
				{showFilters && (
					<div className="bg-white rounded-lg shadow-md p-6 mb-8">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{/* Category Filter */}
							<div>
								<label className="block text-gray-700 font-semibold mb-3">
									Category
								</label>
								<select
									value={selectedCategory}
									onChange={(e) =>
										setSelectedCategory(e.target.value)
									}
									className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
								>
									{categories.map((cat) => (
										<option key={cat} value={cat}>
											{cat}
										</option>
									))}
								</select>
							</div>

							{/* Min Price Filter */}
							<div>
								<label className="block text-gray-700 font-semibold mb-3">
									Min Price: ${priceRange.min.toFixed(2)}
								</label>
								<input
									type="range"
									min="0"
									max="1000"
									step="10"
									value={priceRange.min}
									onChange={(e) =>
										handlePriceChange(e, "min")
									}
									className="w-full"
								/>
							</div>

							{/* Max Price Filter */}
							<div>
								<label className="block text-gray-700 font-semibold mb-3">
									Max Price: ${priceRange.max.toFixed(2)}
								</label>
								<input
									type="range"
									min="0"
									max="1000"
									step="10"
									value={priceRange.max}
									onChange={(e) =>
										handlePriceChange(e, "max")
									}
									className="w-full"
								/>
							</div>
						</div>
					</div>
				)}

				{/* Results Info */}
				<div className="mb-6 text-gray-600">
					<p className="text-sm">
						Showing{" "}
						<span className="font-semibold">
							{filteredProducts.length}
						</span>{" "}
						of{" "}
						<span className="font-semibold">{products.length}</span>{" "}
						products
					</p>
				</div>

				{/* Products Grid */}
				{filteredProducts.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{filteredProducts.map((product) => (
							<ProductCard
								key={product._id}
								product={product}
								onAddToCart={addToCart}
								isAuthenticated={!!token}
							/>
						))}
					</div>
				) : (
					<div className="bg-white rounded-lg shadow-md p-12 text-center">
						<div className="text-6xl mb-4">🔍</div>
						<h3 className="text-2xl font-bold text-gray-800 mb-2">
							No products found
						</h3>
						<p className="text-gray-600 mb-4">
							Try adjusting your search filters or resetting to
							see all products
						</p>
						<button
							onClick={resetFilters}
							className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold transition-colors"
						>
							Reset Filters
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Products;
