#!/bin/bash
cd server || exit
./gradlew build -Dquarkus.native.enabled=true -Dquarkus.package.jar.enabled=false
cd ..
docker compose up -d
