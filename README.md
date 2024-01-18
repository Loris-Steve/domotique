
# creer reseaux backend & sweet-hom
docker network create -d bridge backend
docker network create -d bridge sweet-home

# ajouter le chemin vers "mosquitto" du volumes ligne 8 dans le fichier le "docker-compose.yml"

# dans server.js mettre la bonne adresse vers le serveur mqtt "const addresseQTT = "_bonne_addresse_"; "

## MQTT Server setup (In IOT folder make)
```
Docker compose up
```

## central server setup (In IOT server folder make)
```
Docker compose up
```

### frontend setup (read readme in domotiqueDashboard folder)
