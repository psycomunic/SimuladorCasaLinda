
import React from 'react';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="w-full px-6 py-2">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div 
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i < currentStep ? 'bg-primary shadow-[0_0_10px_rgba(244,192,37,0.3)]' : 'bg-stone-200 dark:bg-stone-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
