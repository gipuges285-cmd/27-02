// ======================== PLAYLISTS ========================
const t = Date.now();

const urls = [
  "https://cdn.jsdelivr.net/gh/sm-monirulislam/AynaOTT-auto-update-playlist@main/AynaOTT.m3u?t=" + t,
  "",
  ""
];

let channels = [];
let hls = null;
let activeCat = "All";
let lastChannel = null;
let controlsTimer = null;

// ======================== ELEMENTS ========================
const video = document.getElementById("player");
const list = document.getElementById("list");
const category = document.getElementById("category");
const left = document.getElementById("left");
const backBtn = document.getElementById("backBtn");
const searchBtn = document.getElementById("searchBtn");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");

const currentLogo = document.getElementById("currentLogo");
const currentName = document.getElementById("currentName");
const poster = document.getElementById("poster");
const posterImg = document.getElementById("posterImg");
const loadingText = document.getElementById("loadingText");

const playBox = document.getElementById("playBox");
const btnPlay = document.getElementById("btnPlay");
const btnMute = document.getElementById("btnMute");
const btnReload = document.getElementById("btnReload");
const btnFull = document.getElementById("btnFull");
const vol = document.getElementById("vol");
const videoWrap = document.getElementById("videoWrap");

backBtn.style.display = "none";

// ======================== CONTROLS ========================
function showControls() {
  playBox.classList.remove("hideControls");
  clearTimeout(controlsTimer);
  controlsTimer = setTimeout(() => playBox.classList.add("hideControls"), 2500);
}

videoWrap.addEventListener("click", showControls);
videoWrap.addEventListener("touchstart", showControls, { passive: true });

btnPlay.onclick = () => {
  showControls();
  if (video.paused) video.play().catch(() => {});
  else video.pause();
};

btnMute.onclick = () => {
  showControls();
  video.muted = !video.muted;
  btnMute.innerText = video.muted ? "🔇" : "🔊";
};

vol.oninput = () => {
  showControls();
  video.volume = Number(vol.value) / 100;
  video.muted = video.volume === 0;
  btnMute.innerText = video.muted ? "🔇" : "🔊";
};

btnReload.onclick = () => {
  showControls();
  if (lastChannel) playChannel(lastChannel);
};

btnFull.onclick = () => {
  showControls();
  if (document.fullscreenElement) document.exitFullscreen();
  else videoWrap.requestFullscreen().catch(() => {});
};

video.onplay = () => (btnPlay.innerText = "⏸");
video.onpause = () => (btnPlay.innerText = "⏵");

backBtn.onclick = () => {
  video.pause();
  if (hls) { hls.destroy(); hls = null; }
  left.style.display = "none";
  backBtn.style.display = "none";
};

searchBtn.onclick = () => {
  searchBox.style.display = searchBox.style.display === "block" ? "none" : "block";
  if (searchBox.style.display === "block") searchInput.focus();
};

searchInput.addEventListener("keyup", () => {
  const q = searchInput.value.trim().toLowerCase();
  const base = activeCat === "All" ? channels : channels.filter(x => x.cat === activeCat);
  if (!q) { renderList(base); return; }
  renderList(base.filter(c => c.name.toLowerCase().includes(q)));
});

// ======================== M3U PARSER ========================
function parseM3U(text) {
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (!l.startsWith("#EXTINF")) continue;

    const name = (l.split(",").pop() || "Unknown").trim();
    const logo = (l.match(/tvg-logo="(.*?)"/) || [])[1] 
                 || "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgk-F1cUOHYKYpUPSS1L05FzI2joFOzyBA7SOYaCHZPy6XSqm5Wj8ojeDG9ba4r8g8xYjX3V5FgiQ9Lq21TNIpspCg5y6fEUl9zYOuszosQsW5INiYIlHxeo6fogknIvL2mNyikKdxLLnjdc6y-ozTDv5hJUgl9aL0DOxE4wxF7j6XUTGb5XH8evlfkE61-/s320/LOGO-LAST.webp";
    const cat = (l.match(/group-title="(.*?)"/) || [])[1] || "Others";
    const stream = (lines[i + 1] || "").trim();

    if (stream && /^https?:\/\//i.test(stream)) {
      channels.push({ name, logo, cat, stream });
    }
  }
}

// ======================== CATEGORY RENDER ========================
function renderCategory() {
  const cats = ["All", ...Array.from(new Set(channels.map(c => c.cat)))];
  category.innerHTML = "";
  cats.forEach(c => {
    const d = document.createElement("div");
    d.className = "catBtn" + (c === activeCat ? " active" : "");
    d.innerText = c;
    d.onclick = () => {
      activeCat = c;
      document.querySelectorAll(".catBtn").forEach(x => x.classList.remove("active"));
      d.classList.add("active");
      searchInput.value = "";
      const arr = activeCat === "All" ? channels : channels.filter(x => x.cat === activeCat);
      renderList(arr);
    };
    category.appendChild(d);
  });
}

// ======================== CHANNEL LIST RENDER ========================
function renderList(arr) {
  list.innerHTML = "";
  arr.forEach(c => {
    const d = document.createElement("div");
    d.className = "channelItem";
    d.innerHTML = `<img src="${c.logo}" onerror="this.src='https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgk-F1cUOHYKYpUPSS1L05FzI2joFOzyBA7SOYaCHZPy6XSqm5Wj8ojeDG9ba4r8g8xYjX3V5FgiQ9Lq21TNIpspCg5y6fEUl9zYOuszosQsW5INiYIlHxeo6fogknIvL2mNyikKdxLLnjdc6y-ozTDv5hJUgl9aL0DOxE4wxF7j6XUTGb5XH8evlfkE61-/s320/LOGO-LAST.webp'">`;
    d.onclick = () => playChannel(c, d);
    list.appendChild(d);
  });
}

// ======================== PLAY CHANNEL ========================
function playChannel(c, el) {
  lastChannel = c;

  if (el) {
    document.querySelectorAll(".channelItem").forEach(x => x.classList.remove("active"));
    el.classList.add("active");
  }

  left.style.display = "flex";
  backBtn.style.display = "block";
  showControls();

  currentLogo.src = c.logo;
  currentName.innerText = c.name;
  posterImg.src = c.logo;

  poster.style.display = "flex";
  loadingText.innerText = "Loading...";

  if (hls) { hls.destroy(); hls = null; }

  video.pause();
  video.removeAttribute("src");
  video.load();
  video.muted = true;
  video.autoplay = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "true");

  let started = false;

  function hidePoster() { 
    poster.style.display = "none"; }
  



  function tryNative() { video.src = c.stream; video.play().catch(() => tryHls()); }

  function tryHls() {
    if (!window.Hls || !Hls.isSupported()) { fallbackOpen(); return; }
    hls = new Hls({ enableWorker: true, lowLatencyMode: true });
    hls.loadSource(c.stream);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => { video.play().catch(() => {}); });
    hls.on(Hls.Events.ERROR, (e, data) => { if (data && data.fatal) fallbackOpen(); });
  }

  video.onplaying = () => { started = true; hidePoster(); video.muted = false; video.volume = Number(vol.value)/100; btnMute.innerText = video.muted ? "🔇" : "🔊"; };
  video.onerror = () => { if (!started) tryHls(); };

  setTimeout(() => {
    if (!started) { tryHls(); setTimeout(() => { if (!started) fallbackOpen(); }, 4000); }
  }, 3500);

  if (video.canPlayType("application/vnd.apple.mpegurl") || c.stream.includes(".mp4") || c.stream.includes(".ts")) tryNative();
  else tryHls();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ======================== LOAD PLAYLISTS ========================
Promise.all(urls.map(u => fetch(u).then(r => r.text()).catch(() => null)))
.then(txts => {
  txts.filter(Boolean).forEach(t => parseM3U(t));

  const seen = new Set();
  channels = channels.filter(c => {
    const k = (c.name + "|" + c.stream).toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  renderCategory();
  renderList(channels);
})
.catch(() => { renderCategory(); renderList([]); });

document.addEventListener("DOMContentLoaded",()=>{

  // CREATE TIME/DAY/DATE BOX
  const timeBox = document.createElement("div");
  timeBox.id = "timeBox";
  timeBox.style.position = "fixed"; // scroll-friendly
  timeBox.style.top = "5px";
  timeBox.style.right = "5px";
  timeBox.style.background = "rgba(0,0,0,0.5)";
  timeBox.style.color = "#fff";
  timeBox.style.padding = "5px 9px";
  timeBox.style.borderRadius = "10px";
  timeBox.style.fontFamily = "Arial, sans-serif";
  timeBox.style.fontSize = "8px";  // front aro boro
  timeBox.style.fontWeight = "bold";
  timeBox.style.zIndex = "9999";
  timeBox.style.cursor = "default";
  timeBox.style.whiteSpace = "nowrap";
  timeBox.style.overflow = "hidden";
  timeBox.style.textAlign = "center";
  document.body.appendChild(timeBox);

  // FUNCTION TO GET CURRENT TIME, DAY, DATE
  const updateTime = ()=>{
    const now = new Date();

    // Time with AM/PM
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2,'0');
    const seconds = now.getSeconds().toString().padStart(2,'0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // convert 0 -> 12
    const timeStr = `${hours.toString().padStart(2,'0')}:${minutes}:${seconds} ${ampm}`;

    // Day
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });

    // Date
    const date = now.toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });

    // Combine
    timeBox.innerText = `${timeStr} | ${day} | ${date}`;
  }

  // Update every second
  setInterval(updateTime,1000);
  updateTime(); // initial call

  // FUNCTION TO UPDATE POSITION (relative to video if playing)
  function updateTimeBoxPosition(){
    const leftDiv = document.getElementById("left"); // main video left box
    const playerBox = document.getElementById("player");
    if(leftDiv && leftDiv.style.display !== "none" && playerBox){
      // playing channel → position relative to video box
      const rect = playerBox.getBoundingClientRect();
      timeBox.style.top = (rect.top + 0)+"px";
      timeBox.style.right = (window.innerWidth - rect.right + 2)+"px";
      timeBox.style.position = "fixed"; // scroll-friendly
    } else {
      // no playing → top-right fixed
      timeBox.style.top = "5px";
      timeBox.style.right = "5px";
      timeBox.style.position = "fixed";
    }
  }

  // Update position on scroll & resize
  window.addEventListener("scroll", updateTimeBoxPosition);
  window.addEventListener("resize", updateTimeBoxPosition);

  // Observe for channel play changes
  const observer = new MutationObserver(updateTimeBoxPosition);
  observer.observe(document.body,{subtree:true, childList:true, attributes:true});

});
document.addEventListener("DOMContentLoaded",()=>{

  const tg = document.createElement("a");
  tg.href = "https://wa.me/8801767046095";
  tg.target = "_blank";
  tg.id = "telegramChat";

  tg.innerHTML = `
    <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff">
      <path d="M9.04 15.84 8.7 19.6c.49 0 .7-.21.96-.46l2.3-2.2 4.77 3.49c.87.48 1.49.23 1.7-.8l3.08-14.44h0c.26-1.22-.44-1.7-1.28-1.39L1.62 9.2c-1.18.46-1.16 1.12-.2 1.42l4.7 1.47L17.4 5.9c.55-.36 1.06-.16.64.2"/>
    </svg>
  `;

  Object.assign(tg.style,{
    position:"fixed",
    bottom:"20px",
    right:"20px",
    width:"52px",
    height:"52px",
    background:"#229ED9",
    borderRadius:"50%",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    boxShadow:"0 4px 12px rgba(0,0,0,.3)",
    zIndex:"99999",
    textDecoration:"none"
  });

  document.body.appendChild(tg);

});






