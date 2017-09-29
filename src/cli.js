import program from 'commander';
import diff from './diff';

const runConsoleProgram = () => {
  program
    .version('0.5.0')
    .arguments('<firstConfig> <secondConfig>')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'output format')
    .action((firstConfigPath, secondConfigPath, options) => {
      console.log(diff(firstConfigPath, secondConfigPath, options.format));
    })
    .parse(process.argv);
};

export default runConsoleProgram;
