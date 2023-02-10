class Node {
  constructor(x, y, walkable, end) {
    this.x = x;
    this.y = y;
    this.walkable = walkable;
    this.end = end;
    this.g = 0;
    this.h = 0;
    this.f = 0;
    this.previous = null;
  }
}

class AStar {
  constructor(grid) {
    this.openList = [];
    this.closedList = [];
    this.grid = grid;
    this.startNode = null;
    this.endNode = null;
  }

  // trouve le node de départ et d'arrivée dans la grille
  initNodes() {
    for (let row of this.grid) {
      for (let node of row) {
        if (node.end === 'start') {
          this.startNode = node;
        } else if (node.end === 'end') {
          this.endNode = node;
        }
      }
    }
  }

  // retourne les voisins accessibles d'un noeud
  getNeighbors(node) {
    let neighbors = [];
    let x = node.x;
    let y = node.y;

    if (this.grid[y - 1] && this.grid[y - 1][x].walkable) {
      neighbors.push(this.grid[y - 1][x]);
    }
    if (this.grid[y + 1] && this.grid[y + 1][x].walkable) {
      neighbors.push(this.grid[y + 1][x]);
    }
    if (this.grid[y][x - 1] && this.grid[y][x - 1].walkable) {
      neighbors.push(this.grid[y][x - 1]);
    }
    if (this.grid[y][x + 1] && this.grid[y][x + 1].walkable) {
      neighbors.push(this.grid[y][x + 1]);
    }

    return neighbors;
  }

  // calcule la distance de Manhattan entre deux noeuds
  manhattan(nodeA, nodeB) {
    return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
  }

  // exécute l'algorithme A *
  search() {
    this.openList.push(this.startNode);
    while (this.openList.length > 0) {
      let node = this.openList.shift();
      this.closedList.push(node);

      if (node === this.endNode) {
        return this.getPath();
      }

      let neighbors = this.getNeighbors(node);
      for (let neighbor of neighbors) {
        if (this.closedList.includes(neighbor)) {
          continue;
        }
        let g = node.g + 1;
        let h = this.manhattan(neighbor, this.endNode);
       
        let f = g + h;

        if (!this.openList.includes(neighbor)) {
          this.openList.push(neighbor);
        } else if (f >= neighbor.f) {
          continue;
        }

        neighbor.f = f;
        neighbor.g = g;
        neighbor.h = h;
        neighbor.previous = node;
      }

      this.openList.sort((a, b) => a.f - b.f);
    }
    return [];
  }

  // retourne le chemin trouvé par l'algorithme A *
  getPath() {
    let node = this.endNode;
    let path = [];
    while (node != null) {
      path.unshift(node);
      node = node.previous;
    }
    return path;
  }
}

module.exports = {
  AStar,
  Node
};