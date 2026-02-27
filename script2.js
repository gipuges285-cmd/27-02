/* =========================
   FINAL ANTI-COPY / ANTI-INSPECT
   ========================= */

(function () {
  "use strict";

  // 1) Right click off
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    alert("চুরি করা মহাপাপ তাই সাবধান।🚫 কোড লাগলে আমার সাথে যোগাযোগ করেন- 01767046095");
  });

  // 2) Block common devtools / view-source / copy/paste/select/save shortcuts
  document.addEventListener("keydown", function (e) {
    const key = (e.key || "").toLowerCase();

    // Detect Ctrl / Cmd
    const ctrlOrCmd = e.ctrlKey || e.metaKey;

    // F12
    if (key === "f12") {
      e.preventDefault();
      alert("Dont Try To Inspect Element");
      return false;
    }

    // Ctrl+Shift+I / J / C  (DevTools)
    if (ctrlOrCmd && e.shiftKey && (key === "i" || key === "j" || key === "c")) {
      e.preventDefault();
      alert("Dont Try To Inspect Element");
      return false;
    }

    // Ctrl/Cmd + U (View Source)
    if (ctrlOrCmd && key === "u") {
      e.preventDefault();
      alert("Dont try to view page sources");
      return false;
    }

    // Ctrl/Cmd + S (Save)
    if (ctrlOrCmd && key === "s") {
      e.preventDefault();
      alert("Saving is disabled");
      return false;
    }

    // Ctrl/Cmd + C (Copy)
    if (ctrlOrCmd && key === "c") {
      e.preventDefault();
      alert("Dont try to copy page element");
      return false;
    }

    // Ctrl/Cmd + V (Paste)
    if (ctrlOrCmd && key === "v") {
      e.preventDefault();
      alert("Dont try to paste anything to other page sources");
      return false;
    }

    // Ctrl/Cmd + A (Select All)
    if (ctrlOrCmd && key === "a") {
      e.preventDefault();
      alert("Select all is disabled");
      return false;
    }

    // Extra: Ctrl/Cmd + P (Print) (চাইলে রাখবেন)
    // if (ctrlOrCmd && key === "p") {
    //   e.preventDefault();
    //   alert("Print disabled");
    //   return false;
    // }

  });

  // 3) Block copy/cut/paste events as a backup
  ["copy", "cut", "paste"].forEach(function (evt) {
    document.addEventListener(evt, function (e) {
      e.preventDefault();
      alert("এই অপশনটি বন্ধ করা আছে 🚫");
    });
  });

  // 4) Try to block text selection (desktop)
  document.addEventListener("selectstart", function (e) {
    e.preventDefault();
  });

})();

