const fs = require('fs');
const spawn = require('child_process').spawn;
const nodefetch = require('node-fetch');
const d3 = require('d3');
const offices = require('../../data-input/townshipssimplified.json');
const pointLookups = require('../data/pointLookups.json');

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

// the default scale for albers is 1070
// 960 is the default width: "The default translation offset places ⟨0°,0°⟩ at the center of a 960×500 area."

const albersRaw = d3.geoConicEqualArea();
const mercatorRaw = d3.geoMercator()

console.log(mercatorRaw.scale());

const square = 256 * 4;
const albers = d3.geoConicEqualArea()
  .scale(square * 1070 / 960)
  .translate([square / 2, square / 2 ])
  .parallels([29.5, 45.5])
  .rotate([96, 0])
  .center([0, 5]);

const mercator = d3.geoMercator()
  .scale(square * 152.94790031131143 / 960) // I think this is supposed to be 960 / tau, but that's 152.788745368 -- edit: the scale in the source code is 961 / tau, which is what this number is.
  //.scale(square * 152.788745368 / 960) // I think this is supposed to be 960 / tau, but that's 152.788745368 
  .translate([square / 2, square / 2]);

const degrees2meters = function(lon: number, lat: number): Point {
  var x = lon * 20037508.34 / 180;
  var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
  y = y * 20037508.34 / 180;
  return [x, y]
};

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let mapFiles: string[] = fs.readdirSync('../toTile').filter((f: string) => f.split('.').pop() === 'tif' && !f.includes('AK-'));

const tileMap = (idx: number): void => {
  const f = mapFiles[idx];
  console.log(`starting ${f}`);

  //retrieve the upper left and lower right coordinates of the Albers georectified image 
  const gdalInfoAlbers = spawn('gdalinfo', ['-json', `../toTile/${f}`]);
  gdalInfoAlbers.stdout.on('data', async (data: any) => {
    const jsonData = JSON.parse(data.toString('utf8'));

    // get the bounding box points, which are in meters
    const { upperLeft: upperLeftAlbers, lowerRight: lowerRightAlbers }: { upperLeft: Point; lowerRight: Point; } = jsonData.cornerCoordinates as CornerCoordinates;
    console.log(`albers coords: ${upperLeftAlbers} ${lowerRightAlbers}`);

    // see if you've already looked up these points in Albers 
    let upperLeftLongAlbers: string;
    let upperLeftLatAlbers: string;
    let lowerRightLongAlbers: string;
    let lowerRightLatAlbers: string;
    if (pointLookups[`x${upperLeftAlbers[0]}`] && pointLookups[`y${upperLeftAlbers[1]}`]
      && pointLookups[`x${lowerRightAlbers[0]}`] && pointLookups[`y${lowerRightAlbers[1]}`]) {
      upperLeftLongAlbers = pointLookups[`x${upperLeftAlbers[0]}`].toString();
      upperLeftLatAlbers = pointLookups[`y${upperLeftAlbers[1]}`].toString();
      lowerRightLongAlbers = pointLookups[`x${lowerRightAlbers[0]}`].toString();
      lowerRightLatAlbers = pointLookups[`y${lowerRightAlbers[1]}`].toString();
    } 
    // if you don't have them, use the espg site to retrieve the translated points and write those to a file to avoid having to look them up the next time this script is run
    else {
      // convert those to lat/lngs
      const urlUperLeftUrl: string = `http://epsg.io/trans?s_srs=102003&t_srs=4326&x=${upperLeftAlbers[0]}&y=${upperLeftAlbers[1]}`;
      const urlLowerRightUrl: string = `http://epsg.io/trans?s_srs=102003&t_srs=4326&x=${lowerRightAlbers[0]}&y=${lowerRightAlbers[1]}`;
      console.log(`requesting upperleft ${urlUperLeftUrl}`);
      const resUL = await nodefetch(urlUperLeftUrl, { method: "Get" });
      ({ x: upperLeftLongAlbers, y: upperLeftLatAlbers } = await resUL.json());
      console.log(`two second nap - zzz ...`);
      await sleep(2000);
      console.log(`requesting lowerRight ${urlLowerRightUrl}`);
      const resLR = await nodefetch(urlLowerRightUrl, { method: "Get" });
      ({ x: lowerRightLongAlbers, y: lowerRightLatAlbers } = await resLR.json());
      console.log(`two second nap - zzz ...`);
      await sleep(2000);
      console.log(`albers bounding box: ${upperLeftLongAlbers}  ${upperLeftLatAlbers} ${lowerRightLongAlbers} ${lowerRightLatAlbers}`);
      pointLookups[`x${upperLeftAlbers[0]}`] = parseFloat(upperLeftLongAlbers);
      pointLookups[`y${upperLeftAlbers[1]}`] = parseFloat(upperLeftLatAlbers);
      pointLookups[`x${lowerRightAlbers[0]}`] = parseFloat(lowerRightLongAlbers);
      pointLookups[`y${lowerRightAlbers[1]}`] = parseFloat(lowerRightLatAlbers);
      fs.writeFileSync('../data/pointLookups.json', JSON.stringify(pointLookups));
    }

    // project the coordinates into Albers to get the xy on the canvas; unproject to get the FAKE lat lng bounding box in mercator
    const nwMercatorLLFake: Point =  mercator.invert(albers([parseFloat(upperLeftLongAlbers), parseFloat(upperLeftLatAlbers)]));
    const seMercatorLLFake: Point =  mercator.invert(albers([parseFloat(lowerRightLongAlbers), parseFloat(lowerRightLatAlbers)]));
    console.log(`mercator fake lat/lng bounding box: ${nwMercatorLLFake} ${seMercatorLLFake}`);

    // use those fake lat lngs and transform them to meters in the mercator datum
    const [wMercatorMFake, nMercatorMFake] = degrees2meters(nwMercatorLLFake[0], nwMercatorLLFake[1]);
    const [eMercatorMFake, sMercatorMFake] = degrees2meters(seMercatorLLFake[0], seMercatorLLFake[1]);
    console.log(wMercatorMFake, nMercatorMFake, eMercatorMFake, sMercatorMFake);

    //copy the file and edit the metadata 
    fs.copyFileSync(`../toTile/${f}`, `../fakeMercators/${f}`);
    const gdalEdit = spawn('python3.9', [
      '/Library/Frameworks/GDAL.framework/Programs/gdal_edit.py',
      "-a_srs", "EPSG:3395",
      "-a_ullr", wMercatorMFake, nMercatorMFake, eMercatorMFake, sMercatorMFake, 
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


