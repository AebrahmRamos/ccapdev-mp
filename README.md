# DLSU Coffee Crawl
## INTRODUCTION
DLSU Coffee Crawl is a web application developed for CCAPDEV COURSE. It is dedicated to helping coffee enthusiasts discover the best coffee spot around De La Salle University. Users can browse cafes, and read and submit reviews. Cafe on the other hand can create a cafe page for their business and update their operating hours, photos, and other information.

## TECHNOLOGY STACK
- React with Vite and React Router
- Node.js and Express.js
- MongoDB with Mongoose
- JWT
- bcrypt
- expess-validator
- Axios
- Framer
- Material UI

## INSTALLATION
### Prerequisites
- Node.js with v14 and up
- MongoDB local or atlas
- npm or yarn

### Setup
1. Clone the repository
```
git clone https://github.com/yourusername/ccapdev-mp.git
cd ccapdev-mp
```
2. Install dependencies
```
npm install
```
```
cd client
npm install
```
3. Create a `config.env` under `server` directory with the following variables
```
PORT=5500
ATLAS_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
4. Start the application
```
# Run the server (from the root directory)
node server/server.cjs

# Run the client (in a separate terminal)
npm run dev
```
5. Open `http://localhost:5173`

## API ENDPOINTS
### Authentication
- `POST /api/login` - User login
- `POST /api/signup/student` - Student signup
- `POST /api/signup/cafe-owner` - Cafe owner signup

### Users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Cafes
- `GET /api/cafes` - Get all cafes
- `GET /api/cafes/:slug` - Get cafe by slug
- `GET /api/cafe` - Get current user's cafe (for cafe owners)
- `PUT /api/cafes/:slug` - Update cafe
- `DELETE /api/cafes/:slug` - Delete cafe

### Reviews
- `POST /api/review`s - Create review
- `GET /api/reviews/cafe/:cafeId` - Get reviews for a cafe
- `GET /api/reviews/user/:userId` - Get reviews by a user
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `PUT /api/reviews/:id/helpful` - Toggle helpful vote

### Images
- `POST /api/upload` - Upload image
- `GET /api/images/:id` - Get image

## Project Structure
```
ccapdev-mp/
├── public/             # Static files
├── server/             # Backend code || Store local.env here
│   ├── Models/         # Mongoose schemas
│   └── server.cjs      # Express server
├── src/                # Frontend code
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── styles/         # CSS files
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main component
│   └── main.jsx        # Entry point
├── package.json        # Dependencies
└── vite.config.js      # Vite configuration
```