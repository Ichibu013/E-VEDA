FROM openjdk:21-jdk-slim
LABEL authors="ansha"

WORKDIR /app

COPY target/E-VEDA-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]