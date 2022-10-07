# Building with Docker:

Docker makes running easy. The we can push to AWS ECR for EC2 Deploy.

Also look at docer compose to make DEV process easier.

## Build Image:

This builds a known version eg'0.0.1' and also a 'latest'

$ docker build . -t com.bragaboo/mer:latest -t com.bragaboo/mer:0.0.1

## Run Image (detached mode):

# Runs on Machine Port 80 to Docker Container Port 80

$ docker run -p 80:80 -d com.bragaboo/mer:0.0.1
or:

#### Runs on Machine Port 3000 to Docker Container Port 80

docker run -p 3000:80 -d com.bragaboo/mer:latest

#### Runs on Machine Port 3001 to Docker Container Port 80

docker run -p 3001:80 -d com.bragaboo/mer:latest

#### Runs on BOTH Machine Port 30000/3001 to Docker Container Port 80

docker run -p 3000:80 -d com.bragaboo/mer:latest
docker run -p 3001:80 -d com.bragaboo/mer:latest

http://localhost:3000 works!
http://localhost:3001 also works!

Flag '-d' runs in detached mode, else need to stop in the Docker app console.

## View Logs:

#### To get Container ID:

`$ docker ps`

CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES
a1caab7d4ea0 mer "docker-entrypoint.s…" 8 seconds ago Up 8 seconds 0.0.0.0:80->80/tcp frosty_keller

#### View Log (static)

$ docker logs {container id}
$ docker logs a1caab7d4ea0

## View Result:

$ curl -i localhost:80

Or open in browser: ---> htpp://localhost:80
