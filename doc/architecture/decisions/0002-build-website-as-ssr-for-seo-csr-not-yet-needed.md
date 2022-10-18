# 2. Build Website as SSR for SEO. CSR not yet needed.

Date: 2022-10-18

## Status

Accepted

## Context

The issue motivating this decision, and any context that influences or constrains the decision.

Need to decide if website shouuld be CSR or SSR. ClientServer Side Rendered.
For example, the PPM dispay could be a specific Micro Frontend for a PPM Service.
Or could be a component embedded on page, or coud be a small React(etc) app.

## Decision

The change that we're proposing or have agreed to implement.

Use SSR to render HTML webpages with content embedded server side.
At this stage, there is no need for user interaction so simple HTML is fine.
SSR also provides for SEO benefits which will help GTM.

## Consequences

What becomes easier or more difficult to do and any risks introduced by the change that will need to be mitigated.

This makes initial release easier and faster. And leaves open for later compexity.
