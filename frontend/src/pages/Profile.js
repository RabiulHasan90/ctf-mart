import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Profile = () => {
	const { user, updateProfile, changePassword, deleteAccount, loading } =
		useContext(AuthContext);
	const navigate = useNavigate();

	const [activeTab, setActiveTab] = useState("view");
	const [editData, setEditData] = useState({
		name: user?.name || "",
		email: user?.email || "",
	});
	const [passwordData, setPasswordData] = useState({
		oldPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [deletePassword, setDeletePassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleEditChange = (e) => {
		setEditData({
			...editData,
			[e.target.name]: e.target.value,
		});
	};

	const handlePasswordChange = (e) => {
		setPasswordData({
			...passwordData,
			[e.target.name]: e.target.value,
		});
	};

	const handleUpdateProfile = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (!editData.name.trim() || !editData.email.trim()) {
			setError("Name and email are required");
			return;
		}

		const result = await updateProfile(editData.name, editData.email);
		if (result.success) {
			setSuccess("Profile updated successfully!");
			setError("");
		} else {
			setError(result.message);
		}
	};

	const handleChangePassword = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (
			!passwordData.oldPassword ||
			!passwordData.newPassword ||
			!passwordData.confirmPassword
		) {
			setError("All password fields are required");
			return;
		}

		if (passwordData.newPassword !== passwordData.confirmPassword) {
			setError("New passwords do not match");
			return;
		}

		if (passwordData.newPassword.length < 6) {
			setError("New password must be at least 6 characters");
			return;
		}

		const result = await changePassword(
			passwordData.oldPassword,
			passwordData.newPassword,
		);
		if (result.success) {
			setSuccess("Password changed successfully!");
			setPasswordData({
				oldPassword: "",
				newPassword: "",
				confirmPassword: "",
			});
			setError("");
		} else {
			setError(result.message);
		}
	};

	const handleDeleteAccount = async (e) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (!deletePassword) {
			setError("Please enter your password");
			return;
		}

		if (
			!window.confirm(
				"Are you sure you want to delete your account? This action cannot be undone!",
			)
		) {
			return;
		}

		const result = await deleteAccount(deletePassword);
		if (result.success) {
			setSuccess("Account deleted successfully. Redirecting to login...");
			setTimeout(() => navigate("/login"), 2000);
		} else {
			setError(result.message);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-2xl mx-auto">
				<div className="bg-white rounded-lg shadow-md overflow-hidden">
					{/* Header */}
					<div
						className="px-6 py-8 text-white"
						style={{
							background:
								"linear-gradient(to right, #26d4a7, #1fa88f)",
						}}
					>
						<h1 className="text-3xl font-bold mb-2">My Profile</h1>
						<p className="text-white text-opacity-80">
							Manage your account settings
						</p>
					</div>

					{/* Tabs */}
					<div className="flex border-b border-gray-200">
						<button
							onClick={() => setActiveTab("view")}
							className={`flex-1 py-4 px-6 font-semibold transition-colors ${
								activeTab === "view"
									? "border-b-2 text-white"
									: "text-gray-600 hover:text-gray-900"
							}`}
							style={
								activeTab === "view"
									? {
											borderBottomColor: "#26d4a7",
											backgroundColor: "#f0fdf9",
											color: "#26d4a7",
										}
									: {}
							}
						>
							View Profile
						</button>
						<button
							onClick={() => setActiveTab("edit")}
							className={`flex-1 py-4 px-6 font-semibold transition-colors ${
								activeTab === "edit"
									? "border-b-2 text-white"
									: "text-gray-600 hover:text-gray-900"
							}`}
							style={
								activeTab === "edit"
									? {
											borderBottomColor: "#26d4a7",
											backgroundColor: "#f0fdf9",
											color: "#26d4a7",
										}
									: {}
							}
						>
							Edit Profile
						</button>
						<button
							onClick={() => setActiveTab("password")}
							className={`flex-1 py-4 px-6 font-semibold transition-colors ${
								activeTab === "password"
									? "border-b-2 text-white"
									: "text-gray-600 hover:text-gray-900"
							}`}
							style={
								activeTab === "password"
									? {
											borderBottomColor: "#26d4a7",
											backgroundColor: "#f0fdf9",
											color: "#26d4a7",
										}
									: {}
							}
						>
							Change Password
						</button>
						<button
							onClick={() => setActiveTab("delete")}
							className={`flex-1 py-4 px-6 font-semibold transition-colors ${
								activeTab === "delete"
									? "border-b-2 text-white"
									: "text-gray-600 hover:text-gray-900"
							}`}
							style={
								activeTab === "delete"
									? {
											borderBottomColor: "#dc2626",
											backgroundColor: "#fef2f2",
											color: "#dc2626",
										}
									: {}
							}
						>
							Delete Account
						</button>
					</div>

					{/* Content */}
					<div className="p-6">
						{/* Error/Success Messages */}
						{error && (
							<div className="mb-4 p-4 bg-red-100 text-red-700 rounded border border-red-300">
								{error}
							</div>
						)}
						{success && (
							<div
								className="mb-4 p-4 text-white rounded border"
								style={{
									backgroundColor: "#26d4a7",
									borderColor: "#1fa88f",
								}}
							>
								{success}
							</div>
						)}

						{/* View Profile Tab */}
						{activeTab === "view" && (
							<div className="space-y-4">
								<div
									className="bg-gray-50 p-4 rounded-lg border-l-4"
									style={{ borderLeftColor: "#26d4a7" }}
								>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Name
									</label>
									<p className="text-lg text-gray-900">
										{user?.name}
									</p>
								</div>
								<div
									className="bg-gray-50 p-4 rounded-lg border-l-4"
									style={{ borderLeftColor: "#26d4a7" }}
								>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Email
									</label>
									<p className="text-lg text-gray-900">
										{user?.email}
									</p>
								</div>
								<div
									className="bg-gray-50 p-4 rounded-lg border-l-4"
									style={{ borderLeftColor: "#26d4a7" }}
								>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Account Balance
									</label>
									<p
										className="text-2xl font-bold"
										style={{ color: "#26d4a7" }}
									>
										$
										{user?.totalBalance?.toFixed(2) ||
											"0.00"}
									</p>
								</div>
								<div
									className="bg-gray-50 p-4 rounded-lg border-l-4"
									style={{ borderLeftColor: "#26d4a7" }}
								>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Account Status
									</label>
									<p className="text-lg text-gray-900">
										<span
											className="inline-block text-white px-3 py-1 rounded-full text-sm font-semibold"
											style={{
												backgroundColor: "#26d4a7",
											}}
										>
											Active
										</span>
									</p>
								</div>
								<div
									className="bg-gray-50 p-4 rounded-lg border-l-4"
									style={{ borderLeftColor: "#26d4a7" }}
								>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										User Role
									</label>
									<p className="text-lg text-gray-900">
										<span
											className="inline-block text-white px-3 py-1 rounded-full text-sm font-semibold"
											style={{
												backgroundColor:
													user?.role === "admin"
														? "#dc2626"
														: "#26d4a7",
											}}
										>
											{user?.role === "admin"
												? "Administrator"
												: "User"}
										</span>
									</p>
								</div>
							</div>
						)}

						{/* Edit Profile Tab */}
						{activeTab === "edit" && (
							<form
								onSubmit={handleUpdateProfile}
								className="space-y-4"
							>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Name
									</label>
									<input
										type="text"
										name="name"
										value={editData.name}
										onChange={handleEditChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
										style={{ "--tw-ring-color": "#26d4a7" }}
										placeholder="Enter your name"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Email
									</label>
									<input
										type="email"
										name="email"
										value={editData.email}
										onChange={handleEditChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
										style={{ "--tw-ring-color": "#26d4a7" }}
										placeholder="Enter your email"
									/>
								</div>
								<button
									type="submit"
									disabled={loading}
									className="w-full text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
									style={{ backgroundColor: "#26d4a7" }}
								>
									{loading ? "Updating..." : "Update Profile"}
								</button>
							</form>
						)}

						{/* Change Password Tab */}
						{activeTab === "password" && (
							<form
								onSubmit={handleChangePassword}
								className="space-y-4"
							>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Current Password
									</label>
									<input
										type="password"
										name="oldPassword"
										value={passwordData.oldPassword}
										onChange={handlePasswordChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
										style={{ "--tw-ring-color": "#26d4a7" }}
										placeholder="Enter current password"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										New Password
									</label>
									<input
										type="password"
										name="newPassword"
										value={passwordData.newPassword}
										onChange={handlePasswordChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
										style={{ "--tw-ring-color": "#26d4a7" }}
										placeholder="Enter new password"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Confirm New Password
									</label>
									<input
										type="password"
										name="confirmPassword"
										value={passwordData.confirmPassword}
										onChange={handlePasswordChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
										style={{ "--tw-ring-color": "#26d4a7" }}
										placeholder="Confirm new password"
									/>
								</div>
								<button
									type="submit"
									disabled={loading}
									className="w-full text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
									style={{ backgroundColor: "#26d4a7" }}
								>
									{loading
										? "Changing..."
										: "Change Password"}
								</button>
							</form>
						)}

						{/* Delete Account Tab */}
						{activeTab === "delete" && (
							<form
								onSubmit={handleDeleteAccount}
								className="space-y-4"
							>
								<div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
									<p className="text-red-800 font-semibold">
										⚠️ Danger Zone
									</p>
									<p className="text-red-700 text-sm mt-2">
										Deleting your account is permanent and
										cannot be undone. All your data will be
										lost.
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Enter Password to Confirm
									</label>
									<input
										type="password"
										value={deletePassword}
										onChange={(e) =>
											setDeletePassword(e.target.value)
										}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
										placeholder="Enter your password"
									/>
								</div>
								<button
									type="submit"
									disabled={loading}
									className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
								>
									{loading ? "Deleting..." : "Delete Account"}
								</button>
							</form>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
