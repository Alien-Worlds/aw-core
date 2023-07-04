# Why Clean Architecture

When developing software applications, one of the key aspects that contribute to their success is a well-structured, organized codebase. Our projects leverage the Clean Architecture principles, which ensure separation of concerns, independence from frameworks, testability, and independence of the user interface and the database. On the web you will find various implementations of this architecture, in our case it is important to follow the established rules and make our code: **clean**, **scalable**, and **maintainable**.

Our code architecture is composed primarily of two main folders: 'data' and 'domain'. Each has a specific purpose and contains different elements crucial to the operation of the project.

## Data Layer

The 'data' folder houses our data sources (e.g., MongoDB), repositories, services, mappers, and types related to models or any other third-party resources. Let's dive into their responsibilities:

- *Data Sources*: Responsible for communication with external systems or services like databases or APIs.
- *Repositories*: They encapsulate the logic needed to access the data sources, handling the data retrieval and manipulation within the application.
- *Services*: These contain two types of responsibilities. On one hand, they interact with third-party APIs that do not provide a concrete list of documents. On the other hand, they are also used internally to handle business logic and interact with repositories.
- *Mappers*: These are responsible for converting entities to models and vice versa, allowing for the seamless movement of data within the application.
- *Types*: These are related to models and third-party resources, defining the structure of various data units in the application.

By organizing these elements within the 'data' folder, we maintain a clean, understandable structure that simplifies the handling of data within the application.

## Domain Layer

On the other hand, the 'domain' folder houses our controllers, interfaces/abstractions for the repositories and services, entities, use cases, and other utilities.

- *Controllers*: They act as an intermediary between the domain and the data layer.
- *Interfaces/Abstractions*: These define the operations that the repositories and services must implement.
- *Entities*: These represent the objects of the business logic.
- *Use Cases*: These encapsulate the business logic of an application.
- *Utilities*: These are helper functions or classes that are used across the application.

A key aspect of our architecture is the use of the Inversion of Control (IoC) principle. With this, we can easily manage dependencies, promoting a loosely-coupled and highly-cohesive system.

## Why Adopt a Consistent Structure?

When working on an open-source project or any project with multiple developers, maintaining a consistent code structure is imperative. It reduces cognitive load when onboarding new developers, simplifies the navigation within the codebase, and promotes a shared understanding of the code architecture.

Moreover, by creating a kind of framework here, complete with our CLI for easier implementation, we not only streamline the development process but also ensure consistency and standardization across projects. It's crucial, though, that we adhere to the established structure and style for the sake of maintainability and scalability.

## Understanding Clean Architecture

For those unfamiliar, the Clean Architecture is a software design philosophy that emphasizes the separation of concerns, maintainability, and testability. The idea is to make the system easy to understand, develop, manage, and scale, keeping it independent of any specific technology, UI, or database.

- Components should be open for extension but closed for modification.
- Dependencies should point inwards. Inner layers should not know anything about the outer layers.
- The system should be adaptable to various types of databases, user interfaces, and external services.

By using the Clean Architecture, we aim to create systems that are scalable, maintainable, and easily testable, while also facilitating cooperation and understanding amongst the developers involved.
