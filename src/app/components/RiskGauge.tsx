import React from 'react';

interface RiskGaugeProps {
  score: number; // 0-100
  level: 'low' | 'medium' | 'high';
  color: string;
}

export function RiskGauge({ score, level, color }: RiskGaugeProps) {
  const radius = 100;
  const strokeWidth = 16;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-64 h-64">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ 
              strokeDashoffset,
              transition: 'stroke-dashoffset 0.5s ease-in-out'
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl" style={{ color }}>
            {Math.round(score)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Risk Score
          </div>
        </div>
      </div>
      
      {/* Risk level badge */}
      <div 
        className="mt-6 px-6 py-2 rounded-full text-white uppercase tracking-wide"
        style={{ backgroundColor: color }}
      >
        {level} Risk
      </div>
    </div>
  );
}
