const AStar = require("./astar").AStar;
const Node = require("./astar").Node;
const keypress = require("keypress");

function random_grid(width, height) {
  const grid = [];
  for (let y = 0; y < height; y++) {
    grid[y] = [];
    for (let x = 0; x < width; x++) {
      if (x != 0 && x != width - 1 && y != 0 && y != height - 1)
        grid[y][x] = Math.random() > 0.8 ? 0 : 1;
      else grid[y][x] = 0;
    }
  }
  return grid;
}
function random_node(grid, wlk = true) {
  const x = Math.floor(Math.random() * grid[0].length);
  const y = Math.floor(Math.random() * grid.length);
  if (wlk) {
    if (grid[y][x].walkable) {
      return grid[y][x];
    } else {
      return random_node(grid);
    }
  } else {
    return grid[y][x];
  }
}

function grid_to_wall(grid) {
  const wall = [];
  for (let y = 0; y < grid.length; y++) {
    wall[y] = [];
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 1) wall[y][x] = "  ";
      else wall[y][x] = "🧱";
    }
  }
  return wall;
}

function grid_from_binary(binary_grid) {
  const gd = [];
  for (let y = 0; y < binary_grid.length; y++) {
    gd[y] = [];
    for (let x = 0; x < binary_grid[y].length; x++) {
      gd[y][x] = new Node(x, y, binary_grid[y][x]);
    }
  }
  return gd;
}
function gen() {
  const out = grid_to_wall(binary_grid);

  out[astar.startNode.y][astar.startNode.x] = "🟩";
  out[astar.endNode.y][astar.endNode.x] = "🟥";
  console.clear();
  console.log(out.map((row) => row.join(" ")).join("\n"));

  console.log("Use arrow keys to move the green node");
  console.log("Press (q) to quit");
  console.log("Press (space) to reveal the path");
  console.log("Press (r) to restart");
}

var binary_grid = random_grid(50, 30);

var grid = grid_from_binary(binary_grid);
random_node(grid).end = "start";
random_node(grid).end = "end";

var astar = new AStar(grid);
astar.initNodes();
astar.search();
var path = astar.getPath();

var steps = 0;
var max_steps = path.length - 1;

// gen();

// rend le terminal capable d'écouter les événements clavier
keypress(process.stdin);

// définit les touches directionnelles
let UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right";

// définit le comportement pour chaque touche directionnelle
process.stdin.on("keypress", function (ch, key) {
  let should_return = false;
  if (key.name === UP) {
    if (binary_grid[astar.startNode.y - 1][astar.startNode.x] == 0) return;
    astar.startNode.y--;
    steps++;
  } else if (key.name === DOWN) {
    if (binary_grid[astar.startNode.y + 1][astar.startNode.x] == 0) return;
    astar.startNode.y++;
    steps++;
  } else if (key.name === LEFT) {
    if (binary_grid[astar.startNode.y][astar.startNode.x - 1] == 0) return;
    astar.startNode.x--;
    steps++;
  } else if (key.name === RIGHT) {
    if (binary_grid[astar.startNode.y][astar.startNode.x + 1] == 0) return;
    astar.startNode.x++;
    steps++;
  } else if (key.name == "q") {
    console.log("Bye !");
    process.exit();
  } else if (key.name == "space") {
    astar.search();
    const path = astar.getPath();
    const out = grid_to_wall(binary_grid);
    out[astar.startNode.y][astar.startNode.x] = "🟩";
    out[astar.endNode.y][astar.endNode.x] = "🟥";
    for (let node of path) {
      if (node.end == "start" || node.end == "end") continue;
      out[node.y][node.x] = "🟦";
    }
    console.clear();

    console.log(out.map((row) => row.join(" ")).join("\n"));
    console.log("Solved !");
    process.exit();
  } else if (key.name == "r") {
    binary_grid = random_grid(50, 30);

    grid = grid_from_binary(binary_grid);
    random_node(grid).end = "start";
    random_node(grid).end = "end";

    astar = new AStar(grid);
    astar.initNodes();
    astar.search();
    path = astar.getPath();

    steps = 0;
    max_steps = path.length - 1;
  } else should_return = true;

  if (
    astar.startNode.x == astar.endNode.x &&
    astar.startNode.y == astar.endNode.y
  ) {
    console.log("You win in", steps, "steps");
    console.log("The best is", max_steps, "steps");
    console.log("Your score is ", ((max_steps / steps) * 20).toFixed(2), "/20");

    process.exit();
  }
  if (should_return) return;
  gen();
});
gen();
// redémarre le terminal en mode "keypress"
process.stdin.setRawMode(true);
// process.stdin.resume();

// setTimeout(() => {
//   for (let node of path) {
//     if (node.end == "start" || node.end == "end") continue;
//     out[node.y][node.x] = "🟦";
//   }
//   console.clear();

//   console.log(out.map((row) => row.join(" ")).join("\n"));
//   setTimeout(gen, 1000);
// }, 1000);
