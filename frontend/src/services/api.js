import axios from "axios";

const API_URL = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const headers = () => ({
	"Content-Type": "application/json",
	Authorization: `Bearer ${getToken()}`,
});

// Products
export const getProducts = (filters = {}) => {
	const params = new URLSearchParams();
	if (filters.search) params.append("search", filters.search);
	if (filters.category) params.append("category", filters.category);
	if (filters.minPrice) params.append("minPrice", filters.minPrice);
	if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

	const queryString = params.toString();
	const url = queryString
		? `${API_URL}/products?${queryString}`
		: `${API_URL}/products`;
	return axios.get(url);
};
export const getProduct = (id) => axios.get(`${API_URL}/products/${id}`);
export const createProduct = (data) =>
	axios.post(`${API_URL}/products`, data, { headers: headers() });
export const updateProduct = (id, data) =>
	axios.put(`${API_URL}/products/${id}`, data, { headers: headers() });
export const deleteProduct = (id) =>
	axios.delete(`${API_URL}/products/${id}`, { headers: headers() });

// Orders
export const getOrders = () =>
	axios.get(`${API_URL}/orders`, { headers: headers() });
export const getMyOrders = () =>
	axios.get(`${API_URL}/orders/my-orders`, { headers: headers() });
export const getOrder = (id) =>
	axios.get(`${API_URL}/orders/${id}`, { headers: headers() });
export const createOrder = (data) =>
	axios.post(`${API_URL}/orders`, data, { headers: headers() });
export const updateOrder = (id, data) =>
	axios.put(`${API_URL}/orders/${id}`, data, { headers: headers() });
export const cancelOrder = (id) =>
	axios.delete(`${API_URL}/orders/${id}`, { headers: headers() });
export const processPayment = (id) =>
	axios.post(`${API_URL}/orders/${id}/pay`, {}, { headers: headers() });

// Reviews
export const getReviewsByProduct = (productId) =>
	axios.get(`${API_URL}/reviews/product/${productId}`);
export const createReview = (data) =>
	axios.post(`${API_URL}/reviews`, data, { headers: headers() });
export const updateReview = (id, data) =>
	axios.put(`${API_URL}/reviews/${id}`, data, { headers: headers() });
export const deleteReview = (id) =>
	axios.delete(`${API_URL}/reviews/${id}`, { headers: headers() });
// Admin
export const getAdminStats = () =>
	axios.get(`${API_URL}/admin/stats`, { headers: headers() });
export const getAllUsers = () =>
	axios.get(`${API_URL}/admin/users`, { headers: headers() });
export const deleteUser = (id) =>
	axios.delete(`${API_URL}/admin/users/${id}`, { headers: headers() });
export const updateUserRole = (id, role) =>
	axios.put(
		`${API_URL}/admin/users/${id}/role`,
		{ role },
		{ headers: headers() },
	);
export const getAllProducts = () =>
	axios.get(`${API_URL}/admin/products`, { headers: headers() });
export const getAllOrders = () =>
	axios.get(`${API_URL}/admin/orders`, { headers: headers() });
export const updateOrderStatus = (id, orderStatus) =>
	axios.put(
		`${API_URL}/admin/orders/${id}/status`,
		{ orderStatus },
		{ headers: headers() },
	);
