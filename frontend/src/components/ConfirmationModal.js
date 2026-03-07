import React from "react";

/**
 * ConfirmationModal Component
 * Displays a confirmation popup when user adds an item to cart
 */
const ConfirmationModal = ({
	isOpen,
	product,
	quantity,
	onConfirm,
	onCancel,
}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100">
				{/* Header */}
				<div className="bg-teal-500 text-white px-6 py-4 rounded-t-lg">
					<h2 className="text-2xl font-bold">Add to Cart?</h2>
				</div>

				{/* Body */}
				<div className="px-6 py-6">
					{product && (
						<>
							{/* Product Image */}
							<div className="mb-4 text-center">
								<img
									src={product.imageUrl}
									alt={product.name}
									className="h-24 w-24 object-cover rounded-lg mx-auto"
									onError={(e) => {
										e.target.src =
											"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='sans-serif' font-size='12'%3ENo Image%3C/text%3E%3C/svg%3E";
									}}
								/>
							</div>

							{/* Product Details */}
							<div className="space-y-3">
								<div>
									<p className="text-sm text-gray-600">
										Product Name
									</p>
									<p className="text-lg font-bold text-gray-800">
										{product.name}
									</p>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="text-sm text-gray-600">
											Price
										</p>
										<p className="text-lg font-bold text-teal-600">
											$
											{product.price?.toFixed(2) ||
												"0.00"}
										</p>
									</div>
									<div>
										<p className="text-sm text-gray-600">
											Quantity
										</p>
										<p className="text-lg font-bold text-gray-800">
											{quantity}
										</p>
									</div>
								</div>

								<div className="border-t pt-3">
									<p className="text-sm text-gray-600">
										Total
									</p>
									<p className="text-2xl font-bold text-teal-600">
										$
										{(
											(product.price || 0) * quantity
										).toFixed(2)}
									</p>
								</div>
							</div>
						</>
					)}
				</div>

				{/* Footer - Buttons */}
				<div className="border-t px-6 py-4 flex gap-3">
					<button
						onClick={onCancel}
						className="flex-1 py-2 px-4 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors duration-200"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						className="flex-1 py-2 px-4 rounded-lg font-semibold bg-teal-500 hover:bg-teal-600 text-white transition-colors duration-200"
					>
						✓ Add to Cart
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationModal;
