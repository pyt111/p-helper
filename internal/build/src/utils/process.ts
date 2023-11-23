import { spawn } from 'child_process';
import chalk from 'chalk';
import consola from 'consola';
import { projRoot } from '@p-helper/build-utils';

export const run = (command, cwd = projRoot) =>
  new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ');
    consola.info(`run: ${chalk.green(`${cmd} ${args.join(' ')}`)}`);

    const app = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    const onProcessExit = (code) => app.kill('SIGHUP');

    app.on('close', (code) => {
      process.removeListener('exit', onProcessExit);

      if (code === 0) resolve(code);
      else
        reject(
          new Error(`Command failed. \n Command: ${command} \n Code: ${code}`)
        );
    });
    process.on('exit', onProcessExit);
  });
