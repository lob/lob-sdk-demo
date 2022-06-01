FROM maven:3.8.5-jdk-11 AS build

WORKDIR /app
COPY pom.xml ./
COPY src ./src

# Package
RUN mvn clean package

# Get Java
FROM gcr.io/distroless/java
FROM openjdk:11-jre-slim
COPY --from=build /app/target/demo-1.0-SNAPSHOT.jar /app/target/demo-1.0-SNAPSHOT.jar

# Start
ENTRYPOINT ["java","-jar","/app/target/demo-1.0-SNAPSHOT.jar"]

