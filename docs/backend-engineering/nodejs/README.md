---
id: backend-engineering-nodejs-readme
title: "Node.js 🟢"
slug: /backend-engineering/nodejs/README
sidebar_label: "Node.js 🟢"
---

# Node.js 🟢

Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine, designed for building scalable network applications. Its event-driven, non-blocking I/O model makes it lightweight and efficient for data-intensive real-time applications.

## Architecture

```
JavaScript Code
      ↓
Node.js APIs (fs, http, path, crypto, ...)
      ↓
libuv (async I/O, event loop, thread pool)
      ↓
Operating System
```

**Key characteristics:**

| Feature                        | Description                                                                                    |
| ------------------------------ | ---------------------------------------------------------------------------------------------- |
| **Single-threaded event loop** | One main thread handles all JS execution; I/O is offloaded to the kernel or thread pool        |
| **Non-blocking I/O**           | Operations that would block use callbacks/promises, keeping the thread free for other requests |
| **Event-driven**               | The event loop picks up completed I/O operations and invokes their callbacks                   |
| **Cross-platform**             | Runs on Linux, macOS, Windows, and more                                                        |

### Core Modules

| Module           | Purpose                                  |
| ---------------- | ---------------------------------------- |
| `fs`             | File system operations                   |
| `http` / `https` | HTTP server and client                   |
| `path`           | File path utilities                      |
| `crypto`         | Cryptographic functions                  |
| `stream`         | Streaming data processing                |
| `events`         | EventEmitter base class                  |
| `child_process`  | Spawn subprocesses                       |
| `worker_threads` | True multi-threading for CPU-bound tasks |
| `cluster`        | Multi-process load balancing             |
| `os`             | Operating system utilities               |
| `url`            | URL parsing and formatting               |

---

## Express 🚂

Express is the most popular Node.js web framework — minimal, unopinionated, and battle-tested. It provides a thin layer of fundamental web application features on top of Node.js.

### Core Concepts

**Middleware pipeline:**

```javascript
const express = require('express');
const app = express();

// Application-level middleware
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse form data
app.use((req, res, next) => {
  // custom logger
  console.log(`${req.method} ${req.url}`);
  next();
});

// Route-level middleware
app.get('/api/users', authenticate, getUsers);
```

**Routing:**

```javascript
// Basic routes
app.get('/api/users', getUsers);
app.post('/api/users', createUser);
app.put('/api/users/:id', updateUser);
app.delete('/api/users/:id', deleteUser);

// Router modules (modular organization)
const userRouter = express.Router();
userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
app.use('/api/users', userRouter);
```

**Error handling middleware** (4 parameters):

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: { message: err.message },
  });
});
```

### Project Structure

```
src/
├── routes/          # Route definitions
│   ├── users.js
│   └── products.js
├── controllers/     # Request handlers
│   ├── userController.js
│   └── productController.js
├── middleware/       # Custom middleware
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
├── models/          # Database models
├── services/        # Business logic
├── utils/           # Helper functions
├── config/          # Configuration
└── app.js           # Entry point
```

---

## NestJS 🐱

NestJS is a progressive framework for building efficient, scalable server-side applications. It uses TypeScript by default and combines elements of OOP, FP, and FRP (Functional Reactive Programming).

### Core Concepts

**Modules** — organize application structure:

```typescript
@Module({
  imports: [UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**Controllers** — handle incoming requests:

```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}
```

**Providers / Services** — business logic, injectable via DI:

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
```

**Guards** — authorization (roles, permissions):

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    return roles.includes(request.user?.role);
  }
}

@UseGuards(RolesGuard)
@Roles('admin')
@Get('admin')
getAdminData() {}
```

**Interceptors** — transform responses, wrap logic:

```typescript
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => ({ success: true, data, timestamp: new Date() })));
  }
}
```

**Pipes** — validate and transform input:

```typescript
@Post()
create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

### NestJS CLI

```bash
# Generate a full CRUD resource
nest g resource users

# Generate individual components
nest g module auth
nest g controller auth
nest g service auth
nest g guard roles
nest g pipe validation
```

### Express vs NestJS

| Criteria                 | Express                    | NestJS                                       |
| ------------------------ | -------------------------- | -------------------------------------------- |
| **Philosophy**           | Minimal, unopinionated     | Opinionated, batteries-included              |
| **Architecture**         | Middleware functions       | Modules, controllers, providers              |
| **TypeScript**           | Optional, manual setup     | First-class, built-in                        |
| **Dependency Injection** | Manual, not built-in       | Built-in DI container                        |
| **Testing**              | Manual setup (Jest, Mocha) | Built-in testing module with Jest            |
| **GraphQL**              | Manual setup               | Built-in code-first and schema-first         |
| **Microservices**        | Manual                     | Built-in transport layer (Redis, NATS, MQTT) |
| **Best for**             | Small to medium apps, APIs | Large enterprise apps, complex architectures |

[← Back to Backend Engineering](../README.md) · © sparshjaswal
