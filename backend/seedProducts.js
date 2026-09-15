const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Product = require("./models/Product");

dotenv.config();

const products = [
  {
    brand: "TRENDY WEAR",
    name: "Women Relaxed Fit Top",
    description: "Stylish relaxed fit top for women.",
    price: 899,
    category: "Women",
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80",
    stock: 20,
    sizes: ["S", "M", "L", "XL"],
    color: "Pink",
  },
  {
    brand: "URBAN STYLE",
    name: "Men Casual Shirt",
    description: "Comfortable casual shirt for men.",
    price: 1299,
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
    stock: 20,
    sizes: ["S", "M", "L", "XL"],
    color: "Blue",
  },
  {
    brand: "FASHION HUB",
    name: "Women Straight Fit Jeans",
    description: "Classic straight fit jeans for women.",
    price: 1599,
    category: "Women",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
    stock: 15,
    sizes: ["28", "30", "32", "34"],
    color: "Blue",
  },
  {
    brand: "STYLE HOUSE",
    name: "Men Slim Fit T-Shirt",
    description: "Comfortable slim fit t-shirt for men.",
    price: 799,
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
    stock: 25,
    sizes: ["S", "M", "L", "XL"],
    color: "White",
  },
  {
    brand: "MODERN LOOK",
    name: "Women Floral Dress",
    description: "Elegant floral dress for women.",
    price: 1899,
    category: "Women",
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
    stock: 12,
    sizes: ["S", "M", "L", "XL"],
    color: "Floral",
  },
  {
    brand: "URBAN EDGE",
    name: "Men Regular Fit Jeans",
    description: "Regular fit denim jeans for men.",
    price: 1499,
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80",
    stock: 18,
    sizes: ["30", "32", "34", "36"],
    color: "Blue",
  },
  {
    brand: "DAILY STYLE",
    name: "Men Casual Sneakers",
    description: "Everyday casual sneakers for men.",
    price: 1999,
    category: "Men",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    stock: 15,
    sizes: ["7", "8", "9", "10"],
    color: "Red",
  },
  {
    brand: "KIDS WORLD",
    name: "Boys Casual T-Shirt & Shorts Set",
    description: "Comfortable casual outfit set for boys.",
    price: 899,
    category: "Kids",
    image:
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=600&q=80",
    stock: 20,
    sizes: ["2Y", "4Y", "6Y", "8Y"],
    color: "Blue",
  },
  {
    brand: "LITTLE STYLE",
    name: "Girls Floral Party Dress",
    description: "Beautiful floral party dress for girls.",
    price: 1299,
    category: "Kids",
    image:
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80",
    stock: 15,
    sizes: ["2Y", "4Y", "6Y", "8Y"],
    color: "Pink",
  },
  {
    brand: "MINI TREND",
    name: "Kids Denim Jacket & Jeans Set",
    description: "Trendy denim jacket and jeans set for kids.",
    price: 1499,
    category: "Kids",
    image:
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80",
    stock: 10,
    sizes: ["4Y", "6Y", "8Y", "10Y"],
    color: "Blue",
  },
  {
    brand: "MINIMALIST",
    name: "Niacinamide 5% Face Serum",
    description: "Daily face serum with niacinamide.",
    price: 599,
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
    stock: 30,
    sizes: [],
    color: "Clear",
  },
  {
    brand: "LAKME",
    name: "Matte Liquid Lipstick",
    description: "Long-lasting matte liquid lipstick.",
    price: 499,
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
    stock: 25,
    sizes: [],
    color: "Red",
  },
  {
    brand: "L'OREAL PARIS",
    name: "Moisturizing Shampoo",
    description: "Moisturizing shampoo for smooth and healthy-looking hair.",
    price: 699,
    category: "Beauty",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=600&q=80",
    stock: 25,
    sizes: [],
    color: "White",
  },
  {
    brand: "DIESEL",
    name: "Only The Brave Eau De Toilette",
    description: "Premium fragrance for a bold and confident style.",
    price: 5368,
    category: "AJIO Luxe",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80",
    stock: 10,
    sizes: [],
    color: "Black",
  },
  {
    brand: "EMPORIO ARMANI",
    name: "Luxury Eau De Parfum",
    description: "Premium luxury fragrance with an elegant aroma.",
    price: 9800,
    category: "AJIO Luxe",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
    stock: 8,
    sizes: [],
    color: "Gold",
  },
  {
    brand: "JUICY COUTURE",
    name: "Viva La Rose Eau De Parfum",
    description: "Elegant floral fragrance with a luxurious feel.",
    price: 3570,
    category: "AJIO Luxe",
    image:
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=600&q=80",
    stock: 10,
    sizes: [],
    color: "Pink",
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    // Remove existing products before inserting
    await Product.deleteMany({});

    console.log("Existing products cleared");

    const createdProducts = await Product.insertMany(products);

    console.log(
      `${createdProducts.length} products inserted successfully`
    );

    process.exit(0);
  } catch (error) {
    console.error("Product seeding failed:", error.message);
    process.exit(1);
  }
};

seedProducts();