---
title: "14. Model Context Protocol: architecture, servers, tools, and security"
sidebar_position: 14
---

# Model Context Protocol: architecture, servers, tools, and security

**Prerequisites:** [agents](13-ai-agents.md), API schemas, authentication, authorization, and asynchronous clients. Read the [existing integration lesson](../agents/06-agent-integrations.md) before implementing a server.

## What it is and why it matters

Model Context Protocol (MCP) defines a common way for applications to discover and use external capabilities. It can replace repeated custom integration work when several compatible applications need the same tools or context. It does not train a model, grant business permissions, or decide whether an action should run.

## Learn in this order

### Architecture and transport

The **host** is the AI application. An MCP **client** inside it communicates with an MCP **server** exposing capabilities. The server may wrap a database, files, or another service. The model's action proposal still passes through the host's controls.

Local connections can use standard input/output; remote connections can use Streamable HTTP. Protocol messages and diagnostic logs must stay separate: for a stdio server, send logs to standard error. Read the [official architecture](https://modelcontextprotocol.io/docs/learn/architecture) rather than assuming every example uses the same protocol generation.

**Practice:** draw your host, client, server, and data store as separate boxes. Mark which component owns identity, checks record access, and records the operation.

### Protocol versions and capability discovery

Pin the SDK and protocol documentation used by both ends. The documentation reviewed for this roadmap describes the 2026-07-28 protocol, including discovery and per-request metadata; older tutorials can describe a different initialization lifecycle. Follow one supported version consistently.

Use the [protocol specification](https://modelcontextprotocol.io/specification/latest) and your SDK's compatibility notes for wire-level details. Discovery tells the client what is available; it does not imply that every user may invoke every capability.

**Practice:** record the client version, server version, supported protocol version, and a capability listing in your lab report. Test a missing capability and an unsupported-version response.

### Servers, tools, resources, and prompts

A tool performs a named operation with validated arguments. A resource exposes contextual data. A prompt supplies a reusable template. These are different interfaces even when they refer to the same underlying document collection. Use narrow capabilities such as `get_document` rather than exposing arbitrary filesystem or database access.

A server should produce bounded results and explicit errors. A resource URI is an identifier, not permission to read any path. Verify record access using authenticated identity at the server, because another client may bypass your original UI.

**Practice:** expose a synthetic document collection through a read-only tool and a resource. Add tests for an unknown ID, wrong tenant, invalid argument, and oversized result. Use the [server-building guide](https://modelcontextprotocol.io/docs/develop/build-server) for the chosen SDK.

### Security and operations

Review server code, dependencies, credentials, and network access. A local subprocess can have the permissions of its operating-system account. A remote service needs appropriate authentication and authorization. Do not pass unrelated downstream tokens through blindly or trust a server merely because it implements MCP.

Treat returned content as untrusted evidence. Tool descriptions can affect model behavior, so changes to them deserve review. Separate protocol compatibility, application authorization, and prompt-injection resistance in your tests. The [official security guidance](https://modelcontextprotocol.io/specification/latest/basic/security_best_practices) covers threats such as confused-deputy behavior and token misuse.

**Practice:** change a harmless tool description to request unrelated data. Confirm that your application and server permissions remain fixed. Rotate a test credential and verify revocation.

## Mastery lab: implement the boundary before the transport

An MCP tool is an integration interface. Its business function still needs validation, identity, authorization, resource limits, and a clear result contract. Test that function directly before testing it through an SDK.

```python runnable
documents = {
    "handbook": {"tenant": "A", "text": "Office opens at nine."},
}
def lookup(identity, arguments):
    if set(arguments) != {"document_id"}:
        raise ValueError("Unexpected arguments")
    key = arguments["document_id"]
    if not isinstance(key, str) or len(key) > 80:
        raise ValueError("Invalid document ID")
    document = documents.get(key)
    if document is None or document["tenant"] != identity["tenant"]:
        return {"status": "unavailable"}
    return {"status": "ok", "text": document["text"]}

print(lookup({"tenant": "A"}, {"document_id": "handbook"})["status"])
print(lookup({"tenant": "B"}, {"document_id": "handbook"})["status"])
```

```text output
ok
unavailable
```

Identity is supplied by a trusted authentication boundary, not tool arguments. Returning the same external status for absent and inaccessible records can avoid disclosing existence, though timing and other paths also need review. This snippet is a business-handler fixture, not an MCP wire implementation.

### Integrate and inspect one request

Choose a supported SDK/protocol pair. Expose the handler as a read-only tool, connect a client, discover capabilities, invoke the tool, and compare its result with the direct-function test. Record request identity, tool name, schema version, duration, and result class without logging credentials or full sensitive content.

Distinguish a tool, a resource, and a prompt by who consumes them and what they provide. Neither discovery nor a model-visible tool description grants authority. For a local stdio server, protocol messages go on the protocol stream and diagnostic output goes to stderr. Follow the [versioned architecture documentation](https://modelcontextprotocol.io/docs/learn/architecture) for lifecycle details.

### Debug, optimize, and design

If a client cannot discover a tool, investigate process startup, transport, protocol compatibility, and discovery before inspecting the model. If discovery works but execution fails, inspect schema, identity, handler errors, and timeout policy. If an answer is wrong despite a correct tool result, the failure belongs to the host's use of evidence.

Bound result size, execution time, and concurrency. Add caching only when data freshness and caller access allow it. Keep cache keys scoped correctly; an integration protocol does not isolate tenants automatically. For write tools, use the same operation and recovery contract as any other remote write.

**Interview defense:** “Why not expose a generic SQL tool?” Discuss input scope, access, query cost, result size, injection boundaries, auditing, and whether a narrow domain operation solves the actual task with less authority.

**Teach it:** trace host → client → server → handler → datastore, naming the contract at each arrow. Introduce a protocol error, an authorization denial, and an unsupported factual answer; ask the learner to locate each failure. Deliver a live integration transcript, direct-handler tests, denied-access cases, and a versioned deployment contract.

## Mini project and real-world use

Wrap the existing documentation lookup behind an MCP server and connect one compatible test client. Keep the ordinary function implementation and its tests. Demonstrate the same successful lookup through both interfaces.

Then add a second client or a second supported transport only when the first works. This demonstrates the integration benefit directly instead of assuming protocol adoption improves answer quality.

Uses include IDE context, internal catalogue lookup, approved document access, and shared developer tools.

**Completion evidence:** architecture diagram, version record, capability contract, client/server integration test, denied-access test, bounded error handling, and sanitized logs. Offline protocol fixtures and a live server connection are different verification levels.

## Interview questions

1. How do host, client, and server differ?
2. When is a resource a better interface than a tool?
3. Why can normal print debugging break a stdio server?
4. Why is capability discovery not authorization?
5. What must you inspect before installing a local server?
6. Why must an MCP server enforce access even when the host already checks it?

## Curated resources

- **Course:** [Hugging Face MCP course](https://huggingface.co/learn/mcp-course/unit0/introduction); compare its examples with the protocol version you actually use.
- **Book:** [Architecture Patterns with Python](https://www.cosmicpython.com/book/preface.html), for the adapter and boundary design behind an MCP integration. This is a supporting architecture book, not an MCP specification.
- **Paper / primary specification:** [MCP specification](https://modelcontextprotocol.io/specification/latest). For a changing protocol, this is more authoritative than a paper describing an older version.
- **GitHub:** [Official Python SDK](https://github.com/modelcontextprotocol/python-sdk) and [MCP Inspector](https://github.com/modelcontextprotocol/inspector).

**Previous:** [Agents](13-ai-agents.md) · **Next:** [Frameworks](15-frameworks.md).
