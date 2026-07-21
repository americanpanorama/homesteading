# Published Office-Level Audit

This report compares June 30 map-adjusted office rows in `public/data/yearData/*.json` against raw reported-office rows in `public/data/timelineData/<STATE>.json`. Office-level differences are expected when a reporting office closed during the fiscal year and its totals were allocated to successor districts.

## Summary

- Office-year rows with at least one mismatch: 114

## States With The Most Office-Level Mismatches

| State | Mismatch rows |
| --- | ---: |
| MN | 19 |
| NE | 17 |
| KS | 16 |
| SD | 10 |
| OK | 9 |
| CA | 5 |
| CO | 5 |
| AR | 4 |
| NV | 4 |
| OR | 4 |
| WI | 4 |
| LA | 3 |
| AL | 2 |
| IA | 2 |
| MI | 2 |

## Largest Claim Count Differences

| Year | State | Office | yearData claims | timeline claims | Diff |
| --- | --- | --- | ---: | ---: | ---: |
| 1871 | KS | Salina | 3005.998307339641 | 662 | 2343.998307339641 |
| 1871 | AR | Dardanelle | 1256.5379995417732 | 71 | 1185.5379995417732 |
| 1879 | MN | Crookston | 1182.750161593712 | 0 | 1182.750161593712 |
| 1869 | NE | West Point | 1150 | 0 | 1150 |
| 1871 | AR | Harrison | 1127.462000458227 | 0 | 1127.462000458227 |
| 1873 | DK | Sioux Falls | 908 | 0 | 908 |
| 1876 | MN | Benson | 763.9810894148249 | 0 | 763.9810894148249 |
| 1906 | OK | Lawton | 757 | 182 | 575 |
| 1880 | MN | Tracy | 630 | 68 | 562 |
| 1879 | AL | Montgomery | 667 | 114 | 553 |
| 1874 | MN | Worthington | 723 | 226 | 497 |
| 1875 | KS | Kirwin | 494 | 0 | 494 |
| 1905 | MO | Springfield | 946 | 463 | 483 |
| 1905 | NE | Lincoln | 639 | 198 | 441 |
| 1863 | KS | Atchison | 466 | 57 | 409 |
| 1880 | KS | Wakeeney | 1082 | 719 | 363 |
| 1906 | OK | Guthrie | 824.9999996035835 | 470 | 354.99999960358355 |
| 1906 | NE | North Platte | 1081 | 741 | 340 |
| 1863 | MN | St. Peter | 829.9999983610621 | 490 | 339.9999983610621 |
| 1873 | FL | Gainesville | 293 | 0 | 293 |

## Idaho Examples

| Year | Office | yearData claims | timeline claims | yearData acres | timeline acres |
| --- | --- | ---: | ---: | ---: | ---: |

## Oklahoma Examples

| Year | Office | yearData claims | timeline claims | yearData acres | timeline acres |
| --- | --- | ---: | ---: | ---: | ---: |
| 1894 | Woodward | 594 | 573 | 94120.72 | 90760.79 |
| 1902 | Guthrie | 124 | 59 | 12437.89 | 5162.57 |
| 1906 | Guthrie | 824.9999996035835 | 470 | 105774.20 | 58303.25 |
| 1906 | Lawton | 757 | 182 | 95371.57 | 23034.26 |
| 1906 | El Reno | 108.00000039641654 | 108 | 12898.87 | 12898.87 |
| 1908 | Guthrie | 518.0741737712228 | 518 | 56050.89 | 56042.31 |
| 1908 | Woodward | 2766.925826228777 | 2591 | 390810.60 | 370463.17 |
| 1910 | Guthrie | 311 | 257 | 33021.15 | 27388.53 |
| 1912 | Guthrie | 365 | 265 | 36736.13 | 25210.87 |

## Interpretation

- Office-level differences are not conservation failures: map rows use June 30 district allocations while timelines preserve the office that originally reported the annual totals.
- Use `published-data-audit` or the generator’s `mapDataConservation.json` to detect activity that was lost or duplicated at the state-year level.
- Investigate an office-level difference only when its allocation is historically or geographically unexpected.
