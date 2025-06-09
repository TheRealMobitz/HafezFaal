import React, { useState, useRef, useEffect } from 'react';

const HafezAudioPlayer = ({ ghazalNumber }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [volume, setVolume] = useState(0.8);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef(null);

  // Generate audio file paths
  const getAudioSrc = () => {
    const mp3Path = `/audio/hafez/${ghazalNumber}.mp3`;
    const oggPath = `/audio/hafez/ogg/${ghazalNumber}.ogg`;
    return { mp3: mp3Path, ogg: oggPath };
  };

  const { mp3, ogg } = getAudioSrc();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);
    
    const handleLoadStart = () => {
      setLoading(true);
      setError(null);
    };
    
    const handleCanPlay = () => {
      setLoading(false);
      setError(null);
    };
    
    const handleError = () => {
      setLoading(false);
      setError('فایل صوتی یافت نشد');
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    // Set initial volume
    audio.volume = volume;

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [ghazalNumber, volume]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        setError('خطا در پخش فایل صوتی');
      });
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    // For RTL: calculate from right side (0 = far right, 1 = far left)
    const percent = (rect.right - e.clientX) / rect.width;
    const seekTime = Math.max(0, Math.min(duration, percent * duration));
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Progress calculation for RTL
  const progressPercent = duration ? Math.max(0, Math.min(100, (currentTime / duration) * 100)) : 0;
  const volumePercent = volume * 100;

  return (
    <div 
      className="audio-player"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Pattern */}
      <div className="audio-player-bg">
        <div className="pattern-circle top-4 right-4"></div>
        <div className="pattern-square bottom-4 left-4"></div>
        <div className="pattern-note top-8 left-8">♪</div>
        <div className="pattern-note bottom-8 right-8">♫</div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 bg-gradient-to-r from-persian-gold to-persian-saffron dark:from-dark-persian-gold dark:to-dark-persian-amber rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-lg">🎵</span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-theme-accent">قرائت غزل</h4>
              <p className="text-xs text-theme-secondary">غزل شماره {ghazalNumber}</p>
            </div>
          </div>
          
          {/* Volume Control - RTL Consistent */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-theme-secondary text-sm">
              {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider w-20"
              style={{
                '--volume-percent': `${volumePercent}%`,
                '--volume-color': '#d4af37',
                '--volume-color-dark': '#c49b2a'
              }}
            />
          </div>
        </div>

        {/* Audio Element */}
        <audio ref={audioRef} preload="metadata">
          <source src={mp3} type="audio/mpeg" />
          <source src={ogg} type="audio/ogg" />
          مرورگر شما از پخش فایل صوتی پشتیبانی نمی‌کند.
        </audio>

        {/* Controls */}
        <div className="space-y-6">
          {/* Play/Pause Button */}
          <div className="flex justify-center">
            <button
              onClick={togglePlayPause}
              disabled={loading || error}
              className={`audio-play-button ${isHovered ? 'ring-4 ring-persian-gold/30 dark:ring-dark-persian-gold/30' : ''}`}
            >
              {/* Animated ring effect when playing */}
              {isPlaying && !loading && !error && (
                <div className="audio-ring-animation"></div>
              )}
              
              {loading ? (
                <div className="loading-spinner"></div>
              ) : error ? (
                <span className="text-2xl">❌</span>
              ) : isPlaying ? (
                <div className="pause-icon">
                  <div className="pause-bar"></div>
                  <div className="pause-bar"></div>
                </div>
              ) : (
                <div className="play-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              )}
            </button>
          </div>

          {/* Progress Bar - RTL Fixed */}
          {!error && (
            <div className="space-y-3">
              <div 
                className="progress-container"
                onClick={handleSeek}
              >
                {/* Background glow */}
                <div className="progress-bg-glow"></div>
                
                {/* Progress fill - RTL positioned */}
                <div 
                  className="progress-fill-rtl"
                  style={{ 
                    width: `${progressPercent}%`
                  }}
                >
                  {/* Animated glow effect */}
                  <div className="progress-fill-glow"></div>
                </div>
                
                {/* Progress handle - RTL positioned */}
                <div 
                  className={`progress-handle ${isHovered ? 'scale-125' : 'scale-100'}`}
                  style={{ 
                    right: `calc(${progressPercent}% - 12px)`
                  }}
                >
                  <div className="progress-handle-inner"></div>
                </div>
              </div>
              
              {/* Time Display */}
              <div className="time-display">
                <span className="time-current">{formatTime(currentTime)}</span>
                <span className="text-xs text-theme-secondary">•</span>
                <span className="time-duration">
                  {loading ? 'در حال بارگذاری...' : formatTime(duration)}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="audio-error">
              <div className="audio-error-icon">⚠️</div>
              <p className="audio-error-message">{error}</p>
              <p className="audio-error-details">
                فایل صوتی غزل شماره {ghazalNumber} در دسترس نیست
              </p>
            </div>
          )}

          {/* Audio Info */}
          {!error && !loading && (
            <div className="audio-info">
              <div className="audio-info-title">
                <span className="text-lg">🎙️</span>
                <p className="text-sm font-semibold text-theme-accent">
                  قرائت توسط علی موسوی گرمارودی
                </p>
              </div>
              <p className="audio-info-subtitle">
                استاد برجسته قرائت شعر فارسی
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HafezAudioPlayer;