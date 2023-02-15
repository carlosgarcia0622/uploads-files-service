![Banner](./banner.png)

# Microservice-based Application with NestJS, DDD, CQRS, and Event Sourcing for Koibanxs backend callenge

## Description

This is an application built with NestJS that uses large-scale distributed microservice-based architectures like Domain-Driven Design ([DDD](https://martinfowler.com/bliki/DomainDrivenDesign.html)), Command Query Responsibility Segregation ([CQRS](https://martinfowler.com/bliki/CQRS.html)), and [event sourcing](https://martinfowler.com/eaaDev/EventSourcing.html). The application allows users to upload Excel (xlsx) files and process them based on a predefined mapping format. (At the moment there isn't a event store configured, but the application is ready to store all the events in a secont version). 

##  Dependency Table

| Name        | Version           |
| ------------- |:-------------: |
| [Node.js](https://nodejs.org)      | 18.11.18      |
| [TypeScript](https://www.typescriptlang.org) | 4.7.4      |
| [Docker Compose](https://docker.com) | v2.4.1      |

## Installation

```bash
$ npm install
```

## Starting mongoDb container

```bash
# development
$ docker-compose up
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Why These Architectures?

The decision to use a microservice architecture based on DDD, CQRS, and Event Sourcing was made to promote modularity, maintainability, and scalability. These architectures provide clear boundaries between different contexts, making it easier to maintain and test the application.

NestJS was chosen as the framework for building the application due to its extensive tooling, ease of use, and support for these architectures. NestJS also provides a robust platform for building microservices, with support for message brokers, load balancing, and scaling. It was chosen over Express due to its better support for building complex applications and its seamless integration with TypeScript.
## Stay in touch

- Author - [Carlos García](carlosgarcia0622@gmail.com)
- linkedIn - [https://www.linkedin.com/in/carlos-andr%C3%A9s-garc%C3%ADa-montoya-a35b8a121/](https://www.linkedin.com/in/carlos-andr%C3%A9s-garc%C3%ADa-montoya-a35b8a121/)

## License

Nest is [MIT licensed](LICENSE).
