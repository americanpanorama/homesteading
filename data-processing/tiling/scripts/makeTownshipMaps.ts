import * as fs from 'fs';
import { spawn } from 'child_process';
// @ts-ignore: Unreachable code error
import US from 'us';
import { parseDate, makeJSONFileNames, getMapPath } from '../../functions.js';
import { MapDate, TownshipFeature } from '../../index.d';

const Townships: { type: string, features: TownshipFeature[] } = JSON.parse(fs.readFileSync('../../data-input/townshipssimplified.json', 'utf8'));
const MapDates: MapDate[] = JSON.parse(fs.readFileSync('../../data-input/mapDates.json', 'utf8'));

const gdalwarpParams = [ '-t_srs', 'ESRI:102003', '-dstnodata', '0', '-of', 'GTiff', '-crop_to_cutline'];
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
