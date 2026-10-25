---
title: "Sources, attribution, and verification"
slug: "/system-design/sources"
pagination_prev: "system-design/case-studies/design-review"
pagination_next: "system-design/references/research-papers"
---

<span id="sources-attribution-and-verification"></span>

# Sources, attribution, and verification

**Prerequisite / previous:** [Architecture reviews and interviews](../case-studies/design-review.md) · **Next:** [Research papers](research-papers.md)

This is the source register for the single [course](../README.md). The imported handbooks are consolidated into the lessons and worked designs instead of remaining parallel courses. Use the original collections and credits below to trace their sources.

## Original collections

- [Karan Pratap Singh — System Design](https://github.com/karanpratapsingh/system-design): original handbook, concept diagrams, estimates, and URL shortener/chat/feed/video/ride design prompts. Adapted and corrected; hypothetical designs are not claims about the named companies' current systems.
- [Donne Martin — System Design Primer](https://github.com/donnemartin/system-design-primer): design questions, trade-off discussions, and companion practice. License and credits are retained below.
- [Awesome Scalability](https://github.com/binhnguyennus/awesome-scalability): the [external bibliography](scalability-reading-list.md), retained as research material rather than another syllabus.
- Existing ByteByteGo notes and attributed guest illustrations: retained distinct case studies and consolidated overlapping explanations. Original source URLs and image references remain in the recovery inventory. Guest author acknowledgements included Love Sharma and Govardhana Miriyala Kannaiah.

## How to use the sources

The lessons distinguish standards, versioned implementation documentation, dated engineering accounts, and hypothetical exercises. Prefer a named invariant and failure model over an unqualified product claim. Popularity lists, tool promotions, and speculative model-cost comparisons are not architecture evidence.

The inline references in the corrected lessons support the specific surrounding statements. The maintained verification record below names the review scope; it does not certify every historical external article or remote illustration in the bibliography.

## Companion practice preserved from the primer

- [System design worked solutions](https://github.com/donnemartin/system-design-primer#system-design-interview-questions-with-solutions): social graph, web crawler, key-value store, and other comparison exercises.
- [Object-oriented design practice](https://github.com/donnemartin/system-design-primer#object-oriented-design-interview-questions-with-solutions): use after system boundaries and invariants are clear.
- [Flashcards](https://github.com/donnemartin/system-design-primer#anki-flashcards): recall aids, not a substitute for worked failure analysis.
- Books preserved as further study: *Designing Data-Intensive Applications*, *Domain-Driven Design*, *Design Patterns*, *The Pragmatic Programmer*, *Code Complete*, *Refactoring*, *Clean Code*, *Introduction to Algorithms*, *Cracking the Coding Interview*, and *System Design Interview*. These are background references, not a separate mandatory track.

## Credits

Credits and sources are provided throughout this repo.

Special thanks to:

* [Hired in tech](http://www.hiredintech.com/system-design/the-system-design-process/)
* [Cracking the coding interview](https://www.amazon.com/dp/0984782850/)
* [High scalability](http://highscalability.com/)
* [checkcheckzz/system-design-interview](https://github.com/checkcheckzz/system-design-interview)
* [shashank88/system_design](https://github.com/shashank88/system_design)
* [mmcgrana/services-engineering](https://github.com/mmcgrana/services-engineering)
* [System design cheat sheet](https://gist.github.com/vasanthk/485d1c25737e8e72759f)
* [A distributed systems reading list](http://dancres.github.io/Pages/)
* [Cracking the system design interview](http://www.puncsky.com/blog/2016-02-13-crack-the-system-design-interview)

## License

*I am providing code and resources in this repository to you under an open source license.  Because this is my personal repository, the license you receive to my code and resources is from me and not my employer (Facebook).*

```text
Copyright 2017 Donne Martin

Creative Commons Attribution 4.0 International License (CC BY 4.0)

http://creativecommons.org/licenses/by/4.0/

```

## Further reading retained from the original notes

Engineering publications from Netflix, Uber, Cloudflare, Meta, LinkedIn, Discord, AWS, Slack, and Stripe are useful when the specific article names a date, workload, and measured result. Additional books retained as background are *Accelerate*, *Continuous Delivery*, *Site Reliability Engineering*, *Effective DevOps*, *The Phoenix Project*, and *The DevOps Handbook*. Tool lists were consolidated into relevant lessons rather than preserved as competing roadmaps.

## Verification record — 25 October 2026

The revised authentication, transport, password storage, database isolation, queue delivery, retry, object upload, Kubernetes probe/service, and payment-idempotency explanations were checked against the primary sources linked beside those claims. Dated Figma, Discord, Airbnb, and Netflix examples use the linked engineering accounts. Other retained company notes are explicitly historical reading material; their complete current technology inventories and every external bibliography link were not independently verified.

## Top 8 Standards Every Developer Should Know


![Top 8 Standards Every Developer Should Know — reference illustration](https://assets.bytebytego.com/diagrams/0015-8-standards-developers-should-know.png)

### Exercise

Choose one HTTP operation and specify its JSON schema, authentication, timestamp format, and compatibility policy. Distinguish normative requirements from product conventions.

## Repository-wide consolidation verification

The 25 October 2026 repository pass read all 433 Markdown/MDX source and report files into an inventory, parsed all published documents, and classified System Design overlaps by topic and section. JavaScript, algorithms, frontend, and coding-pattern explanations retain their existing canonical homes. System Design and Backend Engineering now form one course; company accounts appear beside the mechanism they illustrate.

New primary-source checks covered [Google SRE overload](https://sre.google/sre-book/handling-overload/), [Google SLO alerting](https://sre.google/workbook/alerting-on-slos/), [Fowler's event patterns](https://martinfowler.com/articles/201701-event-driven.html), [Cloudflare cache controls](https://developers.cloudflare.com/cache/concepts/cache-control/), [AWS recovery planning](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/plan-for-disaster-recovery-dr.html), [Microsoft's BFF pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/backends-for-frontends), [Kubernetes Services](https://kubernetes.io/docs/concepts/services-networking/service/), [gRPC deadlines](https://grpc.io/docs/guides/deadlines/), [Express error handling](https://expressjs.com/en/guide/error-handling/), [Socket.IO's Redis adapter](https://socket.io/docs/v4/redis-adapter/), [BullMQ scheduler history](https://docs.bullmq.io/guide/queuescheduler), [Google TrueTime](https://docs.cloud.google.com/spanner/docs/true-time-external-consistency), [Flink event time](https://nightlies.apache.org/flink/flink-docs-stable/docs/concepts/time/), and [Microsoft experimentation diagnostics](https://www.microsoft.com/en-us/research/articles/diagnosing-sample-ratio-mismatch-in-a-b-testing/).

The validation scripts distinguish Markdown/MDX compilation, relative-link and anchor checks, JSON/YAML and JavaScript/TypeScript syntax, executable lesson examples, compiled navigation, and browser diagram rendering. Framework fragments with external services are not integration-tested deployments. Historical illustrations and every external bibliography URL are not covered by deterministic link validation. The reports state those limits rather than equating a successful site build with production correctness.
