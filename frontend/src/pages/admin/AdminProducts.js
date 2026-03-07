import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import AdminNavigation from "../../components/AdminNavigation";
import {
	getAllProducts,
	deleteProduct,
	createProduct,
	updateProduct,
	updateOrderStatus,
} from "../../services/api";

const AdminProducts = () => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		stock: "",
		imageUrl: "",
		privateData: "",
	});
	const [expandedPrivateData, setExpandedPrivateData] = useState({});

	const categories = [
		"Electronics",
		"Books",
		"Clothing",
		"Food",
		"Home",
		"Sports",
		"Toys",
		"Other",
	];

	useEffect(() => {
		if (!user || user.role !== "admin") {
			navigate("/");
			return;
		}
		fetchProducts();
	}, [user, navigate]);

	const fetchProducts = async () => {
		try {
			const response = await getAllProducts();
			if (response.data.success) {
				setProducts(response.data.products);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteProduct = async (productId) => {
		if (window.confirm("Are you sure you want to delete this product?")) {
			try {
				await deleteProduct(productId);
				setProducts(products.filter((p) => p._id !== productId));
			} catch (error) {
				console.error(error);
			}
		}
	};

	const handleEditProduct = (product) => {
		setEditingId(product._id);
		setFormData({
			name: product.name,
			description: product.description,
			price: product.price,
			category: product.category,
			stock: product.stock,
			imageUrl: product.imageUrl,
			privateData: product.privateData || "",
		});
		setShowForm(true);
	};

	const handleAddOrUpdateProduct = async (e) => {
		e.preventDefault();
		try {
			if (editingId) {
				// Update product via API
				const response = await updateProduct(editingId, formData);
				if (response.data.success) {
					const updatedProducts = products.map((p) =>
						p._id === editingId ? response.data.product : p,
					);
					setProducts(updatedProducts);
					setEditingId(null);
				}
			} else {
				// Create new product
				const response = await createProduct(formData);
				if (response.data.success) {
					setProducts([...products, response.data.product]);
				}
			}
			setFormData({
				name: "",
				description: "",
				price: "",
				category: "",
				stock: "",
				imageUrl: "",
				privateData: "",
			});
			setShowForm(false);
		} catch (error) {
			console.error(error);
		}
	};

	if (loading) return <div className="text-center py-8">Loading...</div>;

	return (
		<div className="min-h-screen bg-gray-100">
			<AdminNavigation />

			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-4xl font-bold text-gray-800">
						Product Management
					</h1>
					<button
						onClick={() => setShowForm(!showForm)}
						className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
					>
						{showForm ? "Cancel" : "+ Add Product"}
					</button>
				</div>

				{/* Modal Backdrop */}
				{showForm && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
						{/* Modal Card */}
						<div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
							{/* Modal Header */}
							<div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 flex justify-between items-center sticky top-0">
								<h2 className="text-2xl font-bold text-white">
									{editingId
										? "✏️ Edit Product"
										: "➕ Add New Product"}
								</h2>
								<button
									onClick={() => {
										setEditingId(null);
										setFormData({
											name: "",
											description: "",
											price: "",
											category: "",
											stock: "",
											imageUrl: "",
											privateData: "",
										});
										setShowForm(false);
									}}
									className="text-white text-3xl leading-none hover:opacity-75 transition-opacity"
								>
									×
								</button>
							</div>

							{/* Modal Body */}
							<div className="p-8">
								<form onSubmit={handleAddOrUpdateProduct}>
									<div className="space-y-6">
										{/* Product Name */}
										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-2">
												Product Name *
											</label>
											<input
												type="text"
												placeholder="Enter product name"
												value={formData.name}
												onChange={(e) =>
													setFormData({
														...formData,
														name: e.target.value,
													})
												}
												required
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
										</div>

										{/* Price and Stock */}
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<label className="block text-sm font-semibold text-gray-700 mb-2">
													Price ($) *
												</label>
												<input
													type="number"
													step="0.01"
													placeholder="0.00"
													value={formData.price}
													onChange={(e) =>
														setFormData({
															...formData,
															price: e.target
																.value,
														})
													}
													required
													className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
												/>
											</div>
											<div>
												<label className="block text-sm font-semibold text-gray-700 mb-2">
													Stock *
												</label>
												<input
													type="number"
													placeholder="0"
													value={formData.stock}
													onChange={(e) =>
														setFormData({
															...formData,
															stock: e.target
																.value,
														})
													}
													required
													className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
												/>
											</div>
										</div>

										{/* Category */}
										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-2">
												Category *
											</label>
											<select
												value={formData.category}
												onChange={(e) =>
													setFormData({
														...formData,
														category:
															e.target.value,
													})
												}
												required
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
											>
												<option value="">
													Select a category
												</option>
												{categories.map((cat) => (
													<option
														key={cat}
														value={cat}
													>
														{cat}
													</option>
												))}
											</select>
										</div>

										{/* Description */}
										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-2">
												Description *
											</label>
											<textarea
												placeholder="Enter product description"
												value={formData.description}
												onChange={(e) =>
													setFormData({
														...formData,
														description:
															e.target.value,
													})
												}
												required
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
												rows="3"
											/>
										</div>

										{/* Image URL */}
										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-2">
												Image URL
											</label>
											<input
												type="text"
												placeholder="https://example.com/image.jpg"
												value={formData.imageUrl}
												onChange={(e) =>
													setFormData({
														...formData,
														imageUrl:
															e.target.value,
													})
												}
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
										</div>

										{/* Private Data */}
										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-2">
												Private Data
												<span className="text-gray-500 text-xs ml-1">
													(exclusive info for
													purchasers)
												</span>
											</label>
											<textarea
												placeholder="Enter private/exclusive information"
												value={formData.privateData}
												onChange={(e) =>
													setFormData({
														...formData,
														privateData:
															e.target.value,
													})
												}
												className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
												rows="2"
											/>
										</div>
									</div>

									{/* Modal Footer */}
									<div className="mt-8 flex gap-3 justify-end pt-6 border-t border-gray-200">
										<button
											type="button"
											onClick={() => {
												setEditingId(null);
												setFormData({
													name: "",
													description: "",
													price: "",
													category: "",
													stock: "",
													imageUrl: "",
													privateData: "",
												});
												setShowForm(false);
											}}
											className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
										>
											Cancel
										</button>
										<button
											type="submit"
											className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md"
										>
											{editingId
												? "✓ Update Product"
												: "✓ Create Product"}
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				)}

				{/* Products Table */}
				<div className="bg-white rounded-lg shadow-lg overflow-hidden">
					<table className="w-full">
						<thead className="bg-gray-800 text-white">
							<tr>
								<th className="px-6 py-4 text-left">Name</th>
								<th className="px-6 py-4 text-left">Price</th>
								<th className="px-6 py-4 text-left">Stock</th>
								<th className="px-6 py-4 text-left">
									Category
								</th>
								<th className="px-6 py-4 text-left">
									Private Data
								</th>
								<th className="px-6 py-4 text-left">Actions</th>
							</tr>
						</thead>
						<tbody>
							{products.map((p) => (
								<tr
									key={p._id}
									className="border-b hover:bg-gray-50"
								>
									<td className="px-6 py-4 font-semibold">
										{p.name}
									</td>
									<td className="px-6 py-4 text-green-600 font-bold">
										${parseFloat(p.price).toFixed(2)}
									</td>
									<td className="px-6 py-4">
										<span
											className={`px-3 py-1 rounded text-sm font-semibold ${
												p.stock > 0
													? "bg-green-100 text-green-800"
													: "bg-red-100 text-red-800"
											}`}
										>
											{p.stock}
										</span>
									</td>
									<td className="px-6 py-4">{p.category}</td>
									<td className="px-6 py-4">
										{p.privateData ? (
											<div>
												{expandedPrivateData &&
												expandedPrivateData[p._id] ? (
													<div className="bg-yellow-50 p-2 rounded text-sm mb-2">
														<p className="text-gray-700">
															{p.privateData}
														</p>
													</div>
												) : null}
												<button
													onClick={() =>
														setExpandedPrivateData({
															...expandedPrivateData,
															[p._id]:
																!expandedPrivateData[
																	p._id
																],
														})
													}
													className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm font-semibold hover:bg-yellow-200 transition-colors"
												>
													{expandedPrivateData &&
													expandedPrivateData[p._id]
														? "Hide"
														: "View"}
												</button>
											</div>
										) : (
											<span className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm">
												—
											</span>
										)}
									</td>
									<td className="px-6 py-4">
										<button
											onClick={() => handleEditProduct(p)}
											className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-semibold transition-colors mr-2"
										>
											Edit
										</button>
										<button
											onClick={() =>
												handleDeleteProduct(p._id)
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
					Total Products:{" "}
					<span className="font-bold">{products.length}</span>
				</p>
			</div>
		</div>
	);
};

export default AdminProducts;
