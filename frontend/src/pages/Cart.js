import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import CartContext from "../context/CartContext";
import { createOrder } from "../services/api";

const Cart = () => {
	const [shippingAddress, setShippingAddress] = useState({
		street: "",
		city: "",
		state: "",
		zipCode: "",
		country: "",
	});
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
	const { user, setUser } = useContext(AuthContext);
	const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } =
		useContext(CartContext);

	const totalPrice = getTotalPrice();

	const handleAddressChange = (e) => {
		setShippingAddress({
			...shippingAddress,
			[e.target.name]: e.target.value,
		});
	};

	const handlePlaceOrder = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");
		setLoading(true);

		try {
			// VULNERABILITY: Notice how we're just placing the order without actual payment verification
			// The backend doesn't check if payment is actually completed before marking order as 'processing'

			const orderData = {
				items: cart.map((item) => ({
					productId: item.productId,
					quantity: item.quantity,
				})),
				shippingAddress: shippingAddress,
			};

			const response = await createOrder(orderData);

			if (response.data.success) {
				const successMessage = `Order placed! ${response.data.message}`;
				setSuccess(successMessage);
				clearCart();
				setShippingAddress({
					street: "",
					city: "",
					state: "",
					zipCode: "",
					country: "",
				});

				// Update user balance
				if (setUser) {
					setUser((prev) => ({
						...prev,
						totalBalance: response.data.userBalance,
					}));
				}
			} else {
				setError(response.data.message);
			}
		} catch (err) {
			setError(err.response?.data?.message || "Failed to place order");
		} finally {
			setLoading(false);
		}
	};

	if (cart.length === 0) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold mb-4">
						Your cart is empty
					</h2>
					<a
						href="/products"
						className="bg-blue-500 text-white px-6 py-2 rounded"
					>
						Continue Shopping
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100">
			<nav className="bg-white shadow">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<a
						href="/products"
						className="text-blue-500 hover:underline"
					>
						← Back to Products
					</a>
				</div>
			</nav>

			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="grid grid-cols-3 gap-6">
					<div className="col-span-2">
						<div className="bg-white rounded-lg shadow-md p-6 mb-6">
							<h2 className="text-2xl font-bold mb-4">
								Cart Items
							</h2>
							{cart.map((item) => (
								<div
									key={item.productId}
									className="flex justify-between items-center border-b pb-4 mb-4"
								>
									<div className="flex-1">
										<h3 className="font-bold">
											{item.product.name}
										</h3>
										<p className="text-gray-600">
											${item.product.price.toFixed(2)}
										</p>
									</div>
									<div className="flex items-center gap-4">
										<div className="flex items-center gap-2">
											<button
												onClick={() =>
													updateQuantity(
														item.productId,
														item.quantity - 1,
													)
												}
												className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
											>
												−
											</button>
											<input
												type="number"
												value={item.quantity}
												onChange={(e) =>
													updateQuantity(
														item.productId,
														parseInt(
															e.target.value,
														) || 0,
													)
												}
												className="w-12 text-center border rounded px-2 py-1"
												min="1"
											/>
											<button
												onClick={() =>
													updateQuantity(
														item.productId,
														item.quantity + 1,
													)
												}
												className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
											>
												+
											</button>
										</div>
										<span className="font-bold w-24 text-right">
											$
											{(
												item.product.price *
												item.quantity
											).toFixed(2)}
										</span>
										<button
											onClick={() =>
												removeFromCart(item.productId)
											}
											className="text-red-500 hover:text-red-700 font-semibold"
										>
											Remove
										</button>
									</div>
								</div>
							))}
						</div>

						<div className="bg-white rounded-lg shadow-md p-6">
							<h2 className="text-2xl font-bold mb-4">
								Shipping Address
							</h2>
							<form
								onSubmit={handlePlaceOrder}
								className="space-y-4"
								id="shippingForm"
							>
								<input
									type="text"
									name="street"
									placeholder="Street Address"
									value={shippingAddress.street}
									onChange={handleAddressChange}
									className="w-full px-4 py-2 border rounded"
								/>
								<input
									type="text"
									name="city"
									placeholder="City"
									value={shippingAddress.city}
									onChange={handleAddressChange}
									className="w-full px-4 py-2 border rounded"
								/>
								<input
									type="text"
									name="state"
									placeholder="State"
									value={shippingAddress.state}
									onChange={handleAddressChange}
									className="w-full px-4 py-2 border rounded"
								/>
								<input
									type="text"
									name="zipCode"
									placeholder="Zip Code"
									value={shippingAddress.zipCode}
									onChange={handleAddressChange}
									className="w-full px-4 py-2 border rounded"
								/>
								<input
									type="text"
									name="country"
									placeholder="Country"
									value={shippingAddress.country}
									onChange={handleAddressChange}
									className="w-full px-4 py-2 border rounded"
								/>
							</form>
						</div>
					</div>

					<div>
						<div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
							<h3 className="text-xl font-bold mb-4">
								Order Summary
							</h3>
							<div className="space-y-2 mb-4 border-b pb-4">
								<div className="flex justify-between">
									<span>Subtotal:</span>
									<span>${totalPrice}</span>
								</div>
								<div className="flex justify-between">
									<span>Your Balance:</span>
									<span
										className={
											user &&
											user.totalBalance >= totalPrice
												? "text-green-600"
												: "text-red-600"
										}
									>
										${user?.totalBalance || 0}
									</span>
								</div>
							</div>
							<div className="flex justify-between text-xl font-bold mb-4">
								<span>Total:</span>
								<span>${totalPrice}</span>
							</div>

							{error && (
								<div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
									{error}
								</div>
							)}
							{success && (
								<div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm whitespace-pre-wrap">
									{success}
								</div>
							)}

							<button
								type="submit"
								form="shippingForm"
								disabled={loading}
								className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded disabled:opacity-50"
							>
								{loading ? "Processing..." : "Place Order"}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Cart;
