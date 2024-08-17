# Demo API for Transactions

This repository contains a demonstration API designed to showcase various backend engineering skills and practices. It highlights key aspects of Clean Architecture and SOLID principles, RESTful API design, and integration with modern tools and technologies.

## Features

### General Code Structure

- **Domain Driven Design**: The application is divided by domain independent modules, isolatig logic between them and allowing migrating to a microservice structure if required. User modules is already implemented, while account and transaction modules are in progress.
- **Clean Architecture**: The project adheres to Clean Architecture principles with a well-organized file structure.
- **SOLID Principles**: Classes and functions adhere to the Single Responsibility Principle. Dependency injection facilitates decoupling and enhances testability by injecting dependencies rather than importing them.
- **Data Validation**: Utilizes Data Transfer Objects (DTOs) and comprehensive error handling to validate and manage user input.
- **Principles**: The API design follows RESTful principles, ensuring clear and consistent endpoints.

### Database Integration

- **ORM**: TypeORM is configured for MySQL for both production and development environments.
- **Testing**: A temporary SQLite instance is used for testing, populated with fixtures to allow real database interactions without mocking.
- **Entities**: Defines entities for User, Account, Transaction, and their relationships.

### Infrastructure

- **Local Development**: The application uses Docker to run the database locally.
- **Future Plans**: Future plans include containerizing the application with Docker, using Docker Compose for deployment, and configuring separate setups for production and development.
- **CI/CD**: Scripts for system deployment and CI/CD processes will be added.

### Testing

- **End-to-End (E2E)**: Full E2E integration tests are implemented for every controller interface.
- **Unit Testing**: Comprehensive unit tests verify the functionality of individual services.

### Documentation

- **Swagger**: Swagger integration is planned to document API endpoints, including required and returned data.

## Planned Features

### Authentication and Authorization

- **AuthService**: Implements user validation and JWT token generation.
- **JwtAuthGuard**: Protects routes in the controllers with user roles (Admin, Client) determining access permissions.

### WebSockets

- **Real-Time Notifications**: WebSockets will be added for real-time transaction notifications.

### File Uploads

- **Profile Pictures**: Implementation of profile picture uploads for users.
- **Transaction PDFs**: Ability to download PDFs of transaction information.

### Logging and Monitoring

- **Logging Service**: Planned addition of a logging service to track transactions and user activities.

### Caching

- **Redis**: Use Redis for caching frequently accessed data, such as user information and account balances.

### Task Scheduling

- **Daily Jobs**: Implementation of scheduled tasks to calculate interest on accounts.

### Performance Optimization

- **Request Throttling**: Throttling of requests for sensitive operations, such as money transfers, to enhance performance and security.

### Custom Decorators and Pipes

- **Transaction Logging**: Development of a custom decorator for logging transactions.


## Initialize the project for development

### Installation

```bash
$ npm install
```

### Env file

Copy the .env.dist file to .env and modify it as needed.

### Docker Installation

```bash
$ docker compose up -d
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

[MIT licensed](LICENSE).
