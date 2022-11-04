# 4. deploy ppm as lambda function with api gateway cache

Date: 2022-11-04

## Status

Accepted

## Context

Initial design was that getting PPM data from NOAA Mauii would run as an EC2 service (or Docker Image in ECS)
but this data updates infrequently at source, and equaly we do not neeed to update it more frequently 
than daily (largely because the data are daily averages).

## Decision

Deploy PPM as a Lambda Function, behind API Gateway for HTTP calls.  
Use cache on API Gateway to avod calls to source.
Cache involves some cost, but is more responsive, and avoids hitting the source (which in theory could also be throttled).
NOTE: max cache TTL is 3600 secs (1hr).

Now we have a simple Lambda function, with caching.  

## Consequences

Development now has extra infratsructure and perhaps a different DEV cycle for Lambda.
The Lambda funciton though is serverless so ZERO provisioning.

Deployment via pipeline may also update, as current deployment is set for ECS.
Need to verify github action deployment and republish to Lambda.
 
