# Published Temp Validation

Years regenerated: `1863,1864,1865,1866,1867,1868,1869,1870,1871,1872,1873,1874,1875,1876,1877,1878,1879,1880,1881,1882,1883,1884,1885,1886,1887,1888,1889,1890,1891,1892,1893,1894,1895,1896,1897,1898,1899,1900,1901,1902,1903,1904,1905,1906,1907,1908,1909,1910,1911,1912`

Temporary regeneration root: `/var/folders/x5/mtxs7qx935b81b54ns0yb9_m0000gp/T/homesteads2-trial-dqH6JI`
Temporary published root: `/var/folders/x5/mtxs7qx935b81b54ns0yb9_m0000gp/T/homesteads2-published-d5fSws`

## Idaho 1868

- Raw Boise claims/patents: 43 / 0
- Published Boise claims/patents: 43 / 0

## Oklahoma 1902

| Office | Raw claims | Published claims | Raw patents | Published patents | Tile |
| --- | ---: | ---: | ---: | ---: | --- |
| elReno | 9078 | 9078 | 188 | 188 | OK-ElReno-19020120-19060630 |
| oklahomaCity | 1564 | 1564 | 1559 | 1559 | OK-Oklahoma-19020120-19060429 |
| perry | 65 | missing | 1365 | missing | missing |
| perry (build status) | present in build | excluded for map | - | - | OK-Perry-19010701-19020331 |

## Nevada 1886-1893

| Year | Carson raw claims | Carson published claims | Eureka raw claims | Eureka published claims |
| --- | ---: | ---: | ---: | ---: |
| 1886 | 10 | 10 | 9 | 9 |
| 1887 | 6 | 6 | 4 | 4 |
| 1888 | 5 | 5 | 8 | 8 |
| 1889 | 2 | 2 | 2 | 2 |
| 1890 | 1 | 1 | 3 | 3 |
| 1891 | 1 | 1 | 19 | 19 |
| 1892 | 15 | 15 | 7 | 7 |
| 1893 | 6 | 6 | 8 | 8 |

## Full-State Cases

| Case | Raw claims | Published claims | Raw patents | Published patents | Tile |
| --- | ---: | ---: | ---: | ---: | --- |
| ohio1863 | 57 | 57 | 0 | 0 | missing |
| illinois1863 | 3 | 3 | 0 | 0 | missing |

## Notes

- These checks use the published app-facing shape produced by `publishBuildData.mjs` in `YEAR_DATA_MODE=map`.
- Map-mode publication prefers `adjustedForMap` values when they exist, so exact equality with the raw office table is not always expected for redistributed districts.
- Offices whose boundary ends before June 30 of the fiscal year can still exist in nested build outputs but be intentionally excluded from the app-facing published map data.
