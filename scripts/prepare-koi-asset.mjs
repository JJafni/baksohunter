import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const KOI_ASSET_VERSION = 'forced-fate-5'

const root = join(fileURLToPath(import.meta.url), '..', '..')
const src = join(
  root,
  'node_modules/@designcodeio/threeui/lib-dist/assets/synthralos-halftone.html',
)
const dest = join(root, 'public/synthralos-halftone.html')

const DROP_MARKER = 'threeui-koi-drop'
const DRAG_MARKER = 'threeui-koi-drag'
const FORCED_FATE_MARKER = 'threeui-koi-forced-fate'
const PLAIN_VIDEO_MARKER = 'threeui-koi-plain-video'
const SITE_FONT_MARKER = 'threeui-koi-site-font'

function patchKoiHtml(html) {
  html = html.replace(
    '      let activeDrag = null;',
    `      let activeDrag = null;
      let pendingDrag = null;
      const DRAG_ACTIVATION_SLOP = 8;`,
  )

  html = html.replace(
    `      const cancelDrag = event => {
        if (
          !activeDrag ||
          (event?.pointerId !== undefined && event.pointerId !== activeDrag.pointerId)
        ) {
          return;
        }

        const { card, pointerId } = activeDrag;
        activeDrag = null;

        try {
          if (card.shell.hasPointerCapture?.(pointerId)) {
            card.shell.releasePointerCapture(pointerId);
          }
        } catch {
          // Pointer cancellation may release capture before this cleanup runs.
        }

        card.shell.classList.remove("is-dragging");
        setShellTransform(card);
      };`,
    `      const cancelPendingDrag = event => {
        if (
          !pendingDrag ||
          (event?.pointerId !== undefined && event.pointerId !== pendingDrag.pointerId)
        ) {
          return;
        }

        pendingDrag = null;
      };

      const promotePendingDrag = event => {
        if (!pendingDrag || event.pointerId !== pendingDrag.pointerId) {
          return false;
        }

        const x = event.clientX - pendingDrag.startX;
        const y = event.clientY - pendingDrag.startY;
        if (Math.hypot(x, y) < DRAG_ACTIVATION_SLOP) {
          return false;
        }

        const { card, pointerId, startX, startY } = pendingDrag;
        pendingDrag = null;
        activeDrag = {
          card,
          pointerId,
          startX,
          startY,
          committedDirection: 0,
          traveled: Math.hypot(x, y),
        };
        card.shell.classList.remove("is-tracking");
        card.shell.classList.add("is-dragging");
        card.shell.focus({ preventScroll: true });

        try {
          card.shell.setPointerCapture?.(pointerId);
        } catch {
          activeDrag = null;
          return false;
        }

        handleDragPointerMove(card, event);
        return true;
      };

      const cancelDrag = event => {
        cancelPendingDrag(event);

        if (
          !activeDrag ||
          (event?.pointerId !== undefined && event.pointerId !== activeDrag.pointerId)
        ) {
          return;
        }

        const { card, pointerId } = activeDrag;
        activeDrag = null;

        try {
          if (card.shell.hasPointerCapture?.(pointerId)) {
            card.shell.releasePointerCapture(pointerId);
          }
        } catch {
          // Pointer cancellation may release capture before this cleanup runs.
        }

        card.shell.classList.remove("is-dragging");
        setShellTransform(card);
      };`,
  )

  html = html.replace(
    `      const handlePointerDown = (card, event) => {
        if (
          card !== topCard() ||
          transitioning ||
          (event.button !== undefined && event.button !== 0)
        ) {
          return;
        }

        activeDrag = {
          card,
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          committedDirection: 0,
          traveled: 0
        };
        card.shell.classList.remove("is-tracking");
        card.shell.classList.add("is-dragging");
        card.shell.focus({ preventScroll: true });

        try {
          card.shell.setPointerCapture?.(event.pointerId);
        } catch {
          cancelDrag(event);
          return;
        }

        event.preventDefault();
      };`,
    `      const handlePointerDown = (card, event) => {
        if (
          card !== topCard() ||
          transitioning ||
          (event.button !== undefined && event.button !== 0)
        ) {
          return;
        }

        pendingDrag = {
          card,
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
        };

        event.preventDefault();
      };`,
  )

  html = html.replace(
    `      const handlePointerUp = (card, event) => {
        if (
          !activeDrag ||
          activeDrag.card !== card ||
          event.pointerId !== activeDrag.pointerId
        ) {
          return;
        }`,
    `      const handlePointerUp = (card, event) => {
        if (
          pendingDrag &&
          pendingDrag.card === card &&
          event.pointerId === pendingDrag.pointerId
        ) {
          pendingDrag = null;
          event.preventDefault();
          return;
        }

        if (
          !activeDrag ||
          activeDrag.card !== card ||
          event.pointerId !== activeDrag.pointerId
        ) {
          return;
        }`,
  )

  html = html.replace(
    `        if (committedDirection) {
          if (committedDirection < 0) {
            sendToBack(card, -1, 0);
          } else {
            bringPreviousToFront();
          }
        } else if (isTap) {
          sendToBack(card, x || 1, y);
        } else {
          setShellTransform(card);
        }

        event.preventDefault();
      };`,
    `        /* ${FORCED_FATE_MARKER} */
        if (committedDirection) {
          if (committedDirection < 0) {
            sendToBack(card, -1, 0);
          } else {
            bringPreviousToFront();
          }
        } else {
          setShellTransform(card);
        }

        try {
          if (committedDirection) {
            window.parent.postMessage(
              {
                type: "${DROP_MARKER}",
                cardId: card.id,
                cardName: card.shell.dataset.name,
                x: event.clientX,
                y: event.clientY,
                dx: x,
                dy: y,
                committedDirection,
              },
              "*",
            );
          }
        } catch {}

        event.preventDefault();
      };`,
  )

  html = html.replace(
    `        markInteracted();
        event.preventDefault();
      };

      const handlePointerMove = event => {`,
    `        markInteracted();

        try {
          window.parent.postMessage(
            {
              type: "${DRAG_MARKER}",
              cardId: card.id,
              cardName: card.shell.dataset.name,
              x: event.clientX,
              y: event.clientY,
              dx: x,
              dy: y,
            },
            "*",
          );
        } catch {}

        event.preventDefault();
      };

      const handlePointerMove = event => {`,
  )

  html = html.replace(
    `        card.shell.addEventListener("click", () => {
          if (performance.now() >= card.suppressClickUntil) {
            sendToBack(card, 1, 0);
          }
        });`,
    '',
  )

  html = html.replace(
    `        card.shell.addEventListener("keydown", event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            sendToBack(card, 1, 0);
          }
        });`,
    `        card.shell.addEventListener("keydown", event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
          }
        });`,
  )

  html = html.replace(
    `      window.addEventListener("pointermove", event => {
        if (activeDrag) {
          handleDragPointerMove(activeDrag.card, event);
        }
        handlePointerMove(event);
      });
      window.addEventListener("pointerup", event => {
        if (activeDrag) {
          handlePointerUp(activeDrag.card, event);
        }
      });`,
    `      window.addEventListener("pointermove", event => {
        if (pendingDrag) {
          promotePendingDrag(event);
        }
        if (activeDrag) {
          handleDragPointerMove(activeDrag.card, event);
        }
        handlePointerMove(event);
      });
      window.addEventListener("pointerup", event => {
        if (pendingDrag && event.pointerId === pendingDrag.pointerId) {
          cancelPendingDrag(event);
          return;
        }
        if (activeDrag) {
          handlePointerUp(activeDrag.card, event);
        }
      });`,
  )

  html = html.replace(
    `      const handleGlobalKeyDown = event => {
        const tagName = event.target?.tagName;
        const isTyping =
          event.target?.isContentEditable ||
          tagName === "INPUT" ||
          tagName === "TEXTAREA" ||
          tagName === "SELECT";

        if (isTyping || event.metaKey || event.ctrlKey || event.altKey) return;

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          bringPreviousToFront();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          sendToBack(topCard(), 1, 0);
        }
      };`,
    `      const handleGlobalKeyDown = event => {
        const tagName = event.target?.tagName;
        const isTyping =
          event.target?.isContentEditable ||
          tagName === "INPUT" ||
          tagName === "TEXTAREA" ||
          tagName === "SELECT";

        if (isTyping || event.metaKey || event.ctrlKey || event.altKey) return;

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          const card = topCard();
          try {
            window.parent.postMessage(
              {
                type: "${DROP_MARKER}",
                cardId: card.id,
                cardName: card.shell.dataset.name,
                x: 0,
                y: 0,
                dx: -1,
                dy: 0,
                committedDirection: -1,
              },
              "*",
            );
          } catch {}
          sendToBack(card, -1, 0);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          const card = topCard();
          try {
            window.parent.postMessage(
              {
                type: "${DROP_MARKER}",
                cardId: card.id,
                cardName: card.shell.dataset.name,
                x: 0,
                y: 0,
                dx: 1,
                dy: 0,
                committedDirection: 1,
              },
              "*",
            );
          } catch {}
          bringPreviousToFront();
        }
      };`,
  )

  html = html.replace(
    '← drag next · tap next · drag previous →',
    '← drag to curse · drag to bless →',
  )

  html = html.replace(
    'Drag left for the next card or right for the previous card. Tap for next. Use the Left and Right Arrow keys.',
    'Drag left to curse or right to bless. You must pick a side.',
  )

  html = html.replace(
    `    .image-field {
      position: absolute;
      inset: 0 0 auto;
      width: 100%;
      height: 63.76238%;
      display: block;
      background: var(--panel);
      pointer-events: none;
    }

    .media-source {
      position: absolute;
      width: 1px;
      height: 1px;
      opacity: 0;
      pointer-events: none;
    }`,
    `    /* ${PLAIN_VIDEO_MARKER} */
    .image-field {
      display: none;
    }

    .media-source {
      position: absolute;
      inset: 0 0 auto;
      width: 100%;
      height: 63.76238%;
      display: block;
      object-fit: cover;
      object-position: center;
      background: var(--panel);
      pointer-events: none;
      opacity: 1;
    }`,
  )

  html = html.replace(
    `      const canPlayVideos = () =>
        inView &&
        focused &&
        !reducedMotion.matches;`,
    `      const canPlayVideos = () =>
        inView &&
        focused;`,
  )

  html = html.replace(
    `      const shouldAnimateCanvas = () =>
        cards.every(card => card.imageReady) &&
        inView &&
        focused &&
        (
          canAnimateField() ||
          (!reducedMotion.matches && cards.some(card => card.videoUsable))
        );`,
    `      const shouldAnimateCanvas = () => false; /* ${PLAIN_VIDEO_MARKER} */`,
  )

  html = html.replace(
    '  <title>Koi Studies — Interactive Card Stack</title>\n  <style>',
    `  <title>Koi Studies — Interactive Card Stack</title>
  <!-- ${SITE_FONT_MARKER} -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&display=swap"
    rel="stylesheet"
  />
  <style>`,
  )

  html = html.replace(
    '      font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;',
    `      font-family: 'Rajdhani', ui-sans-serif, system-ui, sans-serif; /* ${SITE_FONT_MARKER} */`,
  )

  html = html.replace(
    `    .copy {
      position: absolute;
      top: 23.5%;
      left: 6.7%;
      margin: 0;
      font-family: Iowan Old Style, Baskerville, "Times New Roman", serif;
      font-size: 9.05cqw;
      font-weight: 400;
      line-height: 0.92;
      letter-spacing: -0.055em;
      text-wrap: balance;
    }`,
    `    .copy {
      position: absolute;
      top: 23.5%;
      left: 6.7%;
      margin: 0;
      font-family: 'Rajdhani', ui-sans-serif, system-ui, sans-serif;
      font-size: 9.05cqw;
      font-weight: 600;
      line-height: 1.02;
      letter-spacing: 0.03em;
      text-wrap: balance;
    }`,
  )

  html = html.replace(
    `    .wordmark {
      font-size: 2.05cqw;
      font-weight: 700;
      line-height: 1;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      white-space: nowrap;
    }`,
    `    .wordmark {
      font-family: 'Rajdhani', ui-sans-serif, system-ui, sans-serif;
      font-size: 2.05cqw;
      font-weight: 700;
      line-height: 1;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      white-space: nowrap;
    }`,
  )

  html = html.replace(
    `    .interaction-hint {
      position: absolute;
      left: 50%;
      top: calc(100% + clamp(28px, 4.5vh, 52px));
      z-index: 2;
      margin: 0;
      color: rgb(238 230 208 / 0.5);
      font-size: clamp(9px, 0.72vw, 12px);
      font-weight: 500;
      letter-spacing: 0.18em;
      line-height: 1;
      text-transform: uppercase;
      white-space: nowrap;
      transform: translateX(-50%);
      transition: opacity 260ms ease;
    }`,
    `    .interaction-hint {
      position: absolute;
      left: 50%;
      top: calc(100% + clamp(28px, 4.5vh, 52px));
      z-index: 2;
      margin: 0;
      color: rgb(238 230 208 / 0.5);
      font-family: 'Rajdhani', ui-sans-serif, system-ui, sans-serif;
      font-size: clamp(9px, 0.72vw, 12px);
      font-weight: 700;
      letter-spacing: 0.16em;
      line-height: 1;
      text-transform: uppercase;
      white-space: nowrap;
      transform: translateX(-50%);
      transition: opacity 260ms ease;
    }`,
  )

  return html
}

export function prepareKoiAsset() {
  if (!existsSync(src)) {
    console.warn('[prepare-koi-asset] threeui asset missing; run npm install first.')
    return
  }

  const html = patchKoiHtml(readFileSync(src, 'utf8'))

  if (
    !html.includes(FORCED_FATE_MARKER) ||
    !html.includes(DROP_MARKER) ||
    !html.includes(DRAG_MARKER) ||
    !html.includes('pendingDrag') ||
    !html.includes('DRAG_ACTIVATION_SLOP') ||
    !html.includes(PLAIN_VIDEO_MARKER) ||
    !html.includes(SITE_FONT_MARKER)
  ) {
    throw new Error('[prepare-koi-asset] Failed to patch koi asset.')
  }

  mkdirSync(dirname(dest), { recursive: true })
  writeFileSync(dest, html)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  prepareKoiAsset()
}
