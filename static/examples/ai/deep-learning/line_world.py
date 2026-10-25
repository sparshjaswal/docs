"""Offline tabular Q-learning in a five-position teaching environment.

This is not a neural network and does not establish real-world safety.
Run: python3 static/examples/ai/deep-learning/line_world.py
"""
import random


def transition(state, action):
    next_state = max(0, min(4, state + (-1 if action == 0 else 1)))
    terminal = next_state == 4
    return next_state, 1.0 if terminal else -0.02, terminal


def greedy_action(values):
    return max(range(2), key=lambda action: values[action])


def rollout(q, limit=12):
    state, path, discounted_return = 0, [0], 0.0
    for step in range(limit):
        state, reward, terminal = transition(state, greedy_action(q[state]))
        discounted_return += 0.9 ** step * reward
        path.append(state)
        if terminal:
            return path, discounted_return, True
    return path, discounted_return, False


def main():
    rng = random.Random(23)
    q = [[0.0, 0.0] for _ in range(5)]
    _, baseline_return, baseline_finished = rollout(q)
    for _ in range(300):
        state = 0
        for _ in range(30):
            action = rng.randrange(2) if rng.random() < 0.2 else greedy_action(q[state])
            next_state, reward, terminal = transition(state, action)
            future = 0.0 if terminal else max(q[next_state])
            target = reward + 0.9 * future
            q[state][action] += 0.2 * (target - q[state][action])
            state = next_state
            if terminal:
                break
    path, learned_return, finished = rollout(q)
    assert finished and path == [0, 1, 2, 3, 4]
    assert learned_return > baseline_return
    print("Training: 300 episodes; epsilon=0.2; evaluation exploration=0")
    print(f"Untrained greedy baseline: reached_goal={baseline_finished}; return={baseline_return:.3f}")
    print("Learned path: " + " -> ".join(map(str, path)))
    print(f"Learned policy: reached_goal={finished}; return={learned_return:.3f}")
    print("Checks passed: greedy goal path, baseline comparison")


if __name__ == "__main__":
    main()
