FROM eclipse-temurin:11-jdk-alpine

WORKDIR /app

#COPYING an ALL .jar files which are in target/ folder to app.jar file which will get create in /app conatiner folder 
COPY target/*.jar app.jar  

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
