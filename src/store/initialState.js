// const { hash } = window.location;
// hash.replace(/^#\/?|\/$/g, '').split('&').forEach((pair) => {
//   const [key, value] = pair.split('=');
//   if (key === 'selectedView' && value === 'narratives') {
//     selectedView = value;
//   }
// });

export default {
  // initialLoad: false,
  selectedYear: 1867,
  // selectedId: null,
  // selectedData: null,
  // vizStartYear: 1825,
  mapPosition: {
    x: 0,
    y: 0,
    z: 0.2,
  },
  dimensions: {
    vizCanvas: {
      height: 550,
      width: 960,
    },
    map: {
      height: 500,
      width: 960,
      scale: 1,
    }
  }
}
