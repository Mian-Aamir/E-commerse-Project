require('dotenv').config();
const connectDB = require('./config/db');
const Category = require('./models/Category');

// Reuses the same image paths already sitting in client/public,
// so the existing look is preserved after switching to the backend.
const initialCategories = [
  { name: "Electronics", image: "/category-electronics.png" },
  { name: "Clothes and Wear", image: "/category-clothes.png" },
  { name: "Home Interiors", image: "/category-home.png" },
  { name: "Books and Magazines", image: "/category-books.png" },
  { name: "Tools Equipment", image: "/category-tools.png" },
  { name: "Sports and Outdoor", image: "/category-sports.png" },
  { name: "Animal and Pets", image: "/category-pets.png" },
  { name: "Toys for Kids", image: "/category-toys.png" },
];

const seedCategories = async () => {
  try {
    await connectDB();
    await Category.deleteMany({});
    const created = await Category.insertMany(initialCategories);
    console.log(`${created.length} categories seeded successfully`);
    process.exit();
  } catch (error) {
    console.error('Error seeding categories:', error.message);
    process.exit(1);
  }
};

seedCategories();