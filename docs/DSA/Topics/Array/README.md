# Array

An array is a contiguous block of memory that stores a fixed-size sequence of elements of the same type. Each element can be accessed directly by its zero-based index, enabling constant-time random access. Arrays are fundamental building blocks for many data structures and algorithms.

- Static arrays have a fixed length determined at creation time.
- Dynamic arrays resize automatically (usually by doubling capacity) to support amortized O(1) append operations.
- Insertions and deletions in the middle require shifting elements, which is O(n).

## Pseudocode for Basic Operations

### Access and Update

```text
Get(A, i)
  Pre: 0 <= i < length(A)
  Post: returns the element at index i
  return A[i]
end Get
```

```text
Set(A, i, value)
  Pre: 0 <= i < length(A)
  Post: A[i] is updated to value
  A[i] ← value
end Set
```

### Insert

Append (dynamic array with automatic resize):
```text
Append(A, value)
  Pre: A has fields: data, size, capacity
  Post: value is placed at the end; size increases by 1
  if A.size = A.capacity
    Resize(A, max(1, 2 × A.capacity))
  end if
  A.data[A.size] ← value
  A.size ← A.size + 1
end Append
```

Insert at arbitrary index (shift right):
```text
InsertAt(A, i, value)
  Pre: 0 <= i <= size(A)
  Post: value inserted at index i; elements i..end shift right by 1
  if A.size = A.capacity
    Resize(A, max(1, 2 × A.capacity))
  end if
  j ← A.size - 1
  while j >= i
    A.data[j + 1] ← A.data[j]
    j ← j - 1
  end while
  A.data[i] ← value
  A.size ← A.size + 1
end InsertAt
```

Prepend is a special case of InsertAt at index 0:
```text
Prepend(A, value)
  InsertAt(A, 0, value)
end Prepend
```

### Search

Linear search (unsorted array):
```text
Contains(A, value)
  Pre: A is an array
  Post: returns true if value exists in A; otherwise false
  i ← 0
  while i < size(A) and A[i] != value
    i ← i + 1
  end while
  if i = size(A)
    return false
  end if
  return true
end Contains
```

Binary search (sorted array):
```text
BinarySearch(A, value)
  Pre: A is sorted in non-decreasing order
  Post: returns index of value if found; otherwise -1
  l ← 0
  r ← size(A) - 1
  while l <= r
    m ← floor((l + r) / 2)
    if A[m] = value
      return m
    else if A[m] < value
      l ← m + 1
    else
      r ← m - 1
    end if
  end while
  return -1
end BinarySearch
```

### Delete

Delete at index (shift left):
```text
RemoveAt(A, i)
  Pre: 0 <= i < size(A)
  Post: element at i removed; elements (i+1)..end shift left by 1
  j ← i
  while j < size(A) - 1
    A.data[j] ← A.data[j + 1]
    j ← j + 1
  end while
  A.size ← A.size - 1
end RemoveAt
```

Delete by value (first occurrence):
```text
RemoveValue(A, value)
  Pre: A is an array
  Post: first occurrence of value removed if present; returns true/false
  idx ← BinarySearch(A, value)  // if A sorted; else do linear search
  if idx = -1
    return false
  end if
  RemoveAt(A, idx)
  return true
end RemoveValue
```

### Traverse

```text
Traverse(A)
  Pre: A is an array
  Post: items in A have been traversed from left to right
  i ← 0
  while i < size(A)
    yield A[i]
    i ← i + 1
  end while
end Traverse
```

### Traverse in Reverse

```text
ReverseTraverse(A)
  Pre: A is an array
  Post: items in A have been traversed from right to left
  i ← size(A) - 1
  while i >= 0
    yield A[i]
    i ← i - 1
  end while
end ReverseTraverse
```

## Complexities

### Time Complexity

| Access | Search           | Insertion | Deletion |
| :----: | :--------------: | :-------: | :------: |
|  O(1)  | O(n) [O(log n)*] |   O(n)    |   O(n)   |

Notes:
- Append on a dynamic array is amortized O(1) due to geometric resizing.
- [O(log n)*] applies to BinarySearch on a sorted array.

### Space Complexity

O(n) to store n elements. Dynamic arrays may over-allocate capacity (up to O(n)) to support amortized O(1) append.


## Practice Problems

| Problem | Difficulty | Solution |
| ------- | ---------- | -------- |
| [LC 1 — Two Sum](https://leetcode.com/problems/two-sum/) | Easy | [View Solution](./Array/LC-1-two-sum) |

## References

- Wikipedia — Array: https://en.wikipedia.org/wiki/Array_data_structure
- Wikipedia — Dynamic array: https://en.wikipedia.org/wiki/Dynamic_array
- YouTube — Arrays in Data Structures: https://www.youtube.com/watch?v=fg2iGP4e2sE
