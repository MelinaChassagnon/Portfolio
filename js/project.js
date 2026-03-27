          document.body.addEventListener("mousemove", (e) => {
  const btn = e.target.closest(".fancy-btn");
  if (!btn) return;

  const rect = btn.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  btn.style.setProperty("--x", `${x}%`);
  btn.style.setProperty("--y", `${y}%`);
});

const movingBg = document.querySelector(".moving_bg");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  movingBg.style.transform = `translateY(${scrollY * -0.3}px)`;
});