<script setup>
import { onMounted, ref } from 'vue';

const mazeCanvas = ref(null);
let pathTaken = []; // Store the path taken by DFS
const grid = [];
const generateMaze = (ctx, width, height) => {
  const cols = 10;
  const rows = 10;
  
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  // Initialize grid
  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
      row.push({ visited: false, walls: [true, true, true, true] }); // top, right, bottom, left
    }
    grid.push(row);
  }

  // DFS to create maze
  const stack = [];
  const startCell = { x: 0, y: 0 };
  let current = startCell;
  grid[current.y][current.x].visited = true;
  stack.push(current);

  while (stack.length > 0) {
    const { x, y } = current;
    const neighbors = getUnvisitedNeighbors(x, y, grid);

    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      removeWall(current, next, grid);
      current = next;
      grid[current.y][current.x].visited = true;
      stack.push(current);
    } else {
      current = stack.pop();
    }
  }

  // Draw the maze
  drawMaze(ctx, grid, cellWidth, cellHeight);
};

const getUnvisitedNeighbors = (x, y, grid) => {
  const neighbors = [];
  if (y > 0 && !grid[y - 1][x].visited) neighbors.push({ x, y: y - 1 }); // Top
  if (x < grid[0].length - 1 && !grid[y][x + 1].visited) neighbors.push({ x: x + 1, y }); // Right
  if (y < grid.length - 1 && !grid[y + 1][x].visited) neighbors.push({ x, y: y + 1 }); // Bottom
  if (x > 0 && !grid[y][x - 1].visited) neighbors.push({ x: x - 1, y }); // Left
  return neighbors;
};

const removeWall = (current, next, grid) => {
  const xDiff = current.x - next.x;
  const yDiff = current.y - next.y;
  if (xDiff === 1) { // current is right of next
    grid[current.y][current.x].walls[3] = false; // Remove left wall of current
    grid[next.y][next.x].walls[1] = false; // Remove right wall of next
  } else if (xDiff === -1) { // current is left of next
    grid[current.y][current.x].walls[1] = false; // Remove right wall of current
    grid[next.y][next.x].walls[3] = false; // Remove left wall of next
  }
  if (yDiff === 1) { // current is below next
    grid[current.y][current.x].walls[0] = false; // Remove top wall of current
    grid[next.y][next.x].walls[2] = false; // Remove bottom wall of next
  } else if (yDiff === -1) { // current is above next
    grid[current.y][current.x].walls[2] = false; // Remove bottom wall of current
    grid[next.y][next.x].walls[0] = false; // Remove top wall of next
  }
};

const drawMaze = (ctx, grid, cellWidth, cellHeight) => {
  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      const xPos = x * cellWidth;
      const yPos = y * cellHeight;
      ctx.beginPath();
      // Top
      if (cell.walls[0]) {
        ctx.moveTo(xPos, yPos);
        ctx.lineTo(xPos + cellWidth, yPos);
      }
      // Right
      if (cell.walls[1]) {
        ctx.moveTo(xPos + cellWidth, yPos);
        ctx.lineTo(xPos + cellWidth, yPos + cellHeight);
      }
      // Bottom
      if (cell.walls[2]) {
        ctx.moveTo(xPos + cellWidth, yPos + cellHeight);
        ctx.lineTo(xPos, yPos + cellHeight);
      }
      // Left
      if (cell.walls[3]) {
        ctx.moveTo(xPos, yPos + cellHeight);
        ctx.lineTo(xPos, yPos);
      }
      ctx.stroke();
    });
  });

   // After drawing the maze, find and draw the escape path
   const path = [];
  findEscapePathDFS(0, 0, grid, path); // Assuming the start is at (0, 0)
  // Draw the escape path
   // Draw the escape path in blue
   ctx.strokeStyle = 'blue'; // Set the stroke color to blue for the escape path
  ctx.lineWidth = 2; // Set the line width for the path
  ctx.beginPath();
  for (let i = 0; i < path.length - 1; i++) {
    const cell = path[i];
    const nextCell = path[i + 1];
    ctx.moveTo(cell.x * cellWidth + cellWidth / 2, cell.y * cellHeight + cellHeight / 2);
    ctx.lineTo(nextCell.x * cellWidth + cellWidth / 2, nextCell.y * cellHeight + cellHeight / 2);
  }
  ctx.stroke(); // Apply the drawing
};

function findEscapePathDFS(x, y, grid, path = []) {
    console.log(`Checking cell: x=${x}, y=${y}, cell=${JSON.stringify(grid[y][x])}`);

    if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length || grid[y][x] === 'wall' || grid[y][x].visited) {
      console.log(`Condition met: x=${x}, y=${y}, cell=${JSON.stringify(grid[y][x])}`);
      return false;
    }

    grid[y][x].visited = true;
    path.push({ x, y });

    if (x === grid[0].length - 1 && y === grid.length - 1) {
      return true;
    }

    const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    for (let [dx, dy] of directions) {
        console.log(`Trying direction: dx=${dx}, dy=${dy}`);
        if (findEscapePathDFS(x + dx, y + dy, grid, path)) { // Removed `this.`
          return true;
        }
    }

    // If no direction works, backtrack by removing the current cell from the path and unmarking it as visited
    path.pop();
    grid[y][x].visited = false;
    return false;
}

onMounted(() => {
  const canvas = mazeCanvas.value;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas.getBoundingClientRect();
    generateMaze(ctx, width, height);
  }
});
</script>

<template>
  <canvas ref="mazeCanvas" widht="500" height="500"></canvas>
</template>

<style scoped>
canvas{
  border: 1px solid black;
  margin-bottom: 50px;
}
</style>