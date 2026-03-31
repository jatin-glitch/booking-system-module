# Booking System API

A production-ready Slot Booking System built with Node.js, Express, and MongoDB, implementing clean architecture principles with robust concurrency handling.

## Features

- **Slot Management**: Create and manage time slots with date/time validation
- **Atomic Booking Operations**: Prevent double booking with MongoDB transactions
- **Clean Architecture**: MVC pattern with separated concerns
- **Comprehensive Validation**: Input validation with Joi middleware
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Logging**: Structured logging for debugging and monitoring
- **Performance Optimized**: Database indexes and lean queries

## Architecture

```
booking-system/
├── controllers/          # Request/response handlers
├── services/            # Business logic layer
├── models/              # Mongoose schemas
├── routes/              # API route definitions
├── middlewares/         # Validation and error handling
├── utils/               # Utility functions (logger)
├── config/              # Database configuration
├── app.js               # Express application setup
├── package.json         # Dependencies and scripts
└── .env.example         # Environment variables template
```

## Setup Instructions

### Prerequisites

- Node.js 16+ 
- MongoDB 4.4+
- npm or yarn

### Local Development

1. **Clone and Install**:
```bash
cd booking-system
npm install
```

2. **Environment Setup**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start MongoDB** (if running locally):
```bash
mongod
```

4. **Run the Application**:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

## Production Deployment

### Environment Variables
```bash
NODE_ENV=production
PORT=8080
MONGODB_URI=mongodb://your-production-db-url
```

### Health Check
```http
GET /
```

Returns API status and available endpoints.

## API Endpoints

### Slot Management

#### Create Slot
```http
POST /api/v1/slots
Content-Type: application/json

{
  "date": "2024-12-31T10:00:00.000Z",
  "time": "14:30"
}
```

#### Get Available Slots
```http
GET /api/v1/slots
GET /api/v1/slots?date=2024-12-31
```

### Booking Management

#### Book a Slot
```http
POST /api/v1/book
Content-Type: application/json

{
  "userId": "user123",
  "slotId": "65a7b8c9d1e2f3g4h5i6j7k8"
}
```

#### Get All Bookings (with pagination)
```http
GET /api/v1/bookings?page=1&limit=10
```

#### Get Booking by ID
```http
GET /api/v1/bookings/:id
```

#### Get User Bookings
```http
GET /api/v1/users/:userId/bookings
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Slot booked successfully",
  "data": {
    "_id": "65a7b8c9d1e2f3g4h5i6j7k8",
    "userId": "user123",
    "slotId": "65a7b8c9d1e2f3g4h5i6j7k9",
    "createdAt": "2024-01-17T10:30:00.000Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Slot already booked"
}
```

## Design Decisions

### Concurrency Handling

The system uses **MongoDB transactions** and **atomic operations** to prevent race conditions:

```javascript
// Atomic booking operation
const updatedSlot = await Slot.findOneAndUpdate(
  { 
    _id: slotId, 
    isBooked: false  // Critical condition
  },
  { 
    isBooked: true 
  },
  { 
    new: true, 
    session: session 
  }
);

if (!updatedSlot) {
  await session.abortTransaction();
  throw new Error('Slot already booked or not found');
}
```

This ensures that:
- Two users cannot book the same slot simultaneously
- The slot state remains consistent even under high concurrency
- Failed operations are properly rolled back

### Database Indexing

Optimized indexes for performance:
- `{ date: 1, time: 1 }` - Unique composite index for slot lookup
- `{ date: 1 }` - For date-based filtering
- `{ isBooked: 1 }` - For available slot queries
- `{ userId: 1 }` - For user booking history
- `{ slotId: 1 }` - Unique index for booking relationships

### Validation Strategy

Multi-layer validation approach:
1. **Schema Validation**: Mongoose schema-level validation
2. **Request Validation**: Joi middleware for API inputs
3. **Business Logic Validation**: Service layer validation

### Error Handling

Centralized error handling with:
- Specific error types (Validation, CastError, DuplicateKey)
- Proper HTTP status codes
- Structured error responses
- Comprehensive logging

## Performance Considerations

- **Lean Queries**: Use `.lean()` for read-only operations
- **Connection Pooling**: MongoDB connection management
- **Index Optimization**: Strategic database indexes
- **Pagination**: Prevent large result sets
- **Input Validation**: Prevent invalid data processing

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input Sanitization**: Joi validation
- **Rate Limiting**: Can be added with express-rate-limit
- **Environment Variables**: Secure configuration

## Monitoring & Logging

- **Structured Logging**: Timestamped log messages
- **Error Tracking**: Comprehensive error logging
- **Request Logging**: Morgan HTTP request logging
- **Environment Awareness**: Different log levels for dev/prod

## Testing

The system is designed for easy testing:
- Modular service layer for unit testing
- Mockable database operations
- Clear separation of concerns
- Environment-based configuration

## Scalability Considerations

The architecture supports:
- **Horizontal Scaling**: Stateless application design
- **Database Scaling**: MongoDB sharding capability
- **Caching**: Redis integration points
- **Load Balancing**: Multiple instance support
- **Microservices**: Modular service design

## Future Enhancements

- User authentication and authorization
- Email notifications for bookings
- Cancellation and rescheduling
- Calendar integration
- Analytics and reporting
- Webhook support
- Advanced filtering and search

## License

MIT License - feel free to use this in your projects!
