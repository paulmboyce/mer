# 3. Build separate Web and API layers

Date: 2022-10-18

## Status

Accepted

## Context


Currently we have a single service which is an express server that gets data from NOAA weather service via a get request, then populates a Hnadlebars teamplate and returns as a complete HTML response.

The question is how to separate these responsibilities for maintainance and scalability.

## Decision

To build an architecture for scalability, we want:
- a webserver layer behind a load balancer (can be scaled horizontally)
- a service layer behind a load balancer (can be scaled horizontally)
Web layer calls internally to Service Layer via HTTP.


## Consequences

This is more complex than a simple Web App calling to services on same VM.
Why push the services down a layer? 
Why push for a Tech Arch separation rather than a services separation?

We can build smaller Services with database separation in the Service layer, 
and the Web layer can merge results for rendering.
We could then deploy each service separately.
Think "open for micro services but not micro FEs"


