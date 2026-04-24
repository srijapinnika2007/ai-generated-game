import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);
  const speedRef = useRef<number>(150);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
    speedRef.current = 150;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (isGameOver) resetGame();
          else setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  const update = useCallback((time: number) => {
    if (isPaused || isGameOver) return;

    if (time - lastUpdateRef.current > speedRef.current) {
      lastUpdateRef.current = time;

      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
        };

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check collision with food
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(generateFood(newSnake));
          // Increase speed slightly
          speedRef.current = Math.max(50, speedRef.current - 2);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }

    gameLoopRef.current = requestAnimationFrame(update);
  }, [isPaused, isGameOver, direction, food, score, generateFood, onScoreChange]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cellSize = canvas.width / GRID_SIZE;

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#10b981' : '#059669';
      ctx.shadowBlur = index === 0 ? 15 : 0;
      ctx.shadowColor = '#10b981';
      ctx.fillRect(
        segment.x * cellSize + 2,
        segment.y * cellSize + 2,
        cellSize - 4,
        cellSize - 4
      );
    });

    // Draw food
    ctx.fillStyle = '#f43f5e';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#f43f5e';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.shadowBlur = 0; // Reset shadow for other drawings
  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="rounded-lg border border-white/5 bg-transparent cursor-none"
        />
        
        <AnimatePresence>
          {(isPaused || isGameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 rounded-lg backdrop-blur-sm"
            >
              <h2 className={`text-5xl font-black mb-6 tracking-tighter ${isGameOver ? 'text-rose-500' : 'text-emerald-400'}`}>
                {isGameOver ? 'CRITICAL FAILURE' : 'SYSTEM PAUSED'}
              </h2>
              {isGameOver && (
                <div className="mb-8 text-center">
                  <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-1">Final Score</p>
                  <p className="text-4xl font-black font-mono text-white tracking-widest">{score.toString().padStart(5, '0')}</p>
                </div>
              )}
              <button
                onClick={isGameOver ? resetGame : () => setIsPaused(false)}
                className="px-12 py-4 rounded-full font-black tracking-widest transition-all hover:scale-105 active:scale-95 bg-white text-slate-950 shadow-[0_0_30px_rgba(255,255,255,0.4)]"
              >
                {isGameOver ? 'REBOOT' : 'INITIALIZE'}
              </button>
              {!isGameOver && (
                <p className="mt-6 text-[10px] text-white/30 uppercase tracking-[0.3em] font-mono">
                  Press Space to {isPaused ? 'Resume' : 'Pause'}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
