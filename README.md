# Task Management System Backend

## Introduction

This is the backend component of a Task Management System built using NestJS. The system is designed to manage projects, tasks, deadlines, and notifications efficiently. It follows microservices architecture, utilizes RabbitMQ for communication, implements distributed caching with Redis, and adheres to Clean Architecture and Domain-Driven Design (DDD) principles.

## Features

- **Microservices**: Consists of two main microservices - User Service and Task Service.
- **RabbitMQ**: Enables inter-service communication with domain events.
- **Distributed Caching**: Uses Redis for caching frequently accessed data.
- **Relational Database**: Utilizes PostgreSQL and an ORM (TypeORM) for data storage.
- **Event-Driven Architecture**: Implements domain events for effective communication.
- **Clean Architecture & OOP**: Follows Clean Architecture principles and object-oriented programming.
- **Type-Safe Code**: Enforces strong typing throughout the application.
- **Error Handling**: Provides robust error handling based on domain-specific rules.
- **Bonus**: Implements Domain-Driven Design (DDD) concepts, includes clear aggregates, entities, and value objects, and supports pagination for task listings.

## Getting Started

### Prerequisites

Before running the application, make sure you have the following installed:

- Node.js
- PostgreSQL
- Redis
- RabbitMQ

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/fosatt/stackbuld_assesment.git
