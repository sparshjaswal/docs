---
id: javascript-testing-guide
title: "🧪 JavaScript Testing Mastery Guide"
slug: /javascript/testing-guide
sidebar_label: "🧪 JavaScript Testing Master..."
---

# 🧪 JavaScript Testing Mastery Guide

> **Comprehensive testing strategies for robust JavaScript applications**

## Table of Contents

- [Testing Fundamentals](#testing-fundamentals)
- [Unit Testing Best Practices](#unit-testing-best-practices)
- [Integration Testing](#integration-testing)
- [Mock & Spy Patterns](#mock--spy-patterns)
- [Async Testing](#async-testing)
- [Testing DOM & Events](#testing-dom--events)
- [Performance Testing](#performance-testing)
- [Test-Driven Development](#test-driven-development)

---

## Testing Fundamentals

### Test Structure & Organization

```javascript
// ✅ Good - Descriptive test structure using AAA pattern
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user with valid data', () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      };
      const userService = new UserService();

      // Act
      const result = userService.createUser(userData);

      // Assert
      expect(result).toMatchObject({
        id: expect.any(String),
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        createdAt: expect.any(Date),
      });
    });

    it('should throw error for invalid email format', () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        age: 30,
      };
      const userService = new UserService();

      // Act & Assert
      expect(() => userService.createUser(userData)).toThrow('Invalid email format');
    });

    it('should assign default age when age is not provided', () => {
      // Arrange
      const userData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
      };
      const userService = new UserService();

      // Act
      const result = userService.createUser(userData);

      // Assert
      expect(result.age).toBe(18); // Default age
    });
  });
});
```

### Custom Matchers & Test Utilities

```javascript
// ✅ Custom matchers for better assertions
const customMatchers = {
  toBeValidEmail(received) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);

    return {
      message: () => `Expected ${received} ${pass ? 'not ' : ''}to be a valid email`,
      pass,
    };
  },

  toBeWithinRange(received, min, max) {
    const pass = received >= min && received <= max;

    return {
      message: () => `Expected ${received} ${pass ? 'not ' : ''}to be within range ${min}-${max}`,
      pass,
    };
  },

  toHaveBeenCalledWithValidUser(received) {
    if (received.mock.calls.length === 0) {
      return {
        message: () => 'Expected function to have been called',
        pass: false,
      };
    }

    const lastCall = received.mock.calls[received.mock.calls.length - 1];
    const user = lastCall[0];

    const isValid =
      user &&
      typeof user.name === 'string' &&
      typeof user.email === 'string' &&
      user.email.includes('@');

    return {
      message: () => `Expected function to have been called with valid user object`,
      pass: isValid,
    };
  },
};

// Extend Jest matchers
expect.extend(customMatchers);

// ✅ Test utilities and fixtures
class TestDataBuilder {
  constructor() {
    this.data = {};
  }

  static user() {
    return new TestDataBuilder().withValidUser();
  }

  withValidUser() {
    this.data = {
      name: 'Test User',
      email: 'test@example.com',
      age: 25,
      isActive: true,
    };
    return this;
  }

  withName(name) {
    this.data.name = name;
    return this;
  }

  withEmail(email) {
    this.data.email = email;
    return this;
  }

  withAge(age) {
    this.data.age = age;
    return this;
  }

  withInvalidEmail() {
    this.data.email = 'invalid-email';
    return this;
  }

  build() {
    return { ...this.data };
  }
}

// Usage
const validUser = TestDataBuilder.user().build();
const invalidUser = TestDataBuilder.user().withInvalidEmail().build();
const youngUser = TestDataBuilder.user().withAge(16).build();
```

---

## Unit Testing Best Practices

### Testing Pure Functions

```javascript
// ✅ Pure function testing - Easy and reliable
describe('Pure Functions', () => {
  describe('calculateDiscount', () => {
    const calculateDiscount = (price, discountPercent) => {
      if (price < 0) throw new Error('Price cannot be negative');
      if (discountPercent < 0 || discountPercent > 100) {
        throw new Error('Discount percent must be between 0 and 100');
      }
      return price * (discountPercent / 100);
    };

    it.each([
      [100, 10, 10],
      [200, 25, 50],
      [50, 0, 0],
      [1000, 100, 1000],
    ])('should calculate %d with %d%% discount as %d', (price, discount, expected) => {
      expect(calculateDiscount(price, discount)).toBe(expected);
    });

    it('should throw error for negative price', () => {
      expect(() => calculateDiscount(-100, 10)).toThrow('Price cannot be negative');
    });

    it.each([
      [-5, 'Discount percent must be between 0 and 100'],
      [101, 'Discount percent must be between 0 and 100'],
    ])('should throw error for invalid discount %d', (discount, expectedMessage) => {
      expect(() => calculateDiscount(100, discount)).toThrow(expectedMessage);
    });
  });
});
```

### Testing Classes with Dependencies

```javascript
// ✅ Testing classes with proper dependency injection
class UserService {
  constructor(userRepository, emailService, logger) {
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.logger = logger;
  }

  async createUser(userData) {
    this.logger.info('Creating user', { email: userData.email });

    // Validate
    if (!userData.email.includes('@')) {
      throw new Error('Invalid email format');
    }

    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create user
    const user = {
      id: this.generateId(),
      ...userData,
      createdAt: new Date(),
    };

    await this.userRepository.save(user);
    await this.emailService.sendWelcomeEmail(user);

    this.logger.info('User created successfully', { userId: user.id });

    return user;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

describe('UserService', () => {
  let userService;
  let mockUserRepository;
  let mockEmailService;
  let mockLogger;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    };

    mockEmailService = {
      sendWelcomeEmail: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
    };

    userService = new UserService(mockUserRepository, mockEmailService, mockLogger);
  });

  describe('createUser', () => {
    const validUserData = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
    };

    it('should create user successfully with valid data', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue();
      mockEmailService.sendWelcomeEmail.mockResolvedValue();

      // Act
      const result = await userService.createUser(validUserData);

      // Assert
      expect(result).toMatchObject({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        id: expect.any(String),
        createdAt: expect.any(Date),
      });

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
      expect(mockUserRepository.save).toHaveBeenCalledWith(result);
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(result);
      expect(mockLogger.info).toHaveBeenCalledTimes(2);
    });

    it('should throw error when user already exists', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue({ id: '123' });

      // Act & Assert
      await expect(userService.createUser(validUserData)).rejects.toThrow('User already exists');

      expect(mockUserRepository.save).not.toHaveBeenCalled();
      expect(mockEmailService.sendWelcomeEmail).not.toHaveBeenCalled();
    });

    it('should handle email service failure gracefully', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue();
      mockEmailService.sendWelcomeEmail.mockRejectedValue(new Error('Email service unavailable'));

      // Act & Assert
      await expect(userService.createUser(validUserData)).rejects.toThrow(
        'Email service unavailable',
      );

      // User should still be saved even if email fails
      expect(mockUserRepository.save).toHaveBeenCalled();
    });
  });
});
```

---

## Integration Testing

### API Integration Testing

```javascript
// ✅ API integration tests with proper setup/teardown
describe('User API Integration', () => {
  let server;
  let testDb;

  beforeAll(async () => {
    // Setup test database
    testDb = await createTestDatabase();
    server = await startTestServer({ database: testDb });
  });

  afterAll(async () => {
    await server.close();
    await testDb.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await testDb.collection('users').deleteMany({});
  });

  describe('POST /api/users', () => {
    it('should create user and return 201 with user data', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      };

      // Act
      const response = await request(server).post('/api/users').send(userData).expect(201);

      // Assert
      expect(response.body).toMatchObject({
        id: expect.any(String),
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        createdAt: expect.any(String),
      });

      // Verify in database
      const userInDb = await testDb.collection('users').findOne({ email: 'john@example.com' });
      expect(userInDb).toBeTruthy();
      expect(userInDb.name).toBe('John Doe');
    });

    it('should return 409 for duplicate email', async () => {
      // Arrange - Create existing user
      await testDb.collection('users').insertOne({
        name: 'Existing User',
        email: 'john@example.com',
        createdAt: new Date(),
      });

      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      };

      // Act & Assert
      await request(server)
        .post('/api/users')
        .send(userData)
        .expect(409)
        .expect((response) => {
          expect(response.body.error).toBe('User already exists');
        });
    });

    it('should validate required fields', async () => {
      const testCases = [
        { data: { name: 'John' }, expectedError: 'Email is required' },
        { data: { email: 'john@example.com' }, expectedError: 'Name is required' },
        { data: { name: '', email: 'john@example.com' }, expectedError: 'Name cannot be empty' },
      ];

      for (const testCase of testCases) {
        await request(server)
          .post('/api/users')
          .send(testCase.data)
          .expect(400)
          .expect((response) => {
            expect(response.body.error).toContain(testCase.expectedError);
          });
      }
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by id', async () => {
      // Arrange
      const user = {
        _id: new ObjectId(),
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        createdAt: new Date(),
      };
      await testDb.collection('users').insertOne(user);

      // Act
      const response = await request(server).get(`/api/users/${user._id}`).expect(200);

      // Assert
      expect(response.body).toMatchObject({
        id: user._id.toString(),
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });
    });

    it('should return 404 for non-existent user', async () => {
      const nonExistentId = new ObjectId();

      await request(server)
        .get(`/api/users/${nonExistentId}`)
        .expect(404)
        .expect((response) => {
          expect(response.body.error).toBe('User not found');
        });
    });
  });
});
```

---

## Mock & Spy Patterns

### Advanced Mocking Strategies

```javascript
// ✅ Mock external dependencies effectively
describe('Advanced Mocking Examples', () => {
  describe('WeatherService', () => {
    let weatherService;
    let mockHttpClient;
    let mockCache;

    beforeEach(() => {
      mockHttpClient = {
        get: jest.fn(),
      };

      mockCache = {
        get: jest.fn(),
        set: jest.fn(),
        has: jest.fn(),
      };

      weatherService = new WeatherService(mockHttpClient, mockCache);
    });

    it('should return cached weather data when available', async () => {
      // Arrange
      const cachedWeather = { temperature: 25, humidity: 60 };
      mockCache.has.mockReturnValue(true);
      mockCache.get.mockReturnValue(cachedWeather);

      // Act
      const result = await weatherService.getWeather('London');

      // Assert
      expect(result).toEqual(cachedWeather);
      expect(mockCache.has).toHaveBeenCalledWith('weather:London');
      expect(mockCache.get).toHaveBeenCalledWith('weather:London');
      expect(mockHttpClient.get).not.toHaveBeenCalled();
    });

    it('should fetch and cache weather data when not cached', async () => {
      // Arrange
      const apiResponse = {
        main: { temp: 22, humidity: 65 },
        weather: [{ main: 'Sunny' }],
      };
      const expectedResult = { temperature: 22, humidity: 65, condition: 'Sunny' };

      mockCache.has.mockReturnValue(false);
      mockHttpClient.get.mockResolvedValue({ data: apiResponse });

      // Act
      const result = await weatherService.getWeather('Paris');

      // Assert
      expect(result).toEqual(expectedResult);
      expect(mockHttpClient.get).toHaveBeenCalledWith('https://api.weather.com/weather?q=Paris');
      expect(mockCache.set).toHaveBeenCalledWith(
        'weather:Paris',
        expectedResult,
        300, // 5 minutes TTL
      );
    });

    it('should handle API errors gracefully', async () => {
      // Arrange
      mockCache.has.mockReturnValue(false);
      mockHttpClient.get.mockRejectedValue(new Error('API unavailable'));

      // Act & Assert
      await expect(weatherService.getWeather('InvalidCity')).rejects.toThrow(
        'Weather service unavailable',
      );

      expect(mockCache.set).not.toHaveBeenCalled();
    });
  });

  // ✅ Spy on existing methods
  describe('UserNotificationService', () => {
    let notificationService;
    let originalSendEmail;

    beforeEach(() => {
      notificationService = new UserNotificationService();
      originalSendEmail = notificationService.sendEmail;
      notificationService.sendEmail = jest.fn();
    });

    afterEach(() => {
      notificationService.sendEmail = originalSendEmail;
    });

    it('should send welcome email to new users', async () => {
      // Arrange
      const user = { id: '123', email: 'test@example.com', name: 'Test User' };
      notificationService.sendEmail.mockResolvedValue({ messageId: 'abc123' });

      // Act
      await notificationService.sendWelcomeNotification(user);

      // Assert
      expect(notificationService.sendEmail).toHaveBeenCalledWith({
        to: 'test@example.com',
        subject: 'Welcome to our platform!',
        template: 'welcome',
        data: { userName: 'Test User' },
      });
    });

    it('should retry email sending on failure', async () => {
      // Arrange
      const user = { id: '123', email: 'test@example.com', name: 'Test User' };

      notificationService.sendEmail
        .mockRejectedValueOnce(new Error('Temporary failure'))
        .mockRejectedValueOnce(new Error('Temporary failure'))
        .mockResolvedValue({ messageId: 'abc123' });

      // Act
      const result = await notificationService.sendWelcomeNotification(user);

      // Assert
      expect(notificationService.sendEmail).toHaveBeenCalledTimes(3);
      expect(result).toEqual({ messageId: 'abc123' });
    });
  });
});
```

### Mock Factories & Test Doubles

```javascript
// ✅ Reusable mock factories
const createMockDatabase = () => ({
  users: new Map(),

  findUser: jest.fn().mockImplementation(function (id) {
    return Promise.resolve(this.users.get(id) || null);
  }),

  saveUser: jest.fn().mockImplementation(function (user) {
    this.users.set(user.id, user);
    return Promise.resolve(user);
  }),

  deleteUser: jest.fn().mockImplementation(function (id) {
    const deleted = this.users.delete(id);
    return Promise.resolve(deleted);
  }),

  // Add test data
  seedData: function (users) {
    users.forEach((user) => this.users.set(user.id, user));
  },

  // Reset for tests
  reset: function () {
    this.users.clear();
    jest.clearAllMocks();
  },
});

const createMockLogger = () => ({
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),

  // Helper to check if error was logged
  hasErrorBeenLogged: function (message) {
    return this.error.mock.calls.some((call) => call[0].includes(message));
  },
});

// ✅ Test-specific stubs
const createStubApiClient = (responses = {}) => {
  const defaultResponses = {
    '/users': { data: [] },
    '/posts': { data: [] },
  };

  const allResponses = { ...defaultResponses, ...responses };

  return {
    get: jest.fn().mockImplementation((url) => {
      const response = allResponses[url];
      if (response) {
        return Promise.resolve(response);
      }
      return Promise.reject(new Error(`No mock response for ${url}`));
    }),

    post: jest.fn().mockResolvedValue({ success: true }),
    put: jest.fn().mockResolvedValue({ success: true }),
    delete: jest.fn().mockResolvedValue({ success: true }),
  };
};
```

---

## Async Testing

### Promise Testing Patterns

```javascript
// ✅ Comprehensive async testing
describe('Async Operations', () => {
  describe('DataService', () => {
    let dataService;
    let mockApi;

    beforeEach(() => {
      mockApi = createStubApiClient();
      dataService = new DataService(mockApi);
    });

    it('should handle successful async operations', async () => {
      // Arrange
      const expectedData = [{ id: 1, name: 'Test' }];
      mockApi.get.mockResolvedValue({ data: expectedData });

      // Act
      const result = await dataService.fetchUsers();

      // Assert
      expect(result).toEqual(expectedData);
      expect(mockApi.get).toHaveBeenCalledWith('/users');
    });

    it('should handle async errors properly', async () => {
      // Arrange
      const apiError = new Error('Network error');
      mockApi.get.mockRejectedValue(apiError);

      // Act & Assert
      await expect(dataService.fetchUsers()).rejects.toThrow('Network error');
    });

    it('should handle timeout scenarios', async () => {
      // Arrange
      mockApi.get.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 6000)));

      // Act & Assert
      await expect(dataService.fetchUsersWithTimeout(5000)).rejects.toThrow('Request timeout');
    }, 10000); // Extend test timeout

    it('should handle concurrent requests', async () => {
      // Arrange
      const responses = [{ data: [{ id: 1 }] }, { data: [{ id: 2 }] }, { data: [{ id: 3 }] }];

      mockApi.get
        .mockResolvedValueOnce(responses[0])
        .mockResolvedValueOnce(responses[1])
        .mockResolvedValueOnce(responses[2]);

      // Act
      const promises = [
        dataService.fetchUser(1),
        dataService.fetchUser(2),
        dataService.fetchUser(3),
      ];

      const results = await Promise.all(promises);

      // Assert
      expect(results).toHaveLength(3);
      expect(mockApi.get).toHaveBeenCalledTimes(3);
    });
  });

  // ✅ Testing async generators
  describe('AsyncDataStream', () => {
    it('should process async generator correctly', async () => {
      // Arrange
      const mockDataSource = {
        *getData() {
          yield Promise.resolve({ id: 1, data: 'first' });
          yield Promise.resolve({ id: 2, data: 'second' });
          yield Promise.resolve({ id: 3, data: 'third' });
        },
      };

      const stream = new AsyncDataStream(mockDataSource);
      const results = [];

      // Act
      for await (const item of stream.process()) {
        results.push(item);
      }

      // Assert
      expect(results).toEqual([
        { id: 1, data: 'first', processed: true },
        { id: 2, data: 'second', processed: true },
        { id: 3, data: 'third', processed: true },
      ]);
    });
  });
});
```

### Timer and Delay Testing

```javascript
// ✅ Testing code with timers
describe('Timer-based functionality', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should debounce function calls', () => {
    // Arrange
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 300);

    // Act
    debouncedFn('call1');
    debouncedFn('call2');
    debouncedFn('call3');

    // Fast-forward time
    jest.advanceTimersByTime(299);
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);

    // Assert
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('call3');
  });

  it('should handle intervals correctly', () => {
    // Arrange
    const callback = jest.fn();
    const ticker = new Ticker(callback, 1000);

    // Act
    ticker.start();

    // Assert
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(3);

    ticker.stop();
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(3); // Should not increase
  });

  it('should test retry logic with exponential backoff', async () => {
    // Arrange
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new Error('Fail 1'))
      .mockRejectedValueOnce(new Error('Fail 2'))
      .mockResolvedValue('Success');

    const retryPromise = retryWithBackoff(mockFn, 3, 100);

    // Act & Assert
    const promise = expect(retryPromise).resolves.toBe('Success');

    // Advance through retries
    await jest.advanceTimersByTimeAsync(100); // First retry
    await jest.advanceTimersByTimeAsync(200); // Second retry

    await promise;
    expect(mockFn).toHaveBeenCalledTimes(3);
  });
});
```

---

## Testing DOM & Events

### DOM Testing with Testing Library

```javascript
// ✅ DOM interaction testing
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';

describe('User Interface Components', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('SearchComponent', () => {
    it('should perform search when user types and waits', async () => {
      // Arrange
      const mockSearchFn = jest.fn().mockResolvedValue([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
      ]);

      const searchComponent = new SearchComponent(container, {
        onSearch: mockSearchFn,
        debounceMs: 300,
      });

      searchComponent.render();

      const searchInput = screen.getByPlaceholderText('Search users...');

      // Act
      fireEvent.change(searchInput, { target: { value: 'john' } });

      // Assert - debounced, so shouldn't call immediately
      expect(mockSearchFn).not.toHaveBeenCalled();

      // Wait for debounce
      await waitFor(() => {
        expect(mockSearchFn).toHaveBeenCalledWith('john');
      });

      // Check results are displayed
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });
    });

    it('should handle empty search results', async () => {
      // Arrange
      const mockSearchFn = jest.fn().mockResolvedValue([]);
      const searchComponent = new SearchComponent(container, {
        onSearch: mockSearchFn,
      });

      searchComponent.render();

      // Act
      const searchInput = screen.getByPlaceholderText('Search users...');
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

      // Assert
      await waitFor(() => {
        expect(screen.getByText('No results found')).toBeInTheDocument();
      });
    });

    it('should handle search errors', async () => {
      // Arrange
      const mockSearchFn = jest.fn().mockRejectedValue(new Error('Search failed'));
      const searchComponent = new SearchComponent(container, {
        onSearch: mockSearchFn,
      });

      searchComponent.render();

      // Act
      const searchInput = screen.getByPlaceholderText('Search users...');
      fireEvent.change(searchInput, { target: { value: 'error' } });

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Search failed. Please try again.')).toBeInTheDocument();
      });
    });
  });

  describe('Modal Component', () => {
    it('should open and close modal correctly', () => {
      // Arrange
      const modal = new Modal(container);
      modal.render();

      const openButton = screen.getByText('Open Modal');

      // Act - Open modal
      fireEvent.click(openButton);

      // Assert
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(document.body).toHaveClass('modal-open');

      // Act - Close modal
      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);

      // Assert
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(document.body).not.toHaveClass('modal-open');
    });

    it('should close modal when clicking overlay', () => {
      // Arrange
      const modal = new Modal(container);
      modal.render();
      modal.open();

      // Act
      const overlay = screen.getByTestId('modal-overlay');
      fireEvent.click(overlay);

      // Assert
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should handle keyboard navigation', () => {
      // Arrange
      const modal = new Modal(container);
      modal.render();
      modal.open();

      // Act - Press Escape
      fireEvent.keyDown(document, { key: 'Escape' });

      // Assert
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
```

---

## Performance Testing

### Performance Benchmarking

```javascript
// ✅ Performance testing utilities
class PerformanceTester {
  static async benchmark(name, fn, iterations = 1000) {
    const measurements = [];

    // Warm up
    for (let i = 0; i < 10; i++) {
      await fn();
    }

    // Actual measurements
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await fn();
      const end = performance.now();
      measurements.push(end - start);
    }

    const average = measurements.reduce((a, b) => a + b) / measurements.length;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);
    const p95 = measurements.sort((a, b) => a - b)[Math.floor(measurements.length * 0.95)];

    return {
      name,
      iterations,
      average: Number(average.toFixed(3)),
      min: Number(min.toFixed(3)),
      max: Number(max.toFixed(3)),
      p95: Number(p95.toFixed(3)),
    };
  }

  static async compareImplementations(name, implementations, iterations = 1000) {
    const results = [];

    for (const [implName, impl] of Object.entries(implementations)) {
      const result = await this.benchmark(`${name} - ${implName}`, impl, iterations);
      results.push(result);
    }

    // Sort by average performance
    results.sort((a, b) => a.average - b.average);

    console.table(results);
    return results;
  }
}

// Usage in tests
describe('Performance Tests', () => {
  it('should benchmark array operations', async () => {
    const largeArray = Array.from({ length: 10000 }, (_, i) => i);

    const implementations = {
      'for-loop': () => {
        let sum = 0;
        for (let i = 0; i < largeArray.length; i++) {
          sum += largeArray[i];
        }
        return sum;
      },

      reduce: () => {
        return largeArray.reduce((sum, num) => sum + num, 0);
      },

      forEach: () => {
        let sum = 0;
        largeArray.forEach((num) => (sum += num));
        return sum;
      },
    };

    const results = await PerformanceTester.compareImplementations(
      'Array Sum',
      implementations,
      100,
    );

    // Assert performance characteristics
    const fastest = results[0];
    const slowest = results[results.length - 1];

    expect(fastest.average).toBeLessThan(slowest.average);
    expect(fastest.average).toBeLessThan(10); // Should be under 10ms
  });

  it('should detect memory leaks', () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;

    // Create and destroy many objects
    for (let i = 0; i < 10000; i++) {
      const obj = {
        data: new Array(1000).fill(Math.random()),
        nested: {
          moreData: new Array(100).fill('test'),
        },
      };
      // Force object to be used
      obj.toString();
    }

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;

    // Memory increase should be reasonable
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // Less than 50MB
  });
});
```

---

## Test-Driven Development

### TDD Workflow Example

```javascript
// ✅ TDD Example: Shopping Cart Implementation

// Step 1: Write failing test
describe('ShoppingCart', () => {
  describe('addItem', () => {
    it('should add item to empty cart', () => {
      // Arrange
      const cart = new ShoppingCart();
      const item = { id: '1', name: 'Apple', price: 1.5 };

      // Act
      cart.addItem(item);

      // Assert
      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getItems()[0]).toEqual({ ...item, quantity: 1 });
    });
  });
});

// Step 2: Make test pass with minimal implementation
class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    this.items.push({ ...item, quantity: 1 });
  }

  getItems() {
    return this.items;
  }
}

// Step 3: Add more tests
describe('ShoppingCart', () => {
  let cart;

  beforeEach(() => {
    cart = new ShoppingCart();
  });

  describe('addItem', () => {
    it('should add item to empty cart', () => {
      const item = { id: '1', name: 'Apple', price: 1.5 };
      cart.addItem(item);

      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getItems()[0]).toEqual({ ...item, quantity: 1 });
    });

    it('should increase quantity when adding existing item', () => {
      const item = { id: '1', name: 'Apple', price: 1.5 };

      cart.addItem(item);
      cart.addItem(item);

      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getItems()[0].quantity).toBe(2);
    });

    it('should add different items separately', () => {
      const apple = { id: '1', name: 'Apple', price: 1.5 };
      const banana = { id: '2', name: 'Banana', price: 0.75 };

      cart.addItem(apple);
      cart.addItem(banana);

      expect(cart.getItems()).toHaveLength(2);
    });
  });

  describe('getTotalPrice', () => {
    it('should return 0 for empty cart', () => {
      expect(cart.getTotalPrice()).toBe(0);
    });

    it('should calculate total for single item', () => {
      const item = { id: '1', name: 'Apple', price: 1.5 };
      cart.addItem(item);

      expect(cart.getTotalPrice()).toBe(1.5);
    });

    it('should calculate total for multiple quantities', () => {
      const item = { id: '1', name: 'Apple', price: 1.5 };
      cart.addItem(item);
      cart.addItem(item);
      cart.addItem(item);

      expect(cart.getTotalPrice()).toBe(4.5);
    });

    it('should calculate total for multiple different items', () => {
      const apple = { id: '1', name: 'Apple', price: 1.5 };
      const banana = { id: '2', name: 'Banana', price: 0.75 };

      cart.addItem(apple); // 1.50
      cart.addItem(banana); // 0.75
      cart.addItem(banana); // 0.75

      expect(cart.getTotalPrice()).toBe(3.0);
    });
  });

  describe('removeItem', () => {
    it('should remove item completely when quantity is 1', () => {
      const item = { id: '1', name: 'Apple', price: 1.5 };
      cart.addItem(item);

      cart.removeItem('1');

      expect(cart.getItems()).toHaveLength(0);
    });

    it('should decrease quantity when removing from multiple quantities', () => {
      const item = { id: '1', name: 'Apple', price: 1.5 };
      cart.addItem(item);
      cart.addItem(item);
      cart.addItem(item);

      cart.removeItem('1');

      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getItems()[0].quantity).toBe(2);
    });

    it('should throw error when removing non-existent item', () => {
      expect(() => cart.removeItem('999')).toThrow('Item not found in cart');
    });
  });
});

// Step 4: Refactor implementation to pass all tests
class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    const existingItem = this.items.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ ...item, quantity: 1 });
    }
  }

  removeItem(itemId) {
    const itemIndex = this.items.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      throw new Error('Item not found in cart');
    }

    const item = this.items[itemIndex];

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.items.splice(itemIndex, 1);
    }
  }

  getItems() {
    return [...this.items]; // Return copy to prevent external mutation
  }

  getTotalPrice() {
    return this.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  clear() {
    this.items = [];
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }
}
```

---

## 📚 Testing Best Practices Summary

### ✅ Do's

- Write descriptive test names that explain the scenario
- Use the AAA pattern (Arrange, Act, Assert)
- Test behavior, not implementation details
- Keep tests independent and isolated
- Use test doubles (mocks, stubs, spies) appropriately
- Test edge cases and error conditions
- Write tests first in TDD approach

### ❌ Don'ts

- Don't test private methods directly
- Don't make tests dependent on each other
- Don't ignore flaky tests
- Don't mock everything (prefer real objects when possible)
- Don't write overly complex test setup
- Don't forget to test async operations properly

### 🏆 Advanced Tips

- Use test coverage as a guide, not a goal
- Consider mutation testing for test quality
- Implement visual regression testing for UI
- Use property-based testing for complex logic
- Monitor test performance and optimize slow tests
- Keep test code as clean as production code

---

> **Remember**: Good tests are your safety net. They should give you confidence to refactor, catch regressions early, and serve as living documentation of your code's behavior.
