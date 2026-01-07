"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, RefreshCcw, AlertCircle, WifiOff } from 'lucide-react';

interface AnswerInputProps {
  questionId: string;
  questionText: string;
  onSave: (answer: string) => Promise<void>;
  simulateLatency: boolean;
}

export function AnswerInput({
  questionId,
  questionText,
  onSave,
  simulateLatency,
}: AnswerInputProps) {
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<'idle' | 'syncing' | 'saved' | 'error' | 'offline'>('idle');
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [queuedAnswer, setQueuedAnswer] = useState<string | null>(null);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save logic with offline queue support
  useEffect(() => {
    if (!answer.trim()) {
      setStatus('idle');
      setQueuedAnswer(null);
      return;
    }

    // If offline, queue the answer instead of attempting save
    if (!isOnline) {
      setQueuedAnswer(answer);
      setStatus('offline');
      return;
    }

    let isSubscribed = true;
    let timer: NodeJS.Timeout | null = null;

    // Small delay before starting "Syncing" state (Debounce)
    timer = setTimeout(async () => {
      if (!isSubscribed) return;
      
      setStatus('syncing');
      
      try {
        if (simulateLatency) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        // Only update state if this effect is still the active one
        await onSave(answer);
        
        if (isSubscribed) {
          setStatus('saved');
          setLastSaved(Date.now());
          setQueuedAnswer(null); // Clear queue on successful save
        }
      } catch (error) {
        if (isSubscribed) setStatus('error');
      }
    }, 1000);

    return () => {
      isSubscribed = false;
      if (timer) clearTimeout(timer);
    };
  }, [answer, onSave, simulateLatency, isOnline]);

  // Reconnection retry: automatically save queued answer when connection returns
  useEffect(() => {
    if (isOnline && queuedAnswer && queuedAnswer.trim()) {
      let isSubscribed = true;

      const retrySave = async () => {
        setStatus('syncing');
        
        try {
          if (simulateLatency) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }

          await onSave(queuedAnswer);
          
          if (isSubscribed) {
            setStatus('saved');
            setLastSaved(Date.now());
            setQueuedAnswer(null);
          }
        } catch (error) {
          if (isSubscribed) setStatus('error');
        }
      };

      retrySave();

      return () => {
        isSubscribed = false;
      };
    }
  }, [isOnline, queuedAnswer, onSave, simulateLatency]);

  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-xl shadow-sm border border-zinc-100 transition-all hover:shadow-md">
      <div className="mb-4">
        <label htmlFor={`q-${questionId}`} className="text-lg font-medium text-zinc-900 block">
          {questionText}
        </label>
      </div>
      
      <div className="relative">
        <textarea
          id={`q-${questionId}`}
          className="w-full p-4 text-zinc-800 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none min-h-[120px]"
          placeholder="Type your answer here..."
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setStatus('idle');
          }}
        />
        
        {/* Status Indicator with ARIA for accessibility */}
        <div 
          role="status"
          aria-live={status === 'offline' ? 'assertive' : 'polite'}
          aria-label={
            status === 'syncing' ? 'Syncing answer' :
            status === 'saved' ? 'Answer saved successfully' :
            status === 'error' ? 'Error saving answer' :
            status === 'offline' ? 'Offline. Answer queued for sync when connection returns' :
            status === 'idle' && answer !== '' ? 'Waiting to sync answer' :
            'Answer input'
          }
          className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-zinc-100 text-xs font-medium transition-all"
        >
          {status === 'syncing' && (
            <>
              <RefreshCcw className="w-3.5 h-3.5 animate-spin text-blue-500" aria-hidden="true" />
              <span className="text-blue-600">Syncing...</span>
            </>
          )}
          {status === 'saved' && (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
              <span className="text-emerald-600">Saved</span>
            </>
          )}
          {status === 'error' && (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" aria-hidden="true" />
              <span className="text-rose-600">Error</span>
            </>
          )}
          {status === 'offline' && (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
              <span className="text-amber-600">Offline - Queued for sync</span>
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
}