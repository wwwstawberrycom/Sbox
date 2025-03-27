
    // Create root container
    const root = document.getElementById('video-player-root');
    
    // =============== CSS-in-JS ===============
    const style = document.createElement('style');
    style.textContent = `
      .video-player-container {
        width: 800px;
        max-width: 100%;
        position: relative;
        border-radius:2rem;
        background: #000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        margin: 20px auto;
      }
      
      .video-element {
        width: 100%;
        display: block;
        border-radius:2rem;
        overflow:hidden;
      }
      
      .controls-wrapper {
        position: absolute;
        bottom: 0;
        width: 100%;
        background: linear-gradient(transparent, rgba(0,0,0,0.7));
        padding: 10px 15px;
        box-sizing: border-box;
        opacity: 1;
        transition: opacity 0.3s ease;
        border-radius:2rem;
        
      }
      
      .hide-controls {
        opacity: 0 !important;
        pointer-events: none;
      }
      
      .timeline-container {
        height: 7px;
        width: 100%;
        background: rgba(255,255,255,0.2);
        border-radius: 3px;
        cursor: pointer;
        margin-bottom: 10px;
      }
      
      .progress-bar {
        height: 100%;
        width: 0%;
        background: #ff0000;
        border-radius: 3px;
        position: relative;
      }
      
      .controls-group {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
      }
      
      .controls-left, .controls-center, .controls-right {
        display: flex;
        align-items: center;
        gap: 15px;
      }
      
      .control-button {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 16px;
        padding: 5px;
      }
      
      .volume-slider {
        width: 80px;
      }
      
      .time-display {
        font-size: 14px;
        font-family: monospace;
      }
      
      .speed-options {
        position: absolute;
        bottom: 40px;
        right: 0;
        background: rgba(0,0,0,0.9);
        border-radius: 4px;
        padding: 5px 0;
        display: none;
        list-style: none;
        width: 100px;
      }
      
      .speed-options.show {
        display: block;
      }
      
      .speed-option {
        padding: 5px 10px;
        cursor: pointer;
        color: white;
      }
      
      .speed-option:hover, .speed-option.active {
        background: rgba(255,255,255,0.2);
      }
      
      .fullscreen .video-player-container {
        width: 100%;
        height: 100%;
        max-width: none;
      }
      
      .fullscreen .video-element {
        height: 100%;
        object-fit: contain;
      }
    `;
    document.head.appendChild(style);
    
    // =============== Player Markup ===============
    // Create container
    const container = document.createElement('div');
    container.className = 'video-player-container';
    
    // Create video element
    const video = document.createElement('video');
    video.className = 'video-element';
    video.poster = 'https://i.ytimg.com/vi/f-ybMFpqpmM/maxresdefault.jpg';
    video.src = '/test/Screenrecorder-2025-03-27-12-00-36-662.mp4';
    video.type = 'video/mp4';
    
    // Create controls wrapper
    const controlsWrapper = document.createElement('div');
    controlsWrapper.className = 'controls-wrapper';
    
    // Create timeline
    const timelineContainer = document.createElement('div');
    timelineContainer.className = 'timeline-container';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    
    timelineContainer.appendChild(progressBar);
    controlsWrapper.appendChild(timelineContainer);
    
    // Create controls group
    const controlsGroup = document.createElement('div');
    controlsGroup.className = 'controls-group';
    
    // Left controls (volume, time)
    const controlsLeft = document.createElement('div');
    controlsLeft.className = 'controls-left';
    
    const volumeButton = document.createElement('button');
    volumeButton.className = 'control-button';
    volumeButton.innerHTML = '<i class="material-icons">volume_up</i>';
    
    const volumeSlider = document.createElement('input');
    volumeSlider.className = 'volume-slider';
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '1';
    volumeSlider.step = '0.01';
    volumeSlider.value = '1';
    
    const timeDisplay = document.createElement('div');
    timeDisplay.className = 'time-display';
    timeDisplay.innerHTML = '<span class="current-time">00:00</span> / <span class="duration">00:00</span>';
    
    controlsLeft.appendChild(volumeButton);
    controlsLeft.appendChild(volumeSlider);
    controlsLeft.appendChild(timeDisplay);
    
    // Center controls (play, skip)
    const controlsCenter = document.createElement('div');
    controlsCenter.className = 'controls-center';
    
    const skipBackButton = document.createElement('button');
    skipBackButton.className = 'control-button';
    skipBackButton.innerHTML = '<i class="fas fa-backward"></i>';
    
    const playButton = document.createElement('button');
    playButton.className = 'control-button';
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    
    const skipForwardButton = document.createElement('button');
    skipForwardButton.className = 'control-button';
    skipForwardButton.innerHTML = '<i class="fas fa-forward"></i>';
    
    controlsCenter.appendChild(skipBackButton);
    controlsCenter.appendChild(playButton);
    controlsCenter.appendChild(skipForwardButton);
    
    // Right controls (speed, pip, fullscreen)
    const controlsRight = document.createElement('div');
    controlsRight.className = 'controls-right';
    
    const speedContainer = document.createElement('div');
    speedContainer.style.position = 'relative';
    
    const speedButton = document.createElement('button');
    speedButton.className = 'control-button';
    speedButton.innerHTML = '<i class="material-icons">slow_motion_video</i>';
    
    const speedOptions = document.createElement('ul');
    speedOptions.className = 'speed-options';
    speedOptions.innerHTML = `
      <li class="speed-option" data-speed="2">2x</li>
      <li class="speed-option" data-speed="1.5">1.5x</li>
      <li class="speed-option active" data-speed="1">Normal</li>
      <li class="speed-option" data-speed="0.75">0.75x</li>
      <li class="speed-option" data-speed="0.5">0.5x</li>
    `;
    
    speedContainer.appendChild(speedButton);
    speedContainer.appendChild(speedOptions);
    
    const pipButton = document.createElement('button');
    pipButton.className = 'control-button';
    pipButton.innerHTML = '<i class="material-icons">picture_in_picture_alt</i>';
    
    const fullscreenButton = document.createElement('button');
    fullscreenButton.className = 'control-button';
    fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
    
    controlsRight.appendChild(speedContainer);
    controlsRight.appendChild(pipButton);
    controlsRight.appendChild(fullscreenButton);
    
    // Assemble controls
    controlsGroup.appendChild(controlsLeft);
    controlsGroup.appendChild(controlsCenter);
    controlsGroup.appendChild(controlsRight);
    controlsWrapper.appendChild(controlsGroup);
    
    // Assemble player
    container.appendChild(video);
    container.appendChild(controlsWrapper);
    root.appendChild(container);
    
    // =============== Player Functionality ===============
    // Helper function to format time
    const formatTime = (time) => {
      const seconds = Math.floor(time % 60);
      const minutes = Math.floor((time / 60) % 60);
      const hours = Math.floor(time / 3600);
      
      return hours > 0 
        ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    
    // Auto-hide controls
    let hideControlsTimeout;
    const hideControls = () => {
      if (video.paused) return;
      hideControlsTimeout = setTimeout(() => {
        controlsWrapper.classList.add('hide-controls');
      }, 3000);
    };
    
    const showControls = () => {
      controlsWrapper.classList.remove('hide-controls');
      clearTimeout(hideControlsTimeout);
      hideControls();
    };
    
    // Event listeners
    container.addEventListener('mousemove', showControls);
    video.addEventListener('click', () => {
      video.paused ? video.play() : video.pause();
    });
    
    // Play/pause
    playButton.addEventListener('click', () => {
      video.paused ? video.play() : video.pause();
    });
    
    video.addEventListener('play', () => {
      playButton.innerHTML = '<i class="fas fa-pause"></i>';
      hideControls();
    });
    
    video.addEventListener('pause', () => {
      playButton.innerHTML = '<i class="fas fa-play"></i>';
      showControls();
    });
    
    // Skip buttons
    skipBackButton.addEventListener('click', () => {
      video.currentTime -= 5;
    });
    
    skipForwardButton.addEventListener('click', () => {
      video.currentTime += 5;
    });
    
    // Volume controls
    volumeButton.addEventListener('click', () => {
      if (video.volume > 0) {
        video.volume = 0;
        volumeButton.innerHTML = '<i class="material-icons">volume_off</i>';
        volumeSlider.value = 0;
      } else {
        video.volume = 1;
        volumeButton.innerHTML = '<i class="material-icons">volume_up</i>';
        volumeSlider.value = 1;
      }
    });
    
    volumeSlider.addEventListener('input', (e) => {
      video.volume = e.target.value;
      volumeButton.innerHTML = e.target.value == 0 
        ? '<i class="material-icons">volume_off</i>' 
        : '<i class="material-icons">volume_up</i>';
    });
    
    // Timeline/progress
    video.addEventListener('timeupdate', () => {
      const percent = (video.currentTime / video.duration) * 100;
      progressBar.style.width = `${percent}%`;
      timeDisplay.querySelector('.current-time').textContent = formatTime(video.currentTime);
    });
    
    video.addEventListener('loadedmetadata', () => {
      timeDisplay.querySelector('.duration').textContent = formatTime(video.duration);
    });
    
    timelineContainer.addEventListener('click', (e) => {
      const rect = timelineContainer.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      video.currentTime = pos * video.duration;
    });
    
    // Speed options
    speedButton.addEventListener('click', () => {
      speedOptions.classList.toggle('show');
    });
    
    speedOptions.querySelectorAll('.speed-option').forEach(option => {
      option.addEventListener('click', () => {
        video.playbackRate = parseFloat(option.dataset.speed);
        speedOptions.querySelector('.active').classList.remove('active');
        option.classList.add('active');
        speedOptions.classList.remove('show');
      });
    });
    
    // Fullscreen
    fullscreenButton.addEventListener('click', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        container.classList.remove('fullscreen');
        fullscreenButton.innerHTML = '<i class="fas fa-expand"></i>';
      } else {
        container.requestFullscreen();
        container.classList.add('fullscreen');
        fullscreenButton.innerHTML = '<i class="fas fa-compress"></i>';
      }
    });
    
    // Picture-in-picture
    pipButton.addEventListener('click', () => {
      if (video !== document.pictureInPictureElement) {
        video.requestPictureInPicture();
      } else {
        document.exitPictureInPicture();
      }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          video.paused ? video.play() : video.pause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          video.currentTime -= 5;
          break;
        case 'ArrowRight':
          e.preventDefault();
          video.currentTime += 5;
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          fullscreenButton.click();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          volumeButton.click();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          pipButton.click();
          break;
        case 's':
        case 'S':
          e.preventDefault();
          speedOptions.classList.toggle('show');
          break;
      }
    });
    
    // Initialize
    hideControls();
