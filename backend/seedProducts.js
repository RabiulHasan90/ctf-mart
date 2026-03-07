const mongoose = require("mongoose");
const Product = require("./src/models/Product");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
	try {
		await mongoose.connect(
			process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce-ctf",
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			},
		);
		console.log("MongoDB Connected");
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

const seedProducts = async () => {
	const products = [
		// ELECTRONICS - Various prices
		{
			name: "USB-C Cable",
			description: "Fast charging USB-C cable, 2 meters long",
			price: 9.99,
			category: "Electronics",
			stock: 100,
			imageUrl:
				"https://images.unsplash.com/photo-1625948515291-69613efd103f?w=300&h=300&fit=crop",
			rating: 4.2,
			privateData:
				"Premium 6A current rating with braided nylon coating. Lifetime warranty included.",
		},
		{
			name: "Phone Case",
			description: "Durable phone case with excellent protection",
			price: 19.99,
			category: "Electronics",
			stock: 80,
			imageUrl:
				"https://images.unsplash.com/photo-1591290621749-b79be48e5b98?w=300&h=300&fit=crop",
			rating: 4.1,
			privateData:
				"Military-grade TPU material. Drop tested from 10 feet. Includes premium screen protector.",
		},
		{
			name: "Wireless Charger",
			description:
				"Fast wireless charging pad for all Qi-enabled devices",
			price: 39.99,
			category: "Electronics",
			stock: 50,
			imageUrl:
				"https://images.unsplash.com/photo-1591290621749-b79be48e5b98?w=300&h=300&fit=crop",
			rating: 4.4,
			privateData:
				"Qi certified. Supports up to 15W fast charging. Temperature control ensures device safety.",
		},
		{
			name: "Portable Power Bank",
			description: "20000mAh power bank with fast charging support",
			price: 49.99,
			category: "Electronics",
			stock: 45,
			imageUrl:
				"https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop",
			rating: 4.5,
			privateData:
				"Contains brand-name lithium cells. Can charge 4 phones simultaneously. 2-year warranty.",
		},
		{
			name: "Mechanical Keyboard",
			description: "RGB mechanical keyboard with Cherry MX switches",
			price: 109.99,
			category: "Electronics",
			stock: 25,
			imageUrl:
				"https://images.unsplash.com/photo-1587829191301-4b47ae2c84c1?w=300&h=300&fit=crop",
			rating: 4.6,
			privateData:
				"Genuine Cherry MX Red switches. Aluminum frame with programmable RGB. 1000Hz polling rate.",
		},
		{
			name: "Gaming Mouse",
			description: "High precision gaming mouse with adjustable DPI",
			price: 79.99,
			category: "Electronics",
			stock: 35,
			imageUrl:
				"https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop",
			rating: 4.5,
			privateData:
				"16,000 DPI sensor. Ambidextrous design. 70-hour battery life. Gaming-grade build quality.",
		},
		{
			name: "Portable SSD",
			description: "1TB portable SSD with 550MB/s read speed",
			price: 129.99,
			category: "Electronics",
			stock: 10,
			imageUrl:
				"https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&h=300&fit=crop",
			rating: 4.8,
			privateData:
				"NVMe protocol. Military-grade encryption available. Shock-resistant case. 5-year warranty.",
		},
		{
			name: "Smart Watch",
			description:
				"Water-resistant smartwatch with fitness tracking and heart rate monitor",
			price: 199.99,
			category: "Electronics",
			stock: 15,
			imageUrl:
				"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
			rating: 4.6,
		},
		{
			name: "4K Webcam",
			description:
				"Professional 4K webcam with noise-cancelling microphone",
			price: 159.99,
			category: "Electronics",
			stock: 20,
			imageUrl:
				"https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=300&h=300&fit=crop",
			rating: 4.7,
		},
		{
			name: "Wireless Headphones",
			description:
				"Premium noise-cancelling wireless headphones with 30-hour battery",
			price: 149.99,
			category: "Electronics",
			stock: 20,
			imageUrl:
				"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
			rating: 4.7,
		},
		{
			name: "Tablet",
			description:
				"10-inch display tablet with 128GB storage and stylus support",
			price: 399.99,
			category: "Electronics",
			stock: 12,
			imageUrl:
				"https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=300&fit=crop",
			rating: 4.5,
		},
		{
			name: "Gaming Laptop",
			description:
				"High-performance gaming laptop with RTX 4060 and 16GB RAM",
			price: 899.99,
			category: "Electronics",
			stock: 5,
			imageUrl:
				"https://images.unsplash.com/photo-1588872657840-790ff3bde08c?w=300&h=300&fit=crop",
			rating: 4.8,
		},

		// CLOTHING - Various prices
		{
			name: "Basic T-Shirt",
			description: "100% cotton comfortable basic t-shirt",
			price: 14.99,
			category: "Clothing",
			stock: 120,
			imageUrl:
				"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
			rating: 4.2,
		},
		{
			name: "Jeans",
			description: "Classic blue denim jeans with perfect fit",
			price: 59.99,
			category: "Clothing",
			stock: 70,
			imageUrl:
				"https://images.unsplash.com/photo-1542272604-787c62ff3d1d?w=300&h=300&fit=crop",
			rating: 4.4,
		},
		{
			name: "Designer T-Shirt",
			description: "Premium cotton designer t-shirt with modern print",
			price: 44.99,
			category: "Clothing",
			stock: 50,
			imageUrl:
				"https://images.unsplash.com/photo-1503341338985-b86817e24e4f?w=300&h=300&fit=crop",
			rating: 4.5,
		},
		{
			name: "Hoodie",
			description: "Warm fleece hoodie perfect for cold weather",
			price: 64.99,
			category: "Clothing",
			stock: 40,
			imageUrl:
				"https://images.unsplash.com/photo-1556821552-5ff63b1b6bbb?w=300&h=300&fit=crop",
			rating: 4.6,
		},
		{
			name: "Running Shoes",
			description: "Lightweight running shoes with excellent cushioning",
			price: 99.99,
			category: "Clothing",
			stock: 30,
			imageUrl:
				"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop",
			rating: 4.7,
		},
		{
			name: "Winter Jacket",
			description: "Waterproof winter jacket with thermal lining",
			price: 159.99,
			category: "Clothing",
			stock: 25,
			imageUrl:
				"https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=300&h=300&fit=crop",
			rating: 4.6,
		},
		{
			name: "Formal Suit",
			description:
				"Premium formal suit perfect for business or special occasions",
			price: 299.99,
			category: "Clothing",
			stock: 15,
			imageUrl:
				"https://images.unsplash.com/photo-1519671482677-1d1757bda635?w=300&h=300&fit=crop",
			rating: 4.8,
		},
		{
			name: "Sports Watch",
			description: "Stylish sports watch with water resistance",
			price: 89.99,
			category: "Clothing",
			stock: 45,
			imageUrl:
				"https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&h=300&fit=crop",
			rating: 4.5,
		},

		// BOOKS - Various prices
		{
			name: "JavaScript Basics",
			description:
				"Complete guide to JavaScript programming fundamentals",
			price: 24.99,
			category: "Books",
			stock: 60,
			imageUrl:
				"https://images.unsplash.com/photo-1495446815901-a7297e1bfb58?w=300&h=300&fit=crop",
			rating: 4.5,
		},
		{
			name: "Advanced Python",
			description:
				"Master advanced concepts and techniques in Python programming",
			price: 34.99,
			category: "Books",
			stock: 45,
			imageUrl:
				"https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=300&fit=crop",
			rating: 4.6,
		},
		{
			name: "Web Development Handbook",
			description: "Complete reference for modern web development",
			price: 44.99,
			category: "Books",
			stock: 50,
			imageUrl:
				"https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=300&fit=crop",
			rating: 4.7,
		},
		{
			name: "Cybersecurity Essentials",
			description:
				"Learn fundamental concepts of cybersecurity and ethical hacking",
			price: 59.99,
			category: "Books",
			stock: 30,
			imageUrl:
				"https://images.unsplash.com/photo-1553448068-a17beb5c3d90?w=300&h=300&fit=crop",
			rating: 4.8,
		},
		{
			name: "Machine Learning Guide",
			description:
				"Comprehensive guide to machine learning and AI concepts",
			price: 69.99,
			category: "Books",
			stock: 25,
			imageUrl:
				"https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=300&fit=crop",
			rating: 4.7,
		},
		{
			name: "Database Design",
			description:
				"Master database design patterns and optimization techniques",
			price: 54.99,
			category: "Books",
			stock: 35,
			imageUrl:
				"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=300&fit=crop",
			rating: 4.6,
		},

		// HOME - Various prices
		{
			name: "LED Desk Lamp",
			description:
				"LED desk lamp with adjustable brightness and USB charging",
			price: 34.99,
			category: "Home",
			stock: 40,
			imageUrl:
				"https://images.unsplash.com/photo-1565625733204-6d4ee5752b35?w=300&h=300&fit=crop",
			rating: 4.4,
		},
		{
			name: "Coffee Maker",
			description: "Automatic coffee maker with programmable timer",
			price: 79.99,
			category: "Home",
			stock: 25,
			imageUrl:
				"https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=300&h=300&fit=crop",
			rating: 4.5,
		},
		{
			name: "Desk Organizer",
			description: "Multi-compartment desk organizer for workspace",
			price: 24.99,
			category: "Home",
			stock: 80,
			imageUrl:
				"https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&h=300&fit=crop",
			rating: 4.2,
		},
		{
			name: "Humidifier",
			description: "Ultrasonic humidifier for better air quality",
			price: 54.99,
			category: "Home",
			stock: 35,
			imageUrl:
				"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
			rating: 4.5,
		},
		{
			name: "Desk Chair",
			description:
				"Ergonomic office chair with lumbar support and adjustable height",
			price: 249.99,
			category: "Home",
			stock: 15,
			imageUrl:
				"https://images.unsplash.com/photo-1592078615290-033ee584e267?w=300&h=300&fit=crop",
			rating: 4.7,
		},
		{
			name: "Standing Desk",
			description:
				"Electric standing desk with memory presets and dual motors",
			price: 399.99,
			category: "Home",
			stock: 10,
			imageUrl:
				"https://images.unsplash.com/photo-1593642632540-0605b02df12d?w=300&h=300&fit=crop",
			rating: 4.8,
		},
		{
			name: "Storage Shelves",
			description: "5-tier storage shelves for bedroom or office",
			price: 69.99,
			category: "Home",
			stock: 30,
			imageUrl:
				"https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=300&h=300&fit=crop",
			rating: 4.6,
		},

		// SPORTS - Various prices
		{
			name: "Yoga Mat",
			description: "Non-slip yoga mat with carrying strap",
			price: 29.99,
			category: "Sports",
			stock: 60,
			imageUrl:
				"https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=300&h=300&fit=crop",
			rating: 4.4,
		},
		{
			name: "Dumbbells Set",
			description: "10kg dumbbells set with adjustable weights",
			price: 89.99,
			category: "Sports",
			stock: 25,
			imageUrl:
				"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop",
			rating: 4.6,
		},
		{
			name: "Basketball",
			description: "Professional regulation basketball with grip pattern",
			price: 39.99,
			category: "Sports",
			stock: 50,
			imageUrl:
				"https://images.unsplash.com/photo-1624526267942-ab67cb38a25f?w=300&h=300&fit=crop",
			rating: 4.5,
		},
		{
			name: "Bicycle Helmet",
			description: "Safety certified bicycle helmet with ventilation",
			price: 54.99,
			category: "Sports",
			stock: 40,
			imageUrl:
				"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
			rating: 4.5,
		},
		{
			name: "Tennis Racket",
			description: "Professional tennis racket with comfortable grip",
			price: 119.99,
			category: "Sports",
			stock: 20,
			imageUrl:
				"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&h=300&fit=crop",
			rating: 4.7,
		},
		{
			name: "Exercise Treadmill",
			description:
				"Folding treadmill with digital display and multiple programs",
			price: 599.99,
			category: "Sports",
			stock: 8,
			imageUrl:
				"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop",
			rating: 4.8,
		},
		{
			name: "Swimming Goggles",
			description: "Comfortable swimming goggles with UV protection",
			price: 24.99,
			category: "Sports",
			stock: 70,
			imageUrl:
				"https://images.unsplash.com/photo-1562183241-b0121b6d4e1a?w=300&h=300&fit=crop",
			rating: 4.3,
		},

		// OTHER - Various prices
		{
			name: "Portable Speaker",
			description: "Bluetooth portable speaker with 360 degree sound",
			price: 59.99,
			category: "Other",
			stock: 45,
			imageUrl:
				"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
			rating: 4.6,
		},
		{
			name: "Digital Camera",
			description:
				"20MP digital camera with optical zoom and video recording",
			price: 299.99,
			category: "Other",
			stock: 12,
			imageUrl:
				"https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=300&h=300&fit=crop",
			rating: 4.7,
		},
		{
			name: "Travel Backpack",
			description: "Durable travel backpack with waterproof compartments",
			price: 84.99,
			category: "Other",
			stock: 30,
			imageUrl:
				"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
			rating: 4.6,
		},
		{
			name: "Smart Home Hub",
			description: "Central hub for controlling all smart home devices",
			price: 149.99,
			category: "Other",
			stock: 18,
			imageUrl:
				"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
			rating: 4.7,
		},
		{
			name: "Drone with Camera",
			description:
				"4K drone with GPS, collision avoidance and 30min flight time",
			price: 799.99,
			category: "Other",
			stock: 6,
			imageUrl:
				"https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=300&h=300&fit=crop",
			rating: 4.9,
		},
		{
			name: "🚩 Secret Flag Product 🚩",
			description:
				"A mysterious premium product worth a flag! CTF_FLAG{Secret_Product_Purchased}",
			price: 199.99,
			category: "Secret",
			stock: 1,
			imageUrl:
				"https://images.unsplash.com/photo-1578926314433-d0b3b5b84edf?w=300&h=300&fit=crop",
			rating: 5.0,
			isSecret: true,
			privateData:
				"🎉 Congratulations! You unlocked the secret flag: CTF_FLAG{Premium_Product_Buyer_2026} - You are now a true CTF master!",
		},
	];

	try {
		// Clear existing products
		await Product.deleteMany({});
		console.log("Cleared existing products");

		// Insert seed products
		await Product.insertMany(products);
		console.log(`✅ Seeded ${products.length} products successfully`);

		// Display products
		const allProducts = await Product.find();
		console.log("\n📦 Products created:");
		allProducts.forEach((p) => {
			console.log(`  • ${p.name} - $${p.price} (${p.stock} in stock)`);
		});
	} catch (error) {
		console.error("Error seeding products:", error);
	} finally {
		mongoose.connection.close();
	}
};

connectDB().then(() => seedProducts());
