import { Response } from 'express';
import { SwaggerRequest, Controller } from './helpers';
import { Game, IGame } from './Game';

@Controller()
export class GamesController {
  private games: IGame[];
  private nextId: number;

  constructor() {
    this.games = [];
    this.nextId = 1;
  }

  public list(req: SwaggerRequest, res: Response): void {
    res.json(this.games);
  }

  public create(req: SwaggerRequest, res: Response): void {
    let humanMovesFirst = req.swagger.params.newGameRequest.value.humanMovesFirst;
    const newGame = new Game(this.nextId, humanMovesFirst);
    this.nextId += 1;
    this.games.push(newGame);
    res.json(newGame);
  }

  public getById(req: SwaggerRequest, res: Response): void {
    const id = req.swagger.params.id.value;
    const game = this.games.find(game => game.id === id);
    if (game) {
      res.json(game);
    } else {
      res.status(404).end();
    }
  }

  public placeHumanMove(req: SwaggerRequest, res: Response): void {
    const id = req.swagger.params.id.value;
    const { rowIndex, columnIndex } = req.swagger.params.instruction.value;

    // Make the move on behalf of the human
    // Find the game
    const game = this.games.find(game => game.id === id);
    if (!game) {
      return res.status(404).end();
    }

    if (game.makeHumanMove(rowIndex, columnIndex)) {
      return res.json(game).end();
    }

    res.status(409).json(game).end();
  }

  public destroy(req: SwaggerRequest, res: Response): void {
    const id = req.swagger.params.id.value;

    const index = this.games.findIndex(g => g.id === id);
    if (index >= 0) {
      this.games.splice(index, 1);
    }
    
    res.status(200).end();
  }
}

export default new GamesController();


