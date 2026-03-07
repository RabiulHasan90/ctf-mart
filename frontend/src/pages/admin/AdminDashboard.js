import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import AdminNavigation from "../../components/AdminNavigation";
import { getAdminStats } from "../../services/api";

const AdminDashboard = () => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user || user.role !== "admin") {
			navigate("/");
			return;
		}
		fetchStats();
	}, [user, navigate]);

	const fetchStats = async () => {
		try {
			const response = await getAdminStats();
			if (response.data.success) {
				setStats(response.data.stats);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) return <div className="text-center py-8">Loading...</div>;

	return (
		<div className="min-h-screen bg-gray-100">
			<AdminNavigation />

			<div className="max-w-7xl mx-auto px-4 py-8">
				<h1 className="text-4xl font-bold mb-8 text-gray-800">
					Admin Dashboard
				</h1>

				{stats && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						{/* Total Users Card */}
						<div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
							<div className="flex justify-between items-start">
								<div>
									<p className="text-gray-600 text-sm font-semibold">
										Total Users
									</p>
									<p className="text-4xl font-bold text-gray-800 mt-2">
										{stats.totalUsers}
									</p>
								</div>
								<span className="text-3xl">👥</span>
							</div>
						</div>

						{/* Total Products Card */}
						<div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
							<div className="flex justify-between items-start">
								<div>
									<p className="text-gray-600 text-sm font-semibold">
										Total Products
									</p>
									<p className="text-4xl font-bold text-gray-800 mt-2">
										{stats.totalProducts}
									</p>
								</div>
								<span className="text-3xl">📦</span>
							</div>
						</div>

						{/* Total Orders Card */}
						<div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
							<div className="flex justify-between items-start">
								<div>
									<p className="text-gray-600 text-sm font-semibold">
										Total Orders
									</p>
									<p className="text-4xl font-bold text-gray-800 mt-2">
										{stats.totalOrders}
									</p>
								</div>
								<span className="text-3xl">📋</span>
							</div>
						</div>

						{/* Total Revenue Card */}
						<div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
							<div className="flex justify-between items-start">
								<div>
									<p className="text-gray-600 text-sm font-semibold">
										Total Revenue
									</p>
									<p className="text-4xl font-bold text-green-600 mt-2">
										${stats.totalRevenue.toFixed(2)}
									</p>
								</div>
								<span className="text-3xl">💰</span>
							</div>
						</div>
					</div>
				)}

				{/* Quick Actions */}
				<div className="bg-white rounded-lg shadow-lg p-8">
					<h2 className="text-2xl font-bold mb-6 text-gray-800">
						Quick Actions
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<button
							onClick={() => navigate("/admin/users")}
							className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
						>
							Manage Users
						</button>
						<button
							onClick={() => navigate("/admin/products")}
							className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
						>
							Manage Products
						</button>
						<button
							onClick={() => navigate("/admin/orders")}
							className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
						>
							View Orders
						</button>
						<button
							onClick={() =>
								alert("CSV export feature coming soon!")
							}
							className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
						>
							Export Data
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
