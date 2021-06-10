import fs from 'fs';

const state = process.argv[2];

fs.readdirSync('../data/townshipFiles')
  .filter(fn => fn.startsWith(`${state}-`))
  .forEach(fn => {
    fs.unlinkSync(`../data/townshipFiles/${fn}`);
    console.log(`deleted townshipFiles/${fn}`)
  });
fs.readdirSync('../toTile')
  .filter(fn => fn.startsWith(`${state}-`))
  .forEach(fn => {
    fs.unlinkSync(`../toTile/${fn}`);
    console.log(`deleted toTile/${fn}`)
  });

fs.readdirSync('../tiles')
  .filter(dirname => dirname.startsWith(`${state}-`))
  .forEach(dirname => {
    fs.rmdirSync(`../tiles/dirname`, { recursive: true });
    console.log(`deleted tiles/${dirname}`);
  });


