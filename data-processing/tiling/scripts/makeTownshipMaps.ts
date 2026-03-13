import * as fs from 'fs';
import { spawn } from 'child_process';
// @ts-ignore: Unreachable code error
import US from '../../../src/us.js';
import { makeJSONFileNames, getMapPath } from '../../functions.js';
import { TownshipFeature } from '../../index.d';

const Townships: { type: string, features: TownshipFeature[] } = JSON.parse(fs.readFileSync('../../data-input/townshipssimplified.json', 'utf8'));
Townships.features.forEach(township => {
  if (township.properties.STATENAM.includes('Dakota') && township.properties.End <= new Date(1889, 10, 2, 0, 0, 0).valueOf()) {
    township.properties.STATENAM = 'Dakota';
  }
})


const gdalwarpParams = [ '-dstnodata', '0', '-of', 'GTiff', '-crop_to_cutline'];
// filter for the state, which can passed in as a param
const townships: TownshipFeature[] = Townships.features.filter(township => (process.argv.length > 2) ? US.lookup(township.properties.STATENAM).abbr === process.argv[2] : true);
const townshipsToCut: string[][] = [];

townships
  .forEach((township: TownshipFeature) => {
    const filenames = makeJSONFileNames(township);
    filenames.forEach(filename => {
      // delete the file if it exists
      if (fs.existsSync(`../toTile/${filename}.tif`)) {
        fs.unlinkSync(`../toTile/${filename}.tif`);
      } 
      townshipsToCut.push([
        ...gdalwarpParams,
        '-t_srs',
        ((township.properties.STATENAM === 'Alaska') ? '+proj=aea +lat_1=55 +lat_2=65 +lat_0=50 +lon_0=-154 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs ' : '+proj=aea +lat_1=29.5 +lat_2=45.5 +lat_0=37.5 +lon_0=-96 +x_0=0 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs'),       
        '-cutline',
        `../data/townshipFiles/${filename}.json`,
        `../toCut/${getMapPath(filename)}.tif`,
        `../toTile/${filename}.tif` // the output file
      ]);
    });
  });

gwarpArea(0);

const errors: { file: string; error: string}[] = []

function gwarpArea(i: number): void {
  const gwarpArgs = townshipsToCut[i];
  console.log(`gdalwarp ${gwarpArgs.join(' ')}`);
  const gwarpProcess = spawn('gdalwarp', gwarpArgs);
  gwarpProcess.stdout.on('close', () => {
    if (i < townshipsToCut.length - 1) {
      gwarpArea(i + 1);
    } else {
      console.log(errors);
    }
  });
  gwarpProcess.stdout.on('data', (data: any) => {
    //console.log(`stdout: ${data}`);
  });

  gwarpProcess.stderr.on('data', (data: any) => {
    console.log(`stderr: ${data}`);
    errors.push({
      file: townshipsToCut[i][9],
      error: data.toString(),
    });
  });
};
