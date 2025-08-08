# --- Build Stage ---
# This stage compiles your Java application using Maven.
FROM maven:3.9.6-amazoncorretto-21 AS builder

# Set the working directory inside the container.
WORKDIR /app

# Copy the Maven project files first to leverage Docker layer caching.
# This ensures that if only your source code changes, Maven dependencies are not re-downloaded.
COPY pom.xml .
COPY Gateway/pom.xml ./Gateway/
COPY API/pom.xml ./API/
COPY Common/pom.xml ./Common/

# Download all dependencies into the local Maven repository.
# This separates the dependency download step from the compilation step.
RUN mvn dependency:go-offline

# Copy the source code for both API and Gateway modules.
# Now, if source code changes, this layer is invalidated, but the dependencies layer above remains cached.
COPY API ./API
COPY Gateway ./Gateway
COPY Common ./Common

# Run the full Maven build to create both API and Gateway JAR files.
# The previous `RUN` command was commented out; this is the crucial fix.
RUN mvn clean install -DskipTests

# --- Run Stage ---
# This stage creates a lightweight image to run your application.
# Using a JRE-only image is smaller than a full JDK image.
# We'll use the slim JDK image as it's a good balance of size and functionality.
FROM amazoncorretto:21-al2023-jdk AS runner

# Set the working directory for the runtime environment.
WORKDIR /app

# Copy the built Gateway JAR file from the 'builder' stage.
# The path /app/Gateway/target/Gateway-0.0.1-SNAPSHOT.jar is relative to the builder's WORKDIR.
COPY --from=builder /app/Gateway/target/*.jar /app/app.jar

# Expose the port your application listens on.
EXPOSE 8080

# Define the command to run your application when the container starts.
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
