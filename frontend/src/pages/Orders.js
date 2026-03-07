import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { getMyOrders } from "../services/api";

const Orders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const { token } = useContext(AuthContext);

	useEffect(() => {
		if (token) fetchOrders();
	}, [token]);

	const fetchOrders = async () => {
		try {
			const response = await getMyOrders();
			if (response.data.success) {
				setOrders(response.data.orders);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	if (loading)
		return <div className="text-center py-8">Loading orders...</div>;

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

			<div className="max-w-6xl mx-auto px-4 py-8">
				<h2 className="text-4xl font-bold mb-10 text-gray-800">
					My Orders
				</h2>

				{orders.length === 0 ? (
					<div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-xl">
						<p className="text-gray-600 text-lg">
							You haven't placed any orders yet
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl">
						{orders.map((order) => (
							<div
								key={order._id}
								className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-teal-100"
							>
								<div className="px-6 py-5">
									<div className="flex justify-between items-start gap-4">
										<div className="flex-1">
											<h3 className="text-2xl font-bold text-gray-900">
												Order #{order._id.slice(-6)}
											</h3>
											<p className="text-sm text-gray-600 mt-1">
												{new Date(
													order.createdAt,
												).toLocaleDateString()}
											</p>
										</div>
										<div className="text-right">
											<p className="text-3xl font-bold text-teal-600">
												${order.totalPrice}
											</p>
											<div className="flex gap-2 mt-2 justify-end flex-wrap">
												<span
													className={`text-xs px-2 py-1 rounded-full font-bold ${
														order.paymentStatus ===
														"completed"
															? "bg-green-200 text-green-800"
															: "bg-yellow-200 text-yellow-800"
													}`}
												>
													{order.paymentStatus}
												</span>
												<span className="text-xs px-2 py-1 rounded-full font-bold bg-blue-200 text-blue-800">
													{order.orderStatus}
												</span>
											</div>
										</div>
									</div>
								</div>

								<div className="px-6 py-5">
									<h4 className="text-lg font-bold text-gray-800 mb-4">
										Items ({order.items.length})
									</h4>
									{order.items.map((item) => (
										<div
											key={item._id}
											className="mb-4 last:mb-0"
										>
											<div className="flex justify-between items-start py-3 px-4 bg-white rounded-xl hover:bg-gray-50 transition-colors border border-teal-100">
												<div className="flex-1">
													<p className="font-bold text-gray-900 text-base">
														{item.product.name}
													</p>
													<p className="text-sm text-gray-600 mt-1">
														Qty:{" "}
														<span className="font-semibold">
															{item.quantity}
														</span>
													</p>
												</div>
												<span className="text-base font-bold text-teal-600 ml-2">
													$
													{(
														item.price *
														item.quantity
													).toFixed(2)}
												</span>
											</div>
											{item.product.privateData && (
												<div className="mt-3">
													<div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-teal-400 rounded-xl p-4 shadow-lg">
														<div className="flex items-center gap-2 mb-2">
															<span className="text-xl">
																🔐
															</span>
															<p className="font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-300">
																Exclusive Access
															</p>
														</div>
														<p className="text-sm leading-relaxed text-gray-100 font-medium">
															{
																item.product
																	.privateData
															}
														</p>
														<div className="mt-2 flex items-center gap-1 text-xs text-teal-300">
															<span>✓</span>
															<span>
																Verified
																Purchase
															</span>
														</div>
													</div>
												</div>
											)}
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Orders;
