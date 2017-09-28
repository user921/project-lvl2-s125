import program from 'commander';
import diff from './diff';

const run = () => {
  program
    .version('0.5.0')
    .arguments('<firstConfig> <secondConfig>')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'output format')
    .action((firstConfigPath, secondConfigPath) => {
      console.log(diff(firstConfigPath, secondConfigPath));
    })
    .parse(process.argv);
};

export default run;
