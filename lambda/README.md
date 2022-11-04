# SETUP - Env and Roles:

## Setup ENV

```
export AWS_REGION=eu-west-1
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo $AWS_REGION
echo $AWS_ACCOUNT_ID

```

## Create Role

```
aws iam create-role --role-name AWSCookbookLambdaRole --assume-role-policy-document file://assume-role-policy.json
```

## Attach Role Policy

```
aws iam attach-role-policy --role-name AWSCookbookLambdaRole --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

# DOCKER - BUILD & DEPLOY IMAGE:

## Get ECR Login and pass to AWS docker

```
aws ecr get-login-password | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
```

## Build Image

NOTE: Building on mac I needed to add --platform=linux/amd64 to work on Lambda

```
docker build -t aws-cookbook506-image .
docker build --platform=linux/amd64 -t aws-cookbook506-image .
```

## Add Tag for Push to ECR

```
docker tag \
aws-cookbook506-image:latest \
$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/aws-cookbook506repo:latest
```

## Manually Create REPO in ECR "aws-cookbook506repo"

Do this in AWS console, ECR:
https://eu-west-1.console.aws.amazon.com/ecr/repositories?region=eu-west-1

## Docker Push

```
docker push \
$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/aws-cookbook506repo:latest
```

## Create Lambda Function with Docker Image:

(I hard coded the AWS Account Id un role because it kept failing to substitute in the cmd)

```
LAMBDA_ARN=$(aws lambda create-function \
    --role arn:aws:iam::369368976179:role/AWSCookbookLambdaRole \
    --function-name AWSCookbook506Lambda \
    --package-type "Image" \
    --code ImageUri=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/aws-cookbook506repo:latest \
    --output text --query FunctionArn)
```

# TESTING:

## Check Lambda Function State (expect ACTIVE):

```
aws lambda get-function --function-name $LAMBDA_ARN \
   --output text --query Configuration.State
```

## Invoke Function (Lambda):

```
aws lambda invoke --function-name $LAMBDA_ARN response.json && cat response.json
```

## Test (local):

With Docker running, start docker image (runs on port 9000 connecting to 8080 in container):

```
docker run -p 9000:8080 aws-cookbook506-image:latest
```

In a separate terminal window, execute the handler with some payload event data:

```
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"payload":"hello world!"}'
```
