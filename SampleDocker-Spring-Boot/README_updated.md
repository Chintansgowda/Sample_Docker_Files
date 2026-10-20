**# Dockerizing a Spring Boot Application**



A beginner-friendly guide to packaging a Spring Boot application into a Docker image and running it as a container.


**## Overview**



Spring Boot applications are Java applications. To run one, you need a compatible Java runtime and the packaged application.



Docker lets us package the application into an **\*\*image\*\*** and run that image as a **\*\*container\*\***. The image contains the application JAR and the runtime needed to execute it.



This guide uses **\*\*Maven\*\*** (\`pom.xml\`) and is configured for **\*\*Spring Boot 2.6.6\*\*** with **\*\*Java 11\*\***. The application is assumed to listen on port **\*\*8080\*\***. Adjust the Java version, JAR path, and port if your project uses different settings.



**## How It Works**



\`\`\`text

Java source code + pom.xml

          |

          | Maven compiles and packages the project

          v

     Executable JAR

          |

          | docker build

          v

      Docker image

          |

          | docker run

          v

 Running container

          |

          | published port

          v

 Browser: http\://localhost:8080

\`\`\`



\- **\*\*Maven\*\*** manages dependencies and builds the Java application.

\- **\*\*JAR\*\*** is the packaged Java application.

\- **\*\*Dockerfile\*\*** contains instructions for creating the image.

\- **\*\*Docker image\*\*** is the packaged, reusable template.

\- **\*\*Container\*\*** is a running instance of an image.



**## Project Structure**



A typical Maven-based Spring Boot project looks like this:



\`\`\`text

Sample_Docker-Spring-Boot/

├── src/

│   ├── main/

│   │   ├── java/             # Java source code

│   │   └── resources/        # Configuration and other resources

│   └── test/                 # Automated tests

├── pom.xml                   # Maven dependencies and build configuration

├── Dockerfile                # Instructions for building the image

└── target/                   # Generated output after Maven builds

    └── \*.jar                 # Packaged application

\`\`\`



Your project may contain additional files.



**## Project Versions

- **Spring Boot:** `2.6.6`
- **Java:** `11`
- **Maven artifact:** `com.dockerforjavadevelopers:hello-world:0.1.0`
- **Application port:** `8080`

The Java version is configured in `pom.xml` with `<java.version>11</java.version>`. Keep this compatible with the Java version in the Docker base image.

## Prerequisites**



Install or have access to:



\- Docker Desktop, running on Windows/macOS, or Docker Engine on Linux.

\- A Maven-based Spring Boot project containing \`pom.xml\`.

\- Java and Maven locally if you plan to build the JAR on your machine. Alternatively, use the project's Maven Wrapper (\`mvnw\` / \`mvnw\.cmd\`) if provided.



Check Docker:



\`\`\`bash

docker --version

docker info

\`\`\`



Check Maven if installed:



\`\`\`bash

mvn -version

\`\`\`



**## Step 1: Build the JAR with Maven**



Run this from the directory containing \`pom.xml\`:



\`\`\`bash

mvn clean package

\`\`\`



If your project includes Maven Wrapper, use the appropriate command:



\`\`\`bash

\# Git Bash / Linux / macOS

./mvnw clean package

\`\`\`



\`\`\`powershell

\# Windows PowerShell

.\mvnw\.cmd clean package

\`\`\`



What the command does:



\- \`clean\` removes output from previous builds.

\- \`package\` compiles the code, runs tests configured for the build, and packages the application.

\- Maven usually writes the JAR to the \`target/\` directory.



Confirm the result:



\`\`\`bash

ls target

\`\`\`



You should see a \`.jar\` file. If the build fails, fix the build or test errors before proceeding.





**\*\*Version compatibility:\*\*** The Java runtime in \`FROM\` must be compatible with the Java version used to compile the application. If the project uses Java 21, use a compatible Java 21 runtime image instead.



**\*\*JAR matching:\*\*** \`COPY target/\*.jar app.jar\` assumes one suitable JAR matches that pattern. If the project creates multiple JAR files (for example, an original and a \`.jar.original\` file), use the exact executable JAR filename instead.



**## Step 3: Build the Docker Image**



Run this from the project root (the directory containing \`Dockerfile\`):



\`\`\`bash

docker build -t springbootapp:v1 .

\`\`\`



Explanation:



\- \`docker build\` builds an image from the Dockerfile.

\- \`-t springbootapp:v1\` assigns the image name \`springbootapp\` and tag \`v1\`.

\- \`.\` makes the current directory the build context, so Docker can access the Dockerfile and the JAR under \`target/\`.



Confirm the image exists:



\`\`\`bash

docker images

\`\`\`



**## Step 4: Run the Container**



\`\`\`bash

docker run -d --name springbootcont -p 8080:8080 springbootapp:v1

\`\`\`



Explanation:



\- \`docker run\` creates and starts a container.

\- \`-d\` runs it in the background (detached mode).

\- \`--name springbootcont\` gives the container a memorable name.

\- \`-p 8080:8080\` publishes host port \`8080\` and forwards traffic to container port \`8080\`.

\- \`springbootapp:v1\` is the image to run.



The port mapping format is:



\`\`\`text

-p HOST_PORT:CONTAINER_PORT

\`\`\`



The **\*\*container port\*\*** must match the port on which Spring Boot listens. The **\*\*host port\*\*** is the port you open on your computer. For example, \`-p 9000:8080\` maps \`localhost:9000\` to container port \`8080\`.



If the name is already in use because an earlier container exists, remove the old container first (this does not delete the image):



\`\`\`bash

docker rm -f springbootcont

\`\`\`



Then run the \`docker run\` command again.



**## Step 5: Test the Application**



Check running containers:



\`\`\`bash

docker ps

\`\`\`



Inspect logs:



\`\`\`bash

docker logs springbootcont

\`\`\`



Follow logs continuously:



\`\`\`bash

docker logs -f springbootcont

\`\`\`



Open the application:



\- \`http\://localhost:8080\`



The root URL works only if the application has a handler for \`/\`. Otherwise, use an endpoint defined by the application's controllers.



You can also test an endpoint with curl:



\`\`\`bash

curl http\://localhost:8080/

\`\`\`



**## Understanding Ports**



There are three different concepts to remember:



1\. **\*\*Application listening port:\*\*** Set by Spring Boot configuration or command-line arguments. Spring Boot web applications commonly default to \`8080\`, but this can be changed, for example with \`server.port\` in \`application.properties\`.

2\. **\*\*\`EXPOSE 8080\`:\*\*** Documents the intended container port in the image. It does not make the port reachable from your host by itself.

3\. **\*\*\`-p 8080:8080\`:\*\*** Publishes a host port and forwards traffic to the container port.



For example:



\`\`\`text

Browser on your computer

http\://localhost:9000

          |

          | Docker port mapping: -p 9000:8080

          v

Spring Boot container

application listens on port 8080

\`\`\`



If the app listens on port \`8080\` inside the container, this works:



\`\`\`bash

docker run -p 9000:8080 springbootapp:v1

\`\`\`



Then open \`http\://localhost:9000\`.



**## Useful Docker Commands**



\`\`\`bash

\# List images

docker images



\# List running containers

docker ps



\# List all containers, including stopped ones

docker ps -a



\# Show application logs

docker logs springbootcont



\# Follow logs

docker logs -f springbootcont



\# Stop the container

docker stop springbootcont



\# Start an existing stopped container

docker start springbootcont



\# Remove a stopped container

docker rm springbootcont



\# Force-stop and remove a container

docker rm -f springbootcont



\# Remove an image (only when no container depends on it)

docker rmi springbootapp:v1

\`\`\`



**## Troubleshooting**



**### The container exits immediately**



Check its logs:



\`\`\`bash

docker logs springbootcont

\`\`\`



Common causes include an incompatible Java version, an invalid JAR, missing configuration, or an application startup error.



**### The browser cannot connect**



1\. Check whether the container is running: \`docker ps -a\`.

2\. Read its logs: \`docker logs springbootcont\`.

3\. Check that the app is listening on the expected container port.

4\. Check the port mapping in \`docker ps\`.

5\. If configured with a custom \`server.port\`, make the container port mapping match it.



**### Docker cannot find the JAR**



Build the application first:



\`\`\`bash

mvn clean package

\`\`\`



Then check \`target/\` and adjust the \`COPY\` instruction to the actual executable JAR name if needed.



**### The container name is already in use**



Remove the old container and recreate it:



\`\`\`bash

docker rm -f springbootcont

docker run -d --name springbootcont -p 8080:8080 springbootapp:v1

\`\`\`



**### Changes to Java code are not reflected**



Rebuild the JAR, rebuild the image, and recreate the container:



\`\`\`bash

mvn clean package

docker build -t springbootapp:v1 .

docker rm -f springbootcont

docker run -d --name springbootcont -p 8080:8080 springbootapp:v1

\`\`\`



**## Production Notes**



This guide uses a straightforward single-stage image for learning. For production, consider:



\- A multi-stage Docker build so build tools and source files are not included in the final runtime image.

\- Running as a non-root user.

\- Keeping secrets outside the image and supplying configuration securely at runtime.

\- Adding health checks or application-level readiness checks where appropriate.

\- Using a supported Java runtime and regularly updating base images.

\- Using appropriate logging, resource limits, and deployment practices.



**## Summary**



The core workflow is:



\`\`\`bash

\# 1. Build the Java application

mvn clean package



\# 2. Build the Docker image

docker build -t springbootapp:v1 .



\# 3. Run the container

docker run -d --name springbootcont -p 8080:8080 springbootapp:v1



\# 4. Check the container and logs

docker ps

docker logs springbootcont

\`\`\`



Remember: **\*\*Maven builds the JAR, Docker builds the image, and \`docker run\` starts a container from that image.\*\***
