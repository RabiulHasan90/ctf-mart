import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import CartContext from "../context/CartContext";
import ConfirmationModal from "../components/ConfirmationModal";
import { getProduct, getReviewsByProduct, createReview } from "../services/api";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import "../styles/ProductDetail.css";

const ProductDetail = () => {
	const { productId } = useParams();
	const navigate = useNavigate();
	const { user, token } = useContext(AuthContext);
	const { addToCart } = useContext(CartContext);

	const [product, setProduct] = useState(null);
	const [reviews, setReviews] = useState([]);
	const [averageRating, setAverageRating] = useState(0);
	const [userReview, setUserReview] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [submittingReview, setSubmittingReview] = useState(false);
	const [quantity, setQuantity] = useState(1);
	const [showConfirmation, setShowConfirmation] = useState(false);

	// Fetch product and reviews on mount
	useEffect(() => {
		fetchProductAndReviews();
	}, [productId]);

	const fetchProductAndReviews = async () => {
		try {
			setLoading(true);
			setError("");

			// Fetch product
			const productResponse = await getProduct(productId);
			if (productResponse.data.success) {
				setProduct(productResponse.data.product);
			}

			// Fetch reviews
			const reviewsResponse = await getReviewsByProduct(productId);
			if (reviewsResponse.data.success) {
				setReviews(reviewsResponse.data.reviews);

				// Calculate average rating
				if (reviewsResponse.data.reviews.length > 0) {
					const avgRating =
						reviewsResponse.data.reviews.reduce(
							(sum, review) => sum + review.rating,
							0,
						) / reviewsResponse.data.reviews.length;
					setAverageRating(avgRating.toFixed(1));
				}

				// Check if current user has already reviewed
				if (user) {
					const existingReview = reviewsResponse.data.reviews.find(
						(review) => review.user._id === user.id,
					);
					setUserReview(existingReview || null);
				}
			}
		} catch (err) {
			setError(err.response?.data?.message || "Failed to load product");
		} finally {
			setLoading(false);
		}
	};

	const handleReviewSubmit = async (rating, comment) => {
		try {
			setSubmittingReview(true);
			setError("");
			setSuccess("");

			const response = await createReview({
				productId,
				rating: parseInt(rating),
				comment,
			});

			if (response.data.success) {
				setSuccess("Review submitted successfully!");

				// Refresh reviews and ratings
				await fetchProductAndReviews();

				// Clear form
				setTimeout(() => setSuccess(""), 3000);
			}
		} catch (err) {
			setError(err.response?.data?.message || "Failed to submit review");
		} finally {
			setSubmittingReview(false);
		}
	};

	const handleAddToCart = () => {
		setShowConfirmation(true);
	};

	const handleConfirmAddToCart = () => {
		if (product && quantity > 0) {
			for (let i = 0; i < quantity; i++) {
				addToCart(product);
			}
			setSuccess(`Added ${quantity} item(s) to cart!`);
			setShowConfirmation(false);
			setTimeout(() => setSuccess(""), 2000);
		}
	};

	const handleCancelAddToCart = () => {
		setShowConfirmation(false);
	};

	const handleContinueShopping = () => {
		navigate("/products");
	};

	if (loading) {
		return (
			<div className="product-detail-container">
				<div className="loading">Loading product details...</div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="product-detail-container">
				<div className="error">Product not found</div>
				<button
					onClick={handleContinueShopping}
					className="btn btn-primary"
				>
					Back to Products
				</button>
			</div>
		);
	}

	return (
		<div className="product-detail-container">
			<button onClick={handleContinueShopping} className="back-button">
				← Back to Products
			</button>

			{error && <div className="error-message">{error}</div>}
			{success && <div className="success-message">{success}</div>}

			<div className="product-detail">
				{/* Product Image */}
				<div className="product-image">
					<img src={product.imageUrl} alt={product.name} />
				</div>

				{/* Product Info */}
				<div className="product-info">
					<h1>{product.name}</h1>

					{/* Rating */}
					<div className="product-rating">
						<div className="stars">
							{renderStars(averageRating)}
						</div>
						<span className="rating-text">
							{reviews.length > 0
								? `${averageRating} out of 5 (${reviews.length} review${reviews.length !== 1 ? "s" : ""})`
								: "No reviews yet"}
						</span>
					</div>

					{/* Price */}
					<div className="product-price">
						<h2>${product.price.toFixed(2)}</h2>
					</div>

					{/* Description */}
					<div className="product-description">
						<p>{product.description}</p>
					</div>

					{/* Category */}
					<div className="product-category">
						<span className="badge">{product.category}</span>
					</div>

					{/* Stock Status */}
					<div className="product-stock">
						<p>
							{product.stock > 0 ? (
								<span className="in-stock">
									✓ In Stock ({product.stock} available)
								</span>
							) : (
								<span className="out-of-stock">
									✗ Out of Stock
								</span>
							)}
						</p>
					</div>

					{/* Quantity Selector */}
					{product.stock > 0 && (
						<div className="quantity-selector">
							<label htmlFor="quantity">Quantity:</label>
							<button
								onClick={() =>
									setQuantity(Math.max(1, quantity - 1))
								}
								disabled={quantity <= 1}
								className="qty-btn"
							>
								−
							</button>
							<input
								type="number"
								id="quantity"
								value={quantity}
								onChange={(e) =>
									setQuantity(
										Math.min(
											Math.max(
												1,
												parseInt(e.target.value) || 1,
											),
											product.stock,
										),
									)
								}
								min="1"
								max={product.stock}
							/>
							<button
								onClick={() =>
									setQuantity(
										Math.min(quantity + 1, product.stock),
									)
								}
								disabled={quantity >= product.stock}
								className="qty-btn"
							>
								+
							</button>
						</div>
					)}

					{/* Add to Cart Button */}
					<button
						onClick={handleAddToCart}
						disabled={product.stock <= 0}
						className={`btn btn-primary btn-large ${
							product.stock <= 0 ? "disabled" : ""
						}`}
					>
						{product.stock > 0 ? "Add to Cart" : "Out of Stock"}
					</button>
				</div>
			</div>

			{/* Reviews Section */}
			<div className="reviews-section">
				<h2>Customer Reviews</h2>

				{/* Review Form (only for logged-in users without existing review) */}
				{token ? (
					<div className="review-form-container">
						{userReview ? (
							<div className="existing-review-notice">
								<p>
									You have already reviewed this product. Your
									review:
								</p>
								<div className="user-review">
									<div className="review-header">
										<div className="review-info">
											<strong>{user.name}</strong>
											<span className="review-date">
												{new Date(
													userReview.createdAt,
												).toLocaleDateString()}
											</span>
										</div>
										<div className="review-rating">
											{renderStars(userReview.rating)}
										</div>
									</div>
									<p className="review-comment">
										{userReview.comment}
									</p>
								</div>
							</div>
						) : (
							<ReviewForm
								onSubmit={handleReviewSubmit}
								isLoading={submittingReview}
							/>
						)}
					</div>
				) : (
					<div className="login-prompt">
						<p>Please log in to write a review.</p>
					</div>
				)}

				{/* Reviews List */}
				<ReviewList reviews={reviews} currentUserId={user?.id} />
			</div>

			{/* Confirmation Modal */}
			<ConfirmationModal
				isOpen={showConfirmation}
				product={product}
				quantity={quantity}
				onConfirm={handleConfirmAddToCart}
				onCancel={handleCancelAddToCart}
			/>
		</div>
	);
};

// Helper function to render star rating
const renderStars = (rating) => {
	const stars = [];
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 !== 0;

	for (let i = 0; i < 5; i++) {
		if (i < fullStars) {
			stars.push(
				<span key={i} className="star star-full">
					★
				</span>,
			);
		} else if (i === fullStars && hasHalfStar) {
			stars.push(
				<span key={i} className="star star-half">
					★
				</span>,
			);
		} else {
			stars.push(
				<span key={i} className="star star-empty">
					☆
				</span>,
			);
		}
	}

	return stars;
};

export default ProductDetail;
