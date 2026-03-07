import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

const Login = () => {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const { login, loading } = useContext(AuthContext);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		const result = await login(formData.email, formData.password);
		if (result.success) {
			setTimeout(() => (window.location.href = "/products"), 1000);
		} else {
			setError(result.message);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
				<h2 className="text-3xl font-bold text-gray-900 mb-6">Login</h2>

				{error && (
					<div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-gray-700 font-bold mb-2">
							Email
						</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
							style={{ "--tw-ring-color": "#26d4a7" }}
						/>
					</div>

					<div>
						<label className="block text-gray-700 font-bold mb-2">
							Password
						</label>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
							style={{ "--tw-ring-color": "#26d4a7" }}
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 transition-all hover:opacity-90"
						style={{ backgroundColor: "#26d4a7" }}
					>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>

				<p className="mt-4 text-center text-gray-600">
					Don't have an account?{" "}
					<a
						href="/register"
						className="hover:underline font-semibold"
						style={{ color: "#26d4a7" }}
					>
						Register
					</a>
				</p>
			</div>
		</div>
	);
};

export default Login;
