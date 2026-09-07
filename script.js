const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const glow = document.querySelector('.cursor-glow');

document.addEventListener('contextmenu', event => event.preventDefault());
menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 30), { passive: true });
window.addEventListener('pointermove', event => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

document.querySelectorAll('.magnetic').forEach(button => {
  button.addEventListener('pointermove', event => {
    const bounds = button.getBoundingClientRect();
    const x = (event.clientX - bounds.left - bounds.width / 2) * 0.16;
    const y = (event.clientY - bounds.top - bounds.height / 2) * 0.16;
    button.style.transform = `translate(${x}px, ${y}px)`;
  });
  button.addEventListener('pointerleave', () => { button.style.transform = ''; });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const target = entry.target;
    const end = Number(target.dataset.count);
    let current = 0;
    const step = () => {
      current += 1;
      target.textContent = current;
      if (current < end) requestAnimationFrame(step);
      else target.textContent = `${end}`;
    };
    requestAnimationFrame(step);
    countObserver.unobserve(target);
  });
}, { threshold: 0.7 });
document.querySelectorAll('[data-count]').forEach(element => countObserver.observe(element));

const canvas = document.getElementById('constellation');
const context = canvas.getContext('2d');
let points = [];
let width = 0;
let height = 0;
function resizeCanvas() {
  width = canvas.width = window.innerWidth * devicePixelRatio;
  height = canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.scale(devicePixelRatio, devicePixelRatio);
  points = Array.from({ length: Math.min(56, Math.floor(window.innerWidth / 24)) }, () => ({
    x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18
  }));
}
function drawCanvas() {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  points.forEach(point => {
    point.x += point.vx; point.y += point.vy;
    if (point.x < 0 || point.x > window.innerWidth) point.vx *= -1;
    if (point.y < 0 || point.y > window.innerHeight) point.vy *= -1;
    context.fillStyle = 'rgba(245, 201, 88, .5)';
    context.fillRect(point.x, point.y, 1.2, 1.2);
    points.forEach(other => {
      const distance = Math.hypot(point.x - other.x, point.y - other.y);
      if (distance < 115 && distance > 0) {
        context.strokeStyle = `rgba(233, 81, 43, ${0.16 - distance / 900})`;
        context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(other.x, other.y); context.stroke();
      }
    });
  });
  requestAnimationFrame(drawCanvas);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
drawCanvas();
