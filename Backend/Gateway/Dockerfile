FROM openjdk:21-jdk-slim
LABEL authors="ansha"

WORKDIR /app

COPY . .
#COPY target/Gateway-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

CMD ["mvn", "spring-boot:run", "-pl", "gateway", "-Dspring-boot.run.jvmArguments=-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005", "-Dspring.devtools.restart.enabled=true"]

ENTRYPOINT ["java", "-jar", "app.jar"]