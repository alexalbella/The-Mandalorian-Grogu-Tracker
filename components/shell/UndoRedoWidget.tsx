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
          className="fixed bottom-6 right-6 z-50 flex items-center gap-1.5 bg-surface-2/95 border border-surface-4/60 p-1.5 rounded-sm shadow-md"
        >
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded-sm transition-colors ${canUndo ? 'text-text-body hover:text-text-heading hover:bg-surface-3' : 'text-surface-4/50 cursor-not-allowed'}`}
            title="Deshacer"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-3.5 bg-surface-4/60" />
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded-sm transition-colors ${canRedo ? 'text-text-body hover:text-text-heading hover:bg-surface-3' : 'text-surface-4/50 cursor-not-allowed'}`}
            title="Rehacer"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
