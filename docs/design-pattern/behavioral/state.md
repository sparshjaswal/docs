# State Pattern 🎛️

> **Definition**: The State pattern allows an object to alter its behavior when its internal state changes. The object will appear to change its class.

## 🎯 Intent

Encapsulate state-specific behavior in separate classes and delegate work to the current state object. This eliminates sprawling conditional logic and makes state transitions explicit.

## 🤔 Problem

A `Document` object goes through states like Draft → Under Review → Approved → Published. Without the State pattern, every method checks the current state with `if/else` or `switch`:

```typescript
// ❌ Anti-pattern: state-driven conditionals everywhere
class Document {
  state: string;

  publish() {
    if (this.state === 'draft') {
      console.log('Cannot publish draft — submit first');
    } else if (this.state === 'approved') {
      console.log('Publishing...');
      this.state = 'published';
    } else if (this.state === 'published') {
      console.log('Already published');
    }
    // ...every method repeats this branching
  }
}
```

As states grow, conditionals spread across every method. Adding a new state requires touching every method — a maintenance nightmare.

## 💡 Solution

Create a separate class for each state. The context holds a reference to the current state and delegates all state-dependent work to it. States handle transitions by setting the context's next state.

## 🏗️ Structure

```
┌─────────────────────────────┐
│          Context             │
├─────────────────────────────┤
│ - state: State               │
├─────────────────────────────┤
│ + request(): void            │  → state.handle(this)
│ + setState(state: State)     │
└──────────┬──────────────────┘
           │ delegates to
           ▼
┌─────────────────────────────┐
│     «interface» State        │
├─────────────────────────────┤
│ + handle(context): void      │
└──────────┬──────────────────┘
           │ implements
     ┌─────┴─────┐
     ▼           ▼
┌─────────┐ ┌─────────┐
│ StateA  │ │ StateB  │
├─────────┤ ├─────────┤
│+handle()│ │+handle()│
└─────────┘ └─────────┘
```

## 📊 State Transition Table

A formal way to document valid transitions:

| Current State  | Action    | Next State     | Condition          |
| -------------- | --------- | -------------- | ------------------ |
| Draft          | submit    | Under Review   | Content not empty  |
| Draft          | archive   | Archived       | —                  |
| Under Review   | approve   | Approved       | Reviewer has role  |
| Under Review   | reject    | Rejected       | —                  |
| Approved       | publish   | Published      | Publisher has role |
| Approved       | reject    | Rejected       | —                  |
| Rejected       | edit      | Draft          | —                  |
| Published      | archive   | Archived       | —                  |
| Published      | edit      | Draft (v2)     | Creates new version|
| Archived       | —         | —              | Terminal state     |

## 💻 Code Example

### Minimal TypeScript Implementation

```typescript
interface State {
  play(player: MediaPlayer): void;
  pause(player: MediaPlayer): void;
  stop(player: MediaPlayer): void;
}

class PlayingState implements State {
  play()  { console.log('▶️ Already playing'); }
  pause(p: MediaPlayer) {
    console.log('⏸️ Pausing');
    p.setState(new PausedState());
  }
  stop(p: MediaPlayer) {
    console.log('⏹️ Stopping');
    p.setState(new StoppedState());
  }
}

class PausedState implements State {
  play(p: MediaPlayer) {
    console.log('▶️ Resuming');
    p.setState(new PlayingState());
  }
  pause() { console.log('⏸️ Already paused'); }
  stop(p: MediaPlayer) {
    console.log('⏹️ Stopping');
    p.setState(new StoppedState());
  }
}

class StoppedState implements State {
  play(p: MediaPlayer) {
    console.log('▶️ Starting playback');
    p.setState(new PlayingState());
  }
  pause() { console.log('⏸️ Cannot pause — already stopped'); }
  stop()  { console.log('⏹️ Already stopped'); }
}

class MediaPlayer {
  private state: State = new StoppedState();

  setState(state: State): void {
    console.log(`🔄 ${this.state.constructor.name} → ${state.constructor.name}`);
    this.state = state;
  }

  play()  { this.state.play(this); }
  pause() { this.state.pause(this); }
  stop()  { this.state.stop(this); }
}

// Usage
const player = new MediaPlayer();
player.play();   // StoppedState → PlayingState
player.pause();  // PlayingState → PausedState
player.play();   // PausedState → PlayingState
player.stop();   // PlayingState → StoppedState
```

## 🌟 Real-World Examples

### 1. Document Workflow System (TypeScript)

```typescript
// ---- States ----
interface DocumentState {
  edit(doc: Document): void;
  submit(doc: Document): void;
  approve(doc: Document, reviewer: string): void;
  publish(doc: Document): void;
}

class DraftState implements DocumentState {
  edit(doc: Document) {
    doc.content += ' [edited]';
    console.log(`✏️ Editing "${doc.title}"`);
  }

  submit(doc: Document) {
    if (!doc.content.trim()) {
      console.log('❌ Cannot submit empty document');
      return;
    }
    console.log(`📤 Submitted for review`);
    doc.transition(new UnderReviewState());
  }

  approve() { this.invalid('approve'); }
  publish() { this.invalid('publish'); }

  private invalid(action: string) {
    console.log(`❌ Cannot ${action} a draft`);
  }
}

class UnderReviewState implements DocumentState {
  edit() { console.log('❌ Cannot edit under review'); }
  submit() { console.log('❌ Already under review'); }

  approve(doc: Document, reviewer: string) {
    console.log(`✅ Approved by ${reviewer}`);
    doc.transition(new ApprovedState());
  }

  publish() { this.invalid('publish'); }
  private invalid(action: string) {
    console.log(`❌ Cannot ${action} while under review`);
  }
}

class ApprovedState implements DocumentState {
  edit()      { console.log('❌ Cannot edit approved document'); }
  submit()    { console.log('❌ Already approved'); }
  approve()   { console.log('❌ Already approved'); }

  publish(doc: Document) {
    console.log(`🌐 Published!`);
    doc.transition(new PublishedState());
  }
}

class PublishedState implements DocumentState {
  edit(doc: Document) {
    console.log('✏️ Creating new version');
    doc.version++;
    doc.transition(new DraftState());
  }
  submit()  { console.log('❌ Already published'); }
  approve() { console.log('❌ Already published'); }
  publish() { console.log('❌ Already published'); }
}

// ---- Context ----
class Document {
  private state: DocumentState = new DraftState();
  content: string = '';
  version: number = 1;

  constructor(public title: string) {}

  transition(newState: DocumentState): void {
    console.log(`📋 "${this.title}": ${this.state.constructor.name} → ${newState.constructor.name}`);
    this.state = newState;
  }

  edit()                           { this.state.edit(this); }
  submit()                         { this.state.submit(this); }
  approve(reviewer: string = '')   { this.state.approve(this, reviewer); }
  publish()                        { this.state.publish(this); }
}

// Usage
const doc = new Document('API Design v2');
doc.edit();
doc.submit();                       // Draft → UnderReview
doc.approve('Alice');               // UnderReview → Approved
doc.publish();                      // Approved → Published
doc.edit();                         // Published → Draft (v2)
```

### 2. React: useReducer as a State Machine

React's `useReducer` naturally implements the State pattern for components:

```typescript
import { useReducer } from 'react';

type FetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: string[] }
  | { status: 'error'; error: string };

type FetchAction =
  | { type: 'FETCH' }
  | { type: 'RESOLVE'; data: string[] }
  | { type: 'REJECT'; error: string }
  | { type: 'RESET' };

const transitionTable: Record<FetchState['status'], FetchAction['type'][]> = {
  idle:    ['FETCH'],
  loading: ['RESOLVE', 'REJECT'],
  success: ['RESET'],
  error:   ['RESET', 'FETCH'],
};

function fetchReducer(state: FetchState, action: FetchAction): FetchState {
  // Guard: reject invalid transitions
  if (!transitionTable[state.status].includes(action.type)) {
    console.warn(`Invalid transition: ${state.status} → ${action.type}`);
    return state;
  }

  switch (action.type) {
    case 'FETCH':   return { status: 'loading' };
    case 'RESOLVE': return { status: 'success', data: action.data };
    case 'REJECT':  return { status: 'error', error: action.error };
    case 'RESET':   return { status: 'idle' };
  }
}

function useDataFetch() {
  const [state, dispatch] = useReducer(fetchReducer, { status: 'idle' });

  const fetchData = async () => {
    dispatch({ type: 'FETCH' });
    try {
      const res = await fetch('/api/items');
      const data = await res.json();
      dispatch({ type: 'RESOLVE', data });
    } catch (e) {
      dispatch({ type: 'REJECT', error: (e as Error).message });
    }
  };

  return { state, fetchData, reset: () => dispatch({ type: 'RESET' }) };
}
```

### 3. TCP Connection State Machine

```typescript
type TcpState = 'CLOSED' | 'LISTEN' | 'SYN_SENT' | 'SYN_RCVD' | 'ESTABLISHED';

const tcpTransitions: Record<TcpState, Partial<Record<string, TcpState>>> = {
  CLOSED:      { passiveOpen: 'LISTEN', activeOpen: 'SYN_SENT' },
  LISTEN:      { send: 'SYN_SENT', close: 'CLOSED' },
  SYN_SENT:    { receive: 'SYN_RCVD', close: 'CLOSED' },
  SYN_RCVD:    { acknowledge: 'ESTABLISHED', close: 'CLOSED' },
  ESTABLISHED: { close: 'CLOSED' },
};

class TcpConnection {
  constructor(private state: TcpState = 'CLOSED') {}

  transition(action: string): void {
    const next = tcpTransitions[this.state]?.[action];
    if (!next) {
      console.log(`❌ Cannot ${action} while ${this.state}`);
      return;
    }
    console.log(`${this.state} → ${next}`);
    this.state = next;
  }

  getState(): TcpState { return this.state; }
}
```

## ⚠️ Common Pitfalls

### 1. State Classes Knowing Too Much

State classes should only handle transitions. Business logic belongs in the context:

```typescript
// ❌ BAD: state class runs business logic directly
class PlayingState implements State {
  stop(player: MediaPlayer) {
    analytics.track('stop');       // side effect in state class
    player.saveToDisk();           // business logic in state class
    player.setState(new StoppedState());
  }
}

// ✅ GOOD: delegate business logic to context
class PlayingState implements State {
  stop(player: MediaPlayer) {
    // state only handles transition; context handles side effects
    player.stopPlayback();
    player.setState(new StoppedState());
  }
}
```

### 2. Context Exposing Too Much Internal State

The context should expose only what states need — not all internals:

```typescript
// ✅ GOOD: context passes itself, states pull only what they need
class MediaPlayer {
  private volume = 50;
  private track = '';

  // Expose via focused methods, not raw fields
  getVolume(): number { return this.volume; }
  setVolume(v: number) { this.volume = v; }
}
```

### 3. Duplicating State Instances (Memory Waste)

If states are stateless, reuse singletons:

```typescript
// ✅ GOOD: share stateless state instances
const playingState = new PlayingState();
const pausedState = new PausedState();
const stoppedState = new StoppedState();

class MediaPlayer {
  setState(state: State) { this.state = state; } // accepts singleton
}
```

### 4. One State Class for Trivial Differences

If two states differ by only one behavior, consider a parameterized approach rather than two classes:

```typescript
// ✅ BEFORE over-engineering, ask: are two classes really needed?
class LockedDoor { open() { console.log('❌ Locked'); } }
class UnlockedDoor { open() { console.log('✅ Opened'); } }

// Often a simple boolean or flag is more appropriate for trivial differences.
```

## 🔄 State vs Strategy

Both patterns use composition/delegation and can look identical structurally. The difference is intent:

| Aspect                 | State Pattern                                      | Strategy Pattern                           |
| ---------------------- | -------------------------------------------------- | ------------------------------------------ |
| **Who drives change**  | State objects themselves trigger transitions       | Client/external code swaps strategies      |
| **Awareness**          | Context may not know which state is active         | Client explicitly chooses the strategy     |
| **Coupling**           | States know about each other (to transition)       | Strategies are independent of each other   |
| **Purpose**            | Manage internal state-dependent behavior           | Swap interchangeable algorithms            |
| **Analogy**            | Media player modes (play/pause/stop cycling)       | Compression format chosen by user          |

## ✅ Pros

- **Eliminates Conditionals**: No more `if/else` or `switch` chains checking state
- **Open/Closed Principle**: Add new states without modifying existing state classes
- **Single Responsibility**: Each state class handles one state's behavior
- **Explicit Transitions**: State changes are visible and traceable
- **Testable States**: States can be tested in isolation

## ❌ Cons

- **Class Proliferation**: Can result in many small classes for complex state machines
- **Overkill for Simple Cases**: A boolean flag is often sufficient for 2-state scenarios
- **Coupling Between States**: Concrete states reference each other to trigger transitions
- **Shared Data**: Passing data between states requires care

## 🎯 When to Use

- **Objects with state-dependent behavior**: The same method behaves differently depending on current state
- **Complex conditional logic**: Many `if/else` or `switch` statements driven by a state variable
- **Finite State Machines (FSM)**: Formal FSMs like TCP, game states, workflow engines
- **Workflow/approval systems**: Documents, orders, tickets moving through stages
- **UI component modes**: Edit vs view mode, loading vs loaded vs error states

## 🎭 Variations

### 1. Table-Driven State Machine

Instead of separate classes, use a transition table (see TCP example above). Simpler for small, well-defined FSMs. Less flexible for complex per-state behavior but great for data-driven transitions.

### 2. Enum-Based with Switch (Lightweight)

For languages without classes or for simple cases, a single switch is acceptable:

```typescript
type State = 'idle' | 'loading' | 'success' | 'error';

function transition(state: State, action: string): State {
  const transitions: Record<State, Record<string, State>> = {
    idle:    { FETCH: 'loading' },
    loading: { RESOLVE: 'success', REJECT: 'error' },
    success: { RESET: 'idle' },
    error:   { FETCH: 'loading', RESET: 'idle' },
  };
  return transitions[state][action] ?? state;
}
```

### 3. XState (JavaScript FSM Library)

For production-grade state machines with guards, side effects, and visualization:

```typescript
import { createMachine, interpret } from 'xstate';

const playerMachine = createMachine({
  id: 'player',
  initial: 'stopped',
  states: {
    stopped: { on: { PLAY: 'playing' } },
    playing: { on: { PAUSE: 'paused', STOP: 'stopped' } },
    paused:  { on: { PLAY: 'playing', STOP: 'stopped' } },
  },
});

const service = interpret(playerMachine).start();
service.send('PLAY');  // stopped → playing
service.send('PAUSE'); // playing → paused
```

## 🔗 Related Patterns

- **Strategy**: Same structure, different intent — Strategy is externally chosen, State is internally driven
- **Command**: State transitions can be represented as command objects
- **Singleton**: Idempotent states are often singletons to save memory
- **Flyweight**: Share state objects across multiple contexts when states are stateless

## 📚 Further Reading

- [State Pattern - Refactoring.Guru](https://refactoring.guru/design-patterns/state)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [Finite State Machines](https://en.wikipedia.org/wiki/Finite-state_machine)
- [XState Docs](https://xstate.js.org/docs/)
