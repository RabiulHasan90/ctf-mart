import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import AdminNavigation from "../../components/AdminNavigation";
import { getAllOrders, updateOrderStatus } from "../../services/api";

const AdminOrders = () => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filterStatus, setFilterStatus] = useState("all");

	useEffect(() => {
		if (!user || user.role !== "admin") {
			navigate("/");
			return;
		}
		fetchOrders();
	}, [user, navigate]);

	const fetchOrders = async () => {
		try {
			const response = await getAllOrders();
			if (response.data.success) {
				setOrders(response.data.orders);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleStatusChange = async (orderId, newStatus) => {
		try {
			await updateOrderStatus(orderId, newStatus);
			setOrders(
				orders.map((o) =>
					o._id === orderId ? { ...o, orderStatus: newStatus } : o,
				),
			);
		} catch (error) {
			console.error(error);
		}
	};

	const filteredOrders =
		filterStatus === "all"
			? orders
			: orders.filter((o) => o.orderStatus === filterStatus);

	if (loading) return <div className="text-center py-8">Loading...</div>;

	return (
		<div className="min-h-screen bg-gray-100">
			<AdminNavigation />

			<div className="max-w-7xl mx-auto px-4 py-8">
				<h1 className="text-4xl font-bold mb-8 text-gray-800">
					Order Management
				</h1>

				{/* Filter */}
				<div className="mb-6">
					<label className="mr-4 font-semibold">
						Filter by Status:
					</label>
					<select
						value={filterStatus}
						onChange={(e) => setFilterStatus(e.target.value)}
						className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
					>
						<option value="all">All Orders</option>
						<option value="pending">Pending</option>
						<option value="processing">Processing</option>
						<option value="shipped">Shipped</option>
						<option value="delivered">Delivered</option>
						<option value="cancelled">Cancelled</option>
					</select>
				</div>

				{/* Orders Table */}
				<div className="bg-white rounded-lg shadow-lg overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-800 text-white">
							<tr>
								<th className="px-6 py-4 text-left">
									Order ID
								</th>
								<th className="px-6 py-4 text-left">User</th>
								<th className="px-6 py-4 text-left">
									Total Price
								</th>
								<th className="px-6 py-4 text-left">Payment</th>
								<th className="px-6 py-4 text-left">Status</th>
								<th className="px-6 py-4 text-left">Items</th>
								<th className="px-6 py-4 text-left">Date</th>
								<th className="px-6 py-4 text-left">Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredOrders.map((o) => (
								<tr
									key={o._id}
									className="border-b hover:bg-gray-50"
								>
									<td className="px-6 py-4 font-semibold">
										{o._id.slice(-6)}
									</td>
									<td className="px-6 py-4">
										{o.user?.name || "Unknown"}
									</td>
									<td className="px-6 py-4 text-green-600 font-bold">
										${parseFloat(o.totalPrice).toFixed(2)}
									</td>
									<td className="px-6 py-4">
										<span
											className={`px-3 py-1 rounded text-sm font-semibold ${
												o.paymentStatus === "completed"
													? "bg-green-100 text-green-800"
													: "bg-yellow-100 text-yellow-800"
											}`}
										>
											{o.paymentStatus}
										</span>
									</td>
									<td className="px-6 py-4">
										<select
											value={o.orderStatus}
											onChange={(e) =>
												handleStatusChange(
													o._id,
													e.target.value,
												)
											}
											className="px-3 py-1 border border-gray-300 rounded bg-white text-sm"
										>
											<option value="pending">
												Pending
											</option>
											<option value="processing">
												Processing
											</option>
											<option value="shipped">
												Shipped
											</option>
											<option value="delivered">
												Delivered
											</option>
											<option value="cancelled">
												Cancelled
											</option>
										</select>
									</td>
									<td className="px-6 py-4">
										{o.items.length} item(s)
									</td>
									<td className="px-6 py-4 text-sm">
										{new Date(
											o.createdAt,
										).toLocaleDateString()}
									</td>
									<td className="px-6 py-4">
										<button
											onClick={() => navigate(`/orders`)}
											className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
										>
											View
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<p className="text-gray-600 mt-4">
					Showing{" "}
					<span className="font-bold">{filteredOrders.length}</span>{" "}
					of <span className="font-bold">{orders.length}</span> orders
				</p>
			</div>
		</div>
	);
};

export default AdminOrders;
