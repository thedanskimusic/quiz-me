"use client";

import React, { useState } from 'react';
import { AnswerInput } from './AnswerInput';
import { Settings, Info } from 'lucide-react';

export const QuizContainer: React.FC = () => {
  const [simulateLatency, setSimulateLatency] = useState(false);

  const mockQuestions = [
    {
      id: 'q1',
      text: 'Explain the difference between synchronous and asynchronous operations in high-scale systems.'
    },
    {
      id: 'q2',
      text: 'How does a message queue like Pub/Sub help in handling a million concurrent writes?'
    }
  ];

  const handleSave = async (answer: string) => {
    // In a real app, this would be an API call to the NestJS backend
    console.log('Saving answer:', answer);
    // Simulate successful save
    return Promise.resolve();
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-8 p-8">
      <header className="flex items-center justify-between pb-6 border-b border-zinc-100">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">System Architecture Quiz</h1>
          <p className="text-zinc-500 text-sm">Prototype: 1M Concurrent User Simulation</p>
        </div>
        
        <div className="flex items-center gap-4 px-4 py-2 bg-zinc-50 rounded-lg border border-zinc-200">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium text-zinc-700">Simulate Latency</span>
          </div>
          <button
            onClick={() => setSimulateLatency(!simulateLatency)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              simulateLatency ? 'bg-blue-600' : 'bg-zinc-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                simulateLatency ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </header>

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700 leading-relaxed">
          <strong>Demo Context:</strong> This portal demonstrates the "Syncing" vs "Saved" states. 
          When 1 million students hit submit, we use <strong>Pub/Sub</strong> to acknowledge immediately, 
          while a background worker processes the write. Toggle latency to see how the UI maintains responsiveness.
        </div>
      </div>

      <div className="space-y-12 py-8">
        {mockQuestions.map((q) => (
          <AnswerInput
            key={q.id}
            questionId={q.id}
            questionText={q.text}
            onSave={handleSave}
            simulateLatency={simulateLatency}
          />
        ))}
      </div>

      <footer className="pt-8 border-t border-zinc-100 text-center text-zinc-400 text-xs">
        &copy; 2026 Quiz-Me High-Scale Prototype &bull; Gradeo Stack Simulation
      </footer>
    </div>
  );
};

