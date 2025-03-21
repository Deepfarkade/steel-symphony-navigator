
# EY Steel Ecosystem Co-Pilot Backend

This is the backend service for the EY Steel Ecosystem Co-Pilot application. It is built with FastAPI and follows a microservice architecture.

## Technology Stack

- Python 3.9+
- FastAPI - Async web framework
- MSSQL - Main database for steel operation data
- MongoDB - NoSQL database for chat sessions and user data
- Docker - Containerization
- Redis - Optional caching for performance (future implementation)

## Getting Started

1. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Set up environment variables:
   - Create a `.env` file in the backend directory with your database credentials
   - Required variables are listed in `.env.example`

3. Run the development server:
   ```
   uvicorn main:app --reload
   ```

## Project Structure

```
backend/
├── main.py                     # Main FastAPI application
├── requirements.txt            # Python dependencies
├── config/                     # Configuration files and environment variables
├── core/                       # Core functionality shared across services
│   ├── database/               # Database connections and models
│   ├── security/               # Authentication and authorization
│   └── utils/                  # Utility functions
├── services/                   # Microservices
│   ├── auth/                   # Authentication service
│   ├── chat/                   # Chat and AI conversation service
│   ├── demand_planning/        # Demand planning microservice
│   ├── supply_planning/        # Supply planning microservice
│   └── ...                     # Other module-specific services
└── tests/                      # Test directory
```

## API Documentation

Once the server is running, you can access the API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
