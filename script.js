// Global State
const app = {
    bookings: [],
    users: [],
    currentUser: null
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadDataFromLocalStorage();
});

function initializeApp() {
    console.log('NexHome AI Home Services initialized');
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        app.currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
}

// Event Listeners
function setupEventListeners() {
    // Form Submissions
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

// Modal Functions
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function showSignupModal() {
    closeModal('loginModal');
    alert('Signup functionality would be implemented here. For now, use the demo login.');
}

function showBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Set minimum date to today
    const dateInput = document.getElementById('bookingDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Mobile Menu
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navActions.style.display = navActions.style.display === 'flex' ? 'none' : 'flex';
}

// Form Handlers
function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };
    
    // Simulate API call
    console.log('Contact form submitted:', formData);
    
    // Show success message
    showNotification('Thank you for contacting us! We\'ll get back to you within 24 hours.', 'success');
    
    // Reset form
    e.target.reset();
}

function handleLoginSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simulate authentication (in production, this would be a backend API call)
    if (email && password) {
        const user = {
            id: generateId(),
            email: email,
            name: email.split('@')[0],
            registeredAt: new Date().toISOString()
        };
        
        app.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        closeModal('loginModal');
        updateUIForLoggedInUser();
        showNotification(`Welcome back, ${user.name}!`, 'success');
    } else {
        showNotification('Please enter valid credentials', 'error');
    }
}

function handleBookingSubmit(e) {
    e.preventDefault();
    
    const booking = {
        id: generateId(),
        service: document.getElementById('bookingService').value,
        date: document.getElementById('bookingDate').value,
        time: document.getElementById('bookingTime').value,
        address: document.getElementById('bookingAddress').value,
        notes: document.getElementById('bookingNotes').value,
        status: 'pending',
        createdAt: new Date().toISOString(),
        userId: app.currentUser ? app.currentUser.id : null
    };
    
    // Add to bookings array
    app.bookings.push(booking);
    saveDataToLocalStorage();
    
    // Simulate AI processing
    processBookingWithAI(booking);
    
    closeModal('bookingModal');
    showNotification('Booking confirmed! Our AI is optimizing your service schedule.', 'success');
    
    // Reset form
    e.target.reset();
    
    // Show booking details
    setTimeout(() => {
        showBookingConfirmation(booking);
    }, 1000);
}

// AI Processing Simulation
function processBookingWithAI(booking) {
    console.log('AI Processing booking:', booking);
    
    // Simulate AI optimization
    const optimizations = [
        'Analyzing your home layout...',
        'Finding optimal service time...',
        'Matching with best service provider...',
        'Setting up smart notifications...'
    ];
    
    let delay = 500;
    optimizations.forEach((message, index) => {
        setTimeout(() => {
            console.log(`AI: ${message}`);
        }, delay * (index + 1));
    });
}

// Service Booking Functions
function bookService(serviceType) {
    showBookingModal();
    
    // Pre-select the service in the form
    const serviceSelect = document.getElementById('bookingService');
    serviceSelect.value = serviceType;
}

function selectPlan(planType) {
    if (planType === 'enterprise') {
        showNotification('Redirecting to enterprise contact form...', 'info');
        setTimeout(() => {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }, 1000);
    } else {
        showBookingModal();
        showNotification(`Selected ${planType} plan. Complete booking to proceed.`, 'info');
    }
}

// Booking Confirmation
function showBookingConfirmation(booking) {
    const confirmationMessage = `
        📅 Booking Confirmed!
        
        Service: ${formatServiceName(booking.service)}
        Date: ${formatDate(booking.date)}
        Time: ${booking.time}
        Address: ${booking.address}
        
        You'll receive a confirmation email shortly with all the details.
    `;
    
    alert(confirmationMessage);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#06D6A0' : type === 'error' ? '#FF6B35' : '#004E89'};
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// UI Updates
function updateUIForLoggedInUser() {
    if (app.currentUser) {
        const loginBtn = document.querySelector('.btn-secondary');
        if (loginBtn) {
            loginBtn.textContent = app.currentUser.name;
            loginBtn.onclick = showUserMenu;
        }
    }
}

function showUserMenu() {
    const menu = `
        User: ${app.currentUser.email}
        Bookings: ${app.bookings.filter(b => b.userId === app.currentUser.id).length}
        
        [View Dashboard] [Logout]
    `;
    
    if (confirm(menu + '\n\nLogout?')) {
        logout();
    }
}

function logout() {
    app.currentUser = null;
    localStorage.removeItem('currentUser');
    location.reload();
}

// Data Persistence
function saveDataToLocalStorage() {
    localStorage.setItem('bookings', JSON.stringify(app.bookings));
    localStorage.setItem('users', JSON.stringify(app.users));
}

function loadDataFromLocalStorage() {
    const bookings = localStorage.getItem('bookings');
    const users = localStorage.getItem('users');
    
    if (bookings) {
        app.bookings = JSON.parse(bookings);
    }
    
    if (users) {
        app.users = JSON.parse(users);
    }
}

// Utility Functions
function generateId() {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function formatServiceName(service) {
    const serviceNames = {
        'cleaning': 'AI Cleaning',
        'maintenance': 'Smart Maintenance',
        'automation': 'Home Automation',
        'garden': 'Garden Care',
        'security': 'Security Monitoring',
        'energy': 'Energy Management'
    };
    return serviceNames[service] || service;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Animation Effects
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.service-card, .step-item, .pricing-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// Initialize animations after DOM loads
setTimeout(initScrollAnimations, 100);

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export for potential use in backend
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { app };
}
