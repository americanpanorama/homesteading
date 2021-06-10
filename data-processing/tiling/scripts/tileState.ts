import { spawn } from 'child_process';

const state = process.argv[2];

const commands = [
  `--no-warnings --loader ts-node/esm deleteFilesForState.ts ${state}`,
  `--no-warnings --loader ts-node/esm makeIndividualTownshipFiles.ts ${state}`,
  `--no-warnings --loader ts-node/esm makeTownshipMaps.ts ${state}`,
  `--no-warnings --loader ts-node/esm reprojection.ts ${state}`
]

const execute = (idx: number) => {
  const node = spawn('node', commands[idx].split(' '));
  node.stdout.on('close', () => {
    if (idx < commands.length - 1) {
      execute(idx + 1);
    } 
  });
  node.stderr.on('data', (data: any) => {
    console.log(`stderr: ${data}`);
  });
  node.stdout.on("data", (data: any) => {
    process.stdout.write(data.toString('utf8'));
});
}

execute(0);
