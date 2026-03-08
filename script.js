var jsonD = [],
  menu = [],
  jsonD_filtered = null,
  currentVideoIndex = -1,
  currentVideoList = [];
var LS = localStorage;
// Manual YYYY-MM-DD to avoid any locale/timezone weirdness
var d = new Date();
var tday = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, '0') + "-" + String(d.getDate()).padStart(2, '0');
var lc = 0;

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function dtest() {
  let info = "iFrame:" + inIframe() + " userAgent:" + navigator.userAgent;
  let dbg = document.getElementById("debug");
  if (dbg) dbg.innerHTML = info;
}

var displayedTotal = 0;
const PAGE_SIZE = 12;

function loaddata() {
  fetch("./data.json")
    .then((response) => response.json())
    .then((json) => {
      jsonD = json;
      resetAndLoad(jsonD);
    });
}

function resetAndLoad(data) {
  let mn = document.getElementById("main");
  if (mn) mn.innerHTML = "";
  displayedTotal = 0;
  // Load initial batches until the scrollbar appears or data runs out
  loadInitialBatches();
}

function loadInitialBatches() {
  loadMore();
  // If the window is still not scrollable and we have more data, load another batch
  if (displayedTotal < jsonD.length && document.documentElement.scrollHeight <= window.innerHeight) {
    // We use a tiny timeout to let the browser render the previous batch and update scrollHeight
    setTimeout(loadInitialBatches, 50);
  }
}

function loadMore() {
  if (displayedTotal >= jsonD.length) return;

  let end = jsonD.length - 1 - displayedTotal;
  let start = Math.max(0, end - PAGE_SIZE + 1);

  for (let i = end; i >= start; i--) {
    let thm = "thumbs/aqara_video/" + jsonD[i].camera + "/" + jsonD[i].path + ".png";
    let vid = "files/aqara_video/" + jsonD[i].camera + "/" + jsonD[i].path + ".mp4";
    let caption = jsonD[i].dt;
    let text = `
      <div class="column is-one-quarter-widescreen is-one-third-desktop is-half-tablet">
        <div class="card">
          <div class="card-image">
            <a href="javascript:void(0)" onclick="openVideoModal(${i})">
              <figure class="image is-16by9">
                <img src="${thm}" alt="Thumbnail" style="object-fit: cover;">
              </figure>
            </a>
          </div>
          <div class="card-content p-3 has-text-centered">
            <p class="is-size-7 has-text-grey-light" style="letter-spacing: 0.05em;">${caption}</p>
          </div>
        </div>
      </div>`;
    addli(text);
  }
  displayedTotal += (end - start + 1);
  navbar(); // Update navbar info if needed
}

// Scroll listener for infinite scroll
window.onscroll = function () {
  // Use documentElement.scrollHeight for better desktop compatibility
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollPos = window.innerHeight + window.scrollY;

  // If we are within 800px of the bottom, load more
  if (scrollPos >= scrollHeight - 800) {
    loadMore();
  }
};

function schoose(val) {
  let a = val.split("*")[0];
  let b = val.split("*")[1];
  choose(a, b);
}

function navbar() {
  const navline = document.getElementById("navigate");
  if (!navline) return;

  // Re-generate menu from full jsonD for navigation
  const tempMenu = [];
  let showhour = -1;
  let showdate = "";
  for (let i = jsonD.length - 1; i >= 0; i--) {
    let da = new Date(jsonD[i].dt);
    let date = da.toString().substring(0, 10);
    let vdate = da.getDate();
    let hour = da.getHours();
    if (hour != showhour || date != showdate) {
      tempMenu.push({ d: date, h: hour });
      showhour = hour;
      showdate = date;
    }
  }

  const days = {};
  tempMenu.forEach(item => {
    if (!days[item.d]) days[item.d] = [];
    if (!days[item.d].includes(item.h)) days[item.d].push(item.h);
  });

  const sortedDays = Object.keys(days).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let startHtml = '';
  for (const dateStr of sortedDays) {
    const hours = days[dateStr].sort((a, b) => b - a);
    let options = `<option disabled selected>${dateStr}</option>`;
    for (const hh of hours) {
      const dayNum = dateStr.split(" ")[2];
      options += `<option value="${dayNum}*${hh}">${hh}:00</option>`;
    }

    startHtml += `
      <div class="navbar-item py-1 px-1">
        <div class="select is-small is-rounded">
          <select onchange="schoose(this.value)">${options}</select>
        </div>
      </div>`;
  }

  const data = `
    <div class="navbar-brand">
      <a class="navbar-item title is-5 mb-0" href="./">Camera</a>
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" onclick="this.classList.toggle('is-active'); document.getElementById('navbarMenu').classList.toggle('is-active');">
        <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>
      </a>
    </div>
    <div id="navbarMenu" class="navbar-menu">
      <div class="navbar-start" style="flex-wrap: wrap; align-items: center; justify-content: flex-start; padding: 0.5rem;">
        ${startHtml}
      </div>
      <div class="navbar-end">
        <div class="navbar-item px-2">
          <div class="buttons field is-grouped mb-0">
            <div class="control"><a class="button is-small is-primary is-outlined" href="javascript:location.reload()">REFRESH</a></div>
          </div>
        </div>
      </div>
    </div>`;

  navline.innerHTML = data;
  navline.style.display = "flex";
}

function choose(d, h) {
  let filterJ = jsonD.filter((obj) => {
    let dt = new Date(obj.dt);
    return dt.getHours() == h && dt.getDate() == d;
  });
  jsonD_filtered = filterJ;
  let mn = document.getElementById("main");
  if (mn) mn.innerHTML = "";

  for (let i = filterJ.length - 1; i >= 0; i--) {
    let item = filterJ[i];
    let thm = "thumbs/aqara_video/" + item.camera + "/" + item.path + ".png";
    let vid = "files/aqara_video/" + item.camera + "/" + item.path + ".mp4";
    let text = `
      <div class="column is-one-quarter-widescreen is-one-third-desktop is-half-tablet">
        <div class="card">
          <div class="card-image">
            <a href="javascript:void(0)" onclick="openVideoModal(${i})">
              <figure class="image is-16by9">
                <img src="${thm}" alt="Thumbnail" style="object-fit: cover;">
              </figure>
            </a>
          </div>
          <div class="card-content p-3 has-text-centered">
            <p class="is-size-7 has-text-grey-light" style="letter-spacing: 0.05em;">${item.dt}</p>
          </div>
        </div>
      </div>`;
    addli(text);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function addli(data) {
  let mn = document.getElementById("main");
  if (mn) mn.innerHTML += data;
}

// Video Modal Functions
function openVideoModal(index) {
  const data = jsonD_filtered || jsonD;
  currentVideoIndex = index;
  currentVideoList = data;
  
  const item = data[index];
  const videoSrc = "files/aqara_video/" + item.camera + "/" + item.path + ".mp4";
  
  const modal = document.getElementById("videoModal");
  const player = document.getElementById("videoPlayer");
  
  player.src = videoSrc;
  modal.classList.add("is-active");
  
  player.play().catch(() => {});
  
  updateTimeDisplay();
  
  if (document.fullscreenElement) {
    showControls();
  }
}

function closeVideoModal() {
  const modal = document.getElementById("videoModal");
  const player = document.getElementById("videoPlayer");
  
  player.pause();
  player.src = "";
  modal.classList.remove("is-active");
}

function togglePlay() {
  const player = document.getElementById("videoPlayer");
  const icon = document.getElementById("playIcon");
  
  if (player.paused) {
    player.play();
    icon.innerHTML = "&#10074;&#10074;";
  } else {
    player.pause();
    icon.innerHTML = "&#9658;";
  }
}

function toggleMute() {
  const player = document.getElementById("videoPlayer");
  const icon = document.getElementById("volumeIcon");
  
  player.muted = !player.muted;
  icon.innerHTML = player.muted ? "&#128263;" : "&#128266;";
}

function setVolume() {
  const player = document.getElementById("videoPlayer");
  const slider = document.getElementById("volumeSlider");
  player.volume = slider.value;
}

function seekVideo() {
  const player = document.getElementById("videoPlayer");
  const slider = document.getElementById("progressBar");
  player.currentTime = slider.value;
}

function updateTimeDisplay() {
  const player = document.getElementById("videoPlayer");
  const progress = document.getElementById("progressBar");
  const timeDisplay = document.getElementById("timeDisplay");
  const playIcon = document.getElementById("playIcon");
  
  if (!player.src) return;
  
  const current = formatTime(player.currentTime);
  const duration = formatTime(player.duration || 0);
  timeDisplay.textContent = current + " / " + duration;
  
  if (!isNaN(player.duration)) {
    progress.max = player.duration;
    progress.value = player.currentTime;
  }
  
  playIcon.innerHTML = player.paused ? "&#9658;" : "&#10074;&#10074;";
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m + ":" + s.toString().padStart(2, '0');
}

function prevVideo() {
  if (currentVideoIndex > 0) {
    openVideoModal(currentVideoIndex - 1);
  }
}

function nextVideo() {
  if (currentVideoIndex < currentVideoList.length - 1) {
    openVideoModal(currentVideoIndex + 1);
  }
}

function toggleFullscreen() {
  const container = document.querySelector('.video-container');
  if (!document.fullscreenElement) {
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    } else if (container.msRequestFullscreen) {
      container.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

function toggleFit() {
  const container = document.querySelector('.video-container');
  container.classList.toggle('video-fit-contain');
  const btn = document.getElementById('fitBtn');
  if (btn) {
    btn.innerHTML = container.classList.contains('video-fit-contain') ? '&#x1F4F7;' : '&#x1F5BC;';
  }
}

function updateFullscreenButton() {
  const btn = document.getElementById('fullscreenBtn');
  if (btn) {
    btn.innerHTML = document.fullscreenElement ? '&#x2716;' : '&#x26F6;';
  }
  
  const controls = document.querySelector('.video-controls');
  if (controls) {
    if (document.fullscreenElement) {
      controls.classList.add('always-visible');
      showControls();
    } else {
      controls.classList.remove('always-visible');
      controls.style.opacity = '';
    }
  }
}

let controlsTimeout;
function showControls() {
  const controls = document.querySelector('.video-controls');
  if (!controls || !document.fullscreenElement) return;
  
  controls.style.opacity = '1';
  clearTimeout(controlsTimeout);
  controlsTimeout = setTimeout(() => {
    controls.style.opacity = '0';
  }, 3000);
}

// Video player event listeners
document.addEventListener("DOMContentLoaded", function() {
  const player = document.getElementById("videoPlayer");
  if (player) {
    player.addEventListener("timeupdate", updateTimeDisplay);
    player.addEventListener("loadedmetadata", updateTimeDisplay);
    player.addEventListener("ended", function() {
      document.getElementById("playIcon").innerHTML = "&#9658;";
    });
    player.addEventListener("dblclick", toggleFullscreen);
  }
  
  document.addEventListener("fullscreenchange", updateFullscreenButton);
  document.addEventListener("webkitfullscreenchange", updateFullscreenButton);
  
  const container = document.querySelector('.video-container');
  if (container) {
    container.addEventListener('mousemove', showControls);
  }
  
  // Keyboard shortcuts
  document.addEventListener("keydown", function(e) {
    const modal = document.getElementById("videoModal");
    if (!modal.classList.contains("is-active")) return;
    
    switch(e.key) {
      case " ":
        e.preventDefault();
        togglePlay();
        break;
      case "ArrowLeft":
        prevVideo();
        break;
      case "ArrowRight":
        nextVideo();
        break;
      case "Escape":
        closeVideoModal();
        break;
      case "m":
      case "M":
        toggleMute();
        break;
      case "f":
      case "F":
        toggleFullscreen();
        break;
      case "c":
      case "C":
        toggleFit();
        break;
    }
  });
});


