# Dockerizing a Spring Boot Application

A beginner-friendly project demonstrating how to build a Spring Boot application using Maven, package it into a JAR, and containerize it using Docker.

## Tech Stack

- **Java:** 11
- **Spring Boot:** 2.6.6
- **Build Tool:** Maven
- **Containerization:** Docker
- **Application Port:** 8080

## Project Structure

```text
hello-world/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── dockerforjavadevelopers/
│   │   │           └── hello/
│   │   │               └── Application.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/                  # Test classes
├── target/                        # Generated during Maven build
│   └── hello-world-0.1.0.jar
├── pom.xml                        # Maven dependencies and versions
├── Dockerfile                     # Docker image instructions
├── .dockerignore                  # Files excluded from Docker build context
└── README.md                      # Project documentation
```

### What Each File and Folder Contains

| File/Folder | Purpose |
|---|---|
| `src/main/java/` | Java source code, including controllers and the main application class. |
| `src/main/resources/` | Application configuration and resource files. |
| `application.properties` | Application settings, including the server port if explicitly configured. |
| `src/test/` | Unit and integration tests. |
| `pom.xml` | Project metadata, dependencies, Java version, Spring Boot version, and build configuration. |
| `target/` | Generated build output, including the executable JAR. Created by Maven. |
| `Dockerfile` | Instructions for building the Docker image. |
| `.dockerignore` | Specifies files and folders Docker should exclude from the build context. |
| `README.md` | Project documentation and instructions. |

*Note: The structure above is illustrative. Some files, such as `application.properties` and `.dockerignore`, may need to be created if they don't already exist.*

## Version Configuration

Versions are primarily configured in `pom.xml`.

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.6.6</version>
</parent>

<properties>
    <java.version>11</java.version>
</properties>
```

- **Spring Boot version:** `2.6.6`, specified in the parent section.
- **Java version:** `11`, specified in the properties section.
- **Project version:** `0.1.0`, specified by the top-level `<version>` element.

The Java version used by Maven and the Java version in the Docker image must be compatible.

## Application Port

Spring Boot web applications use port `8080` by default unless another port is configured.

To explicitly configure it, add this to `src/main/resources/application.properties`:

```properties
server.port=8080
```

The port is also referenced in the Dockerfile:

```dockerfile
EXPOSE 8080
```

And when starting the container:

```bash
docker run -d --name hello-world-container -p 8080:8080 hello-world:v1
```

Here, the format is `-p HOST_PORT:CONTAINER_PORT`.

- **Application port:** The port Spring Boot listens on inside the container.
- **`EXPOSE 8080`:** Documents the intended container port; it does not publish it.
- **`-p 8080:8080`:** Maps host port `8080` to container port `8080`.

## Prerequisites

- Java 11
- Maven
- Docker Desktop or Docker Engine

Verify the installations:

```bash
java -version
mvn -version
docker --version
docker info
```

## 1. Build the JAR

Run from the directory containing `pom.xml`:

```bash
mvn clean package
```

Maven compiles the source code, runs configured tests, and packages the application.

Verify the generated artifact:

```bash
ls -lh target/*.jar
```

Expected JAR: `target/hello-world-0.1.0.jar`

## 2. Dockerfile

```dockerfile
FROM eclipse-temurin:11-jdk-alpine

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

- `FROM`: Selects the Java environment.
- `WORKDIR`: Sets the working directory inside the container.
- `COPY`: Copies the JAR into the image.
- `EXPOSE`: Documents the intended container port.
- `ENTRYPOINT`: Starts the Spring Boot application.

## 3. Build the Docker Image

```bash
docker build -t hello-world:v1 .
```

List images:

```bash
docker images
```

## 4. Run the Container

```bash
docker run -d --name hello-world-container -p 8080:8080 hello-world:v1
```

Access the application at `http://localhost:8080`, provided the application has a handler for the root endpoint.

## 5. Verify and Troubleshoot

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# View application logs
docker logs hello-world-container

# Inspect container state and configuration
docker inspect hello-world-container
```

If the container exits, check its logs, exit code, Java compatibility, application configuration, and port mapping.

## Workflow Summary

```bash
# 1. Build the JAR
mvn clean package

# 2. Build the Docker image
docker build -t hello-world:v1 .

# 3. Run the container
docker run -d --name hello-world-container -p 8080:8080 hello-world:v1

# 4. Check status and logs
docker ps
docker logs hello-world-container
```

**Key takeaway:** Maven builds the JAR, Docker builds the image, and `docker run` creates and starts a container from that image.