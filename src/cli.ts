#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { configFileContent } from './template';
import { main } from './index';

const CONFIG_FILE_NAME = 'yapi.config.ts';

program
  .name('yapi-ts-gen')
  .description('Generate TypeScript API client from YAPI')
  .version('1.0.0')
  .option('-i, --init', 'Initialize configuration file')
  .option('-g, --generate', 'Generate API client')
  .parse(process.argv);

const options = program.opts();

async function run() {
  try {
    if (options.init) {
      if (fs.existsSync(CONFIG_FILE_NAME)) {
        console.log(chalk.yellow('Configuration file already exists'));
        return;
      }
      fs.writeFileSync(CONFIG_FILE_NAME, configFileContent);
      console.log(chalk.green('Configuration file created successfully'));
      return;
    }

    if (options.generate) {
      if (!fs.existsSync(CONFIG_FILE_NAME)) {
        console.log(chalk.red('Configuration file not found. Run with --init to create one.'));
        return;
      }

      const configPath = path.resolve(process.cwd(), CONFIG_FILE_NAME);
      const config = require(configPath);
      await main(config);
      console.log(chalk.green('API client generated successfully'));
      return;
    }

    program.help();
  } catch (error) {
    console.error(chalk.red('Error:'), error);
    process.exit(1);
  }
}

run(); 