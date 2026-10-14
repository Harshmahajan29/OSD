import { VERTEX, FRAGMENT } from './shaders.js';
import { heroPointer } from '../hero-parallax.js';

/**
 * Animated WebGL fog behind the hero.
 * Performance guards:
 *  - renders at half resolution (fog is soft, nobody can tell);
 *  - only runs while the hero is on screen and the tab is visible;
 *  - measures frame time and switches itself off on slow devices.
 */
export function initFog(canvas, hero) {
  if (!canvas || !hero) return;
  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    powerPreference: 'low-power',
  });
  if (!gl) return;

  const program = createProgram(gl, VERTEX, FRAGMENT);
  if (!program) return;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, 'r');
  const uTime = gl.getUniformLocation(program, 't');
  const uMouse = gl.getUniformLocation(program, 'm');

  const isSmall = window.matchMedia('(max-width: 700px)').matches;
  const scale = Math.min(window.devicePixelRatio || 1, 2) * (isSmall ? 0.35 : 0.5);

  function resize() {
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  resize();
  new ResizeObserver(resize).observe(canvas);

  const mouse = { x: 0.7, y: 0.55 };
  const t0 = performance.now();
  let running = false;
  let raf = 0;
  let slowFrames = 0;
  let last = 0;

  function draw(now) {
    raf = 0;
    if (!running) return;

    // Self-disable if the device can't keep up (≈ <25 fps for ~2 s).
    if (last) {
      slowFrames = now - last > 40 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
      if (slowFrames > 50) return disable();
    }
    last = now;

    const target = heroPointer;
    mouse.x += (target.x - mouse.x) * 0.06;
    mouse.y += (1 - target.y - mouse.y) * 0.06;

    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (now - t0) / 1000);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(draw);
  }

  function setRunning(on) {
    running = on && !document.hidden;
    last = 0;
    if (running && !raf) raf = requestAnimationFrame(draw);
  }

  function disable() {
    running = false;
    canvas.classList.remove('is-ready');
  }

  let heroVisible = true;
  new IntersectionObserver(([entry]) => {
    heroVisible = entry.isIntersecting;
    setRunning(heroVisible);
  }).observe(hero);
  document.addEventListener('visibilitychange', () => setRunning(heroVisible));

  canvas.classList.add('is-ready');
  setRunning(true);
}

function createProgram(gl, vsSource, fsSource) {
  const compile = (type, src) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };
  const vs = compile(gl.VERTEX_SHADER, vsSource);
  const fs = compile(gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}
