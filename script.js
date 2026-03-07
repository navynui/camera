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

function loaddata() {
  menu = []; // Clear global menu
  fetch("./data.json")
    .then((response) => response.json())
    .then((json) => save(json));
}

function save(json) {
  jsonD = json;
  let w = window.innerWidth;
  if (w >= 2215) process(jsonD, 24);
  else if (w >= 1845) process(jsonD, 15);
  else if (w >= 1480) process(jsonD, 12);
  else process(jsonD, 6);

  timebar(jsonD);
  navbar();
}

function timebar(json) {
  let all = json.length;
  let data = '<div class="tags are-small is-multiline">';
  let timeline = document.getElementById("timeline");
  if (!timeline) return;

  let showhour = -1;
  let showdate = "";
  for (let i = all - 1; i >= 0; i--) {
    let da = new Date(json[i].dt);
    let date = da.toString().substring(0, 10);
    let vdate = da.getDate();
    let hour = da.getHours();

    if (hour != showhour || date != showdate) {
      if (date != showdate) {
        data += `<span class='tag is-dark is-uppercase ml-2'><strong>${date.replace(/ /g, ".")}</strong></span>`;
        showdate = date;
      }
      data += `<a class='tag is-primary is-light mx-0' href='javascript:choose(${vdate},${hour})'>${hour}</a>`;
      menu.push({ d: date, h: hour });
      showhour = hour;
    }
  }
  data += "</div>";
  timeline.innerHTML = data;
}

function schoose(val) {
  let a = val.split("*")[0];
  let b = val.split("*")[1];
  choose(a, b);
}

function navbar() {
  const navline = document.getElementById("navigate");
  if (!navline) return;

  const days = {};
  menu.forEach(item => {
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
      <div class="navbar-item py-0 px-1">
        <div class="field mb-0">
          <div class="control">
            <div class="select is-small is-rounded is-primary">
              <select onchange="schoose(this.value)">${options}</select>
            </div>
          </div>
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
      <div class="navbar-start" style="flex-wrap: wrap; align-items: center; justify-content: flex-start;">
        ${startHtml}
      </div>
      <div class="navbar-end">
        <div class="navbar-item px-2">
          <div class="buttons field is-grouped mb-0">
            <div class="control"><a class="button is-small is-info is-light" href="../">Links</a></div>
            <div class="control"><a class="button is-small is-primary is-light" href="javascript:location.reload()">Reload</a></div>
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
  process(filterJ, filterJ.length);
}

function process(json, num) {
  let mn = document.getElementById("main");
  if (!mn) return;
  mn.innerHTML = "";
  let size = json.length;
  for (let i = size - 1; i >= Math.max(0, size - num); i--) {
    let thm = "thumbs/aqara_video/" + json[i].camera + "/" + json[i].path + ".png";
    let vid = "files/aqara_video/" + json[i].camera + "/" + json[i].path + ".mp4";
    let caption = json[i].dt;
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
          <div class="card-content p-1">
            <p class="is-size-7 has-text-centered has-text-grey">${caption}</p>
          </div>
        </div>
      </div>`;
    addli(text);
  }
}

function addli(data) {
  let mn = document.getElementById("main");
  if (mn) mn.innerHTML += data;
}


