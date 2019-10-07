# Course Rating Restful API
This is the back end for a course rating service. I decided to update an older project with cleaner architecture and more features such as caching and docker for easier development. The technologies used are node, docker, redis, and mongodb.

## Useful commands
    - `docker-compose run api npm install` to install all dependencies in package.json
        **you must do this before attempting to build the image the first time**
    - `docker-compose run api npm install --save <packageName>` to install a specific package
    - `docker-compose stop` to stop all running containers
    - `docker-compose down` to remove containers and volumes

## Tests
 - `docker-compose run --rm api npm run test` will run all tests suites with jest

## Build
  `docker-compose run --rm api npm run build` will create a `dist/` dir and compile all code with babel