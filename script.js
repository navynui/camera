var jsonD = [],
  menu = [];
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
            <a href="${vid}">
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
  // Note: Infinity scroll is primarily for "All" view. 
  // For filtered view, we can just render everything or still use loadMore.
  // Let's make choose reset the current view to the filtered set.
  jsonD_filtered = filterJ;
  // To keep it simple, I'll temporarily swap jsonD and restore it? 
  // No, let's just render the filtered set directly since it's usually small.
  let mn = document.getElementById("main");
  if (mn) mn.innerHTML = "";

  // Reuse process logic for simple filtered view
  for (let i = filterJ.length - 1; i >= 0; i--) {
    let item = filterJ[i];
    let thm = "thumbs/aqara_video/" + item.camera + "/" + item.path + ".png";
    let vid = "files/aqara_video/" + item.camera + "/" + item.path + ".mp4";
    let text = `
      <div class="column is-one-quarter-widescreen is-one-third-desktop is-half-tablet">
        <div class="card">
          <div class="card-image">
            <a href="${vid}">
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


