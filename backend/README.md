
# EY Steel Ecosystem Co-Pilot Backend

This is the backend service for the EY Steel Ecosystem Co-Pilot application. It is built with FastAPI and follows a microservice architecture.

## Technology Stack

- Python 3.9+
- FastAPI - Async web framework
- MSSQL - Main database for steel operation data
- MongoDB - NoSQL database for chat sessions and user data
- Redis - Caching and rate limiting
- Docker & Docker Compose - Containerization
- Azure OpenAI - AI services integration

## Prerequisites

- Python 3.9 or higher
- Docker and Docker Compose
- ODBC Driver 17 for SQL Server
- MongoDB (local or remote)
- Azure OpenAI API credentials

## Getting Started

### Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://your-repository-url.git
   cd ey-steel-ecosystem-copilot/backend
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Update the `.env` file with your database credentials, API keys, and other settings
   - Ensure all required variables are properly configured:
     - Database connection details (MSSQL and MongoDB)
     - Secret key for JWT authentication (generate a strong key)
     - Azure OpenAI credentials
     - Security settings

5. **Run the development server**:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`

### Running with Docker

1. **Build and run using Docker Compose**:
   ```bash
   docker-compose up --build
   ```

   This will start the backend API, MongoDB, and Redis services.

2. **Run in detached mode**:
   ```bash
   docker-compose up --build -d
   ```

### Production Deployment with Container Apps

1. **Build the Docker image**:
   ```bash
   docker build -t ey-steel-ecosystem-backend:latest .
   ```

2. **Push to a container registry** (e.g., Azure Container Registry):
   ```bash
   docker tag ey-steel-ecosystem-backend:latest <your-registry>.azurecr.io/ey-steel-ecosystem-backend:latest
   docker push <your-registry>.azurecr.io/ey-steel-ecosystem-backend:latest
   ```

3. **Deploy to Azure Container Apps**:
   - Configure resources, scaling, and networking as needed
   - Ensure environment variables are properly set in the Container App configuration
   - Set up managed identity for secure credential management

## Running Frontend and Backend Separately

### Backend Configuration

1. Run the backend:
   ```bash
   cd backend
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

2. Configure CORS in `main.py` to allow requests from the frontend:
   - Ensure `ALLOWED_ORIGINS` in your `.env` file includes the frontend URL
   - Example: `ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.com`

### Frontend Configuration

1. Run the frontend (from project root):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. Set the API base URL in the frontend to point to the backend:
   - Update API configuration to use `http://localhost:8000/api/v1`

## Security Considerations

### Authentication and Authorization

- The application uses JWT-based authentication
- Access tokens expire after 30 minutes (configurable in `.env`)
- Implement proper role-based access control for different API endpoints

### Database Security

- Use strong, unique passwords for database access
- Enable SSL connections to databases
- Implement proper connection pooling and timeouts
- Use parameterized queries to prevent SQL injection

### API Security

- Rate limiting is enabled to prevent abuse (configurable in `.env`)
- SSL is recommended for production environments
- Set appropriate CORS policies
- Input validation on all API endpoints

### SSL Configuration

For production, SSL is strongly recommended:

1. **Generate SSL certificates** or obtain from a trusted CA
2. Configure in `main.py` by setting:
   ```python
   uvicorn.run(
       "main:app",
       host=host,
       port=port,
       workers=workers,
       ssl_keyfile="/path/to/key.pem",  # Set in .env
       ssl_certfile="/path/to/cert.pem"  # Set in .env
   )
   ```
3. Set environment variables:
   ```
   SSL_ENABLED=True
   SSL_KEYFILE=/path/to/key.pem
   SSL_CERTFILE=/path/to/cert.pem
   ```

### Docker Security

- The Docker container runs as a non-root user (`appuser`)
- Container resources are limited to prevent resource exhaustion
- Only required ports are exposed
- Sensitive data is passed via environment variables, not in the container image

## API Documentation

When the server is running in development mode, API documentation is available at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Performance Optimization

For high-concurrency environments (100+ users):

1. **Worker Configuration**:
   - Gunicorn with multiple workers is configured by default
   - Default: 4 workers, can be adjusted in `docker-compose.yml` or via environment variables

2. **Database Connection Pooling**:
   - The application uses connection pooling for database access
   - Pool size can be adjusted in `mssql.py` and connection settings

3. **Caching with Redis**:
   - Add Redis caching for frequently accessed data
   - Configure TTL appropriate for your data freshness requirements

4. **Horizontal Scaling**:
   - The application is designed to be horizontally scalable
   - Multiple instances can be deployed behind a load balancer

## Environment Variables

Essential environment variables include:

```
# Database Configuration - MSSQL
MSSQL_SERVER=your_server
MSSQL_DATABASE=your_database
MSSQL_USERNAME=your_username
MSSQL_PASSWORD=your_password
MSSQL_DRIVER=ODBC Driver 17 for SQL Server

# Database Configuration - MongoDB
MONGODB_URI=mongodb://username:password@host:port/database
MONGODB_DATABASE=ey_steel_ecosystem

# Authentication
SECRET_KEY=your-secret-key-here  # Generate a strong random key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Configuration
API_PREFIX=/api/v1
DEBUG=False
ENVIRONMENT=production

# Azure OpenAI Configuration
AZURE_API_KEY=your_azure_api_key
AZURE_API_BASE=https://your_azure_openai_endpoint
AZURE_API_VERSION=2023-05-15
AZURE_DEPLOYMENT_NAME=your_deployment_name

# Security Settings
ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:3000
RATE_LIMIT_PER_MINUTE=60
SSL_ENABLED=True
SSL_KEYFILE=/path/to/key.pem
SSL_CERTFILE=/path/to/cert.pem
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Verify connection strings in `.env`
   - Ensure database servers are running and accessible
   - Check firewall settings

2. **ODBC Driver Issues**:
   - Ensure ODBC Driver 17 for SQL Server is installed
   - On Linux: `apt-get install -y unixodbc-dev msodbcsql17`
   - On Windows: Install from Microsoft's website

3. **SSL Certificate Issues**:
   - Verify paths to SSL certificates
   - Check certificate validity and expiration dates

4. **Performance Issues**:
   - Check database query performance
   - Monitor resource usage (CPU, memory)
   - Adjust worker count based on your server capacity

## Project Structure

```
backend/
├── main.py                     # Main FastAPI application
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Docker configuration
├── docker-compose.yml          # Docker Compose configuration
├── .env.example                # Example environment variables
├── config/                     # Configuration files
│   └── settings.py             # Application settings
├── core/                       # Core functionality
│   ├── database/               # Database connections
│   ├── security/               # Authentication and authorization
│   └── utils/                  # Utility functions
├── services/                   # Microservices
│   ├── auth/                   # Authentication service
│   ├── chat/                   # Chat and AI conversation service
│   ├── demand_planning/        # Demand planning microservice
│   ├── supply_planning/        # Supply planning microservice
│   ├── ai/                     # AI integrations (Azure OpenAI)
│   └── ...                     # Other module-specific services
└── static/                     # Static files
    └── assets/                 # Assets for the application
```

## License

[Your License Information]

## Contributing

[Your Contribution Guidelines]
