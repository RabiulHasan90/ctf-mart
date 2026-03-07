import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";

/**
 * ProductCard Component
 * Displays a single product with image, details, and add to cart button
 */
const ProductCard = ({ product, onAddToCart, isAuthenticated }) => {
	const navigate = useNavigate();
	const [showConfirmation, setShowConfirmation] = useState(false);
	const { _id, name, description, price, category, stock, imageUrl, rating } =
		product;

	// Truncate description to 100 characters
	const truncatedDescription =
		description.length > 100
			? description.substring(0, 100) + "..."
			: description;

	const isOutOfStock = stock === 0;

	const handleViewDetails = () => {
		navigate(`/products/${_id}`);
	};

	const handleAddToCartClick = () => {
		if (isAuthenticated && !isOutOfStock) {
			setShowConfirmation(true);
		}
	};

	const handleConfirmAdd = () => {
		onAddToCart(product);
		setShowConfirmation(false);
	};

	const handleCancelAdd = () => {
		setShowConfirmation(false);
	};

	return (
		<div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
			{/* Product Image */}
			<div className="relative h-48 overflow-hidden bg-gray-200">
				<img
					src={imageUrl}
					alt={name}
					className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
					onError={(e) => {
						e.target.src =
							"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e5e7eb' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='sans-serif' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E";
					}}
				/>
				{isOutOfStock && (
					<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
						<span className="text-white font-bold text-lg">
							Out of Stock
						</span>
					</div>
				)}
				{stock <= 5 && !isOutOfStock && (
					<div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold">
						Only {stock} left
					</div>
				)}
			</div>

			{/* Product Details */}
			<div className="p-4 flex flex-col flex-grow">
				{/* Category Badge */}
				<div className="mb-2">
					<span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
						{category}
					</span>
				</div>

				{/* Product Name - Clickable */}
				<h3
					onClick={handleViewDetails}
					className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
				>
					{name}
				</h3>

				{/* Description - Clickable for more info */}
				<p
					onClick={handleViewDetails}
					className="text-gray-600 text-sm mb-3 flex-grow cursor-pointer hover:text-gray-800 transition-colors"
				>
					{truncatedDescription}
				</p>

				{/* Rating */}
				{rating > 0 && (
					<div className="flex items-center mb-3">
						<div className="flex text-yellow-400">
							{[...Array(5)].map((_, i) => (
								<span key={i}>
									{i < Math.round(rating) ? "★" : "☆"}
								</span>
							))}
						</div>
						<span className="text-gray-600 text-sm ml-2">
							({rating.toFixed(1)})
						</span>
					</div>
				)}

				{/* Price and Stock */}
				<div className="flex justify-between items-center mb-4 pt-2 border-t">
					<span className="text-2xl font-bold text-green-600">
						${price.toFixed(2)}
					</span>
					<span className="text-sm text-gray-500">
						Stock: <span className="font-semibold">{stock}</span>
					</span>
				</div>

				{/* Buttons Container */}
				<div className="flex gap-2">
					{/* View Details Button */}
					<button
						onClick={handleViewDetails}
						className="flex-1 py-2 px-3 rounded font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors duration-200"
						title="View product details and reviews"
					>
						Details
					</button>

					{/* Add to Cart Button */}
					<button
						onClick={handleAddToCartClick}
						disabled={isOutOfStock || !isAuthenticated}
						className={`flex-1 py-2 px-3 rounded font-semibold transition-colors duration-200 ${
							!isAuthenticated
								? "bg-gray-400 text-gray-600 cursor-not-allowed"
								: isOutOfStock
									? "bg-gray-300 text-gray-600 cursor-not-allowed"
									: "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
						}`}
						title={
							!isAuthenticated
								? "Please login to add items to cart"
								: isOutOfStock
									? "This product is out of stock"
									: "Add to cart"
						}
					>
						{!isAuthenticated
							? "Login"
							: isOutOfStock
								? "Out"
								: "Add"}
					</button>
				</div>
			</div>

			{/* Confirmation Modal */}
			<ConfirmationModal
				isOpen={showConfirmation}
				product={product}
				quantity={1}
				onConfirm={handleConfirmAdd}
				onCancel={handleCancelAdd}
			/>
		</div>
	);
};

export default ProductCard;
