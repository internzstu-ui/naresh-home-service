// server.js - Express Backend for NexHome AI Home Services
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '.')));

// In-memory database (replace with real database in production)
let database = {
    users: [],
    bookings: [],
    services: [],
    aiAnalytics: []
};

// Initialize services data
database.services = [
    {
        id: 'cleaning',
        name: 'AI Cleaning',
        description: 'Smart scheduling, robotic cleaners, and professional teams',
        basePrice: 99,
        features: ['Robotic vacuum & mop', 'Professional deep cleaning', 'Smart scheduling', 'Real-time tracking']
    },
    {
        id: 'maintenance',
        name: 'Smart Maintenance',
        description: 'Predictive maintenance using IoT sensors and AI',
        basePrice: 149,
        features: ['Predictive diagnostics', '24/7 monitoring', 'Emergency response', 'Preventive plans']
    },
    {
        id: 'automation',
        name: 'Home Automation',
        description: 'Complete smart home setup and integration',
        basePrice: 299,
        features: ['Smart device installation', 'Voice control', 'Custom routines', 'Energy optimization']
    },
    {
        id: 'garden',
        name: 'Garden Care',
        description: 'AI-powered irrigation and landscaping',
        basePrice: 129,
        features: ['Smart irrigation', 'Lawn maintenance', 'Plant monitoring', 'Landscaping design']
    },
    {
        id: 'security',
        name: 'Security Monitoring',
        description: 'AI-driven security with facial recognition',
        basePrice: 199,
        features: ['24/7 AI monitoring', 'Facial recognition', 'Intrusion detection', 'Emergency dispatch']
    },
    {
        id: 'energy',
        name: 'Energy Management',
        description: 'Optimize energy consumption with AI analytics',
        basePrice: 89,
        features: ['Usage analytics', 'Smart thermostat', 'Solar optimization', 'Cost reduction']
    }
];

// ==================== ROUTES ====================

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ==================== USER ROUTES ====================

// Register new user
app.post('/api/users/register', async (req, res) => {
    try {
        const { email, password, name, phone, address } = req.body;
        
        // Check if user already exists
        const existingUser = database.users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        const newUser = {
            id: generateId(),
            email,
            password: hashPassword(password), // In production, use bcrypt
            name,
            phone,
            address,
            plan: 'starter',
            createdAt: new Date().toISOString(),
            isActive: true
        };
        
        database.users.push(newUser);
        
        // Don't send password back
        const { password: _, ...userWithoutPassword } = newUser;
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login user
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = database.users.find(u => u.email === email);
        if (!user || user.password !== hashPassword(password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Generate token (in production, use JWT)
        const token = generateToken();
        
        const { password: _, ...userWithoutPassword } = user;
        
        res.json({
            success: true,
            message: 'Login successful',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user profile
app.get('/api/users/:userId', (req, res) => {
    try {
        const user = database.users.find(u => u.id === req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user profile
app.put('/api/users/:userId', (req, res) => {
    try {
        const userIndex = database.users.findIndex(u => u.id === req.params.userId);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const updatedUser = {
            ...database.users[userIndex],
            ...req.body,
            updatedAt: new Date().toISOString()
        };
        
        database.users[userIndex] = updatedUser;
        
        const { password: _, ...userWithoutPassword } = updatedUser;
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: userWithoutPassword
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== BOOKING ROUTES ====================

// Create new booking
app.post('/api/bookings', async (req, res) => {
    try {
        const { userId, serviceId, date, time, address, notes } = req.body;
        
        // Validate service exists
        const service = database.services.find(s => s.id === serviceId);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        
        const newBooking = {
            id: generateId(),
            userId,
            serviceId,
            serviceName: service.name,
            date,
            time,
            address,
            notes,
            status: 'pending',
            price: service.basePrice,
            createdAt: new Date().toISOString(),
            aiOptimized: false
        };
        
        database.bookings.push(newBooking);
        
        // Trigger AI optimization
        const optimizedBooking = await aiOptimizeBooking(newBooking);
        
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking: optimizedBooking
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all bookings for a user
app.get('/api/bookings/user/:userId', (req, res) => {
    try {
        const userBookings = database.bookings.filter(b => b.userId === req.params.userId);
        res.json({
            success: true,
            bookings: userBookings
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get booking by ID
app.get('/api/bookings/:bookingId', (req, res) => {
    try {
        const booking = database.bookings.find(b => b.id === req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update booking
app.put('/api/bookings/:bookingId', (req, res) => {
    try {
        const bookingIndex = database.bookings.findIndex(b => b.id === req.params.bookingId);
        if (bookingIndex === -1) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        const updatedBooking = {
            ...database.bookings[bookingIndex],
            ...req.body,
            updatedAt: new Date().toISOString()
        };
        
        database.bookings[bookingIndex] = updatedBooking;
        
        res.json({
            success: true,
            message: 'Booking updated successfully',
            booking: updatedBooking
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cancel booking
app.delete('/api/bookings/:bookingId', (req, res) => {
    try {
        const bookingIndex = database.bookings.findIndex(b => b.id === req.params.bookingId);
        if (bookingIndex === -1) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        database.bookings[bookingIndex].status = 'cancelled';
        database.bookings[bookingIndex].cancelledAt = new Date().toISOString();
        
        res.json({
            success: true,
            message: 'Booking cancelled successfully'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== SERVICE ROUTES ====================

// Get all services
app.get('/api/services', (req, res) => {
    try {
        res.json({
            success: true,
            services: database.services
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get service by ID
app.get('/api/services/:serviceId', (req, res) => {
    try {
        const service = database.services.find(s => s.id === req.params.serviceId);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== AI ROUTES ====================

// AI-powered booking optimization
app.post('/api/ai/optimize-booking', async (req, res) => {
    try {
        const { bookingId } = req.body;
        
        const booking = database.bookings.find(b => b.id === bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        const optimizedBooking = await aiOptimizeBooking(booking);
        
        res.json({
            success: true,
            message: 'Booking optimized successfully',
            booking: optimizedBooking
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// AI scheduling recommendations
app.post('/api/ai/recommend-schedule', async (req, res) => {
    try {
        const { userId, serviceId, preferences } = req.body;
        
        const recommendations = await aiRecommendSchedule(userId, serviceId, preferences);
        
        res.json({
            success: true,
            recommendations
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// AI analytics for user
app.get('/api/ai/analytics/:userId', async (req, res) => {
    try {
        const analytics = await generateUserAnalytics(req.params.userId);
        
        res.json({
            success: true,
            analytics
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Predictive maintenance check
app.post('/api/ai/predictive-maintenance', async (req, res) => {
    try {
        const { homeId, sensorData } = req.body;
        
        const predictions = await predictMaintenanceNeeds(homeId, sensorData);
        
        res.json({
            success: true,
            predictions
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== CONTACT ROUTE ====================

app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // In production, send email via SendGrid, AWS SES, etc.
        console.log('Contact form submission:', { name, email, subject, message });
        
        res.json({
            success: true,
            message: 'Thank you for contacting us! We\'ll get back to you within 24 hours.'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== AI SIMULATION FUNCTIONS ====================

async function aiOptimizeBooking(booking) {
    // Simulate AI processing delay
    await sleep(1000);
    
    // AI optimization logic
    const optimizations = {
        suggestedTime: optimizeTimeSlot(booking.date, booking.time),
        estimatedDuration: estimateDuration(booking.serviceId),
        routeOptimization: calculateOptimalRoute(booking.address),
        costOptimization: calculateOptimalCost(booking.price),
        aiScore: Math.random() * 100
    };
    
    const optimizedBooking = {
        ...booking,
        ...optimizations,
        aiOptimized: true,
        optimizedAt: new Date().toISOString()
    };
    
    // Update in database
    const bookingIndex = database.bookings.findIndex(b => b.id === booking.id);
    if (bookingIndex !== -1) {
        database.bookings[bookingIndex] = optimizedBooking;
    }
    
    return optimizedBooking;
}

async function aiRecommendSchedule(userId, serviceId, preferences) {
    await sleep(500);
    
    // AI generates recommendations based on user history and preferences
    const recommendations = [];
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (let i = 0; i < 3; i++) {
        const dayIndex = Math.floor(Math.random() * 7);
        const hour = Math.floor(Math.random() * 8) + 9; // 9 AM to 5 PM
        
        recommendations.push({
            date: getNextDayOfWeek(dayIndex),
            time: `${hour}:00`,
            day: daysOfWeek[dayIndex],
            confidence: Math.random() * 30 + 70, // 70-100%
            reason: generateRecommendationReason()
        });
    }
    
    return recommendations;
}

async function generateUserAnalytics(userId) {
    await sleep(300);
    
    const userBookings = database.bookings.filter(b => b.userId === userId);
    
    return {
        totalBookings: userBookings.length,
        completedBookings: userBookings.filter(b => b.status === 'completed').length,
        totalSpent: userBookings.reduce((sum, b) => sum + (b.price || 0), 0),
        mostUsedService: getMostUsedService(userBookings),
        averageRating: 4.7,
        savings: {
            energySaved: Math.floor(Math.random() * 500) + 200,
            timeSaved: Math.floor(Math.random() * 50) + 20,
            moneySaved: Math.floor(Math.random() * 1000) + 500
        },
        recommendations: [
            'Consider upgrading to Professional plan for better rates',
            'Smart maintenance due in 2 weeks',
            'Energy optimization could save you $50/month'
        ]
    };
}

async function predictMaintenanceNeeds(homeId, sensorData) {
    await sleep(800);
    
    // AI analyzes sensor data and predicts maintenance needs
    return {
        predictions: [
            {
                system: 'HVAC',
                priority: 'medium',
                predictedIssue: 'Filter replacement needed',
                confidence: 85,
                estimatedDate: getDateInFuture(14),
                estimatedCost: 75
            },
            {
                system: 'Plumbing',
                priority: 'low',
                predictedIssue: 'Minor leak detection',
                confidence: 62,
                estimatedDate: getDateInFuture(30),
                estimatedCost: 150
            },
            {
                system: 'Electrical',
                priority: 'low',
                predictedIssue: 'Circuit optimization recommended',
                confidence: 71,
                estimatedDate: getDateInFuture(45),
                estimatedCost: 200
            }
        ],
        overallHealth: 87,
        lastAnalyzed: new Date().toISOString()
    };
}

// ==================== UTILITY FUNCTIONS ====================

function generateId() {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function generateToken() {
    return 'token-' + Math.random().toString(36).substr(2) + Date.now().toString(36);
}

function hashPassword(password) {
    // Simple hash for demo - use bcrypt in production
    return Buffer.from(password).toString('base64');
}

function optimizeTimeSlot(date, time) {
    const hours = parseInt(time.split(':')[0]);
    const optimizedHour = hours < 12 ? 10 : 14;
    return `${optimizedHour}:00`;
}

function estimateDuration(serviceId) {
    const durations = {
        cleaning: 120,
        maintenance: 90,
        automation: 180,
        garden: 150,
        security: 120,
        energy: 60
    };
    return durations[serviceId] || 90;
}

function calculateOptimalRoute(address) {
    return {
        distance: Math.random() * 20 + 5,
        estimatedTravelTime: Math.floor(Math.random() * 30) + 15,
        optimized: true
    };
}

function calculateOptimalCost(basePrice) {
    const discount = Math.random() * 0.15; // 0-15% discount
    return Math.round(basePrice * (1 - discount));
}

function getMostUsedService(bookings) {
    const serviceCounts = {};
    bookings.forEach(b => {
        serviceCounts[b.serviceId] = (serviceCounts[b.serviceId] || 0) + 1;
    });
    const maxCount = Math.max(...Object.values(serviceCounts));
    const mostUsed = Object.keys(serviceCounts).find(key => serviceCounts[key] === maxCount);
    return mostUsed || 'none';
}

function getNextDayOfWeek(dayIndex) {
    const today = new Date();
    const daysUntil = (dayIndex - today.getDay() + 7) % 7 || 7;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysUntil);
    return targetDate.toISOString().split('T')[0];
}

function getDateInFuture(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

function generateRecommendationReason() {
    const reasons = [
        'Based on your past preferences',
        'Optimal weather conditions predicted',
        'Lower service demand during this time',
        'Best availability of premium technicians',
        'Energy-efficient time slot'
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════════════════╗
    ║   NexHome AI Home Services Backend Server     ║
    ║   Server running on http://localhost:${PORT}    ║
    ╚═══════════════════════════════════════════════╝
    
    Available endpoints:
    - GET    /                           (Frontend)
    - POST   /api/users/register         (Register user)
    - POST   /api/users/login            (Login user)
    - GET    /api/users/:userId          (Get user profile)
    - PUT    /api/users/:userId          (Update user profile)
    - POST   /api/bookings               (Create booking)
    - GET    /api/bookings/user/:userId  (Get user bookings)
    - GET    /api/bookings/:bookingId    (Get booking)
    - PUT    /api/bookings/:bookingId    (Update booking)
    - DELETE /api/bookings/:bookingId    (Cancel booking)
    - GET    /api/services               (Get all services)
    - GET    /api/services/:serviceId    (Get service)
    - POST   /api/ai/optimize-booking    (AI optimize)
    - POST   /api/ai/recommend-schedule  (AI recommendations)
    - GET    /api/ai/analytics/:userId   (User analytics)
    - POST   /api/ai/predictive-maintenance (Predictive maintenance)
    - POST   /api/contact                (Contact form)
    `);
});

module.exports = app;
