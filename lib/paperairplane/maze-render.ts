/**
 * Canvas rendering for PaperAirplane mazes (mirrors spikes/PA-005-jspdf/render.js)
 * @see https://github.com/flehmenlips/PaperAirplane/tree/main/spikes/PA-005-jspdf
 */

import {
  computeMazeCellSize,
  passageOpen,
  type MazeConfig,
  type MazeGrid,
  type MazeStats,
} from './maze-logic';

export type Theme = 'classic' | 'dinosaurs' | 'farm' | 'space';
export type RenderStyle = 'dark' | 'light';

const THEME_DECO: Record<Exclude<Theme, 'classic'>, { fill: string; label: string }> = {
  dinosaurs: { fill: '#86efac', label: 'DIN' },
  farm: { fill: '#fde047', label: 'FRM' },
  space: { fill: '#bae6fd', label: 'SPC' },
};

export type DrawMazeOptions = {
  style?: RenderStyle;
  theme?: Theme;
  showPath?: boolean;
  maxWidthPx?: number;
};

export type MazeLayout = {
  cell: number;
  offsetX: number;
  originY: number;
  wCells: number;
  hCells: number;
  decoWidth: number;
};

function palette(style: RenderStyle) {
  const light = style === 'light';
  return {
    bg: light ? '#f8f1e3' : '#111827',
    wall: light ? '#1e1e1e' : '#f3e8d8',
    start: '#22c55e',
    end: '#ef4444',
    markerText: light ? '#ffffff' : '#111827',
    path: light ? 'rgba(37, 99, 235, 0.55)' : 'rgba(96, 165, 250, 0.65)',
    subtitle: light ? '#475569' : '#94a3b8',
    decoText: light ? '#1f2937' : '#111827',
  };
}

function drawMarker(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  color: string,
  label: string,
  textColor: string,
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = textColor;
  ctx.font = `${Math.max(9, Math.floor(r * 1.4))}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, cx, cy);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

export function drawMazeToCanvas(
  canvas: HTMLCanvasElement,
  grid: MazeGrid,
  config: MazeConfig,
  stats: MazeStats | null,
  options: DrawMazeOptions = {},
): MazeLayout {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { cell: 0, offsetX: 0, originY: 0, wCells: 0, hCells: 0, decoWidth: 0 };
  }

  const style = options.style ?? 'dark';
  const theme = options.theme ?? 'classic';
  const showPath = options.showPath ?? false;
  const colors = palette(style);
  const { width: wCells, height: hCells, difficulty } = config;

  const layoutWidth = options.maxWidthPx ?? 520;
  const decoWidth = theme === 'classic' ? 0 : 45;
  const mazeAreaWidth = layoutWidth - decoWidth - 24;
  const cell = Math.min(
    computeMazeCellSize(wCells, hCells, difficulty, mazeAreaWidth, mazeAreaWidth),
    Math.floor(mazeAreaWidth / wCells),
  );

  const mazeWidth = wCells * cell;
  const mazeHeight = hCells * cell;
  const offsetX = 12 + Math.max(0, (mazeAreaWidth - mazeWidth) / 2);
  const originY = 36;
  const wallWidth = difficulty === 'easy' ? Math.max(2, cell / 8) : Math.max(2.5, cell / 6);

  canvas.width = layoutWidth;
  canvas.height = originY + mazeHeight + 16;

  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = colors.subtitle;
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillText(
    `${difficulty} · ${wCells}×${hCells}${stats?.solvable ? ` · path ${stats.path_length}` : ''}`,
    12,
    18,
  );

  ctx.strokeStyle = colors.wall;
  ctx.lineWidth = wallWidth;
  ctx.lineCap = 'square';

  const x0 = offsetX;
  const y0 = originY;
  const x1 = offsetX + mazeWidth;
  const y1 = originY + mazeHeight;
  ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);

  for (let cy = 0; cy < hCells; cy++) {
    for (let cx = 0; cx < wCells; cx++) {
      const x = offsetX + cx * cell;
      const y = originY + cy * cell;
      if (cx + 1 < wCells && !passageOpen(grid, cx, cy, cx + 1, cy)) {
        ctx.beginPath();
        ctx.moveTo(x + cell, y);
        ctx.lineTo(x + cell, y + cell);
        ctx.stroke();
      }
      if (cy + 1 < hCells && !passageOpen(grid, cx, cy, cx, cy + 1)) {
        ctx.beginPath();
        ctx.moveTo(x, y + cell);
        ctx.lineTo(x + cell, y + cell);
        ctx.stroke();
      }
    }
  }

  drawMarker(
    ctx,
    offsetX + cell / 2,
    originY + cell / 2,
    cell * 0.28,
    colors.start,
    'GO',
    colors.markerText,
  );
  drawMarker(
    ctx,
    offsetX + (wCells - 0.5) * cell,
    originY + (hCells - 0.5) * cell,
    cell * 0.24,
    colors.end,
    difficulty === 'hard' ? 'FIN' : 'FIN',
    colors.markerText,
  );

  if (showPath && stats?.path?.length) {
    ctx.strokeStyle = colors.path;
    ctx.lineWidth = cell * 0.14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i < stats.path.length; i++) {
      const [px, py] = stats.path[i];
      const cx = offsetX + (px + 0.5) * cell;
      const cy = originY + (py + 0.5) * cell;
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }

  if (theme !== 'classic') {
    const deco = THEME_DECO[theme];
    const decoX = offsetX + mazeWidth + 8;
    ctx.fillStyle = deco.fill;
    ctx.fillRect(decoX, originY, 35, 35);
    ctx.fillStyle = colors.decoText;
    ctx.font = '10px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(deco.label, decoX + 17, originY + 22);
    ctx.textAlign = 'left';
  }

  return { cell, offsetX, originY, wCells, hCells, decoWidth };
}
