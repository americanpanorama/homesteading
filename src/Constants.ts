export const colors = {
  insetBGcolor: '#FFFFFA',
  mainBGcolor: '#FFFFFA',
  insetHeaderBGcolor: '#28251E',
  lightColor: '#211D16',
  highlightColor: '#575653',
  mapBGcolor: '#0B0A08',
  whiteColor: '#FFFFFF',
  blackColor: '#000000',
  focusRingColor: '#F2BE00',
  mutedTextColor: '#888888',
  softTextColor: '#EEEEEE',
  disabledTextColor: '#444444',
  districtStrokeColor: '#8A4353',
  fullStateDistrictFillColor: '#9B8E75',
  accentColor: '#5A455A', // '#02796B',
  northAmericaBackgroundColor: '#FFFDFA',
};

/* 
Green: #02796B
Cream Background: #FFFFFA
Text: #211D16
Light Grey Border: #B4B6B8
*/

export const barCategoryColors = {
  federalLands: '#8A3FFC',
  indianLands: '#20D5D2',
  commutations2301: '#D12765',
  commutations18800615: '#FA75A6',
  commutationsIndianLands: '#009E9A',
};

// export const heatmapGradientColors = [
//   '#FFF0E1',
//   '#FFCBBC',
//   '#FFA696',
//   '#FF7E6F',
//   '#CC4440',
//   '#BF1657',
//   '#BA0079',
// ];

export const heatmapGradientColors = [
  '#FFF0E1',
  '#FFA696',
  '#FF7E6F',
  '#CC4440',
  '#BF1657',
  '#BA0079',
];

export const indianLandsColors = '#00BE8B';

export const fonts = {
  // serif: '"Playfair Display", serif;',
  serif: '"Montaga", serif;',
  sansSerif: '"Roboto Condensed", sans-serif;',
}

export const sizes = {
  mobile: 480,
  tabletPortrait: 768,
  tabletLandscape: 1024,
  desktop: 1280,
};

export const isTabletLandscapeViewport = (width: number, height: number) =>
  width >= sizes.tabletLandscape && width > height;

export const isWideViewport = (width: number, height: number) =>
  width >= sizes.desktop || isTabletLandscapeViewport(width, height);

export const devices = {
  // min-width helpers (keep if you use them a lot)
  mobile: `(min-width: ${sizes.mobile}px)`,
  tabletPortrait: `(min-width: ${sizes.tabletPortrait}px)`,
  tabletLandscape: `(min-width: ${sizes.tabletLandscape}px) and (orientation: landscape)`,
  desktop: `(min-width: ${sizes.desktop}px)`,
};
