# 5. deploy lambda function as docker image

Date: 2022-11-04

## Status

Accepted

## Context

With Lambda function there are various ways to package and develop/test cycle.
The slowest is to upload code manually or develop in the Lambda environment.

## Decision

Deploy Lambda functions as Docker images.
This allows:
- local testing of function
- local build and test of Docker image
- then push and verify in Lambda


## Consequences

Building Docker image on mac causes problems. Needs to set the --build-platform flag

We need to automate deployment in pipeline.
Also need ot manage API Gateway stages.

