docker stop MD3-PROD && docker container rm MD3-PROD
docker image rm md3-prod
docker build -t md3-prod .
docker container run --name MD3-PROD -dp 3750:3000 md3-prod