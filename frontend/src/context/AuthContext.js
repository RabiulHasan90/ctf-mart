import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("token") || null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (token) {
			localStorage.setItem("token", token);
		} else {
			localStorage.removeItem("token");
		}
	}, [token]);

	// Fetch user data when token exists
	useEffect(() => {
		const fetchUser = async () => {
			if (token) {
				setLoading(true);
				try {
					const response = await fetch(
						"http://localhost:5000/api/auth/me",
						{
							headers: {
								Authorization: `Bearer ${token}`,
							},
						},
					);
					const data = await response.json();
					if (data.success) {
						setUser(data.user);
					}
				} catch (error) {
					console.error("Failed to fetch user:", error);
				} finally {
					setLoading(false);
				}
			}
		};
		fetchUser();
	}, [token]);

	const login = async (email, password) => {
		setLoading(true);
		try {
			const response = await fetch(
				"http://localhost:5000/api/auth/login",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				},
			);
			const data = await response.json();
			if (data.success) {
				setToken(data.token);
				setUser(data.user);
				return data;
			}
			return data;
		} catch (error) {
			console.error(error);
			return { success: false, message: error.message };
		} finally {
			setLoading(false);
		}
	};

	const register = async (name, email, password) => {
		setLoading(true);
		try {
			const response = await fetch(
				"http://localhost:5000/api/auth/register",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ name, email, password }),
				},
			);
			const data = await response.json();
			if (data.success) {
				setToken(data.token);
				setUser(data.user);
				return data;
			}
			return data;
		} catch (error) {
			console.error(error);
			return { success: false, message: error.message };
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		setToken(null);
		setUser(null);
		localStorage.removeItem("token");
	};

	const updateProfile = async (name, email) => {
		setLoading(true);
		try {
			const response = await fetch(
				"http://localhost:5000/api/auth/update-profile",
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ name, email }),
				},
			);
			const data = await response.json();
			if (data.success) {
				setUser(data.user);
				return data;
			}
			return data;
		} catch (error) {
			console.error(error);
			return { success: false, message: error.message };
		} finally {
			setLoading(false);
		}
	};

	const changePassword = async (oldPassword, newPassword) => {
		setLoading(true);
		try {
			const response = await fetch(
				"http://localhost:5000/api/auth/change-password",
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ oldPassword, newPassword }),
				},
			);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error(error);
			return { success: false, message: error.message };
		} finally {
			setLoading(false);
		}
	};

	const deleteAccount = async (password) => {
		setLoading(true);
		try {
			const response = await fetch(
				"http://localhost:5000/api/auth/delete-account",
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ password }),
				},
			);
			const data = await response.json();
			if (data.success) {
				setToken(null);
				setUser(null);
				localStorage.removeItem("token");
			}
			return data;
		} catch (error) {
			console.error(error);
			return { success: false, message: error.message };
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				token,
				login,
				register,
				logout,
				updateProfile,
				changePassword,
				deleteAccount,
				loading,
				setUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
