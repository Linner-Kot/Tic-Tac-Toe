import { Game } from './game';
// import { NodeGame } from './game-node';
// import readline from 'node:readline';

const isNode =
  typeof process !== 'undefined' &&
  process.versions !== null &&
  process.versions.node !== null;

if (isNode) {
  // const rl = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  // });
  // rl.question(`Введите размер поля: `, (answer) => {
  //   new NodeGame(+answer, rl);
  // });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    new Game();
  });
}
