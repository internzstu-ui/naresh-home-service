# naresh-home-service[README.md](https://github.com/user-attachments/files/25225995/README.md)
# NexHome - AI Automated Home Services Platform

A full-stack web application for AI-powered home services including cleaning, maintenance, automation, security, garden care, and energy management.

## 🚀 Features

### Frontend
- **Modern UI/UX**: Bold, distinctive design with smooth animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Interactive Components**: Dynamic service cards, pricing plans, and booking system
- **Real-time Updates**: Live notifications and booking confirmations
- **User Authentication**: Login/signup modals with session management
- **Service Booking**: Easy-to-use booking interface with date/time selection

### Backend
- **RESTful API**: Complete CRUD operations for users, bookings, and services
- **AI Integration**: 
  - Smart booking optimization
  - Predictive maintenance analysis
  - Schedule recommendations
  - User analytics and insights
- **Data Persistence**: In-memory storage (easily upgradeable to MongoDB/PostgreSQL)
- **Security**: Password hashing and token-based authentication

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone or download the files**
   ```bash
   # Navigate to the project directory
   cd nexhome-ai-services
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
nexhome-ai-services/
├── index.html          # Main HTML file
├── styles.css          # Complete CSS styling
├── script.js           # Frontend JavaScript
├── server.js           # Backend Express server
├── package.json        # Node.js dependencies
└── README.md          # This file
```

## 🔌 API Endpoints

### User Management

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

#### Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get User Profile
```http
GET /api/users/:userId
```

#### Update User Profile
```http
PUT /api/users/:userId
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "+1987654321"
}
```

### Booking Management

#### Create Booking
```http
POST /api/bookings
Content-Type: application/json

{
  "userId": "user-id",
  "serviceId": "cleaning",
  "date": "2026-03-15",
  "time": "10:00",
  "address": "123 Main St",
  "notes": "Please use eco-friendly products"
}
```

#### Get User Bookings
```http
GET /api/bookings/user/:userId
```

#### Get Booking Details
```http
GET /api/bookings/:bookingId
```

#### Update Booking
```http
PUT /api/bookings/:bookingId
Content-Type: application/json

{
  "date": "2026-03-16",
  "time": "14:00"
}
```

#### Cancel Booking
```http
DELETE /api/bookings/:bookingId
```

### Service Management

#### Get All Services
```http
GET /api/services
```

#### Get Service Details
```http
GET /api/services/:serviceId
```

### AI Features

#### Optimize Booking
```http
POST /api/ai/optimize-booking
Content-Type: application/json

{
  "bookingId": "booking-id"
}
```

#### Get Schedule Recommendations
```http
POST /api/ai/recommend-schedule
Content-Type: application/json

{
  "userId": "user-id",
  "serviceId": "cleaning",
  "preferences": {
    "preferredDays": ["Monday", "Wednesday"],
    "preferredTime": "morning"
  }
}
```

#### Get User Analytics
```http
GET /api/ai/analytics/:userId
```

#### Predictive Maintenance
```http
POST /api/ai/predictive-maintenance
Content-Type: application/json

{
  "homeId": "home-id",
  "sensorData": {
    "temperature": 72,
    "humidity": 45,
    "airQuality": 85
  }
}
```

### Contact Form

#### Submit Contact Form
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about services",
  "message": "I would like to know more..."
}
```

## 🎨 Design Features

- **Bold Typography**: Uses Dela Gothic One for headlines and Outfit for body text
- **Vibrant Color Palette**: Orange (#FF6B35) primary, Blue (#004E89) secondary
- **Smooth Animations**: Fade-ins, slide-ups, and hover effects
- **Gradient Backgrounds**: Dynamic orb animations in hero section
- **3D Device Mockup**: Perspective transforms on hero device
- **Custom Icons**: SVG icons throughout the interface
- **Responsive Grid**: CSS Grid and Flexbox for layouts

## 🤖 AI Capabilities

The platform simulates various AI features:

1. **Smart Scheduling**: Optimizes booking times based on user preferences and service availability
2. **Predictive Maintenance**: Analyzes patterns to predict when maintenance will be needed
3. **Cost Optimization**: Suggests optimal pricing based on demand and availability
4. **Route Optimization**: Calculates best routes for service providers
5. **User Analytics**: Generates insights on usage patterns, savings, and recommendations

## 🔒 Security Considerations

For production deployment, implement:

- Real database (MongoDB, PostgreSQL)
- Proper password hashing (bcrypt)
- JWT tokens for authentication
- HTTPS encryption
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Environment variables for secrets
- SQL injection prevention
- XSS protection

## 🚀 Production Deployment

### Option 1: Traditional Hosting (DigitalOcean, AWS, Heroku)

1. Set up a server
2. Install Node.js
3. Clone the repository
4. Install dependencies: `npm install`
5. Set environment variables
6. Start with PM2: `pm2 start server.js`

### Option 2: Docker

```dockerfile
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Option 3: Serverless (Vercel, Netlify)

Deploy frontend to Vercel/Netlify and backend to AWS Lambda or similar.

## 📝 Environment Variables

Create a `.env` file:

```env
PORT=3000
NODE_ENV=production
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
EMAIL_API_KEY=your_email_api_key
```

## 🧪 Testing

Add tests using Jest or Mocha:

```bash
npm install --save-dev jest supertest
npm test
```

## 📦 Database Integration

To add MongoDB:

```bash
npm install mongoose
```

```javascript
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);
```

To add PostgreSQL:

```bash
npm install pg sequelize
```

## 🔄 Future Enhancements

- [ ] Real AI/ML integration
- [ ] Payment processing (Stripe)
- [ ] Email notifications (SendGrid)
- [ ] SMS notifications (Twilio)
- [ ] Real-time chat support
- [ ] Mobile app (React Native)
- [ ] IoT device integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Video consultation feature

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions welcome! Please feel free to submit pull requests.

## 📧 Support

For support, email support@nexhome.ai or visit our contact page.

## 🌟 Acknowledgments

- Design inspired by modern SaaS platforms
- Icons from custom SVG library
- Fonts from Google Fonts (Outfit, Dela Gothic One)

---

Built with ❤️ by the NexHome Team
