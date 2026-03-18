'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Undo2, Redo2 } from 'lucide-react';
import { useProgressStore } from '@/store/progress';
import { useUIStore } from '@/store/ui';

export default function UndoRedoWidget() {
  const { history, historyIndex, undo, redo } = useProgressStore();
  const { reducedMotion } = useUIStore();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <AnimatePresence>
      {(canUndo || canRedo) && (
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.9 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-surface-2/90 backdrop-blur-md border border-surface-4 p-2 rounded-full shadow-xl shadow-black/50"
        >
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-2 rounded-full transition-colors ${canUndo ? 'text-text-body hover:text-text-heading hover:bg-surface-3' : 'text-surface-4 cursor-not-allowed'}`}
            title="Deshacer"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-surface-4 mx-1" />
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-2 rounded-full transition-colors ${canRedo ? 'text-text-body hover:text-text-heading hover:bg-surface-3' : 'text-surface-4 cursor-not-allowed'}`}
            title="Rehacer"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
