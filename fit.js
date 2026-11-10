(function () {
  function fit() {
    var block = document.getElementById("titleBlock");
    if (!block) return;
    var w = block.offsetWidth;
    var h = block.offsetHeight;
    var s = Math.min(window.innerWidth / w, window.innerHeight / h);
    block.style.position = "absolute";
    block.style.left = Math.max(0, (window.innerWidth - w * s) / 2) + "px";
    block.style.top = Math.max(0, (window.innerHeight - h * s) / 2) + "px";
    block.style.transformOrigin = "top left";
    block.style.transform = "scale(" + s + ")";
  }
  window.addEventListener("resize", fit);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fit);
  else fit();
})();
