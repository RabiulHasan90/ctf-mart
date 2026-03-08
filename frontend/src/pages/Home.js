import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Home = () => {
	const navigate = useNavigate();
	const { token } = useContext(AuthContext);

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
			{/* Hero Section */}
			<div className="max-w-7xl mx-auto px-4 py-20">
				<div className="text-center mb-16">
					<h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
						Welcome to{" "}
						<span className="text-teal-400">ShopCTF</span>
					</h1>
					<p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
						An e-commerce platform with hidden vulnerabilities and
						secret flags. Can you find them all?
					</p>
					<div className="flex gap-4 justify-center">
						{token ? (
							<>
								<button
									onClick={() => navigate("/products")}
									className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
								>
									Shop Now
								</button>
								<button
									onClick={() => navigate("/orders")}
									className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
								>
									My Orders 
								</button>
							
							</>
						) : (
							<>
								<button
									onClick={() => navigate("/register")}
									className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
								>
									Get Started
								</button>
								<button
									onClick={() => navigate("/login")}
									className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
								>
									Sign In
								</button>
							</>
						)}
					</div>
				</div>

				{/* Features Section */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
					<div className="bg-slate-700 rounded-lg p-8 text-center">
						<div className="text-4xl mb-4">🛍️</div>
						<h3 className="text-xl font-bold text-white mb-4">
							Browse Products
						</h3>
						<p className="text-gray-300">
							Explore our collection of products with varying
							prices and hidden features.
						</p>
					</div>

					<div className="bg-slate-700 rounded-lg p-8 text-center">
						<div className="text-4xl mb-4">💰</div>
						<h3 className="text-xl font-bold text-white mb-4">
							$50 Signup Bonus
						</h3>
						<p className="text-gray-300">
							Every new user gets $50 to start shopping. Try to
							find ways to maximize your balance!
						</p>
					</div>

					<div className="bg-slate-700 rounded-lg p-8 text-center">
						<div className="text-4xl mb-4">🚩</div>
						<h3 className="text-xl font-bold text-white mb-4">
							Find Secret Flags
						</h3>
						<p className="text-gray-300">
							Unlock hidden flags by exploiting business logic
							vulnerabilities and completing challenges.
						</p>
					</div>
				</div>

				{/* CTF Challenge Section */}
				<div className="mt-20 bg-slate-700 rounded-lg p-8 md:p-12">
					<h2 className="text-3xl font-bold text-white mb-6">
						🎯 CTF Challenge
					</h2>
					<div className="text-gray-300 space-y-4">
						<p>
							<strong>Objective:</strong> Find and claim all
							available flags by discovering vulnerabilities in
							the e-commerce platform's business logic.
						</p>
						<p>
							<strong>Flag Hints:</strong>
						</p>
						<ul className="list-disc list-inside space-y-2 ml-4">
							<li>
								Look for products with special prices - some
								might unlock special rewards
							</li>
							<li>
								The secret flag product costs more than $100 -
								can you afford it?
							</li>
							<li>
								Explore different user interactions and payment
								flows
							</li>
							<li>
								Check your profile page to see what flags you've
								collected
							</li>
						</ul>
						<p className="mt-6">
							<strong>Remember:</strong> This is a CTF challenge
							platform. The "vulnerabilities" are intentional for
							educational purposes. Have fun hunting flags! 🚩
						</p>
					</div>
				</div>

				{/* How It Works Section */}
				<div className="mt-20">
					<h2 className="text-3xl font-bold text-white mb-10 text-center">
						How It Works
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						<div className="bg-slate-700 rounded-lg p-6">
							<div className="bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-4">
								1
							</div>
							<h4 className="text-lg font-bold text-white mb-2">
								Register
							</h4>
							<p className="text-gray-300 text-sm">
								Create an account and receive $50 starting
								balance
							</p>
						</div>

						<div className="bg-slate-700 rounded-lg p-6">
							<div className="bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-4">
								2
							</div>
							<h4 className="text-lg font-bold text-white mb-2">
								Browse Products
							</h4>
							<p className="text-gray-300 text-sm">
								Explore products and look for suspicious
								business logic
							</p>
						</div>

						<div className="bg-slate-700 rounded-lg p-6">
							<div className="bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-4">
								3
							</div>
							<h4 className="text-lg font-bold text-white mb-2">
								Shop & Hunt
							</h4>
							<p className="text-gray-300 text-sm">
								Make purchases and search for vulnerabilities
							</p>
						</div>

						<div className="bg-slate-700 rounded-lg p-6">
							<div className="bg-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-4">
								4
							</div>
							<h4 className="text-lg font-bold text-white mb-2">
								Claim Flags
							</h4>
							<p className="text-gray-300 text-sm">
								Unlock flags by exploiting business logic issues
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
