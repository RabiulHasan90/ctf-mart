import React from "react";
import "../styles/ReviewList.css";

const ReviewList = ({ reviews, currentUserId }) => {
	if (!reviews || reviews.length === 0) {
		return (
			<div className="reviews-list">
				<div className="no-reviews">
					<p>No reviews yet. Be the first to review this product!</p>
				</div>
			</div>
		);
	}

	return (
		<div className="reviews-list">
			<h3>All Reviews ({reviews.length})</h3>
			<div className="reviews-container">
				{reviews.map((review) => (
					<div key={review._id} className="review-item">
						<div className="review-header">
							<div className="reviewer-info">
								<strong className="reviewer-name">
									{review.user.name}
								</strong>
								<span className="review-date">
									{new Date(
										review.createdAt,
									).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</span>
								{currentUserId === review.user._id && (
									<span className="badge badge-yours">
										Your review
									</span>
								)}
							</div>
							<div className="review-rating">
								{renderStars(review.rating)}
								<span className="rating-value">
									{review.rating}
								</span>
							</div>
						</div>
						<p className="review-comment">{review.comment}</p>
						{review.updatedAt !== review.createdAt && (
							<p className="review-edited">
								(Updated{" "}
								{new Date(
									review.updatedAt,
								).toLocaleDateString()}
								)
							</p>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

// Helper function to render star rating
const renderStars = (rating) => {
	const stars = [];
	for (let i = 0; i < 5; i++) {
		if (i < rating) {
			stars.push(
				<span key={i} className="star star-full">
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

export default ReviewList;
