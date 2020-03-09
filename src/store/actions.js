import A from './actionTypes';

export function selectYear(eOrId) {
  const year = getEventId(eOrId, 'number');
  return {
    type: A.SELECT_YEAR,
    payload: year
  };
}

export function calculateDimensions() {
  const { innerHeight, innerWidth } = window;
  const headerHeight = 50;
  const mapMargins = 20;

  const vizCanvas = {
    height: innerHeight - headerHeight - mapMargins * 2,
    width: innerWidth - mapMargins * 2,
  };

  const mapWidth = vizCanvas.width;
  const mapHeight = vizCanvas.height * 2 / 3;
  const horizontalScale = mapWidth / 960;
  const verticalScale = mapHeight / 500;
  const map = {
    height: mapHeight,
    width: mapWidth,
    scale: Math.min(horizontalScale, verticalScale),
  }

  return {
    type: A.DIMENSIONS_CALCULATED,
    payload: {
      calculated: true,
      vizCanvas,
      map,
    }
  };
}

function getEventId(eOrId, type = 'string') {
  let id = eOrId.id || eOrId;
  if (!eOrId.id && typeof eOrId === 'object') {
    const ct = eOrId.currentTarget || eOrId.target;
    id = ct.id || ct.options.id;
  }
  return (type === 'number') ? parseInt(id, 10) : id;
}
