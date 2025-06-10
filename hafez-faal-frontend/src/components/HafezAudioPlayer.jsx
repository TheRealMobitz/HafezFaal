import React, { useState, useRef, useEffect } from 'react';

const HafezAudioPlayer = ({ ghazalNumber }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [volume, setVolume] = useState(0.8);
  const [isHovered, setIsHovered] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(false);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const audioRef = useRef(null);

  // External GitHub repository for audio files
  const GITHUB_AUDIO_BASE = 'https://raw.githubusercontent.com/mahdiit/DivanHafezAudio/master';

  // Generate audio file paths - External GitHub + Local fallback
  const getAudioSources = () => {
    return [
      // Primary: External GitHub sources
      `${GITHUB_AUDIO_BASE}/Hafez-Audio/${ghazalNumber}.mp3`,
      `${GITHUB_AUDIO_BASE}/Hafez-Audio-Ogg/${ghazalNumber}.opus`,
      
      // Fallback: Local sources (if you add them later)
      `/audio/hafez/${ghazalNumber}.mp3`,
      `/audio/hafez/ogg/${ghazalNumber}.ogg`
    ];
  };

  const audioSources = getAudioSources();

  useEffect(() => {
    // Reset states when ghazal changes
    setLoading(true);
    setError(null);
    setAudioAvailable(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setCurrentSourceIndex(0);
    
    // Start loading audio
    loadAudio();
  }, [ghazalNumber]);

  const loadAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    console.log(`Loading audio for ghazal ${ghazalNumber}`);
    console.log(`Trying source: ${audioSources[currentSourceIndex]}`);
    
    // Clean up existing listeners
    const cleanupListeners = () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
    };

    // Event handlers
    const handleLoadStart = () => {
      console.log('Audio loading started...');
      setLoading(true);
      setError(null);
    };

    const handleCanPlay = () => {
      console.log('Audio can play');
      setAudioAvailable(true);
      setError(null);
    };

    const handleCanPlayThrough = () => {
      console.log('Audio can play through');
      setLoading(false);
      setAudioAvailable(true);
    };

    const handleLoadedMetadata = () => {
      console.log('Audio metadata loaded, duration:', audio.duration);
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const handleError = (e) => {
      const errorDetails = e.target.error;
      console.error('Audio loading failed:', {
        code: errorDetails?.code,
        message: errorDetails?.message,
        currentSource: audioSources[currentSourceIndex],
        sourceIndex: currentSourceIndex
      });
      
      cleanupListeners();
      
      // Try next source if available
      const nextIndex = currentSourceIndex + 1;
      if (nextIndex < audioSources.length) {
        console.log(`Trying next source (${nextIndex + 1}/${audioSources.length}): ${audioSources[nextIndex]}`);
        setCurrentSourceIndex(nextIndex);
        setTimeout(() => {
          audio.src = audioSources[nextIndex];
          audio.load();
        }, 500);
      } else {
        setLoading(false);
        setAudioAvailable(false);
        
        // Provide specific error messages
        if (errorDetails?.code === 4) {
          setError('فایل صوتی در GitHub یافت نشد');
        } else if (errorDetails?.code === 3) {
          setError('خطا در کدگذاری فایل صوتی');
        } else if (errorDetails?.code === 2) {
          setError('خطا در اتصال به GitHub');
        } else {
          setError('فایل صوتی برای این غزل موجود نیست');
        }
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    // Clean up existing listeners
    cleanupListeners();

    // Add event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    // Set initial properties
    audio.volume = volume;
    audio.preload = 'metadata'; // Start with metadata for faster loading
    audio.crossOrigin = 'anonymous'; // Required for external sources
    
    // Load the audio - start with first source (GitHub MP3)
    audio.src = audioSources[currentSourceIndex];
    audio.load();

    // Return cleanup function
    return cleanupListeners;
  };

  const togglePlayPause = async () => {
    if (!audioAvailable || error) return;
    
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        // Switch to auto preload for better playback
        if (audio.preload !== 'auto') {
          audio.preload = 'auto';
          audio.load();
          
          // Wait a moment for better loading
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setError(null);
            })
            .catch(err => {
              console.error('Error playing audio:', err);
              setIsPlaying(false);
              
              if (err.name === 'NotAllowedError') {
                setError('لطفاً اجازه پخش صوتی را بدهید');
              } else if (err.name === 'NotSupportedError') {
                setError('فرمت فایل پشتیبانی نمی‌شود');
              } else {
                setError('خطا در پخش فایل صوتی');
              }
            });
        }
      }
    } catch (err) {
      console.error('Toggle play/pause error:', err);
      setError('خطا در کنترل پخش');
    }
  };

  const handleSeek = (e) => {
    if (!audioAvailable || error || !duration) return;
    
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (rect.right - e.clientX) / rect.width;
    const seekTime = Math.max(0, Math.min(duration, percent * duration));
    
    try {
      audio.currentTime = seekTime;
      setCurrentTime(seekTime);
    } catch (err) {
      console.warn('Seek failed:', err);
    }
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

  const progressPercent = duration ? Math.max(0, Math.min(100, (currentTime / duration) * 100)) : 0;
  const volumePercent = volume * 100;

  // Get source type for display
  const getSourceType = () => {
    if (currentSourceIndex === 0) return 'GitHub MP3';
    if (currentSourceIndex === 1) return 'GitHub OPUS';
    if (currentSourceIndex === 2) return 'محلی MP3';
    return 'محلی OGG';
  };

  // Show detailed error state
  if (!audioAvailable && !loading) {
    return (
      <div className="audio-player">
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-center space-x-3 space-x-reverse mb-4">
            <div className="w-12 h-12 bg-red-400 dark:bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🎵</span>
            </div>
            <div className="text-center">
              <h4 className="text-lg font-semibold text-theme-accent">قرائت صوتی</h4>
              <p className="text-sm text-theme-secondary">غزل شماره {ghazalNumber}</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="audio-error">
              <div className="audio-error-icon mb-2">⚠️</div>
              <p className="audio-error-message">{error || 'فایل صوتی در دسترس نیست'}</p>
              <p className="audio-error-details">
                ممکن است این غزل هنوز قرائت صوتی نشده باشد
              </p>
              
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-xs text-blue-700 dark:text-blue-300 text-center font-bold mb-2">
                  🌐 منابع بررسی شده:
                </p>
                <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                  <p>• GitHub MP3: {GITHUB_AUDIO_BASE}/Hafez-Audio/{ghazalNumber}.mp3</p>
                  <p>• GitHub OPUS: {GITHUB_AUDIO_BASE}/Hafez-Audio-Ogg/{ghazalNumber}.opus</p>
                  <p>• منابع محلی (در صورت وجود)</p>
                </div>
              </div>
              
              <div className="mt-3 flex gap-2 justify-center">
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                >
                  تلاش مجدد
                </button>
                <a 
                  href={`${GITHUB_AUDIO_BASE}/Hafez-Audio/${ghazalNumber}.mp3`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                >
                  بررسی فایل در GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      
      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        preload="metadata"
        crossOrigin="anonymous"
        controls={false}
      >
        <source src={audioSources[0]} type="audio/mpeg" />
        <source src={audioSources[1]} type="audio/ogg; codecs=opus" />
        مرورگر شما از پخش فایل صوتی پشتیبانی نمی‌کند.
      </audio>
      
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
              <p className="text-xs text-theme-secondary">
                غزل شماره {ghazalNumber}
                {audioAvailable && ` (${getSourceType()})`}
              </p>
            </div>
          </div>
          
          {/* Volume Control */}
          {(audioAvailable || loading) && !error && (
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
                disabled={loading}
                style={{
                  '--volume-percent': `${volumePercent}%`,
                  '--volume-color': '#d4af37',
                  '--volume-color-dark': '#c49b2a'
                }}
              />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Play/Pause Button */}
          <div className="flex justify-center">
            <button
              onClick={togglePlayPause}
              disabled={loading || error}
              className={`audio-play-button ${isHovered ? 'ring-4 ring-persian-gold/30 dark:ring-dark-persian-gold/30' : ''} ${(loading || error) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
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

          {/* Progress Bar */}
          {audioAvailable && !error && (
            <div className="space-y-3">
              <div 
                className="progress-container"
                onClick={handleSeek}
              >
                <div className="progress-bg-glow"></div>
                <div 
                  className="progress-fill-rtl"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="progress-fill-glow"></div>
                </div>
                <div 
                  className={`progress-handle ${isHovered ? 'scale-125' : 'scale-100'}`}
                  style={{ right: `calc(${progressPercent}% - 12px)` }}
                >
                  <div className="progress-handle-inner"></div>
                </div>
              </div>
              
              <div className="time-display">
                <span className="time-current">{formatTime(currentTime)}</span>
                <span className="text-xs text-theme-secondary">•</span>
                <span className="time-duration">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center">
              <div className="loading-spinner mx-auto mb-2"></div>
              <p className="text-theme-secondary text-sm">
                در حال بارگذاری از GitHub...
                {currentSourceIndex > 0 && ` (منبع ${currentSourceIndex + 1})`}
              </p>
            </div>
          )}

          {/* Audio Info */}
          {audioAvailable && !error && (
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
              <p className="text-xs text-theme-secondary mt-1">
                منبع: {getSourceType()} • GitHub Repository
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HafezAudioPlayer;