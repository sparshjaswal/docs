---
id: dsa-math-euclidean-distance-readme
title: "Euclidean Distance"
slug: /DSA/math/euclidean-distance/README
sidebar_label: "Euclidean Distance"
---

# Euclidean Distance

**Read first:** [Square Root (Newtons Method)](../square-root/README.md).

**Practice focus:** Draw the horizontal and vertical differences before taking the square root of their squared sum.

Euclidean distance is the straight-line distance between two points. From `(0, 0)` to `(3, 4)`, the horizontal change is 3 and the vertical change is 4, so the distance is `√(3² + 4²) = 5`.

![Straight-line distance comes from the horizontal and vertical differences using the Pythagorean theorem.](https://upload.wikimedia.org/wikipedia/commons/5/55/Euclidean_distance_2d.svg)

## Distance formulas

### One dimension

The distance between any two points on the real line is the absolute value of the numerical difference of their coordinates

`distance = abs(p − q)`

### Two dimensions

`distance = √((px − qx)² + (py − qy)²)`

### Higher dimensions

In three dimensions, for points given by their Cartesian coordinates, the distance is

`distance = √((px − qx)² + (py − qy)² + (pz − qz)²)`

Example: the distance between the two points `(8,2,6)` and `(3,5,7)`:

![In three dimensions, square the changes in x, y, and z, add them, then take the square root.](https://www.mathsisfun.com/algebra/images/dist-2-points-3d.svg)

In general, for points given by Cartesian coordinates in `n`-dimensional Euclidean space, the distance is

`distance = √(sum of (p[i] − q[i])² over all coordinates i)`

## Exercise and failure drill

Compare distances for two coordinates measured in meters, then convert only one coordinate to centimeters.

<details>
<summary>Expected trace and debugging checks</summary>

The numerical distance changes unless the representation accounts for the unit change. A distance is meaningful only with a deliberate coordinate system and scaling policy.

</details>

## Interview reasoning

Can squared distance replace distance? For comparing nonnegative Euclidean distances, squaring preserves ordering and avoids square roots. Do not use the squared value where the actual distance or triangle inequality is required.

## References

- [Euclidean Distance on MathIsFun](https://www.mathsisfun.com/algebra/distance-2-points.html)
- [Euclidean Distance on Wikipedia](https://en.wikipedia.org/wiki/Euclidean_distance)

**Next:** [k-Nearest Neighbors Algorithm](../../ml/knn/README.md).
