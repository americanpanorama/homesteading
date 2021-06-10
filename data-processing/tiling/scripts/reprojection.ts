import * as fs from 'fs';
import { spawn } from 'child_process';
import d3Geo from 'd3-geo';
import { albersProjection, mercatorProjection } from '../../functions.js';

type Point = [number, number];

interface CornerCoordinates {
  upperLeft: Point;
  lowerLeft: Point;
  lowerRight: Point;
  upperRight: Point;
  center: Point;
};

interface PointTransformationLookup {
  [index: string]: number;
}

const degrees2meters = function(lon: number, lat: number): Point {
  var x = lon * 20037508.34 / 180;
  var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
  y = y * 20037508.34 / 180;
  return [x, y]
};

let mapFiles: string[] = fs.readdirSync('../toTile')
  .filter((f: string) => f.split('.').pop() === 'tif' && !f.includes('AK-'))
  //.filter((f: string) => f.includes('Bozeman'))
  .filter((f: string) => (process.argv.length > 2) ? f.includes(process.argv[2]) : true);

const tileMap = (idx: number): void => {
  const f = mapFiles[idx];
  console.log(`starting ${f}`);

  //retrieve the upper left and lower right coordinates of the Albers georectified image 
  const gdalInfoAlbers = spawn('gdalinfo', ['-json', `../toTile/${f}`]);
  gdalInfoAlbers.stdout.on('data', async (data: any) => {
    const jsonData = JSON.parse(data.toString('utf8'));

    // project the coordinates into Albers to get the xy on the canvas; unproject to get the FAKE lat lng bounding box in mercator
    const nwMercatorLLFake: Point =  mercatorProjection.invert(albersProjection([jsonData.wgs84Extent.coordinates[0][0][0], jsonData.wgs84Extent.coordinates[0][0][1]]));
    const seMercatorLLFake: Point =  mercatorProjection.invert(albersProjection([jsonData.wgs84Extent.coordinates[0][2][0], jsonData.wgs84Extent.coordinates[0][2][1]]));

    // use those fake lat lngs and transform them to meters in the mercator datum
    const [wMercatorMFake, nMercatorMFake] = degrees2meters(nwMercatorLLFake[0], nwMercatorLLFake[1])
    const [eMercatorMFake, sMercatorMFake] = degrees2meters(seMercatorLLFake[0], seMercatorLLFake[1]);

    //copy the file and edit the metadata 
    fs.copyFileSync(`../toTile/${f}`, `../fakeMercators/${f}`);
    const gdalEdit = spawn('python3.9', [
      '/Library/Frameworks/GDAL.framework/Programs/gdal_edit.py',
      //"-a_srs", "EPSG:3395",
      "-a_srs", "EPSG:3857",
      "-a_ullr", wMercatorMFake.toString(), nMercatorMFake.toString(), eMercatorMFake.toString(), sMercatorMFake.toString(), 
      `../fakeMercators/${f}`
    ]);
    gdalEdit.stdout.on('close', () => {
      console.log('edited metadata');
      const tileOptions = [
        '/Library/Frameworks/GDAL.framework/Programs/gdal2tiles.py',
        '-w', 'none',
        '-z', '1-7',
        `../fakeMercators/${f}`,
        `../tiles/${f.replace(/\.tif/g, '')}`
      ];
      const tile = spawn('python3.9', tileOptions);
      tile.stdout.on('data', (data: any) => {
        process.stdout.write(data.toString('utf8'));
      });
      tile.stdout.on('close', () => {
        if (idx < mapFiles.length - 1) {
          tileMap(idx + 1);
        } else {
          console.log('finished!!');
        }
      });
    });
  });
};

tileMap(0);

