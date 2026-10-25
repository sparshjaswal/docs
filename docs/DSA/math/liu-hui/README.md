---
id: dsa-math-liu-hui-readme
title: "Liu Hui's π Algorithm"
slug: /DSA/math/liu-hui/README
sidebar_label: "Liu Hui's π Algorithm"
---

# Liu Hui's π Algorithm

**Read first:** [Square Root (Newtons Method)](../square-root/README.md).

**Practice focus:** Draw an inscribed polygon and see why adding sides improves the circle approximation.

Liu Hui’s method estimates π using polygons inside a circle. A polygon with more sides follows the circle more closely. Repeatedly doubling the number of sides improves the estimate. The formulas below explain how to do that without measuring each new side directly.

## Area of a circle

Liu Hui argued:

> Multiply one side of a hexagon by the radius (of its
> circumcircle), then multiply this by three, to yield the
> area of a dodecagon; if we cut a hexagon into a
> dodecagon, multiply its side by its radius, then again
> multiply by six, we get the area of a 24-gon; the finer
> we cut, the smaller the loss with respect to the area
> of circle, thus with further cut after cut, the area of
> the resulting polygon will coincide and become one with
> the circle; there will be no loss

![Use a polygon inside a circle to estimate its size; more sides follow the boundary more closely.](https://upload.wikimedia.org/wikipedia/commons/6/69/Cutcircle2.svg)

Liu Hui's method of calculating the area of a circle.

Further, Liu Hui proved that the area of a circle is half of its circumference
multiplied by its radius. He said:

> Between a polygon and a circle, there is excess radius. Multiply the excess
> radius by a side of the polygon. The resulting area exceeds the boundary of
> the circle

In the diagram `d = excess radius`. Multiplying `d` by one side results in
oblong `ABCD` which exceeds the boundary of the circle. If a side of the polygon
is small (i.e. there is a very large number of sides), then the excess radius
will be small, hence excess area will be small.

> Multiply the side of a polygon by its radius, and the area doubles;
> hence multiply half the circumference by the radius to yield the area of circle.

![Doubling an inscribed polygon’s sides improves the approximation to the circle.](https://upload.wikimedia.org/wikipedia/commons/9/95/Cutcircle.svg)

The area within a circle is equal to the radius multiplied by half the
circumference, or `A = r x C/2 = r x r x π`.

## Iterative algorithm

Liu Hui began with an inscribed hexagon. Let `M` be the length of one side `AB` of
hexagon, `r` is the radius of circle.

![The geometry of half-angles gives the next polygon side length in Liu Hui’s method.](https://upload.wikimedia.org/wikipedia/commons/4/46/Liuhui_geyuanshu.svg)

Bisect `AB` with line `OPC`, `AC` becomes one side of dodecagon (12-gon), let
its length be `m`. Let the length of `PC` be `j` and the length of `OP` be `G`.

`AOP`, `APC` are two right angle triangles. Liu Hui used
the [Gou Gu](https://en.wikipedia.org/wiki/Pythagorean_theorem) (Pythagorean theorem)
theorem repetitively:

The geometry can be written using five named quantities. All lengths use the same unit:

| Quantity | Formula | Meaning |
| --- | --- | --- |
| h | `M / 2` | Half the old side. |
| G | `√(r² − h²)` | Distance from the center to the old side. |
| j | `r − G` | Gap from the old side's midpoint to the circle. |
| m | `√(h² + j²)` | Side length after doubling the number of sides. |
| New side count | `2 × old side count` | 6 becomes 12, then 24, and so on. |

For a unit circle, start with six sides of length 1. The next side is about 0.517638. An inscribed n-gon with side s has area `n × s × √(r² − (s/2)²) / 2`. Dividing this area by `r²` gives a lower estimate of π, improving as the side count grows. Avoid unlimited iteration: floating-point subtraction in `r − G` eventually loses precision.

From here, there is now a technique to determine `m` from `M`, which gives the
side length for a polygon with twice the number of edges. Starting with a
hexagon, Liu Hui could determine the side length of a dodecagon using this
formula. Then continue repetitively to determine the side length of a
24-gon given the side length of a dodecagon. He could do this recursively as
many times as necessary. Knowing how to determine the area of these polygons,
Liu Hui could then approximate `π`.

## References

- [Wikipedia](https://en.wikipedia.org/wiki/Liu_Hui%27s_%CF%80_algorithm)

**Next:** [Radian](../radian/README.md).
