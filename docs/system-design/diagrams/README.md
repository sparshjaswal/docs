---
title: "System design diagram sources"
slug: "/system-design/diagrams"
pagination_prev: "system-design/references/illustrations"
pagination_next: null
---

<span id="system-design-diagram-sources"></span>

# System design diagram sources

**Prerequisite / previous:** [Illustration catalog](../references/illustrations.md)


These original Excalidraw documents support the [handbook](../references/sources.md) and architecture exercises. Import a file into Excalidraw to inspect or edit it. They are source assets, not Mermaid. The course keeps explanations in text so a missing remote illustration does not hide a required concept.

## Complete asset index

- [api gateway](api-gateway.excalidraw) — editable architecture diagram.
- [caching](caching.excalidraw) — editable architecture diagram.
- [cap](cap.excalidraw) — editable architecture diagram.
- [cdn](cdn.excalidraw) — editable architecture diagram.
- [circuit breaker](circuit-breaker.excalidraw) — editable architecture diagram.
- [clustering](clustering.excalidraw) — editable architecture diagram.
- [consistent hashing](consistent-hashing.excalidraw) — editable architecture diagram.
- [cqrs](cqrs.excalidraw) — editable architecture diagram.
- [database replication](database-replication.excalidraw) — editable architecture diagram.
- [db dbms](db-dbms.excalidraw) — editable architecture diagram.
- [disaster recovery](disaster-recovery.excalidraw) — editable architecture diagram.
- [distributed transactions](distributed-transactions.excalidraw) — editable architecture diagram.
- [domain name system](domain-name-system.excalidraw) — editable architecture diagram.
- [enterprise service bus](enterprise-service-bus.excalidraw) — editable architecture diagram.
- [event driven architecture](event-driven-architecture.excalidraw) — editable architecture diagram.
- [event sourcing](event-sourcing.excalidraw) — editable architecture diagram.
- [federated database](federated-database.excalidraw) — editable architecture diagram.
- [geohashing quadtrees](geohashing-quadtrees.excalidraw) — editable architecture diagram.
- [indexes](indexes.excalidraw) — editable architecture diagram.
- [load balancing](load-balancing.excalidraw) — editable architecture diagram.
- [lp ws sse](lp-ws-sse.excalidraw) — editable architecture diagram.
- [message brokers](message-brokers.excalidraw) — editable architecture diagram.
- [message queues](message-queues.excalidraw) — editable architecture diagram.
- [monoliths microservices](monoliths-microservices.excalidraw) — editable architecture diagram.
- [n tier architecture](n-tier-architecture.excalidraw) — editable architecture diagram.
- [netflix](netflix.excalidraw) — editable architecture diagram.
- [oauth openid connect](oauth-openid-connect.excalidraw) — editable architecture diagram.
- [osi](osi.excalidraw) — editable architecture diagram.
- [pacelc](pacelc.excalidraw) — editable architecture diagram.
- [proxy](proxy.excalidraw) — editable architecture diagram.
- [pubsub](pubsub.excalidraw) — editable architecture diagram.
- [rate limiting](rate-limiting.excalidraw) — editable architecture diagram.
- [scaling](scaling.excalidraw) — editable architecture diagram.
- [service discovery](service-discovery.excalidraw) — editable architecture diagram.
- [sharding](sharding.excalidraw) — editable architecture diagram.
- [sso](sso.excalidraw) — editable architecture diagram.
- [tcp udp](tcp-udp.excalidraw) — editable architecture diagram.
- [transactions](transactions.excalidraw) — editable architecture diagram.
- [twitter](twitter.excalidraw) — editable architecture diagram.
- [uber](uber.excalidraw) — editable architecture diagram.
- [url shortener](url-shortener.excalidraw) — editable architecture diagram.
- [virtualization containerization](virtualization-containerization.excalidraw) — editable architecture diagram.
- [whatsapp](whatsapp.excalidraw) — editable architecture diagram.

## Choosing a diagram format

Use a request sequence when timing and acknowledgement matter, a component flow when ownership and data movement matter, and a state diagram for allowed transitions. Mermaid, PlantUML, ASCII diagrams, Excalidraw, and diagram-as-code libraries are tools for expressing these views; generated graphics do not prove that an architecture is correct. Keep labels readable, name trust boundaries, and avoid decorative vendor-logo maps.

**Exercise:** draw one failed request twice: once as a sequence and once as a state transition. Explain which unanswered question each view reveals.
