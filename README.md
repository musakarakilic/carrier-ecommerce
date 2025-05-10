# E-Commerce Platform

A full-stack e-commerce application with a Vue.js frontend and Node.js/Express backend.

## Project Structure

This project is organized into two main directories:

- `client/`: Frontend Vue.js application
- `server/`: Backend Node.js/Express API

## Features

- User authentication and authorization
- Product browsing and searching
- Shopping cart functionality
- Order processing
- Payment integration with Stripe
- Admin dashboard for managing products, orders, and users
- Product categories and collections
- Brand management
- User profiles
- File uploads for product images and user avatars
- Subscription system

## Technology Stack

### Frontend (Client)

- **Vue.js 3**: Progressive JavaScript framework
- **Vite**: Next-generation frontend tooling
- **Pinia**: State management
- **Vue Router**: Routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client
- **Stripe.js**: Payment processing
- **Vue Toastification**: Toast notifications

### Backend (Server)

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **Multer**: File uploads
- **Stripe API**: Payment processing
- **Express Validator**: Input validation

## Setup and Installation

### Prerequisites

- Node.js (v14+)
- MongoDB
- Stripe account (for payment integration)

### Client Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with the following variables:
# VITE_API_URL=https://carrier-ecommerce.onrender.com/api

# Start development server
npm run dev
```

### Server Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with the following variables:
# PORT=5000
# MONGODB_URI=your_mongodb_atlas_uri
# JWT_SECRET=your_jwt_secret
# STRIPE_SECRET_KEY=your_stripe_secret_key
# FRONTEND_URL=https://carrier-ecommerce.vercel.app

# Start development server
npm run dev

# To seed the database with initial data
npm run seed:all
```

## API Endpoints

The backend provides RESTful APIs for:

- Authentication (`/api/auth`)
- Products (`/api/products`)
- Categories (`/api/categories`)
- Users (`/api/users`)
- Orders (`/api/orders`)
- Payments (`/api/payments`)
- Collections (`/api/collections`)
- Brands (`/api/brands`)
- Subscriptions (`/api/subscriptions`)
- File Uploads (`/api/uploads`)

## Project Structure Details

### Client Structure

```
client/
├── public/           # Static files
├── src/
│   ├── assets/       # Images, fonts, etc.
│   ├── components/   # Reusable Vue components
│   ├── layouts/      # Page layouts
│   ├── router/       # Vue Router configuration
│   ├── services/     # API services
│   ├── stores/       # Pinia stores
│   ├── utils/        # Utility functions
│   ├── views/        # Page components
│   ├── App.vue       # Root component
│   └── main.js       # Application entry point
├── .env              # Environment variables
└── package.json      # Dependencies and scripts
```

### Server Structure

```
server/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middlewares/      # Express middlewares
├── models/           # Mongoose models
├── routes/           # API routes
├── scripts/          # Utility scripts
├── seeder/           # Database seeders
├── services/         # Business logic
├── uploads/          # Uploaded files
├── utils/            # Utility functions
├── .env              # Environment variables
└── server.js         # Server entry point
```

## Deployment

### Client Deployment

```bash
# Build for production
cd client
npm run build

# The build output will be in the dist/ directory
# which can be deployed to a static hosting service
```

### Server Deployment

```bash
# Start production server
cd server
npm start
```

## License

This project is open source and available under the [MIT License](LICENSE). 