# Backend Blockchain API

A robust Node.js backend application built with Express, PostgreSQL, Redis, and Docker for blockchain-related operations.

## 🚀 Features

- **Express.js** - Fast, unopinionated web framework
- **PostgreSQL** - Reliable relational database with Sequelize ORM
- **Redis** - High-performance caching and session storage
- **Docker** - Containerized development and production environments
- **Swagger/OpenAPI** - Interactive API documentation
- **JWT Authentication** - Secure user authentication
- **Rate Limiting** - API protection against abuse
- **Security Headers** - Comprehensive security middleware
- **Logging & Monitoring** - Request tracking and performance monitoring
- **Testing Suite** - Jest testing framework with coverage
- **Code Quality** - ESLint and Prettier integration
- **CI/CD Pipeline** - GitHub Actions automation

## 📋 Prerequisites

- **Node.js** (v18.0.0 or higher)
- **Docker & Docker Compose** (for containerized development)
- **Git** (for version control)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/UNKLAB-ID/backend-blockchain.git
cd backend-blockchain
```

### 2. Environment Configuration

Create environment files from examples:

```bash
cp .env.example .env
cp .env.development .env.development
```

Edit the environment files with your configuration:

```bash
# .env (for local development without Docker)
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=backend_blockchain
DB_USER=postgres
DB_PASSWORD=your_password
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key
```

### 3. Install Dependencies

```bash
npm install
```

## 🐳 Development with Docker (Recommended)

### Quick Start

```bash
# Start all services (PostgreSQL, Redis, API, Management Tools)
make dev

# Or using npm scripts
npm run docker:dev
```

This will start:
- **API Server** - http://localhost:3000
- **PostgreSQL** - localhost:5432
- **Redis** - localhost:6379
- **PgAdmin** - http://localhost:8080 (admin@example.com / admin123)
- **Redis Commander** - http://localhost:8081
- **Swagger Docs** - http://localhost:3000/api-docs

### Available Make Commands

```bash
# Development
make dev              # Start development environment
make build-dev        # Build and start development environment
make down-dev         # Stop development environment
make logs-dev         # View development logs

# Production
make prod             # Start production environment
make build-prod       # Build and start production environment
make down-prod        # Stop production environment
make logs-prod        # View production logs

# Utilities
make clean            # Clean Docker resources
make health           # Check application health
make deploy-prod      # Full production deployment with health check
```

### Docker Services

#### Development Services
- **app** - Node.js application with hot reload
- **postgres** - PostgreSQL database
- **redis** - Redis cache
- **pgadmin** - Database management interface
- **redis-commander** - Redis management interface

#### Production Services
- **app** - Optimized Node.js application
- **nginx** - Reverse proxy with SSL support

## 💻 Local Development (Without Docker)

### 1. Setup Local Databases

Install and start PostgreSQL and Redis locally, then:

```bash
# Create database
createdb backend_blockchain

# Start Redis
redis-server
```

### 2. Run Database Migrations

```bash
npm run db:migrate
```

### 3. Start Development Server

```bash
npm run dev
```

## 🚀 Production Deployment

### Docker Production Setup

#### 1. Environment Configuration

Create production environment file:

```bash
cp .env.production .env.production
```

Configure production variables:

```bash
# .env.production
NODE_ENV=production
PORT=3000
DB_HOST=your-prod-db-host.amazonaws.com
DB_NAME=backend_blockchain_prod
DB_USER=your_db_user
DB_PASSWORD=strong_production_password
DB_SSL=true
REDIS_HOST=your-redis-host.amazonaws.com
REDIS_PASSWORD=redis_password
JWT_SECRET=super-strong-production-jwt-secret
CORS_ORIGIN=https://yourdomain.com
```

#### 2. Deploy with Docker

```bash
# Build and start production environment
make build-prod

# Or using docker-compose directly
docker-compose -f docker-compose.prod.yml up --build -d
```

#### 3. Health Check

```bash
make health
# Or manually
curl http://localhost:3000/api/health
```

### Production Features

- **Multi-stage Docker build** for optimized image size
- **Nginx reverse proxy** with rate limiting and security headers
- **SSL/TLS support** (certificate configuration required)
- **Resource limits** and auto-restart policies
- **Health checks** for all services
- **Structured logging** with rotation
- **External database support** (AWS RDS, etc.)

## 📚 API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message and API info |
| GET | `/api` | API information and endpoints |
| GET | `/api/health` | Comprehensive health check |
| GET | `/api/health/simple` | Simple health check for load balancers |
| GET | `/api/v1/users` | Get users (example endpoint) |
| GET | `/api/v1/users/:id` | Get user by ID (example endpoint) |

### Swagger Documentation

Interactive API documentation is available at:
- **Development**: http://localhost:3000/api-docs
- **Production**: Disabled for security (contact support)

### Authentication

API uses JWT Bearer token authentication:

```bash
Authorization: Bearer <your-jwt-token>
```

### Rate Limiting

- **Global**: 100 requests per 15 minutes
- **API endpoints**: 100 requests per 15 minutes
- **Auth endpoints**: 5 requests per 15 minutes
- **Health checks**: 30 requests per minute

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Coverage

Minimum coverage requirements:
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## 🔍 Code Quality

### Linting

```bash
# Check code style
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Formatting

```bash
# Format code with Prettier
npm run format
```

### Pre-commit Hooks

The project includes ESLint and Prettier configurations:
- **ESLint**: `.eslintrc.js`
- **Prettier**: `.prettierrc.js`

## 📊 Database

### Sequelize ORM

The project uses Sequelize ORM with PostgreSQL:

```bash
# Run migrations
npm run db:migrate

# Rollback migrations
npm run db:migrate:undo

# Run seeders
npm run db:seed

# Rollback seeders
npm run db:seed:undo

# Create new migration
npx sequelize-cli migration:generate --name your-migration-name

# Create new model
npx sequelize-cli model:generate --name User --attributes email:string,username:string
```

### Database Configuration

- **Development**: Docker PostgreSQL container
- **Production**: External managed database (AWS RDS recommended)
- **Test**: In-memory or separate test database

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment (development/production/test) | Yes | development |
| `PORT` | Server port | No | 3000 |
| `DB_HOST` | Database host | Yes | localhost |
| `DB_PORT` | Database port | No | 5432 |
| `DB_NAME` | Database name | Yes | - |
| `DB_USER` | Database user | Yes | - |
| `DB_PASSWORD` | Database password | Yes | - |
| `DB_SSL` | Enable SSL for database | No | false |
| `REDIS_HOST` | Redis host | Yes | localhost |
| `REDIS_PORT` | Redis port | No | 6379 |
| `REDIS_PASSWORD` | Redis password | No | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_EXPIRES_IN` | JWT expiration time | No | 7d |
| `CORS_ORIGIN` | CORS allowed origin | No | http://localhost:3000 |
| `LOG_LEVEL` | Logging level | No | info |

## 🚨 Monitoring & Logging

### Health Checks

- **Application health**: `/api/health`
- **Database connectivity**: Included in health check
- **Redis connectivity**: Included in health check
- **Simple health**: `/api/health/simple` (for load balancers)

### Logging

- **Request/Response logging** with sanitization
- **Performance monitoring** for slow requests
- **Error tracking** with stack traces
- **Request ID tracing** for debugging

### Production Monitoring

- Health check endpoints for load balancers
- Performance metrics headers
- Resource usage monitoring
- Error logging and alerting

## 🔐 Security

### Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate limiting** - Request throttling
- **Input validation** - Request validation
- **JWT authentication** - Secure user auth
- **SQL injection protection** - Sequelize ORM
- **XSS protection** - Built-in headers
- **Request size limiting** - Payload size control

### Security Best Practices

1. **Environment Variables**: Never commit secrets to repository
2. **HTTPS**: Use SSL/TLS in production
3. **Strong Passwords**: Use strong database and JWT secrets
4. **Regular Updates**: Keep dependencies updated
5. **Security Audits**: Run `npm audit` regularly

## 🚀 CI/CD Pipeline

### GitHub Actions

The project includes automated CI/CD pipeline:

1. **Testing**: Automated tests on Node.js 18.x and 20.x
2. **Linting**: Code quality checks
3. **Security**: Dependency vulnerability scanning
4. **Docker Build**: Container image building and testing
5. **Deployment**: Automated deployment to staging/production

### Pipeline Triggers

- **Pull Requests**: Run tests and linting
- **Push to develop**: Deploy to staging
- **Push to main**: Deploy to production (with manual approval)

## 🛠️ Troubleshooting

### Common Issues

#### 1. Docker Build Fails
```bash
# Clean Docker resources
make clean

# Rebuild from scratch
make build-dev
```

#### 2. Database Connection Issues
```bash
# Check database logs
make logs-dev | grep postgres

# Restart services
make down-dev && make dev
```

#### 3. Port Already in Use
```bash
# Kill processes on ports
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:5432 | xargs kill -9
sudo lsof -ti:6379 | xargs kill -9
```

#### 4. Permission Issues
```bash
# Fix Docker permissions
sudo chown -R $USER:$USER .
```

### Debug Mode

Enable debug logging:

```bash
DEBUG=* npm run dev
```

## 📞 Support

### Getting Help

1. **Documentation**: Check this README and inline code comments
2. **API Docs**: Visit `/api-docs` in development
3. **Issues**: Create GitHub issues for bugs
4. **Discussions**: Use GitHub discussions for questions

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🔄 Version History

- **v1.0.0** - Initial release with Express, PostgreSQL, Redis, Docker setup
- **API v1** - Current API version with JWT auth and rate limiting

---

**Happy Coding! 🚀**