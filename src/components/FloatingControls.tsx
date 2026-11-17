import React from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';

interface FloatingControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  showReplay: boolean;
  onToggleMusic: () => void;
  onToggleMute: () => void;
  onReplay: () => void;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  isPlaying,
  isMuted,
  showReplay,
  onToggleMusic,
  onToggleMute,
  onReplay,
}) => {
  return (
    <div
      className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 p-1.5 rounded-full glass-purple border border-[#FFB6E6]/30 shadow-[0_8px_28px_rgba(16,9,31,0.75)]"
      role="region"
      aria-label="Celebration quick controls"
    >
      <button
        type="button"
        onClick={onToggleMusic}
        aria-label={isPlaying ? 'Pause birthday music' : 'Play birthday music'}
        title={isPlaying ? 'Pause music' : 'Play music'}
        className="flex items-center justify-center w-11 h-11 rounded-full text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4FCB]"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-[#FFD780]" aria-hidden="true" />
        ) : (
          <Play className="w-4 h-4 ml-0.5 text-[#FFB6E6]" aria-hidden="true" />
        )}
      </button>

      <button
        type="button"
        onClick={onToggleMute}
        aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
        title={isMuted ? 'Unmute' : 'Mute'}
        className="flex items-center justify-center w-11 h-11 rounded-full text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4FCB]"
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-white/60" aria-hidden="true" />
        ) : (
          <Volume2 className="w-4 h-4 text-white" aria-hidden="true" />
        )}
      </button>

      {showReplay && (
        <button
          type="button"
          onClick={onReplay}
          aria-label="Replay birthday surprise from the beginning"
          title="Replay Surprise"
          className="flex items-center gap-1.5 h-11 px-3.5 rounded-full text-xs font-medium text-[#FFD780] bg-[#FF4FCB]/15 hover:bg-[#FF4FCB]/30 border border-[#FFB6E6]/25 transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD780]"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Replay</span>
        </button>
      )}
    </div>
  );
};
