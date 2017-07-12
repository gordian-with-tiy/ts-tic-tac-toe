export interface IGame {
  id: number;
  winner: number;
  humanMovesFirst: boolean;
  board: number[][];
  makeHumanMove(row: number, col: number): boolean;
}

export class Game implements IGame {
  winner: number;
  board: number[][];

  constructor(
    public id: number,
    public humanMovesFirst: boolean
  ) {
    this.board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    if (!this.humanMovesFirst) {
      this.makeMove();
    }
  }

  public makeHumanMove(row: number, col: number): boolean {
    if (this.board[row][col] !== 0) {
      return false;
    }

    if (this.winner === undefined) {
      this.board[row][col] = this.humanMovesFirst ? 1 : 2;
      this.checkGameOver();
      this.makeMove();
      this.checkGameOver();
    }
    return true;
  }

  private checkGameOver() {
    this.checkTie();
    this.checkWinner();
  }

  private checkTie(): void {
    if (this.winner !== undefined) {
      return;
    }

    for (let i = 0; i < this.board.length; i += 1) {
      let row = this.board[i];
      for (let j = 0; j < row.length; j += 1) {
        if (row[j] === 0) {
          return;
        }
      }
    }
    this.winner = 0;
  }

  private checkWinner(): void {
    if (this.winner !== undefined) {
      return;
    }
    
    let board = this.board;
    for (let i = 0; i < 3; i += 1) {
      let [a, b, c] = board[i];
      if (a !== 0 && a === b && a === c) {
        this.winner = a;
      }
      a = board[0][i];
      b = board[1][i];
      c = board[2][i];
      if (a !== 0 && a === b && a === c) {
        this.winner = a;
      }
    }
    let a = this.board[0][0],
        b = this.board[1][1],
        c = this.board[2][2];
    if (a !== 0 && a === b && a === c) {
      this.winner = a;
    }
    a = this.board[2][0];
    b = this.board[1][1];
    c = this.board[0][2];
    if (a !== 0 && a === b && a === c) {
      this.winner = a;
    }
  }

  private makeMove(): void {
    const empties: number[][] = [];
    for (let i = 0; i < this.board.length; i += 1) {
      let row = this.board[i];
      for (let j = 0; j < row.length; j += 1) {
        if (row[j] === 0) {
          empties.push([i, j]);
        }
      }
    }
    const moveIndex = Math.floor(Math.random() * empties.length);
    const move = empties[moveIndex];
    const moveValue = this.humanMovesFirst ? 2 : 1;
    this.board[move[0]][move[1]] = moveValue;
  }
}
