# Building with Docker:

Docker makes running easy. The we can push to AWS ECR for EC2 Deploy.

Also look at docer compose to make DEV process easier.

## Build Image:

This builds a known version eg'0.0.1' and also a 'latest'

```
$ docker build . -t com.bragaboo/mer:latest -t com.bragaboo/mer:0.0.1
```

## Run Image (detached mode):

# Runs on Machine Port 80 to Docker Container Port 80

```
$ docker run -p 80:80 -d com.bragaboo/mer:0.0.1
```

or:

#### Runs on Machine Port 3000 to Docker Container Port 80

```
$ docker run -p 3000:80 -d com.bragaboo/mer:latest
```

#### Runs on Machine Port 3001 to Docker Container Port 80

```
$ docker run -p 3001:80 -d com.bragaboo/mer:latest
```

#### Runs on BOTH Machine Port 30000/3001 to Docker Container Port 80

```
$ docker run -p 3000:80 -d com.bragaboo/mer:latest
$ docker run -p 3001:80 -d com.bragaboo/mer:latest
```

http://localhost:3000 works!
http://localhost:3001 also works!

Flag '-d' runs in detached mode, else need to stop in the Docker app console.

## View Logs:

#### To get Container ID:

```
$ docker ps
```

CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES
a1caab7d4ea0 mer "docker-entrypoint.s…" 8 seconds ago Up 8 seconds 0.0.0.0:80->80/tcp frosty_keller

#### View Log (static)

```
$ docker logs {container id}
$ docker logs a1caab7d4ea0
```

## View Result:

```
$ curl -i localhost:80
```

Or open in browser: ---> http://localhost:80

# Building with Copilot:

Copilot allows to build a Docker image, upload to ECR, create a full Loadbalned Cluster and provision services in EC2 Fargate containers.
The advantage of Copilot is you can get a full infrastructure created automatically by AWS.
You can then keep the infrastucture and deploy updates to image Github (CircleCI, or other CI/CD pipeline tool) into this infrastructure.
Or, yo can just destroy the entire infrastructure, and recrete again as needed.
This allows a lot of options to get "Best Practice" arctitecture from AWS with minimal effort.
YOu can then explore what AWS created and reuse it, or recreate from scratch.
Generally the process of proviioning an infrastructure is a one step, followed by subsequent iterations.
NOTE: Copilot creates mainfest files (in the copilot folder) which are configurable.
Also, in theory you can use Copilot to redeploy a Docker image without rebuilding it using the image.location prop.
I remaiin t see how useful Copilot is for redeployments. It is possible that Coplot could be plugged directly to the CI/CD pipeline.

## Summary:

1. Use Copilot initial pass to create the manifests
2. Can stop/start service fairly quickly:

#### Init app:

```
$ copilot init \
  --app mer-app \
  --name ppm-service \
  --type 'Load Balanced Web Service'
```

#### Init env (accept defaults)

```
$ copilot env init --name development --region eu-west-1
```

#### Deploy env + service

```
$ copilot env deploy --name development
$ copilot svc deploy --name ppm-service --env development
```

NOTE: Copilot autogenerates names for:

- ECS Cluster Name
- ECS Service Name
- 2x Role Names (defined in Task Defn)

So... need to update for CI/CD Pipeline:

- - .aws/mer-app-development-ppm-service-task-defn.json
- - .github/workflows/aws-ecr.yml )

## Commands:

### Build and Deploy a Service intot a Cluster one go (via Copilot):

This BUILDs everything, creates copilot folder with all configuration, and deploys infractructure with image and provisions with URL.
(Deploys your container app on AWS App Runner or Amazon ECS on AWS Fargate, complete with a networking stack and roles.)

```
$ copilot init --app mer-app --name ppm-service --type 'Load Balanced Web Service' --dockerfile './Dockerfile' --port 80 --deploy
```

SEE: https://aws.github.io/copilot-cli/docs/commands/init/

### Build Service into a Cluster (via Copilot):

Here's a simpler version that builds the copiot manifests and Docker Image, but does not deploy the infrastructure:

```
$ copilot init \
  --app mer-app \
  --name ppm-service \
  --type 'Load Balanced Web Service'
```

### Create Initial Environment, Roles etc (via Copilot):

```
$ copilot env init
```

Environment name: development
Credential source: Enter temporary credentials
AWS Access Key ID: **\*\***\*\*\*\***\*\***ZQ7T
AWS Secret Access Key: **\*\***\*\*\*\***\*\***18TE
AWS Session Token:
Region: eu-west-1

Would you like to use the default configuration for a new environment? - A new VPC with 2 AZs, 2 public subnets and 2 private subnets - A new ECS Cluster - New IAM Roles to manage services and jobs in your environment
[Use arrows to move, type to filter]

> Yes, use default.

    Yes, but I'd like configure the default resources (CIDR ranges, AZs).
    No, I'd like to import existing resources (VPC, subnets).

OUTPUT:
Wrote the manifest for environment development at copilot/environments/development/manifest.yml

### Deploy the Environment (via Copilot):

This takes the configurations in your environment manifest (in copilot folder) and deploys your environment infrastructure:

```
$ copilot env deploy
```

### Define the service (via Copilot):

Define the service (creates manifest in /copilot/{service-name}/manifest.yml):

```
$ copilot svc init \
  --name ppm-service \
  --image 369368976179.dkr.ecr.eu-west-1.amazonaws.com/bragaboo-mer:latest \
  --type 'Load Balanced Web Service' \
  --port 80 \
```

### Deploy the Service (via Copilot):

Deploy the service (WITHOUT rebuilding the image):
$ copilot svc deploy

### List Infrastructure (via Copilot):

This LISTs the infrastructure deployed for the app:
$ copilot svc show

### Create Cloudformation Templates (via Copilot):

Optionally, create local copies of the CloudFormation template(s) used to deploy our service to an environment.

```
$ copilot svc package --output-dir ./infrastructure
```

### Delete Infrastructure (via Copilot):

This DESTROYs the infrastructure for the app:

```
$ copilot app delete
```

### View Running Service Config:

```
$ copilot svc show
```

### View Running Service Logs:

```
$ copilot svc logs
```

# Infrastructure - Cloud Formation Templates

## Create CF Templates for Environments and Services:

### CF for an Environment:

```
copilot env package -n development --output-dir ./cf-infrastructure/env/development
```

### CF for a Service:

```
copilot svc package -n ppm-service -e development --output-dir ./cf-infrastructure/service
```
