"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';
import jsPDF from 'jspdf';
import {
  DIFFICULTY_DEFAULTS,
  generateMazeGrid,
  randomSeed,
  resolveMazeConfig,
  type Difficulty,
  type MazeConfig,
  type MazeResult,
} from '@/lib/paperairplane/maze-logic';
import { drawMazeToCanvas, type Theme } from '@/lib/paperairplane/maze-render';

const FREE_MAX_SIZE = 16;
const PRO_MAX_SIZE = 28;

type ProStatus = {
  paperAirplanePro: boolean;
  livemode: boolean | null;
  verified: boolean;
};

type GeneratorParams = {
  difficulty: Difficulty;
  width: number;
  height: number;
  braid: number;
  seed: number;
};

function buildConfig(params: GeneratorParams, maxSize: number): MazeConfig {
  return resolveMazeConfig({
    difficulty: params.difficulty,
    width: params.width,
    height: params.height,
    braid: params.braid,
    maxSize,
  });
}

function clampParams(params: GeneratorParams, maxSize: number): GeneratorParams {
  return {
    ...params,
    width: Math.min(params.width, maxSize),
    height: Math.min(params.height, maxSize),
  };
}

function generateFromParams(params: GeneratorParams, maxSize: number): MazeResult | null {
  const config = buildConfig(params, maxSize);
  let best: MazeResult | null = null;
  for (let offset = 0; offset < 12; offset++) {
    const result = generateMazeGrid(config, params.seed + offset, 25);
    if (result?.meetsDifficultyTarget) return result;
    if (result && (!best || result.stats.path_ratio > best.stats.path_ratio)) {
      best = result;
    }
  }
  return best;
}

export default function PaperAirplanePwaClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [proStatus, setProStatus] = useState<ProStatus>({
    paperAirplanePro: false,
    livemode: null,
    verified: false,
  });
  const [params, setParams] = useState<GeneratorParams>({
    difficulty: 'medium',
    width: DIFFICULTY_DEFAULTS.medium.width,
    height: DIFFICULTY_DEFAULTS.medium.height,
    braid: DIFFICULTY_DEFAULTS.medium.braid,
    seed: 0,
  });
  const [theme, setTheme] = useState<Theme>('classic');
  const [showSolution, setShowSolution] = useState(false);
  const [mazeResult, setMazeResult] = useState<MazeResult | null>(null);
  const [seedInput, setSeedInput] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isPro = proStatus.paperAirplanePro;
  const maxSize = isPro ? PRO_MAX_SIZE : FREE_MAX_SIZE;

  useEffect(() => {
    const query = sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : '';
    let cancelled = false;

    fetch(`/api/pro-status${query}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ProStatus | null) => {
        if (!cancelled && data) {
          const nextMax = data.paperAirplanePro ? PRO_MAX_SIZE : FREE_MAX_SIZE;
          setProStatus(data);
          setParams((prev) => {
            const updated = clampParams(prev, nextMax);
            setMazeResult(generateFromParams(updated, nextMax));
            return updated;
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProStatus({ paperAirplanePro: false, livemode: null, verified: false });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const effectiveShowSolution = isPro && showSolution;

  const applyParams = useCallback((next: GeneratorParams | ((prev: GeneratorParams) => GeneratorParams)) => {
    if (typeof next === 'function') {
      setParams((prev) => {
        const updated = clampParams(next(prev), maxSize);
        setMazeResult(generateFromParams(updated, maxSize));
        return updated;
      });
    } else {
      const updated = clampParams(next, maxSize);
      setParams(updated);
      setMazeResult(generateFromParams(updated, maxSize));
    }
  }, [maxSize]);

  const setDifficulty = useCallback(
    (difficulty: Difficulty) => {
      const defaults = DIFFICULTY_DEFAULTS[difficulty];
      applyParams((prev) => ({
        ...prev,
        difficulty,
        width: defaults.width,
        height: defaults.height,
        braid: defaults.braid,
      }));
    },
    [applyParams],
  );

  const regenerate = useCallback(() => {
    const nextSeed = randomSeed();
    setSeedInput(String(nextSeed));
    applyParams((prev) => ({ ...prev, seed: nextSeed }));
  }, [applyParams]);

  const applySeedFromInput = useCallback(() => {
    const parsed = Number.parseInt(seedInput, 10);
    if (!Number.isFinite(parsed)) return;
    applyParams((prev) => ({ ...prev, seed: parsed >>> 0 }));
  }, [applyParams, seedInput]);

  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    if (mazeResult === null) {
      const seed = randomSeed();
      const initial: GeneratorParams = {
        difficulty: 'medium',
        width: DIFFICULTY_DEFAULTS.medium.width,
        height: DIFFICULTY_DEFAULTS.medium.height,
        braid: DIFFICULTY_DEFAULTS.medium.braid,
        seed,
      };
      setSeedInput(String(seed));
      setParams(initial);
      setMazeResult(generateFromParams(initial, maxSize));
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  useEffect(() => {
    if (!canvasRef.current) return;
    if (mazeResult) {
      drawMazeToCanvas(canvasRef.current, mazeResult.grid, mazeResult.config, mazeResult.stats, {
        style: 'dark',
        theme,
        showPath: effectiveShowSolution,
      });
    } else {
      const c = canvasRef.current;
      c.width = 300;
      c.height = 180;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px sans-serif';
        ctx.fillText('Loading maze preview...', 70, 90);
      }
    }
  }, [mazeResult, theme, effectiveShowSolution]);

  const exportPDF = () => {
    if (!mazeResult) return;

    const { grid, stats, config } = mazeResult;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.setFontSize(16);
    pdf.text(
      `PaperAirplane Maze — ${theme} (${config.difficulty}, ${config.width}×${config.height})`,
      20,
      20,
    );

    pdf.setFontSize(10);
    pdf.text('Print this page. Use a pencil to solve the maze. Ages 4–10+ depending on difficulty.', 20, 28);
    if (stats.solvable) {
      pdf.text(`Solution path: ${stats.path_length} steps · seed ${params.seed}`, 20, 34);
    }

    const offCanvas = document.createElement('canvas');
    drawMazeToCanvas(offCanvas, grid, config, stats, {
      style: 'light',
      theme,
      showPath: effectiveShowSolution,
      maxWidthPx: 680,
    });
    const imgData = offCanvas.toDataURL('image/png');
    let imgWidth = 160;
    let imgHeight = (offCanvas.height / offCanvas.width) * imgWidth;

    const maxImgHeight = pageHeight - 60;
    if (imgHeight > maxImgHeight) {
      const scale = maxImgHeight / imgHeight;
      imgHeight = maxImgHeight;
      imgWidth = imgWidth * scale;
    }
    const x = (pageWidth - imgWidth) / 2;
    pdf.addImage(imgData, 'PNG', x, 40, imgWidth, imgHeight);

    const footerY = Math.max(pageHeight - 15, 40 + imgHeight + 10);
    pdf.setFontSize(8);
    pdf.text('Generated at neverstill.dev · Neverstill Operator Toolkit', 20, footerY);

    pdf.save(
      `paperairplane-maze-${theme}-${config.difficulty}-${config.width}x${config.height}-seed${params.seed}.pdf`,
    );
  };

  const stats = mazeResult?.stats;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Link href="/tools/paperairplane" className="text-sm text-white/50 hover:text-white">
          ← Back to PaperAirplane
        </Link>

        <div className="mt-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🧩</span>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-semibold tracking-tighter">PaperAirplane Mazes</h1>
                {isPro && (
                  <span className="rounded-full border border-emerald-500/40 bg-emerald-950/50 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-emerald-200">
                    Pro
                  </span>
                )}
              </div>
              <p className="text-white/60">Hosted PWA — difficulty presets, braid loops, printable PDF</p>
            </div>
          </div>
        </div>

        {isPro ? (
          <div className="mt-4 text-sm text-emerald-100 bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-xl">
            Pro access active — larger sizes (up to {PRO_MAX_SIZE}×{PRO_MAX_SIZE}) and solution-path overlay
            unlocked.
            {proStatus.livemode === false && (
              <span className="block mt-1 text-xs text-emerald-100/70">Stripe test mode purchase</span>
            )}
          </div>
        ) : (
          <div className="mt-4 text-sm text-white/70 bg-white/5 p-4 rounded-xl">
            Free tier: mazes up to {FREE_MAX_SIZE}×{FREE_MAX_SIZE}.{' '}
            <Link href="/tools/paperairplane" className="underline hover:text-white">
              Buy PaperAirplane Pro
            </Link>{' '}
            for larger sizes and solution-path overlay. After checkout, return via /account with your session
            linked.
          </div>
        )}

        <div className="mt-8 grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <label className="text-xs uppercase tracking-widest text-white/50">Difficulty preset</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(['easy', 'medium', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`px-3 py-1 text-sm rounded-full border capitalize ${
                      params.difficulty === d
                        ? 'bg-white text-black border-white'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/50 mt-2">
                Easy {DIFFICULTY_DEFAULTS.easy.width}×{DIFFICULTY_DEFAULTS.easy.height} · Medium{' '}
                {DIFFICULTY_DEFAULTS.medium.width}×{DIFFICULTY_DEFAULTS.medium.height} · Hard{' '}
                {DIFFICULTY_DEFAULTS.hard.width}×{DIFFICULTY_DEFAULTS.hard.height}
              </p>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-white/50">Width × Height</label>
              <div className="flex gap-2 mt-2">
                <input
                  type="range"
                  min="4"
                  max={maxSize}
                  value={Math.min(params.width, maxSize)}
                  onChange={(e) => {
                    const width = parseInt(e.target.value, 10);
                    applyParams((prev) => ({ ...prev, width }));
                  }}
                  className="flex-1"
                />
                <input
                  type="range"
                  min="4"
                  max={maxSize}
                  value={Math.min(params.height, maxSize)}
                  onChange={(e) => {
                    const height = parseInt(e.target.value, 10);
                    applyParams((prev) => ({ ...prev, height }));
                  }}
                  className="flex-1"
                />
              </div>
              <div className="text-center text-sm mt-1">
                {params.width} × {params.height}
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-white/50">Braid (extra loops)</label>
              <input
                type="range"
                min="0"
                max="0.35"
                step="0.01"
                value={params.braid}
                onChange={(e) => {
                  const braid = parseFloat(e.target.value);
                  applyParams((prev) => ({ ...prev, braid }));
                }}
                className="w-full mt-2"
              />
              <div className="text-xs text-white/60 mt-1">
                {params.braid.toFixed(2)} — higher braid adds dead ends and backtracking (validated via min path
                ratio).
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-white/50">Theme</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {(['classic', 'dinosaurs', 'farm', 'space'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={`px-3 py-1 text-sm rounded-full border ${
                      theme === t ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/50 mt-2">
                Border color labels only — maze paths are plain pencil style until decorative themes ship.
              </p>
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-white/50">Seed (reproducible export)</label>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={seedInput}
                  onChange={(e) => setSeedInput(e.target.value)}
                  className="flex-1 rounded bg-zinc-900 border border-white/20 px-2 py-1 text-sm"
                  placeholder="e.g. 42"
                />
                <button
                  type="button"
                  onClick={applySeedFromInput}
                  className="rounded border border-white/30 px-3 py-1 text-sm hover:bg-white/5"
                >
                  Apply
                </button>
              </div>
            </div>

            <label
              className={`flex items-center gap-2 text-sm ${
                isPro ? 'text-white/80 cursor-pointer' : 'text-white/50 cursor-not-allowed'
              }`}
            >
              <input
                type="checkbox"
                checked={showSolution}
                disabled={!isPro}
                onChange={(e) => setShowSolution(e.target.checked)}
                className="rounded disabled:opacity-40"
              />
              Show solution path (preview + PDF)
              {!isPro && <span className="text-xs text-white/40">— Pro</span>}
            </label>

            <button
              type="button"
              onClick={regenerate}
              className="w-full rounded bg-white text-black py-3 font-medium hover:bg-white/90 active:bg-white"
            >
              Regenerate Maze
            </button>

            <button
              type="button"
              onClick={exportPDF}
              disabled={!mazeResult}
              className="w-full rounded border border-white/30 py-2 text-sm hover:bg-white/5 disabled:opacity-50"
            >
              Export Printable PDF
            </button>

            {stats && (
              <div className="text-xs text-white/50 border-t border-white/10 pt-3 space-y-1">
                <div>
                  Path: {stats.path_length} steps · ratio {(stats.path_ratio * 100).toFixed(0)}%
                  {stats.solvable ? '' : ' · unsolvable'}
                </div>
                <div>Min path ratio target: {(buildConfig(params, maxSize).min_path_ratio * 100).toFixed(0)}%</div>
                {mazeResult && !mazeResult.meetsDifficultyTarget && (
                  <p className="text-amber-400/90">
                    Could not fully meet difficulty target — try Regenerate or lower braid/size.
                  </p>
                )}
              </div>
            )}

            <div className="text-[10px] text-white/40 pt-4 border-t border-white/10">
              Client-side only. Add to home screen for offline use. Pro (Stripe) unlocks up to {PRO_MAX_SIZE}×
              {PRO_MAX_SIZE} mazes and solution-path overlay — verified server-side via /api/pro-status.
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="border border-white/10 rounded-2xl p-4 bg-zinc-900/50">
              <canvas
                ref={canvasRef}
                className="w-full max-w-[520px] mx-auto border border-white/10 rounded bg-[#111827]"
              />
              <p className="text-center text-xs text-white/50 mt-3">GO → FIN · thick walls for pencil solving</p>
            </div>

            <div className="mt-4 text-xs text-white/50">
              Algorithms match the PaperAirplane Python generator and{' '}
              <a
                href="https://github.com/flehmenlips/PaperAirplane/tree/main/spikes/PA-005-jspdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white/80"
              >
                PA-005-jspdf spike
              </a>
              . Python CLI remains the pack-production tool for Gumroad bundles.
            </div>
          </div>
        </div>

        <div className="mt-12 text-xs text-white/40 border-t border-white/10 pt-6">
          Part of Neverstill Operator Toolkit · NT-002 · Python pack tool in sibling PaperAirplane repo
        </div>
      </div>
    </div>
  );
}
