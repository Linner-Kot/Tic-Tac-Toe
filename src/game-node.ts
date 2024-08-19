// import readline from 'node:readline';
// import { Game } from './game';

// export class GameNode extends Game {
//   constructor() {
//     super();
//     this.rl.question(`Введите размер поля: `, (answer) => {
//       this.startGameInNode(+answer);
//     });
//   }

//   private startGameInNode(size: number) {
//     this.printBoard();
//     this.askMove();
//   }

//   private rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   private askMove() {
//     this.rl.question(
//       `Игрок ${this.getCurrentPlayer()}, введите ваш ход (row,col): `,
//       (answer) => {
//         const [row, col] = answer.split(',').map(Number);
//         if (!Number.isInteger(row) || !Number.isInteger(col)) {
//           console.log('Убедитесь, что ввели координаты в формате row,col.');
//           this.askMove();
//           return;
//         }
//         if (this.makeMove(row, col)) {
//           this.rl.close();
//         } else {
//           this.askMove();
//         }
//       },
//     );
//   }
// }

// new GameNode();

//-------------------------------------------------------------------------- 2

// import { Game } from './game';
// import readline from 'node:readline';

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// rl.question(`Введите размер поля: `, (answer) => {
//   const game = new Game(+answer, rl);
//   game.printBoard();
//   game.askMove();
// });

//-------------------------------------------------------------------------- 3

// import { Game } from './game';
// import readline from 'node:readline';

// export class NodeGame extends Game {
//   private rl: readline.Interface;

//   constructor(size: number, rl: readline.Interface) {
//     super(size);
//     this.rl = rl;
//     this.printBoard();
//     this.askMove();
//   }

//   public askMove() {
//     this.rl.question(
//       `Игрок ${this.getCurrentPlayer()}, введите ваш ход (row,col): `,
//       (answer) => {
//         const [row, col] = answer.split(',').map(Number);
//         if (!Number.isInteger(row) || !Number.isInteger(col)) {
//           console.log('Убедитесь, что ввели координаты в формате row,col.');
//           this.askMove();
//           return;
//         }
//         if (this.makeMove(row, col)) {
//           this.rl.close();
//         } else {
//           this.askMove();
//         }
//       },
//     );
//   }
// }
