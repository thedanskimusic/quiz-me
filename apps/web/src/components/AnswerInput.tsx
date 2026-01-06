"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, RefreshCcw, AlertCircle } from 'lucide-react';

interface AnswerInputProps {
  questionId: string;
  questionText: string;
  onSave: (answer: string) => Promise<void>;
  simulateLatency: boolean;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  questionId,
  questionText,
  onSave,
  simulateLatency,
}) => {
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<'idle' | 'syncing' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<number | null>(null);

  // Debounce saving
  useEffect(() => {
    if (answer === '') return;

    const timer = setTimeout(async () => {
      setStatus('syncing');
      try {
        if (simulateLatency) {
          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        await onSave(answer);
        setStatus('saved');
        setLastSaved(Date.now());
      } catch (error) {
        setStatus('error');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [answer, onSave, simulateLatency]);

  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-xl shadow-sm border border-zinc-100 transition-all hover:shadow-md">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-zinc-900">{questionText}</h3>
      </div>
      
      <div className="relative">
        <textarea
          className="w-full p-4 text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none min-h-[120px]"
          placeholder="Type your answer here..."
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setStatus('idle');
          }}
        />
        
        <div className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-zinc-100 text-xs font-medium transition-all">
          {status === 'syncing' && (
            <>
              <RefreshCcw className="w-3.5 h-3.5 animate-spin text-blue-500" />
              <span className="text-blue-600">Syncing...</span>
            </>
          )}
          {status === 'saved' && (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600">Saved</span>
            </>
          )}
          {status === 'error' && (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              <span className="text-rose-600">Error</span>
            </>
          )}
          {status === 'idle' && answer !== '' && (
            <span className="text-zinc-400">Waiting to sync...</span>
          )}
          {status === 'idle' && answer === '' && (
            <span className="text-zinc-300">Start typing</span>
          )}
        </div>
      </div>
      
      {lastSaved && (
        <div className="mt-2 text-[10px] text-zinc-400 text-right italic">
          Last saved at {new Date(lastSaved).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

