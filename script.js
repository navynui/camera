var jsonD = [],
  menu = [];
var user = "",
  intv,
  LS = localStorage;
// Manual YYYY-MM-DD to avoid any locale/timezone weirdness
var d = new Date();
var tday = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, '0') + "-" + String(d.getDate()).padStart(2, '0');
var lc = 0;

function gldt(u) {
  if (u == 142857142857) return md5(st2hx(tday));
  else return tday;
}

function chk(inp) {
  if (
    inp != "" &&
    inp != null &&
    md5(inp) == "f4c403a72934a24d0e608eacc67686dc"
  ) {
    user = gldt(142857142857);
    lc = 0;
    return true;
  } else if (inp == md5(st2hx(tday))) {
    return true;
  } else {
    return false;
  }
}

var hex_chr = "0123456789abcdef".split("");
if (md5("hello") != "5d41402abc4b2a76b9719d911017c592") {
  function add32(e, t) {
    var n = (e & 65535) + (t & 65535),
      r = (e >> 16) + (t >> 16) + (n >> 16);
    return (r << 16) | (n & 65535);
  }
}

function sto(val) {
  LS.setItem("magic", val);
}

function ret() {
  let t = LS.getItem("magic");
  if (t != null && t == md5(st2hx(tday))) {
    return t;
  } else {
    return "";
  }
}

function recall() {
  user = ret();
  if (chk(user)) {
    loaddata();
  } else {
    openPWS();
  }
}

function chkkey(e) {
  if (e.key === "Enter") {
    validate();
  }
}

function validate() {
  user = document.getElementById("psw").value;
  if (null == user || "" == user) recall();
  if (chk(user)) {
    sto(user);
    closePWS();
    loaddata();
  } else {
    closePWS();
    nodata();
  }
}

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

function nodata() {
  let mn = document.getElementById("main");
  if (mn) mn.innerHTML = '<div class="column is-6"><div class="notification is-danger is-light has-text-centered">Incorrect Password.</div></div>';
}

function loaddata() {
  if (chk(user)) {
    menu = []; // Clear global menu
    fetch("./data.json")
      .then((response) => response.json())
      .then((json) => save(json));
  } else {
    recall();
  }
}

function save(json) {
  if (chk(user)) {
    closePWS(); // Ensure lock screen is hidden
    jsonD = json;
    let w = window.innerWidth;
    if (w >= 2215) process(jsonD, 24);
    else if (w >= 1845) process(jsonD, 15);
    else if (w >= 1480) process(jsonD, 12);
    else process(jsonD, 6);

    timebar(jsonD);
    navbar();
  } else {
    recall();
  }
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
            <div class="control"><a class="button is-small is-danger is-light" href="javascript:LS.clear();location.reload()">Logout</a></div>
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

function openPWS() {
  document.getElementById("pswinput").style.display = "flex";
  const nav = document.getElementById("navigate");
  if (nav) nav.style.display = "none";
  if (!intv) {
    intv = setInterval(function () {
      lc = Math.random(); // Only randomize when screen is open
      rain();
    }, 20);
  }
}

function closePWS() {
  document.getElementById("pswinput").style.display = "none";
  if (intv) {
    clearInterval(intv);
    intv = null;
  }
}

function randomText() {
  var text = "!@#$%^*()";
  return text[Math.floor(Math.random() * text.length)];
}

function rain() {
  let cloud = document.querySelector(".cloud");
  if (!cloud) return;
  let e = document.createElement("div");
  e.classList.add("drop");
  cloud.appendChild(e);

  let left = Math.floor(Math.random() * 300);
  let size = Math.random() * 1.5;
  let duration = Math.random() * 1;

  e.innerText = randomText();
  e.style.left = left + "px";
  e.style.fontSize = 0.5 + size + "em";
  e.style.animationDuration = 1 + duration + "s";

  setTimeout(function () {
    if (e.parentNode) cloud.removeChild(e);
  }, 2000);
}
