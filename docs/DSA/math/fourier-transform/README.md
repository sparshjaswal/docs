---
id: dsa-math-fourier-transform-readme
title: "Fourier Transform"
slug: /DSA/math/fourier-transform/README
sidebar_label: "Fourier Transform"
---

# Fourier Transform

**Practice focus:** Follow a tiny sample through the frequency calculation, then compare DFT work with FFT work.

A Fourier transform describes a signal as a mixture of frequencies. The **discrete Fourier transform (DFT)** takes a finite list of equally spaced samples and returns a list of complex frequency coefficients. An **FFT** is a faster algorithm for computing the same DFT.

Prerequisites: [complex numbers](../complex-number/README.md) and [radians](../radian/README.md).

## Definitions

| Symbol | Meaning |
| --- | --- |
| `N` | Number of samples. |
| `x[n]` | Input sample at position n, from 0 through N−1. |
| `X[k]` | Complex coefficient for frequency bin k. |
| `fs` | Sampling rate, measured in samples per second. |
| `i` | Imaginary unit, where i² = −1. |

This lesson uses a negative sign in the forward transform and a `1/N` factor in the inverse:

```text
X[k] = sum over n = 0 … N−1 of x[n] × exp(−i × 2π × k × n / N)
x[n] = (1/N) × sum over k = 0 … N−1 of X[k] × exp(i × 2π × k × n / N)
```

A bin index is not automatically a frequency in hertz. The frequency spacing is `fs / N`. For example, with `fs = 800` and `N = 8`, bin 1 represents 100 Hz. Higher bins also represent negative frequencies under the usual wrapped ordering. Libraries can use different normalization conventions; [FFTW documents its signs, ordering, and normalization](https://www.fftw.org/fftw3_doc/The-1d-Discrete-Fourier-Transform-_0028DFT_0029.html).

## Explanation

Each bin asks: “How strongly does this repeating wave match the samples?” Multiply samples by the corresponding rotating complex values, then add them. Matching contributions reinforce one another; opposing contributions cancel.

For `x = [1, 1, 1, 1]`, the zero-frequency bin simply adds the samples: `X[0] = 4`. The other bins cancel to zero. The input is constant, so it has only a constant component.

For `x = [1, -1, 1, -1]`, bin 2 matches the alternating signs. Its coefficient is 4; the other coefficients are zero, up to floating-point error.

| Input samples | DFT coefficients with this convention | Interpretation |
| --- | --- | --- |
| `[1, 1, 1, 1]` | `[4, 0, 0, 0]` | A constant signal. |
| `[1, -1, 1, -1]` | `[0, 0, 4, 0]` | A signal alternating every sample. |
| `[1, 0, 0, 0]` | `[1, 1, 1, 1]` | One impulse contributes to every bin. |

```mermaid
flowchart LR
  accTitle: Convert equally spaced samples to frequency coefficients and back
  accDescr: A DFT, or an FFT computing the same transform, maps time samples to complex frequency coefficients. A matching inverse transform reconstructs time samples.
  A[Time samples] -->|DFT or FFT| B[Complex frequency coefficients]
  B -->|Inverse transform with matching normalization| A
```

A coefficient has magnitude and phase. Plotting only its magnitude hides phase information, so that plot alone is not enough to reconstruct the original signal.

## Cost and limits

The direct formula uses `N` terms for each of `N` bins: `O(N²)` arithmetic work. FFT algorithms reuse subcalculations to achieve `O(N log N)` work for common transform sizes. A radix-2 FFT requires a power-of-two size; other FFT algorithms support other sizes.

Sampling limits which frequencies can be distinguished. Finite observation windows can spread energy across bins, called spectral leakage. Zero-padding adds sampled points to the displayed spectrum but does not create new observations of the original signal.

## Practice Problems

| Problem | Level / priority | Practice / notes | Example / answer |
| --- | --- | --- | --- |
| Constant signal | Practice | Check: Explain why only bin 0 remains for four identical samples. | — |
| Frequency units | Practice | Check: With fs = 1000 and N = 100, calculate the 10 Hz bin spacing. | — |
| Round trip | Practice | Check: Apply a transform and its matching inverse; compare samples with a tolerance. | — |
| Magnitude versus phase | Practice | Check: Explain why discarding phase can change the reconstructed signal. | — |

## References

[FFTW transform definitions](https://www.fftw.org/fftw3_doc/What-FFTW-Really-Computes.html)

**Next:** [Math for problem solving](../README.md).
