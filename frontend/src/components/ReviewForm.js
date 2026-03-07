import React, { useState } from "react";
import "../styles/ReviewForm.css";

const ReviewForm = ({ onSubmit, isLoading }) => {
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		setError("");

		// Validation
		if (!rating || rating < 1 || rating > 5) {
			setError("Please select a rating between 1 and 5");
			return;
		}

		if (!comment.trim()) {
			setError("Please write a review comment");
			return;
		}

		if (comment.trim().length < 10) {
			setError("Review must be at least 10 characters long");
			return;
		}

		if (comment.trim().length > 500) {
			setError("Review cannot exceed 500 characters");
			return;
		}

		onSubmit(rating, comment.trim());
		setComment("");
		setRating(5);
	};

	return (
		<form className="review-form" onSubmit={handleSubmit}>
			<h3>Write a Review</h3>

			{error && <div className="form-error">{error}</div>}

			{/* Star Rating */}
			<div className="form-group">
				<label htmlFor="rating">Rating:</label>
				<div className="star-rating-input">
					{[1, 2, 3, 4, 5].map((star) => (
						<button
							key={star}
							type="button"
							className={`star-btn ${
								star <= rating ? "active" : ""
							}`}
							onClick={() => setRating(star)}
							disabled={isLoading}
							title={`${star} stars`}
						>
							★
						</button>
					))}
					<span className="rating-label">
						{rating === 1 && "Poor"}
						{rating === 2 && "Fair"}
						{rating === 3 && "Good"}
						{rating === 4 && "Very Good"}
						{rating === 5 && "Excellent"}
					</span>
				</div>
			</div>

			{/* Comment */}
			<div className="form-group">
				<label htmlFor="comment">Your Review:</label>
				<textarea
					id="comment"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					placeholder="Share your thoughts about this product (10-500 characters)"
					disabled={isLoading}
					maxLength={500}
					rows={5}
					required
				/>
				<div className="character-count">
					{comment.length} / 500 characters
				</div>
			</div>

			{/* Submit Button */}
			<button
				type="submit"
				className="btn btn-primary"
				disabled={isLoading}
			>
				{isLoading ? "Submitting..." : "Submit Review"}
			</button>
		</form>
	);
};

export default ReviewForm;
