import React from 'react';

interface WaveformDisplayProps {
  isListening: boolean;
}

const WaveformDisplay: React.FC<WaveformDisplayProps> = ({ isListening }) => {
  const barCount = 15; // Number of bars in the waveform
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div className="flex justify-center items-end h-24 w-full px-4 overflow-hidden">
      {bars.map((_, index) => (
        <div
          key={index}
          className={`
            w-1.5 mx-0.5 rounded-full bg-black
            transition-all duration-150 ease-in-out
            ${isListening ? 'animate-waveform' : 'h-2'}
          `}
          style={{ animationDelay: `${index * 0.05}s` }}
        ></div>
      ))}
      <style>{`
        @keyframes waveform-animation {
          0%, 100% { height: 8px; }
          25% { height: 20px; }
          50% { height: 40px; }
          75% { height: 10px; }
        }
        .animate-waveform {
          animation: waveform-animation 1.5s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default WaveformDisplay;