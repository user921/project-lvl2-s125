import program from 'commander';

const run = () => {
  program
    .version('0.1.0')
    .arguments('<firstConfig> <secondConfig>')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'output format')
    .action((firstConfig, secondConfig) => {
      console.log('firstConfig:', firstConfig);
      console.log('secondConfig:', secondConfig);
    })
    .parse(process.argv);
};

export default run;
