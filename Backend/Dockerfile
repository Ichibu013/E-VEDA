# --- Build Stage ---
# This stage compiles your Java application using Maven.
# Updated to use a more robust Maven image with Amazon Corretto OpenJDK 21.
FROM maven:3.9.6-amazoncorretto-21 AS builder

# Set the working directory inside the container.
WORKDIR /app

# Copy the Maven project files.
# Copy pom.xml first to leverage Docker layer caching.
COPY pom.xml .

# Copy the source code for both API and Gateway modules.
# Assuming API and Gateway are subdirectories of the root where pom.xml resides.
COPY API ./API
COPY Gateway ./Gateway

# Build the application.
# -DskipTests is used to skip running tests during the build, which is common in Docker builds.
# This command will build both API-0.0.1-SNAPSHOT.jar and Gateway-0.0.1-SNAPSHOT.jar
RUN #mvn clean install -DskipTests

# --- Run Stage ---
# This stage creates a lightweight image to run your application.
# Using a JRE-only image is smaller than a full JDK image.
# Updated to use Amazon Corretto JRE 21 (alpine variant for smaller size).
FROM amazoncorretto:21-al2023-jdk AS runner

# Set the working directory for the runtime environment.
WORKDIR /app

# Copy the built Gateway JAR file from the 'builder' stage.
# The path /app/Gateway/target/Gateway-0.0.1-SNAPSHOT.jar is relative to the builder's WORKDIR.
COPY --from=builder /app/Gateway/target/Gateway-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your application listens on.
EXPOSE 8080

# Define the command to run your application when the container starts.
ENTRYPOINT ["java", "-jar", "app.jar"]
