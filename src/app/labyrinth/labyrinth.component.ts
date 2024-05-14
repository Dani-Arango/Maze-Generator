import { Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-labyrinth',
  standalone: true,
  imports: [],
  templateUrl: './labyrinth.component.html',
  styleUrl: './labyrinth.component.css'
})
export class LabyrinthComponent implements OnInit{

  /*
     Construction of a maze with Kruskal's Algorithm
  */

  private direction: Record<number, number[]> = {
     0: [-1, 0],
     1: [1, 0],
     2: [0, -1],
     3: [0, 1]
  };
  private objects = {
     player: -1,
     wall: -2,
     home: -3,
     space: -4
  };
  private colors: Record<string, string> = {
     '-1': 'green',
     '-2': 'orange',
     '-3': 'blue',
     '-4': 'white',
  }
  private KEY_CODE: Record<number, number> = {
     87: 0,
     83: 1,
     65: 2,
     68: 3
  };

  public itsHome!: boolean;

  private eventPlayer: any;
  private maze!: number[][];
  private sizeMaze!: number;
  private identifier!: number;
  private playerPosition!: number[];
  private canvas?: HTMLCanvasElement;
  private context?: CanvasRenderingContext2D;
  @ViewChild('canvas', { static: true }) myCanvas!: ElementRef;

  constructor(private readonly router: Router) {
     this.eventPlayer = this.playerMovement.bind(this);
  }

  ngOnInit(): void {
     this.canvas = this.myCanvas.nativeElement;
     this.context = this.canvas!.getContext('2d')!;
     this.startGame();
  }

  public startGame(){
     this.identifier = 0;
     this.itsHome = false;
     this.maze = this.generateStructure();
     this.sizeMaze = this.maze.length - 2;
     this.playerPosition = [1, 1];
     this.generateMaze();

     this.StartAndFinish();
     this.startEventPlayer();

     this.draw();
  };

  private startEventPlayer(){
     document.removeEventListener('keyup', this.eventPlayer);
     document.addEventListener('keyup', this.eventPlayer);
  }

  private draw(){
     const px = 15;
     if (this.context) {
        this.maze.forEach((element, y) => {
           element.forEach((data, x) => {
              this.context!.fillStyle = this.colors[data];
              this.context!.fillRect(x * px, y * px, px, px);
           });
        });
     }
  };

  private generateStructure() {
     const matrix = [];
     for (let i = 0; i < 41; i++) {
        const row = [];
        for (let j = 0; j < 41; j++) {
           if (i % 2 === 0 || j % 2 === 0) {
              row.push(this.objects.wall);
           } else {
              this.identifier++;
              row.push(this.identifier);
           }
        }
        matrix.push(row);
     }
     return matrix;
  }

  private generateMaze() {
     while (this.identifier > 1) {
        const position = this.GeneratePosition();

        const newId = this.maze[position.y][position.x];

        const direction = this.GenerateDirection(position);

        const id = this.getIdChange(position, direction);

        if (id != newId) {

           this.dig(position, direction);

           this.changeId(newId, id);

           this.identifier--;
        }
     }
     this.deleteId();
  }

  private StartAndFinish() {
     this.maze[1][1] = this.objects.player;
     this.maze[this.sizeMaze][this.sizeMaze] = this.objects.home;
  }

  private GeneratePosition() {
     let x = Math.floor(Math.random() * (this.sizeMaze - 1)) + 1;
     let y = Math.floor(Math.random() * (this.sizeMaze - 1)) + 1;
     if (x % 2 == 0) x++;
     if (y % 2 == 0) y++;
     return { x: x, y: y };
  }

  private GenerateDirection(position: Iposition): number[] {
     while (true) {
        const direction = Math.floor(Math.random() * 4);
        if (direction === 0 && 1 == position.y) continue;
        else if (direction === 1 && this.sizeMaze == position.y) continue;
        else if (direction === 2 && 1 == position.x) continue;
        else if (direction === 3 && this.sizeMaze == position.x) continue;
        return this.direction[direction];
     }
  }

  private dig(position: Iposition, direction: number[]) {
     this.maze[position.y + direction[0]][position.x + direction[1]] = this.objects.space;
  }

  private getIdChange(position: Iposition, direction: number[]): number {
     return this.maze[position.y + (direction[0] * 2)][position.x + (direction[1] * 2)];
  }

  private changeId(newId: number, id: number) {
     for (let i = 0; i < this.maze.length; i++) {
        for (let j = 0; j < this.maze[i].length; j++) {
           if (this.maze[i][j] === id) {
              this.maze[i][j] = newId;
           }
        }
     }
  }

  private deleteId() {
     for (let i = 0; i < this.maze.length; i++) {
        for (let j = 0; j < this.maze[i].length; j++) {
           if (this.maze[i][j] != this.objects.wall) {
              this.maze[i][j] = this.objects.space;
           }
        }
     }
  }

  // Player movement
  private playerMovement(event: KeyboardEvent) {

     if (!this.KEY_CODE.hasOwnProperty(event.keyCode)) return;

     const key = this.KEY_CODE[event.keyCode];
     const xy = this.direction[key];
     const next = this.maze[this.playerPosition[0] + xy[0]][this.playerPosition[1] + xy[1]];

     if (next == this.objects.wall) return
     else if (next == this.objects.home) {
        this.itsHome = true;
        document.removeEventListener('keyup', this.eventPlayer);
     }

     this.maze[this.playerPosition[0]][this.playerPosition[1]] = this.objects.space;
     this.maze[this.playerPosition[0] += xy[0]][this.playerPosition[1] += xy[1]] = this.objects.player;

     this.draw();
  }
}

interface Iposition {
  x: number,
  y: number
}
