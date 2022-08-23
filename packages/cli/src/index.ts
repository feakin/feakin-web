import { Command } from 'commander';
const program = new Command();

import { processFile } from "./process-file";

program
  .option('--input <input>', 'Input file')
  .option('--output <output>', 'Output file');

program.parse();

const options = program.opts();
const inputFile = options['input'];
const outputFile = options['output'];

processFile(inputFile, outputFile)
