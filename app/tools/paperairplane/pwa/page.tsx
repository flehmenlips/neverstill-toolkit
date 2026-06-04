"use client";

import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';

// Simple client-side maze generator (recursive backtracking) - spike for PA-005 PWA hosted demo
// This parallels the Python implementation in the PaperAirplane repo (separate agent).
// Goal: pure web, installable PWA experience, no server, offline capable.

function generateMaze(width: number, height: number, braid: number = 0): boolean[][] {
  // Returns a grid of walls: true = wall present
  // Using a 2x grid for walls between cells, simplified for drawing
  const gridWidth = width * 2 + 1;
  const gridHeight = height * 2 + 1;
  const maze: boolean[][] = Array.from({ length: gridHeight }, () => Array(gridWidth).fill(true));

  const stack: [number, number][] = [];
  const visited = Array.from({ length: height }, () => Array(width).fill(false));

  const cx = 0, cy = 0;
  visited[cy][cx] = true;
  stack.push([cx, cy]);

  while (stack.length > 0) {
    const [x, y] = stack[stack.length - 1];
    const neighbors: [number, number, string][] = [];

    if (x > 0 && !visited[y][x - 1]) neighbors.push([x - 1, y, 'left']);
    if (x < width - 1 && !visited[y][x + 1]) neighbors.push([x + 1, y, 'right']);
    if (y > 0 && !visited[y - 1][x]) neighbors.push([x, y - 1, 'up']);
    if (y < height - 1 && !visited[y + 1][x]) neighbors.push([x, y + 1, 'down']);

    if (neighbors.length > 0) {
      const [nx, ny, dir] = neighbors[Math.floor(Math.random() * neighbors.length)];
      // Carve passage in the wall grid
      const wx = x * 2 + 1;
      const wy = y * 2 + 1;

      if (dir === 'left') {
        maze[wy][wx - 1] = false; // left wall
      } else if (dir === 'right') {
        maze[wy][wx + 1] = false;
      } else if (dir === 'up') {
        maze[wy - 1][wx] = false;
      } else if (dir === 'down') {
        maze[wy + 1][wx] = false;
      }

      // Mark cell
      maze[ny * 2 + 1][nx * 2 + 1] = false;
      visited[ny][nx] = true;
      stack.push([nx, ny]);
    } else {
      stack.pop();
    }
  }

  // Add braid (loops) for higher difficulty - randomly remove some internal walls
  if (braid > 0) {
    for (let y = 1; y < gridHeight - 1; y += 2) {
      for (let x = 1; x < gridWidth - 1; x += 2) {
        if (Math.random() < braid) {
          // Randomly knock down a wall to a neighbor
          const dirs = [[0, -2], [2, 0], [0, 2], [-2, 0]];
          const [dx, dy] = dirs[Math.floor(Math.random() * dirs.length)];
          const nx = x + dx;
          const ny = y + dy;
          if (nx > 0 && nx < gridWidth - 1 && ny > 0 && ny < gridHeight - 1) {
            const mx = (x + nx) / 2;
            const my = (y + ny) / 2;
            maze[my][mx] = false;
          }
        }
      }
    }
  }

  // Ensure start and end are open
  maze[1][1] = false; // start cell
  maze[gridHeight - 2][gridWidth - 2] = false; // end cell

  return maze;
}

function drawMazeOnCanvas(canvas: HTMLCanvasElement, maze: boolean[][], theme: string) {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const gridH = maze.length;
  const gridW = maze[0].length;

  // Compute cell size from the actual generated maze grid (logical size = (grid-1)/2 )
  const logicalW = (gridW - 1) / 2;
  const logicalH = (gridH - 1) / 2;
  const cellSize = Math.min(28, Math.floor(520 / Math.max(logicalW, logicalH)));

  const decoWidth = (theme !== 'classic') ? 45 : 0; // reserve space for theme decoration on the right
  canvas.width = gridW * cellSize + decoWidth;
  canvas.height = gridH * cellSize;

  ctx.fillStyle = '#111827'; // dark bg
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#f3e8d8'; // warm wall color for "printable"
  ctx.lineWidth = Math.max(2, cellSize / 6);
  ctx.lineCap = 'round';

  // Draw walls
  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      if (maze[y][x]) {
        const px = x * cellSize;
        const py = y * cellSize;

        ctx.beginPath();
        // Simple thick segments for walls (mimics the Python rect approach but cleaner)
        if (y % 2 === 0 || x % 2 === 0) {
          ctx.rect(px, py, cellSize, cellSize);
        }
        ctx.fillStyle = '#3f2a1f';
        ctx.fill();
      }
    }
  }

  // Start (GO)
  const startX = 1 * cellSize + cellSize / 2;
  const startY = 1 * cellSize + cellSize / 2;
  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.arc(startX, startY, cellSize / 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111827';
  ctx.font = `${Math.floor(cellSize / 2.5)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GO', startX, startY);

  // End (FIN)
  const endX = (gridW - 2) * cellSize + cellSize / 2;
  const endY = (gridH - 2) * cellSize + cellSize / 2;
  ctx.fillStyle = '#f87171';
  ctx.beginPath();
  ctx.arc(endX, endY, cellSize / 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111827';
  ctx.fillText('FIN', endX, endY);

  // Theme decoration (simple) - placed in reserved right margin to avoid overlap with maze
  if (theme !== 'classic') {
    const decoX = gridW * cellSize + 5;
    ctx.fillStyle = theme === 'dinosaurs' ? '#86efac' : theme === 'farm' ? '#fde047' : '#bae6fd';
    ctx.fillRect(decoX, 10, 35, 35);
    ctx.fillStyle = '#111827';
    ctx.font = '10px sans-serif';
    ctx.fillText(theme.slice(0, 3).toUpperCase(), decoX + 18, 28);
  }
}

export default function PaperAirplanePWA() {
  const [config, setConfig] = useState({ width: 8, height: 8, braid: 0.1 });
  const [theme, setTheme] = useState<'classic' | 'dinosaurs' | 'farm' | 'space'>('classic');
  const [maze, setMaze] = useState<boolean[][]>(() => generateMaze(8, 8, 0.1));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // For the manual "Regenerate" button (re-seed with current params)
  const regenerate = useCallback(() => {
    const newMaze = generateMaze(config.width, config.height, config.braid);
    setMaze(newMaze);
  }, [config]);

  useEffect(() => {
    if (maze && canvasRef.current) {
      drawMazeOnCanvas(canvasRef.current, maze, theme);
    }
  }, [maze, theme]);

  const exportPDF = () => {
    if (!maze || !canvasRef.current) return;

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Title
    pdf.setFontSize(16);
    pdf.text(`PaperAirplane Maze — ${theme} (${config.width}x${config.height})`, 20, 20);

    // Instructions
    pdf.setFontSize(10);
    pdf.text('Print this page. Use a pencil to solve the maze. Great for ages 4-10 depending on size.', 20, 28);

    // Embed canvas as image (simple for spike; full vector port would redraw paths)
    const imgData = canvasRef.current.toDataURL('image/png');
    let imgWidth = 160; // mm target max
    let imgHeight = (canvasRef.current.height / canvasRef.current.width) * imgWidth;

    // Scale to fit page (title at ~30mm + instructions + margins + footer space)
    const maxImgHeight = pageHeight - 60; // leave room for header/footer
    if (imgHeight > maxImgHeight) {
      const scale = maxImgHeight / imgHeight;
      imgHeight = maxImgHeight;
      imgWidth = imgWidth * scale;
    }
    const x = (pageWidth - imgWidth) / 2;
    pdf.addImage(imgData, 'PNG', x, 35, imgWidth, imgHeight);

    // Footer - positioned safely below image
    const footerY = Math.max(pageHeight - 15, 35 + imgHeight + 10);
    pdf.setFontSize(8);
    pdf.text('Generated in the Neverstill Toolkit PWA (PA-005 spike). Full parity with Python version coming.', 20, footerY);

    pdf.save(`paperairplane-maze-${theme}-${config.width}x${config.height}.pdf`);
  };



  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link href="/tools/paperairplane" className="text-sm text-white/50 hover:text-white">← Back to PaperAirplane</Link>

        <div className="mt-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🧩</span>
            <div>
              <h1 className="text-4xl font-semibold tracking-tighter">PaperAirplane PWA Demo</h1>
              <p className="text-white/60">Interactive maze generator — PA-005 hosted spike</p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-white/70 bg-white/5 p-4 rounded-xl">
          This is a pure-web, client-side spike of the maze generator (recursive backtracking + optional braid for loops/higher difficulty).
          Matches the philosophy of the Python version but runs 100% in the browser (no install, installable as PWA via browser menu).
          Canvas preview + PDF export using jsPDF. Full port of writing + more themes + parity with Python in the parallel PaperAirplane PA-005 work.
        </div>

        <div className="mt-8 grid md:grid-cols-5 gap-8">
          {/* Controls */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <label className="text-xs uppercase tracking-widest text-white/50">Width × Height</label>
              <div className="flex gap-2 mt-2">
                <input type="range" min="4" max="16" value={config.width} onChange={(e) => {
                  const v = parseInt(e.target.value);
                  const newConfig = { ...config, width: v };
                  setConfig(newConfig);
                  const newMaze = generateMaze(newConfig.width, newConfig.height, newConfig.braid);
                  setMaze(newMaze);
                }} className="flex-1" />
                <input type="range" min="4" max="16" value={config.height} onChange={(e) => {
                  const v = parseInt(e.target.value);
                  const newConfig = { ...config, height: v };
                  setConfig(newConfig);
                  const newMaze = generateMaze(newConfig.width, newConfig.height, newConfig.braid);
                  setMaze(newMaze);
                }} className="flex-1" />
              </div>
              <div className="text-center text-sm mt-1">{config.width} × {config.height}</div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-white/50">Difficulty (braid / loops)</label>
              <input type="range" min="0" max="0.4" step="0.05" value={config.braid} onChange={(e) => {
                const v = parseFloat(e.target.value);
                const newConfig = { ...config, braid: v };
                setConfig(newConfig);
                const newMaze = generateMaze(newConfig.width, newConfig.height, newConfig.braid);
                setMaze(newMaze);
              }} className="w-full mt-2" />
              <div className="text-xs text-white/60 mt-1">0 = perfect maze (unique path). Higher = more choices and backtracking fun.</div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-white/50">Theme</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(['classic', 'dinosaurs', 'farm', 'space'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`px-3 py-1 text-sm rounded-full border ${theme === t ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white/40'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={regenerate}
              className="w-full rounded bg-white text-black py-3 font-medium hover:bg-white/90 active:bg-white"
            >
              Regenerate Maze
            </button>

            <button
              onClick={exportPDF}
              disabled={!maze}
              className="w-full rounded border border-white/30 py-2 text-sm hover:bg-white/5 disabled:opacity-50"
            >
              Export Printable PDF
            </button>

            <div className="text-[10px] text-white/40 pt-4 border-t border-white/10">
              This demo is fully client-side. Add to home screen for real PWA experience. Pro (via Stripe in the hub) will unlock more generators, larger sizes, and custom themes.
            </div>
          </div>

          {/* Preview */}
          <div className="md:col-span-3">
            <div className="border border-white/10 rounded-2xl p-4 bg-zinc-900/50">
              <canvas
                ref={canvasRef}
                className="w-full max-w-[520px] mx-auto border border-white/10 rounded bg-[#111827]"
              />
              <p className="text-center text-xs text-white/50 mt-3">Preview — solve with pencil after printing. GO to FIN.</p>
            </div>

            <div className="mt-4 text-xs text-white/50">
              <strong>PA-005 note:</strong> This is the toolkit-side spike for hosted PWA. The full generator port, writing tracing vectors, fidelity matching, and Pyodide experiments are happening in parallel in the PaperAirplane repo by another agent. Exciting to compare the two workflows!
            </div>
          </div>
        </div>

        <div className="mt-12 text-xs text-white/40 border-t border-white/10 pt-6">
          Part of Neverstill Operator Toolkit • PWA direction (PA-005) • Python remains the pack production tool
        </div>
      </div>
    </div>
  );
}
