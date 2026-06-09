import * as React from 'react';
import * as d3 from 'd3';
import NorthAmerica from '../../../../data/northAmerica.json';
import Border from '../../../../data/internationalBorder.json';
import States from '../../../../data/states.json';
import { CANVASSIZE, TILESIZE } from '../../../Config';
import { useYearData } from '../../../hooks';
import { ProjectedState } from '../../../index.d';
import Next from '../../Buttons/Next';
import Previous from '../../Buttons/Previous';
import { Bounds, Point, ProjectedTownship, TileData } from '../../Map.d';
import * as Styled from './styled';

const FIRST_YEAR = 1863;
const LAST_YEAR = 1912;
const DEFAULT_YEAR = 1912;
const DEFAULT_CENTER: Point = [CANVASSIZE * 0.37, CANVASSIZE * 0.47];
const DEFAULT_ROTATION = -2;
const SOURCE_TILE_OPACITY = 0.72;
const YEARS = Array.from({ length: LAST_YEAR - FIRST_YEAR + 1 }, (_, index) => FIRST_YEAR + index);

interface SourceTileFigureSceneProps {
  expanded?: boolean;
  year: number;
  onYearChange: (year: number) => void;
  onExpand?: () => void;
  onClose?: () => void;
}

const getInitialTransform = (width: number, height: number): d3.ZoomTransform => {
  const mapHeight = 500 / 960 * CANVASSIZE;
  const scale = Math.min(width / CANVASSIZE, height / mapHeight) * 0.96;
  return d3.zoomIdentity
    .translate(width / 2 - DEFAULT_CENTER[0] * scale, height * 0.5 - DEFAULT_CENTER[1] * scale)
    .scale(scale);
};

const calculateZ = (scale: number): number => {
  const fullSizeOfCanvas = scale * CANVASSIZE;
  for (let z = 0; z < 18; z += 1) {
    if ((1 << z) * TILESIZE >= fullSizeOfCanvas) {
      return Math.min(7, z);
    }
  }

  return 1;
};

const scaleDivisor = (scale: number): number => Math.pow(2, calculateZ(scale) - 2);

const getTileLayerScale = (scale: number): number => scale / scaleDivisor(scale) / scale;

const getTileX = (x: number, z: number, canvassize: number): number => {
  const tilesForCanvas = Math.pow(2, z);
  return Math.floor(tilesForCanvas * (x / canvassize));
};

const getTileY = (y: number, z: number, canvassize: number): number => {
  const tilesForCanvas = Math.pow(2, z);
  return tilesForCanvas - getTileX(y, z, canvassize) - 1;
};

const getProjectedValue = (num: number, z: number): number => num * Math.pow(2, z);

const clampTileIndex = (value: number, z: number): number => {
  const max = Math.pow(2, z) - 1;
  return Math.min(max, Math.max(0, value));
};

const intersectsBounds = (bounds: Bounds, visibleBounds: Bounds): boolean => !(
  bounds[0][0] > visibleBounds[1][0]
  || bounds[1][0] < visibleBounds[0][0]
  || bounds[0][1] > visibleBounds[1][1]
  || bounds[1][1] < visibleBounds[0][1]
);

const getVisibleBounds = (
  transform: d3.ZoomTransform,
  width: number,
  height: number,
): Bounds => {
  const points = [
    transform.invert([0, 0]),
    transform.invert([width, 0]),
    transform.invert([width, height]),
    transform.invert([0, height]),
  ];
  const padding = 120 / transform.k;
  const xs = points.map(point => point[0]);
  const ys = points.map(point => point[1]);

  return [
    [Math.min(...xs) - padding, Math.min(...ys) - padding],
    [Math.max(...xs) + padding, Math.max(...ys) + padding],
  ];
};

const pushTilesForOffice = (
  tiles: TileData[],
  projectedTownship: ProjectedTownship,
  z: number,
  canvassize: number,
  boundsOffset: Point = [0, 0],
  translate?: Point,
) => {
  const minXForOffice = clampTileIndex(getTileX(projectedTownship.bounds[0][0] + boundsOffset[0], z, canvassize), z);
  const maxXForOffice = clampTileIndex(getTileX(projectedTownship.bounds[1][0] + boundsOffset[0], z, canvassize), z);
  const maxYForOffice = clampTileIndex(getTileY(projectedTownship.bounds[0][1] + boundsOffset[1], z, canvassize), z);
  const minYForOffice = clampTileIndex(getTileY(projectedTownship.bounds[1][1] + boundsOffset[1], z, canvassize), z);

  for (let tempX = minXForOffice; tempX <= maxXForOffice; tempX += 1) {
    for (let tempY = minYForOffice; tempY <= maxYForOffice; tempY += 1) {
      tiles.push({
        tile_id: projectedTownship.tile_id,
        z,
        x: tempX,
        y: tempY,
        translate,
        opacity: SOURCE_TILE_OPACITY,
      });
    }
  }
};

const getTiles = (
  offices: ProjectedTownship[],
  transform: d3.ZoomTransform,
  width: number,
  height: number,
): TileData[] => {
  const visibleBounds = getVisibleBounds(transform, width, height);
  const tiles: TileData[] = [];
  const z = calculateZ(transform.k);

  offices
    .filter(projectedTownship => projectedTownship.tile_id)
    .filter(projectedTownship => projectedTownship.state !== 'AK')
    .filter(projectedTownship => intersectsBounds(projectedTownship.bounds, visibleBounds))
    .forEach(projectedTownship => {
      pushTilesForOffice(tiles, projectedTownship, z, CANVASSIZE);
    });

  offices
    .filter(projectedTownship => projectedTownship.tile_id)
    .filter(projectedTownship => projectedTownship.state === 'AK')
    .filter(projectedTownship => intersectsBounds(projectedTownship.bounds, visibleBounds))
    .forEach(projectedTownship => {
      const alaskaZ = calculateZ(transform.k / 4);
      pushTilesForOffice(
        tiles,
        projectedTownship,
        alaskaZ,
        CANVASSIZE / 4,
        [64, -512],
        [getProjectedValue(-64, alaskaZ), getProjectedValue(512, alaskaZ)],
      );
    });

  const uniqueTiles = new Map<string, TileData>();
  tiles.forEach(tile => {
    uniqueTiles.set(`${tile.tile_id}/${tile.z}/${tile.x}/${tile.y}`, tile);
  });

  return [...uniqueTiles.values()];
};

const SourceTileImage = ({ tile }: { tile: TileData }) => (
  <Styled.SourceTile
    href={`https://s3.amazonaws.com/dsl-general/homesteading/${tile.tile_id}/${tile.z}/${tile.x}/${tile.y}.png`}
    transform={`translate(${tile.translate ? tile.translate.join(' ') : '0 0'})`}
    width={TILESIZE}
    x={TILESIZE * tile.x}
    y={TILESIZE * (Math.pow(2, tile.z) - tile.y) - TILESIZE}
    opacity={tile.opacity}
  />
);

const SourceTileFigureScene = ({
  expanded,
  year,
  onYearChange,
  onExpand,
  onClose,
}: SourceTileFigureSceneProps) => {
  const width = expanded ? 1280 : 980;
  const height = expanded ? 760 : 520;
  const yearData = useYearData(year);
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const zoomRef = React.useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [transform, setTransform] = React.useState<d3.ZoomTransform>(() => getInitialTransform(width, height));
  const tiles = React.useMemo(
    () => getTiles(yearData.offices, transform, width, height),
    [height, transform, width, yearData.offices],
  );
  const tileLayerScale = getTileLayerScale(transform.k);
  const selectedYearPosition = (year - FIRST_YEAR) / (LAST_YEAR - FIRST_YEAR) * 100;
  const handleSliderInput = React.useCallback((event: React.FormEvent<HTMLInputElement>) => {
    onYearChange(parseInt(event.currentTarget.value, 10));
  }, [onYearChange]);
  const stepYear = React.useCallback((direction: -1 | 1) => {
    onYearChange(Math.min(LAST_YEAR, Math.max(FIRST_YEAR, year + direction)));
  }, [onYearChange, year]);
  const applyZoomTransform = React.useCallback((nextTransform: d3.ZoomTransform) => {
    setTransform(nextTransform);
    if (!svgRef.current || !zoomRef.current) {
      return;
    }

    d3.select(svgRef.current)
      .call((zoomRef.current as any).transform, nextTransform);
  }, []);
  const zoomBy = React.useCallback((factor: number) => {
    const nextScale = Math.min(6, Math.max(0.75, transform.k * factor));
    const centerX = width / 2;
    const centerY = height / 2;
    const centerMapX = (centerX - transform.x) / transform.k;
    const centerMapY = (centerY - transform.y) / transform.k;
    const nextTransform = d3.zoomIdentity
      .translate(centerX - centerMapX * nextScale, centerY - centerMapY * nextScale)
      .scale(nextScale);

    applyZoomTransform(nextTransform);
  }, [applyZoomTransform, height, transform, width]);
  const resetZoom = React.useCallback(() => {
    applyZoomTransform(getInitialTransform(width, height));
  }, [applyZoomTransform, height, width]);

  React.useEffect(() => {
    if (!svgRef.current) {
      return undefined;
    }

    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.75, 6])
      .translateExtent([[-260, -260], [CANVASSIZE + 260, CANVASSIZE + 260]])
      .on('zoom', (event: any) => {
        const nextTransform = event?.transform || (d3 as any).event?.transform;
        if (nextTransform) {
          setTransform(nextTransform);
        }
      });

    zoomRef.current = zoom;
    svg.call(zoom as any);
    svg.call((zoom as any).transform, getInitialTransform(width, height));

    return () => {
      zoomRef.current = null;
      svg.on('.zoom', null);
    };
  }, [height, width]);

  return (
    <Styled.Figure $expanded={expanded}>
      <Styled.Shell $expanded={expanded}>
        <Styled.MapViewport>
          <Styled.MapSvg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            role='img'
            aria-label={`Original General Land Office source-map tiles for ${year}`}
          >
            <rect width={width} height={height} fill='#e9e6df' />
            <g transform={`${transform.toString()} rotate(${DEFAULT_ROTATION} ${DEFAULT_CENTER[0]} ${DEFAULT_CENTER[1]})`}>
              {(NorthAmerica as string[]).map(d => (
                <Styled.NorthAmericaPath d={d} key={`source-tile-na-${d.substring(0, 50)}`} />
              ))}

              <Styled.TileGroup $faded={yearData.offices.length === 0}>
                <g transform={`scale(${tileLayerScale})`}>
                  {tiles.map(tile => (
                    <SourceTileImage tile={tile} key={`source-tile-${tile.tile_id}-${tile.z}-${tile.x}-${tile.y}`} />
                  ))}
                </g>
              </Styled.TileGroup>

              {/* {(States as ProjectedState[]).map(state => (
                <Styled.StatePath d={state.d} key={`source-tile-state-${state.abbr}`} />
              ))}

              {yearData.offices.map(projectedTownship => (
                <Styled.DistrictPath
                  d={projectedTownship.d}
                  key={`source-tile-district-${projectedTownship.state}-${projectedTownship.office}-${projectedTownship.tile_id}`}
                />
              ))}*/}

              {(Border as string[]).map(d => (
                <Styled.BorderPath d={d} key={`source-tile-border-${d.substring(0, 50)}`} />
              ))} 
            </g>

            {yearData.offices.length === 0 && (
              <Styled.LoadingMessage x={width / 2} y={height / 2}>
                Loading map sources...
              </Styled.LoadingMessage>
            )}
          </Styled.MapSvg>

          <Styled.ZoomControls aria-label='Source map zoom controls'>
            <Styled.ZoomButton
              type='button'
              aria-label='Zoom in'
              title='Zoom in'
              onClick={() => zoomBy(1.35)}
            >
              <Styled.ZoomIcon
                viewBox='0 0 24 24'
                aria-hidden='true'
                focusable='false'
              >
                <line x1='6' y1='12' x2='18' y2='12' />
                <line x1='12' y1='6' x2='12' y2='18' />
              </Styled.ZoomIcon>
            </Styled.ZoomButton>
            <Styled.ZoomButton
              type='button'
              aria-label='Zoom out'
              title='Zoom out'
              onClick={() => zoomBy(1 / 1.35)}
            >
              <Styled.ZoomIcon
                viewBox='0 0 24 24'
                aria-hidden='true'
                focusable='false'
              >
                <line x1='5' y1='12' x2='19' y2='12' />
              </Styled.ZoomIcon>
            </Styled.ZoomButton>
            <Styled.ZoomButton
              type='button'
              aria-label='Reset map view'
              title='Reset map view'
              onClick={resetZoom}
            >
              <Styled.ResetIcon
                viewBox='0 0 24 24'
                aria-hidden='true'
                focusable='false'
              >
                <path d='M18.2 8.6A7 7 0 1 0 19 14' />
                <path d='M18.2 8.6h-5.1' />
                <path d='M18.2 8.6V3.5' />
              </Styled.ResetIcon>
            </Styled.ZoomButton>
          </Styled.ZoomControls>

          <Styled.ExpandRail $expanded={expanded}>
            <Styled.ExpandToggle
              type='button'
              aria-label={expanded ? 'Close expanded source map' : 'Expand source map'}
              title={expanded ? 'Close' : 'Expand'}
              onClick={expanded ? onClose : onExpand}
            >
              {expanded ? <Previous /> : <Next />}
            </Styled.ExpandToggle>
          </Styled.ExpandRail>
        </Styled.MapViewport>

        <Styled.TimelineControl>
          <Styled.StepButton
              type='button'
              aria-label='Previous source map year'
              onClick={() => stepYear(-1)}
            >
              <Previous />
            </Styled.StepButton>

          <Styled.TimelineRail>
            <Styled.SelectedYearLabel $left={selectedYearPosition}>
              {year}
            </Styled.SelectedYearLabel>

            <Styled.Ticks aria-hidden='true'>
              {YEARS.map(tickYear => {
                const isDecade = tickYear % 10 === 0;
                const left = (tickYear - FIRST_YEAR) / (LAST_YEAR - FIRST_YEAR) * 100;
                return (
                  <Styled.Tick
                    $left={left}
                    $decade={isDecade}
                    key={`source-map-year-tick-${tickYear}`}
                  >
                    {isDecade && (
                      <Styled.TickLabel>
                        {tickYear}
                      </Styled.TickLabel>
                    )}
                  </Styled.Tick>
                );
              })}
            </Styled.Ticks>

            <Styled.SelectedYearMarker $left={selectedYearPosition} />

            <Styled.Slider
              type='range'
              min={FIRST_YEAR}
              max={LAST_YEAR}
              step={1}
              value={year}
              aria-label='Select source map year'
              onChange={handleSliderInput}
              onInput={handleSliderInput}
            />
          </Styled.TimelineRail>

          <Styled.StepButton
              type='button'
              aria-label='Next source map year'
              onClick={() => stepYear(1)}
            >
              <Next />
            </Styled.StepButton>
        </Styled.TimelineControl>
      </Styled.Shell>
      {!expanded && (
        <Styled.Figcaption>
          General Land Office district maps serve as the primary source for township boundaries in this project. The maps were georeferenced to transform the original scans into images that included geospatial metadata. Here, the georeference maps of each district are assembled together for each fiscal year from 1863 to 1912. Maps were not produced for Illinois, Indiana, Ohio, and Mississippi, each of which only had a single district; claims and patents in these state are shown on the site's interactive map, but are not included in the source map figure.
        </Styled.Figcaption>
      )}
    </Styled.Figure>
  );
};

const SourceTileFigure = () => {
  const [year, setYear] = React.useState(DEFAULT_YEAR);
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    if (!expanded) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpanded(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [expanded]);

  return (
    <>
      {!expanded && (
        <SourceTileFigureScene
          year={year}
          onYearChange={setYear}
          onExpand={() => setExpanded(true)}
        />
      )}

      {expanded && (
        <Styled.ModalBackdrop
          role='presentation'
          onMouseDown={event => {
            if (event.target === event.currentTarget) {
              setExpanded(false);
            }
          }}
        >
          <Styled.ModalPanel
            role='dialog'
            aria-modal='true'
            aria-label='Expanded original source maps'
          >
            <SourceTileFigureScene
              expanded
              year={year}
              onYearChange={setYear}
              onClose={() => setExpanded(false)}
            />
          </Styled.ModalPanel>
        </Styled.ModalBackdrop>
      )}
    </>
  );
};

export default SourceTileFigure;
