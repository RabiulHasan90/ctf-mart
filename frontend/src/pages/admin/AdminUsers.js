import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import AdminNavigation from "../../components/AdminNavigation";
import { getAllUsers, deleteUser, updateUserRole } from "../../services/api";

const AdminUsers = () => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		if (!user || user.role !== "admin") {
			navigate("/");
			return;
		}
		fetchUsers();
	}, [user, navigate]);

	const fetchUsers = async () => {
		try {
			const response = await getAllUsers();
			if (response.data.success) {
				setUsers(response.data.users);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteUser = async (userId) => {
		if (window.confirm("Are you sure you want to delete this user?")) {
			try {
				await deleteUser(userId);
				setUsers(users.filter((u) => u._id !== userId));
			} catch (error) {
				console.error(error);
			}
		}
	};

	const handleChangeRole = async (userId, newRole) => {
		try {
			await updateUserRole(userId, newRole);
			setUsers(
				users.map((u) =>
					u._id === userId ? { ...u, role: newRole } : u,
				),
			);
		} catch (error) {
			console.error(error);
		}
	};

	const filteredUsers = users.filter(
		(u) =>
			u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			u.email.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	if (loading) return <div className="text-center py-8">Loading...</div>;

	return (
		<div className="min-h-screen bg-gray-100">
			<AdminNavigation />

			<div className="max-w-7xl mx-auto px-4 py-8">
				<h1 className="text-4xl font-bold mb-8 text-gray-800">
					User Management
				</h1>

				{/* Search Bar */}
				<div className="mb-6">
					<input
						type="text"
						placeholder="Search by name or email..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500"
					/>
				</div>

				{/* Users Table */}
				<div className="bg-white rounded-lg shadow-lg overflow-hidden">
					<table className="w-full">
						<thead className="bg-gray-800 text-white">
							<tr>
								<th className="px-6 py-4 text-left">Name</th>
								<th className="px-6 py-4 text-left">Email</th>
								<th className="px-6 py-4 text-left">Balance</th>
								<th className="px-6 py-4 text-left">Role</th>
								<th className="px-6 py-4 text-left">Flag</th>
								<th className="px-6 py-4 text-left">Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredUsers.map((u) => (
								<tr
									key={u._id}
									className="border-b hover:bg-gray-50"
								>
									<td className="px-6 py-4">{u.name}</td>
									<td className="px-6 py-4">{u.email}</td>
									<td className="px-6 py-4">
										<span className="text-green-600 font-bold">
											${u.totalBalance}
										</span>
									</td>
									<td className="px-6 py-4">
										<select
											value={u.role}
											onChange={(e) =>
												handleChangeRole(
													u._id,
													e.target.value,
												)
											}
											className="px-3 py-1 border border-gray-300 rounded bg-white text-sm"
										>
											<option value="user">User</option>
											<option value="admin">Admin</option>
										</select>
									</td>
									<td className="px-6 py-4">
										<button
											onClick={() =>
												handleDeleteUser(u._id)
											}
											className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold transition-colors"
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<p className="text-gray-600 mt-4">
					Total Users:{" "}
					<span className="font-bold">{filteredUsers.length}</span>
				</p>
			</div>
		</div>
	);
};

export default AdminUsers;
