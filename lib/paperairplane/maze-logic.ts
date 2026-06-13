/**
 * Maze generation aligned with PaperAirplane Python + spikes/PA-005-jspdf/maze-logic.js
 * @see https://github.com/flehmenlips/PaperAirplane/tree/main/spikes/PA-005-jspdf
 */

export const WALL = '#';
export const PASSAGE = ' ';
export const START = 'S';
export const END = 'E';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type MazeConfig = {
  width: number;
  height: number;
  braid: number;
  min_path_ratio: number;
  difficulty: Difficulty;
};

export type MazeStats = {
  path_length: number;
  path_ratio: number;
  solvable: boolean;
  width: number;
  height: number;
  braid: number;
  path?: [number, number][];
};

export type MazeGrid = string[][];

export type MazeResult = {
  grid: MazeGrid;
  stats: MazeStats;
  config: MazeConfig;
  /** False when returned as best-effort fallback below min_path_ratio. */
  meetsDifficultyTarget: boolean;
};

export const DIFFICULTY_DEFAULTS: Record<
  Difficulty,
  { width: number; height: number; braid: number; min_path_ratio: number }
> = {
  easy: { width: 7, height: 7, braid: 0.0, min_path_ratio: 0.55 },
  medium: { width: 10, height: 10, braid: 0.12, min_path_ratio: 0.65 },
  hard: { width: 14, height: 14, braid: 0.28, min_path_ratio: 0.75 },
};

export type Rng = {
  random: () => number;
  shuffle: <T>(arr: T[]) => T[];
};

/** Mulberry32 — deterministic PRNG for reproducible maze exports. */
export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  return {
    random() {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    shuffle<T>(arr: T[]) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(this.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },
  };
}

export function resolveMazeConfig(input: {
  difficulty?: Difficulty;
  width?: number;
  height?: number;
  braid?: number;
  min_path_ratio?: number;
}): MazeConfig {
  const difficulty = input.difficulty ?? 'medium';
  const defaults = DIFFICULTY_DEFAULTS[difficulty] ?? DIFFICULTY_DEFAULTS.medium;
  return {
    width: Math.max(4, Math.min(20, input.width ?? defaults.width)),
    height: Math.max(4, Math.min(20, input.height ?? defaults.height)),
    braid: Math.max(0, Math.min(0.35, input.braid ?? defaults.braid)),
    min_path_ratio: Math.max(0.1, Math.min(1, input.min_path_ratio ?? defaults.min_path_ratio)),
    difficulty,
  };
}

export function carvePerfectMaze(width: number, height: number, rng: Rng): MazeGrid {
  const grid: MazeGrid = Array.from({ length: height * 2 + 1 }, () =>
    Array.from({ length: width * 2 + 1 }, () => WALL),
  );

  function carve(cx: number, cy: number) {
    grid[cy * 2 + 1][cx * 2 + 1] = PASSAGE;
    const dirs = rng.shuffle([
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as [number, number][]);
    for (const [dx, dy] of dirs) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height && grid[ny * 2 + 1][nx * 2 + 1] === WALL) {
        grid[cy * 2 + 1 + dy][cx * 2 + 1 + dx] = PASSAGE;
        carve(nx, ny);
      }
    }
  }

  carve(0, 0);
  grid[1][1] = START;
  grid[height * 2 - 1][width * 2 - 1] = END;
  return grid;
}

function cellPassage(grid: MazeGrid, cx: number, cy: number): boolean {
  const ch = grid[cy * 2 + 1][cx * 2 + 1];
  return ch === PASSAGE || ch === START || ch === END;
}

function passageBetween(grid: MazeGrid, x1: number, y1: number, x2: number, y2: number): boolean {
  const mx = x1 * 2 + 1 + (x2 - x1);
  const my = y1 * 2 + 1 + (y2 - y1);
  return grid[my][mx] !== WALL;
}

export function applyBraid(grid: MazeGrid, width: number, height: number, braid: number, rng: Rng): void {
  if (braid <= 0) return;
  const candidates: [number, number, number, number][] = [];
  for (let cy = 0; cy < height; cy++) {
    for (let cx = 0; cx < width; cx++) {
      if (
        cx + 1 < width &&
        cellPassage(grid, cx, cy) &&
        cellPassage(grid, cx + 1, cy) &&
        !passageBetween(grid, cx, cy, cx + 1, cy)
      ) {
        candidates.push([cx, cy, cx + 1, cy]);
      }
      if (
        cy + 1 < height &&
        cellPassage(grid, cx, cy) &&
        cellPassage(grid, cx, cy + 1) &&
        !passageBetween(grid, cx, cy, cx, cy + 1)
      ) {
        candidates.push([cx, cy, cx, cy + 1]);
      }
    }
  }
  if (!candidates.length) return;
  rng.shuffle(candidates);
  const removeCount = Math.max(1, Math.floor(candidates.length * braid));
  for (const [x1, y1, x2, y2] of candidates.slice(0, removeCount)) {
    const mx = x1 * 2 + 1 + (x2 - x1);
    const my = y1 * 2 + 1 + (y2 - y1);
    grid[my][mx] = PASSAGE;
  }
}

export function solveMaze(grid: MazeGrid, width: number, height: number): [number, number][] | null {
  if (!cellPassage(grid, 0, 0) || !cellPassage(grid, width - 1, height - 1)) return null;
  const goal: [number, number] = [width - 1, height - 1];
  const queue: [number, number][] = [[0, 0]];
  const prev = new Map<string, [number, number] | null>();
  prev.set('0,0', null);

  while (queue.length) {
    const [cx, cy] = queue.shift()!;
    if (cx === goal[0] && cy === goal[1]) {
      const path: [number, number][] = [];
      let cur: [number, number] | null = goal;
      while (cur) {
        path.push(cur);
        cur = prev.get(`${cur[0]},${cur[1]}`) ?? null;
      }
      return path.reverse();
    }
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as [number, number][]) {
      const nx = cx + dx;
      const ny = cy + dy;
      const key = `${nx},${ny}`;
      if (nx >= 0 && nx < width && ny >= 0 && ny < height && !prev.has(key)) {
        if (passageBetween(grid, cx, cy, nx, ny)) {
          prev.set(key, [cx, cy]);
          queue.push([nx, ny]);
        }
      }
    }
  }
  return null;
}

export function mazeStats(grid: MazeGrid, width: number, height: number, braid = 0): MazeStats {
  const path = solveMaze(grid, width, height);
  if (!path) {
    return { path_length: 0, path_ratio: 0, solvable: false, width, height, braid };
  }
  return {
    path_length: path.length,
    path_ratio: path.length / Math.max(1, width + height),
    solvable: true,
    width,
    height,
    braid,
    path,
  };
}

export function generateMazeGrid(
  config: MazeConfig,
  seed: number,
  maxAttempts = 25,
): MazeResult | null {
  let best: MazeResult | null = null;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const rng = createRng(seed + attempt);
    const grid = carvePerfectMaze(config.width, config.height, rng);
    applyBraid(grid, config.width, config.height, config.braid, rng);
    const stats = mazeStats(grid, config.width, config.height, config.braid);
    if (stats.solvable && stats.path_ratio >= config.min_path_ratio) {
      return { grid, stats, config, meetsDifficultyTarget: true };
    }
    if (!best || stats.path_length > best.stats.path_length) {
      best = { grid, stats, config, meetsDifficultyTarget: false };
    }
  }
  return best;
}

export function passageOpen(grid: MazeGrid, x1: number, y1: number, x2: number, y2: number): boolean {
  return passageBetween(grid, x1, y1, x2, y2);
}

export function computeMazeCellSize(
  wCells: number,
  hCells: number,
  difficulty: Difficulty,
  layoutWidth = 170,
  layoutHeight = 175,
): number {
  let base = 9;
  if (difficulty === 'hard') base = Math.max(7, base - 1);
  if (difficulty === 'easy') base += 1;
  return Math.min(base, layoutWidth / wCells, layoutHeight / hCells);
}

/** Client-only random seed (avoid Math.random during SSR). */
export function randomSeed(): number {
  return Math.floor(Math.random() * 0x7fffffff);
}
