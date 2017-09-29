import program from 'commander';
import diff from './diff';

const runConsoleProgram = () => {
  program
    .version('0.6.0')
    .arguments('<firstConfig> <secondConfig>')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'output format')
    .option('--json', 'output in json format')
    .action((firstConfigPath, secondConfigPath, options) => {
      console.log(diff(firstConfigPath, secondConfigPath, options.format, options.json));
    })
    .parse(process.argv);
};

export default runConsoleProgram;
