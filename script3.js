const SITE_PASSWORD = "4545";

function hideLogin(){
  const wrap = document.getElementById("gtaLogin");
  if (wrap) wrap.style.display = "none";
}

function showLogin(){
  const wrap = document.getElementById("gtaLogin");
  if (wrap) wrap.style.display = "flex";
}

function setErr(msg){
  const e = document.getElementById("pwError");
  if (e) e.innerText = msg || "";
}

function checkPw(){
  const input = document.getElementById("pwInput");
  const val = (input?.value || "").trim();

  if (val === SITE_PASSWORD){
    localStorage.setItem("siteLogin", "yes");
    setErr("");
    hideLogin();
  } else {
    localStorage.removeItem("siteLogin");
    setErr("❌ Wrong Password");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // If already logged in
  if (localStorage.getItem("siteLogin") === "yes") hideLogin();

  const btn = document.getElementById("pwBtn");
  const input = document.getElementById("pwInput");
  const toggle = document.getElementById("pwToggle");
  const reset = document.getElementById("pwReset");

  btn?.addEventListener("click", checkPw);

  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkPw();
  });

  toggle?.addEventListener("click", () => {
    if (!input) return;
    input.type = (input.type === "password") ? "text" : "password";
  });

  reset?.addEventListener("click", () => {
    localStorage.removeItem("siteLogin");
    setErr("✅ RESET DONE. PLEASE ENTER THE PASSWORD AGAIN");
    showLogin();
    input && (input.value = "");
    input?.focus();
  });
});
