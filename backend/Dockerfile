FROM openjdk:24-jdk-slim

WORKDIR /app

COPY . .

RUN chmod +x gradlew

# Fait les tests (si echouent, ne va pas plus loin)
RUN ./gradlew test --no-daemon


# Build de prod, sans les tests
ENV SPRING_PROFILES_ACTIVE prod
RUN ./gradlew build --no-daemon -x test

EXPOSE 8080

CMD ["java", "-jar", "build/libs/backend-1.0.0.jar"]
