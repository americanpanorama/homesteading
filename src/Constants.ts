import { hextoRgba } from './colorUtilities';

const lightTextColor = '#211D16';
const blackColor = '#000000';
const whiteColor = '#FFFFFF';
const legendBorderColor = '#BFC1C2';
const legendLandscapeBackgroundColor = '#F7F5F1';
const legendIndianLandsColor = '#0EB087';

export const colors = {
  insetBGcolor: whiteColor,
  mainBGcolor: whiteColor,
  insetHeaderBGcolor: '#28251E',
  lightColor: lightTextColor,
  highlightColor: '#575653',
  mapBGcolor: '#0B0A08',
  whiteColor,
  blackColor,
  focusRingColor: '#F2BE00',
  mutedTextColor: '#777676',
  softTextColor: '#EEEEEE',
  disabledTextColor: '#444444',
  districtStrokeColor: '#8A4353',
  fullStateDistrictFillColor: '#9B8E75',
  olive: '#6d6352',
  accentColor: '#5A455A', // '#02796B',
  northAmericaBackgroundColor: '#FFFDFA',
  legendBorderColor,
  legendControlBackgroundColor: hextoRgba(whiteColor, 0.9),
  legendToggleBackgroundColor: hextoRgba(whiteColor, 0.88),
  legendPanelBackgroundColor: hextoRgba(whiteColor, 0.97),
  legendPanelLandscapeBackgroundColor: hextoRgba(legendLandscapeBackgroundColor, 0.96),
  legendPanelShadowColor: hextoRgba(blackColor, 0.16),
  legendPanelLandscapeShadowColor: hextoRgba(blackColor, 0.06),
  legendHeaderShadowColor: hextoRgba(blackColor, 0.08),
  legendHeaderDividerColor: hextoRgba(lightTextColor, 0.26),
  legendDimmedTextColor: '#999999',
  legendIndianLandsColor,
  legendIndianLandsFaintColor: hextoRgba(legendIndianLandsColor, 0.1),
  legendIndianLandsMediumColor: hextoRgba(legendIndianLandsColor, 0.5),
  legendConflictColor: '#E12727',
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

// export const heatmapGradientColors = [
//   '#FFF0E1',
//   '#FFA696',
//   '#FF7E6F',
//   '#CC4440',
//   '#BF1657',
//   '#BA0079',
// ];

// export const heatmapGradientColors = [
//   '#FFF0E1', // near-zero / very low
//   '#F5B084', // low, still quiet
//   '#E57762', // low-mid
//   '#C94951', // mid
//   '#B51D66', // high
//   '#BA0079', // highest
// ];

// export const heatmapGradientColors = [
//   '#FFF0E1',
//   '#EDB184',
//   '#D98260',
//   '#BF514F',
//   '#A92B61',
//   '#970079',
// ];

export const heatmapGradientColors = [
  '#FFF0E1',
  '#F2AD90',
  '#E07464',
  '#CC4440',
  '#BF1657',
  '#BA0079',
];

export const indianLandsColors = '#00BE8B';

export const fonts = {
  serif: '"Unica One", serif',
  sansSerif: '"Roboto Condensed", sans-serif;',
  altFont: '"Zen Dots", sans-serif;',
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
  wideLayout: `(min-width: ${sizes.desktop}px), (min-width: ${sizes.tabletLandscape}px) and (orientation: landscape)`,
};
