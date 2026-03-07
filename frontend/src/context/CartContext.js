import React, { createContext, useState, useEffect } from "react";

/**
 * CartContext
 * Manages shopping cart state globally across the application
 * Provides add, remove, update quantity, and clear cart functions
 * Persists cart to localStorage for session persistence
 */
const CartContext = createContext();

export const CartProvider = ({ children }) => {
	// Initialize cart from localStorage
	const [cart, setCart] = useState(() => {
		const savedCart = localStorage.getItem("cart");
		if (savedCart) {
			try {
				return JSON.parse(savedCart);
			} catch (error) {
				console.error("Failed to load cart from localStorage:", error);
				return [];
			}
		}
		return [];
	});
	const [loading, setLoading] = useState(false);

	// Save cart to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem("cart", JSON.stringify(cart));
	}, [cart]);

	/**
	 * Add product to cart
	 * If product already in cart, increase quantity
	 * Otherwise, add new item with quantity 1
	 */
	const addToCart = (product) => {
		setCart((prevCart) => {
			// Handle both product._id and product.productId formats
			const productId = product._id || product.productId;

			const existingItem = prevCart.find(
				(item) => item.productId === productId,
			);

			if (existingItem) {
				// Update quantity
				return prevCart.map((item) =>
					item.productId === productId
						? {
								...item,
								quantity: item.quantity + 1,
							}
						: item,
				);
			} else {
				// Add new item - normalize product data
				const normalizedProduct = {
					_id: productId,
					name: product.name,
					price: product.price,
					imageUrl: product.image || product.imageUrl,
					stock: product.stock,
					...product, // Include any other properties
				};

				return [
					...prevCart,
					{
						productId: productId,
						quantity: 1,
						product: normalizedProduct,
					},
				];
			}
		});
	};

	/**
	 * Remove product from cart by productId
	 */
	const removeFromCart = (productId) => {
		setCart((prevCart) =>
			prevCart.filter((item) => item.productId !== productId),
		);
	};

	/**
	 * Update quantity of a product in cart
	 * If quantity <= 0, remove the item
	 */
	const updateQuantity = (productId, quantity) => {
		if (quantity <= 0) {
			removeFromCart(productId);
		} else {
			setCart((prevCart) =>
				prevCart.map((item) =>
					item.productId === productId ? { ...item, quantity } : item,
				),
			);
		}
	};

	/**
	 * Clear entire cart
	 */
	const clearCart = () => {
		setCart([]);
	};

	/**
	 * Get total price of all items in cart
	 */
	const getTotalPrice = () => {
		return cart.reduce(
			(total, item) => total + item.product.price * item.quantity,
			0,
		);
	};

	/**
	 * Get total quantity of all items in cart
	 */
	const getTotalItems = () => {
		return cart.reduce((total, item) => total + item.quantity, 0);
	};

	const value = {
		cart,
		loading,
		setLoading,
		addToCart,
		removeFromCart,
		updateQuantity,
		clearCart,
		getTotalPrice,
		getTotalItems,
	};

	return (
		<CartContext.Provider value={value}>{children}</CartContext.Provider>
	);
};

export default CartContext;
