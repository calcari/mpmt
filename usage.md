# MPMT - Application de Gestion de Projet - Franck Calcari


# Déploiement
Lorsqu'un commit a lieu sur la branche "prod" et qu'il est push sur le repo remote GitHub, alors GitHub actions fait :
- Build les images avec docker compose
- Les publie sur le container registry de GitLab (ghcr)

## Backend

### Config
- Java 24

### Commandes

```
cd backend

# Démarrer l'application en mode développement
gradlew.bat bootRun

# Exécuter les tests
gradlew.bat test

# Compiler l'application
gradlew.bat build

#Démarrer en prod
set SPRING_PROFILES_ACTIVE=prod
java -jar build/libs/mpmt-backend-{version}.jar

```

### Base de données

- **Développement** : H2 en mémoire (http://localhost:8080/h2-console)
- **Production** : Configuration à définir dans application-prod.properties

## Frontend

### Config
- Angular 20

### Commandes

````
cd frontend

# Démarrer angular en mode dev
pnpm dev

# Executer les tests
pnpm test

# Coverage
pnpm test:coverage

# Build (prod)
pnpm build
```