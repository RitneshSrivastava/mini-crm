FROM eclipse-temurin:21-jdk


RUN apt-get update && apt-get install -y maven

WORKDIR /app

COPY pom.xml .


RUN mvn dependency:go-offline


COPY backend/src ./src


RUN mvn clean package -DskipTests


CMD ["java", "-Dspring.profiles.active=production", "-jar", "target/mini-crm-0.0.1-SNAPSHOT.jar"]
