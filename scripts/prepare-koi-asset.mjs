import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { extractKoiVideos } from './extract-koi-videos.mjs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const KOI_ASSET_VERSION = 'forced-fate-19'

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
const SITE_THEME_MARKER = 'threeui-koi-site-theme'
const NO_FLUID_PASTELS_MARKER = 'threeui-koi-no-fluid-pastels'
const NO_ORBITAL_LINES_MARKER = 'threeui-koi-no-orbital-lines'
const SHUFFLE_MARKER = 'threeui-koi-shuffle'
const SHUFFLE_RESULT_MARKER = 'threeui-koi-shuffle-result'
const LIMITS_MARKER = 'threeui-koi-limits'
const FATE_LIMITS_MARKER = 'threeui-koi-fate-limits'
const CARD_SCALE_MARKER = 'threeui-koi-card-scale'
const FATE_RELEASE_MARKER = 'threeui-koi-fate-release'
const FATE_COMMIT_MARKER = 'threeui-koi-fate-commit'
const RELEASE_ONLY_FATE_MARKER = 'threeui-koi-release-only-fate'

function patchKoiHtml(html) {
  html = html.replace(
    `    .stack-scene {
      position: relative;
      z-index: 2;
      width: min(26.40625vw, 46.94444vh);
      aspect-ratio: 676 / 1010;
      perspective: 900px;
      container-type: inline-size;
      isolation: isolate;
    }`,
    `    .stack-scene {
      position: relative;
      z-index: 2;
      /* ${CARD_SCALE_MARKER} */
      width: min(36vw, 52vh, 22.5rem);
      aspect-ratio: 676 / 1010;
      perspective: 900px;
      container-type: inline-size;
      isolation: isolate;
    }`,
  )

  html = html.replace(
    `    .stack-shell.is-releasing .drag-plane {
      transition:
        transform 180ms cubic-bezier(0.32, 0, 0.2, 1),
        opacity 90ms ease-out,
        filter 120ms ease-out;
    }

    .artwork {
      --panel: #211914;`,
    `    .stack-shell.is-releasing .drag-plane {
      transition:
        transform 180ms cubic-bezier(0.32, 0, 0.2, 1),
        opacity 90ms ease-out,
        filter 120ms ease-out;
    }

    /* ${FATE_COMMIT_MARKER} */
    .stack-shell.is-fate-commit {
      pointer-events: none;
      z-index: 40;
    }

    .stack-shell.is-fate-commit .drag-plane {
      transition:
        transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
        opacity 260ms ease-out,
        filter 260ms ease-out;
    }

    .artwork {
      --panel: #211914;`,
  )

  html = html.replace(
    `    @media (max-aspect-ratio: 3 / 4) {
      .stack-scene {
        width: min(72vw, 44vh);
      }
    }`,
    `    @media (max-aspect-ratio: 3 / 4) {
      .stack-scene {
        width: min(72vw, 52vh, 22.5rem);
      }
    }`,
  )

  html = html.replace(
    '        const duration = reducedMotion.matches ? 0 : 180;',
    `        const duration = reducedMotion.matches ? 0 : 320; /* ${FATE_RELEASE_MARKER} */`,
  )

  html = html.replace(
    '      let activeDrag = null;',
    `      let activeDrag = null;
      let pendingDrag = null;
      const DRAG_ACTIVATION_SLOP = 8;
      /* ${FATE_LIMITS_MARKER} */
      let fateLimits = { cursedFull: false, blessedFull: false };
      const isFateDirectionAllowed = direction => {
        if (!direction) return false;
        if (direction < 0) return !fateLimits.cursedFull;
        return !fateLimits.blessedFull;
      };
      /* ${FATE_RELEASE_MARKER} */
      const postFateDrop = payload => {
        try {
          window.parent.postMessage(payload, "*");
        } catch {}
      };`,
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
    `        const {
          committedDirection: latchedDirection,
          startX,
          startY,
          traveled
        } = activeDrag;
        const x = event.clientX - startX;
        const y = event.clientY - startY;
        const threshold = getDragCommitThreshold();
        const tapSlop = 3;
        const dropDistance = Math.hypot(x, y);
        const releaseDirection = getCommittedDirection(x, y, threshold);
        const committedDirection = releaseDirection || latchedDirection;
        const isTap = traveled <= tapSlop && dropDistance <= tapSlop;`,
    `        const { startX, startY, traveled } = activeDrag;
        const x = event.clientX - startX;
        const y = event.clientY - startY;
        const threshold = getDragCommitThreshold();
        const tapSlop = 3;
        const dropDistance = Math.hypot(x, y);
        const releaseDirection = getCommittedDirection(x, y, threshold);
        /* ${RELEASE_ONLY_FATE_MARKER} */
        const committedDirection = isFateDirectionAllowed(releaseDirection)
          ? releaseDirection
          : 0;
        const isTap = traveled <= tapSlop && dropDistance <= tapSlop;`,
  )

  html = html.replace(
    `        activeDrag.traveled = Math.max(activeDrag.traveled, Math.hypot(x, y));
        if (committedDirection) {
          activeDrag.committedDirection = committedDirection;
        }
        setShellTransform(`,
    `        activeDrag.traveled = Math.max(activeDrag.traveled, Math.hypot(x, y));
        activeDrag.committedDirection = committedDirection;
        setShellTransform(`,
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
          sendToFate(card, committedDirection, x, y);

          postFateDrop({
            type: "${DROP_MARKER}",
            cardId: card.id,
            cardName: card.shell.dataset.name,
            x: event.clientX,
            y: event.clientY,
            dx: x,
            dy: y,
            committedDirection,
          });
        } else {
          setShellTransform(card);
        }

        event.preventDefault();
      };`,
  )

  html = html.replace(
    '      const topCard = () => cards[order[order.length - 1]];',
    '      const topCard = () => (order.length ? cards[order[order.length - 1]] : null);',
  )

  html = html.replace(
    `      window.addEventListener("mouseout", event => {
        if (!event.relatedTarget && !activeDrag) {
          const card = topCard();
          card.shell.classList.remove("is-tracking");
          setShellTransform(card);
        }
      });`,
    `      window.addEventListener("mouseout", event => {
        if (!event.relatedTarget && !activeDrag) {
          const card = topCard();
          if (!card) return;
          card.shell.classList.remove("is-tracking");
          setShellTransform(card);
        }
      });`,
  )

  html = html.replace(
    `      const updateStack = () => {
        const top = topCard();

        for (let index = 0; index < order.length; index += 1) {
          const card = cards[order[index]];
          const depth = order.length - index - 1;
          const isTop = card === top;
          const wasActive = card.shell.classList.contains("is-active");

          card.shell.style.zIndex = String(index + 1);
          card.shell.style.pointerEvents = isTop ? "auto" : "none";
          card.shell.tabIndex = isTop ? 0 : -1;
          card.shell.setAttribute("aria-hidden", isTop ? "false" : "true");
          card.shell.classList.toggle("is-active", isTop);
          if (isTop && !wasActive) {
            card.entryRevealStart = performance.now();
          }
          card.shell.dataset.depth = String(depth);
          card.shell.style.setProperty(
            "--stack-x",
            \`\${STACK_X[depth] ?? 0}%\`
          );
          card.shell.style.setProperty(
            "--stack-y",
            \`\${STACK_Y[depth] ?? 0}%\`
          );
          card.shell.style.setProperty(
            "--stack-z",
            STACK_Z[depth] ?? "0px"
          );
          card.artwork.style.setProperty(
            "--stack-rotation",
            \`\${STACK_ROTATIONS[depth] ?? 0}deg\`
          );
          card.artwork.style.setProperty(
            "--stack-scale",
            String(1 - depth * STACK_SCALE_STEP)
          );

          if (!isTop) resetShellTransform(card);
        }

        status.textContent = \`\${top.shell.dataset.name} is the active card.\`;
      };`,
    `      const updateStack = () => {
        if (!order.length) {
          status.textContent = "All koi assigned.";
          return;
        }

        const top = topCard();

        for (let index = 0; index < order.length; index += 1) {
          const card = cards[order[index]];
          const depth = order.length - index - 1;
          const isTop = card === top;
          const wasActive = card.shell.classList.contains("is-active");

          card.shell.style.display = "";
          card.shell.style.visibility = "";
          card.shell.style.zIndex = String(index + 1);
          card.shell.style.pointerEvents = isTop ? "auto" : "none";
          card.shell.tabIndex = isTop ? 0 : -1;
          card.shell.setAttribute("aria-hidden", isTop ? "false" : "true");
          card.shell.classList.toggle("is-active", isTop);
          if (isTop && !wasActive) {
            card.entryRevealStart = performance.now();
          }
          card.shell.dataset.depth = String(depth);
          card.shell.style.setProperty(
            "--stack-x",
            \`\${STACK_X[depth] ?? 0}%\`
          );
          card.shell.style.setProperty(
            "--stack-y",
            \`\${STACK_Y[depth] ?? 0}%\`
          );
          card.shell.style.setProperty(
            "--stack-z",
            STACK_Z[depth] ?? "0px"
          );
          card.artwork.style.setProperty(
            "--stack-rotation",
            \`\${STACK_ROTATIONS[depth] ?? 0}deg\`
          );
          card.artwork.style.setProperty(
            "--stack-scale",
            String(1 - depth * STACK_SCALE_STEP)
          );

          if (!isTop) resetShellTransform(card);
        }

        status.textContent = \`\${top.shell.dataset.name} is the active card.\`;
      };`,
  )

  html = html.replace(
    `      const sendToBack = (card, vectorX = 1, vectorY = 0) => {
        if (transitioning || card !== topCard()) return;

        markInteracted();
        transitioning = true;`,
    `      /* ${FATE_COMMIT_MARKER} */
      const sendToFate = (card, direction, releaseX = 0, releaseY = 0) => {
        if (transitioning || card !== topCard()) return;

        markInteracted();
        transitioning = true;
        const directionX = direction < 0 ? -1 : 1;
        const sceneWidth = Math.max(1, scene.getBoundingClientRect().width);
        const exitDistance = Math.max(sceneWidth * 0.92, 280);
        const targetX =
          directionX < 0
            ? Math.min(releaseX, -exitDistance)
            : Math.max(releaseX, exitDistance);
        const targetY = releaseY * 0.35;
        const duration = reducedMotion.matches ? 0 : 320;
        const nextOrder = order.filter(id => id !== card.id);
        const incoming = nextOrder.length
          ? cards[nextOrder[nextOrder.length - 1]]
          : null;
        const hadFocus = document.activeElement === card.shell;

        card.shell.classList.remove("is-dragging", "is-tracking", "is-active");
        card.shell.classList.add("is-releasing", "is-fate-commit");
        card.shell.style.pointerEvents = "none";
        card.shell.style.zIndex = "50";
        card.shell.style.transition = "none";

        order = nextOrder;
        updateStack();

        card.dragPlane.style.transition = duration
          ? "transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms ease-out, filter 260ms ease-out"
          : "none";
        setShellTransform(
          card,
          targetX,
          targetY,
          clamp(-releaseY / sceneWidth * 5, -5, 5),
          directionX * 10,
          directionX * 12,
        );
        card.dragPlane.style.opacity = "0";
        card.dragPlane.style.setProperty(
          "--release-blur",
          duration ? "18px" : "0px",
        );

        const finish = () => {
          card.shell.style.transition = "none";
          card.dragPlane.style.transition = "none";
          setShellTransform(card);
          card.dragPlane.style.opacity = "0";
          card.dragPlane.style.setProperty("--release-blur", "0px");
          card.shell.classList.remove("is-releasing", "is-fate-commit");
          card.shell.style.display = "none";
          card.shell.style.zIndex = "";
          card.shell.tabIndex = -1;
          card.shell.style.transition = "";
          card.dragPlane.style.transition = "";
          transitioning = false;

          if (hadFocus && incoming) incoming.shell.focus({ preventScroll: true });
        };

        if (duration) window.setTimeout(finish, duration);
        else finish();
      };

      const sendToBack = (card, vectorX = 1, vectorY = 0) => {
        if (transitioning || card !== topCard()) return;

        markInteracted();
        transitioning = true;`,
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
          if (fateLimits.cursedFull) return;
          const card = topCard();
          const threshold = getDragCommitThreshold();
          sendToFate(card, -1, -threshold, 0);
          postFateDrop({
            type: "${DROP_MARKER}",
            cardId: card.id,
            cardName: card.shell.dataset.name,
            x: 0,
            y: 0,
            dx: -1,
            dy: 0,
            committedDirection: -1,
          });
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          if (fateLimits.blessedFull) return;
          const card = topCard();
          const threshold = getDragCommitThreshold();
          sendToFate(card, 1, threshold, 0);
          postFateDrop({
            type: "${DROP_MARKER}",
            cardId: card.id,
            cardName: card.shell.dataset.name,
            x: 0,
            y: 0,
            dx: 1,
            dy: 0,
            committedDirection: 1,
          });
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
      color: rgb(138 127 110 / 0.92);
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

  html = html.replace(
    `    :root {
      --field: #10100e;
      --paper: #eee6d0;
      --muted: #a39b88;
      --accent: #c95c3f;
    }`,
    `    :root {
      /* ${SITE_THEME_MARKER} */
      --field: #0f0d0a;
      --paper: #ede4d3;
      --muted: #8a7f6e;
      --accent: #c9a24d;
    }`,
  )

  html = html.replace(
    `      background:
        radial-gradient(circle at 52% 42%, rgb(201 92 63 / 0.055), transparent 27rem),
        radial-gradient(circle at 45% 55%, rgb(238 230 208 / 0.035), transparent 40rem),
        var(--field);`,
    `      background:
        radial-gradient(circle at 12% -5%, rgb(107 127 82 / 0.18), transparent 42%),
        radial-gradient(circle at 88% 15%, rgb(184 101 58 / 0.14), transparent 38%),
        radial-gradient(circle at 50% 100%, rgb(201 162 77 / 0.08), transparent 50%),
        var(--field);`,
  )

  html = html.replace(
    `      background:
        radial-gradient(circle at 50% 46%, transparent 16%, rgb(7 7 6 / 0.18) 100%),
        radial-gradient(circle at 52% 42%, rgb(201 92 63 / 0.065), transparent 30rem),
        linear-gradient(rgb(34 31 25 / 0.16), rgb(17 18 15 / 0.22));`,
    `      background:
        radial-gradient(circle at 50% 46%, transparent 16%, rgb(15 13 10 / 0.28) 100%),
        radial-gradient(circle at 88% 12%, rgb(201 162 77 / 0.08), transparent 32rem),
        linear-gradient(rgb(23 20 16 / 0.2), rgb(15 13 10 / 0.28));`,
  )

  html = html.replace(
    /<div class="orbital-field"[\s\S]*?<\/div>\s*/,
    `<!-- ${NO_ORBITAL_LINES_MARKER} -->\n`,
  )

  html = html.replace(
    `    .orbital-field {
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: 0;
      width: 220%;
      aspect-ratio: 1;
      pointer-events: none;
      translate: -50% -50%;
    }

    .orbit {
      position: absolute;
      left: 50%;
      top: 50%;
      width: var(--orbit-size);
      aspect-ratio: 1;
      border-radius: 50%;
      background: conic-gradient(
        from var(--orbit-angle),
        transparent 0 13%,
        rgb(238 230 208 / 0.07) 19%,
        rgb(238 230 208 / 0.26) 27%,
        rgb(201 92 63 / 0.24) 34%,
        transparent 45% 67%,
        rgb(238 230 208 / 0.17) 76%,
        transparent 88%
      );
      opacity: var(--orbit-opacity);
      translate: -50% -50%;
      rotate: 0deg;
      -webkit-mask: radial-gradient(
        farthest-side,
        transparent calc(100% - var(--orbit-line)),
        #000 calc(100% - var(--orbit-line) + 0.75px)
      );
      mask: radial-gradient(
        farthest-side,
        transparent calc(100% - var(--orbit-line)),
        #000 calc(100% - var(--orbit-line) + 0.75px)
      );
      animation: orbit-spin var(--orbit-speed) linear infinite;
      will-change: rotate;
    }

    .orbit-one {
      --orbit-size: 58%;
      --orbit-line: 1.5px;
      --orbit-angle: 18deg;
      --orbit-opacity: 0.9;
      --orbit-speed: 18s;
    }

    .orbit-two {
      --orbit-size: 79%;
      --orbit-line: 1px;
      --orbit-angle: 154deg;
      --orbit-opacity: 0.7;
      --orbit-speed: 27s;
      animation-direction: reverse;
    }

    .orbit-three {
      --orbit-size: 100%;
      --orbit-line: 1px;
      --orbit-angle: 252deg;
      --orbit-opacity: 0.5;
      --orbit-speed: 36s;
    }

    @keyframes orbit-spin {
      to {
        rotate: 360deg;
      }
    }

`,
    '',
  )

  html = html.replace(
    `      .orbit {
        animation: none;
      }

      .orbit-one {
        rotate: 22deg;
      }

      .orbit-two {
        rotate: 148deg;
      }

      .orbit-three {
        rotate: 276deg;
      }

`,
    '',
  )

  html = html.replace(
    `      .fluid-pastels-background,
      .orbital-field {
        display: none;
      }`,
    '',
  )

  html = html.replace(
    `    .artwork {
      --panel: #211914;
      --ink: var(--paper);
      --accent-card: var(--accent);
      --stack-rotation: 0deg;
      --stack-scale: 1;
      position: absolute;
      inset: 0;
      overflow: hidden;
      container-type: inline-size;
      background: var(--panel);
      border-radius: clamp(20px, 2vw, 30px);
      box-shadow:
        0 2.6cqw 6.5cqw rgb(0 0 0 / 0.38),
        inset 0 0 0 1px rgb(255 255 255 / 0.1);`,
    `    .artwork {
      --panel: #171410;
      --ink: var(--paper);
      --accent-card: var(--accent);
      --stack-rotation: 0deg;
      --stack-scale: 1;
      position: absolute;
      inset: 0;
      overflow: hidden;
      container-type: inline-size;
      background: var(--panel);
      border-radius: 0.75rem;
      box-shadow:
        0 2.6cqw 6.5cqw rgb(0 0 0 / 0.55),
        inset 0 1px 0 rgb(228 200 120 / 0.14),
        inset 0 0 0 1px rgb(201 162 77 / 0.28);`,
  )

  html = html.replace(
    `      background: linear-gradient(
        145deg,
        rgb(255 255 255 / 0.22),
        rgb(238 230 208 / 0.11) 42%,
        rgb(255 255 255 / 0.035) 72%,
        rgb(201 92 63 / 0.19)
      );`,
    `      background: linear-gradient(
        145deg,
        rgb(228 200 120 / 0.28),
        rgb(201 162 77 / 0.14) 42%,
        rgb(228 200 120 / 0.04) 72%,
        rgb(184 101 58 / 0.18)
      );`,
  )

  html = html.replace(
    `    .copy-panel {
      position: absolute;
      inset: 63.76238% 0 0;
      background: var(--panel);
      color: var(--ink);
      box-shadow: inset 0 1px rgb(238 230 208 / 0.09);
    }`,
    `    .copy-panel {
      position: absolute;
      inset: 63.76238% 0 0;
      background: var(--panel);
      color: var(--ink);
      box-shadow: inset 0 1px rgb(201 162 77 / 0.2);
    }`,
  )

  html = html.replace(
    `        radial-gradient(ellipse at 24% 48%, var(--accent-card), transparent 44%),
        radial-gradient(ellipse at 58% 62%, rgb(238 230 208 / 0.16), transparent 52%);`,
    `        radial-gradient(ellipse at 24% 48%, var(--accent-card), transparent 44%),
        radial-gradient(ellipse at 58% 62%, rgb(228 200 120 / 0.18), transparent 52%);`,
  )

  html = html.replace(
    `        #c64b35;`,
    `        #c9a24d;`,
  )

  html = html.replace(
    '<article class="artwork" style="--panel: #211914; --ink: #eee6d0; --accent-card: #c95c3f;">',
    '<article class="artwork" style="--panel: #1f1a14; --ink: #ede4d3; --accent-card: #b8653a;">',
  )

  html = html.replace(
    '<article class="artwork" style="--panel: #18201e; --ink: #e8dfc9; --accent-card: #b8664d;">',
    '<article class="artwork" style="--panel: #171410; --ink: #ede4d3; --accent-card: #6b7f52;">',
  )

  html = html.replace(
    '<article class="artwork" style="--panel: #29231a; --ink: #eee6d0; --accent-card: #bc744b;">',
    '<article class="artwork" style="--panel: #2a231b; --ink: #ede4d3; --accent-card: #c9a24d;">',
  )

  html = html.replace(
    /<canvas\s+id="fluid-pastels-background"[\s\S]*?<\/canvas>\s*/,
    `<!-- ${NO_FLUID_PASTELS_MARKER} -->\n`,
  )

  html = html.replace(
    /<script type="module">\s*\(\(\) => \{[\s\S]*?mountFluidPastels\(\);\s*\}\)\(\);\s*<\/script>\s*/,
    `<!-- ${NO_FLUID_PASTELS_MARKER} -->\n`,
  )

  html = html.replace(
    `    .fluid-pastels-background {
      position: fixed;
      inset: 0;
      z-index: 0;
      width: 100vw;
      height: 100dvh;
      display: block;
      background: var(--field);
      pointer-events: none;
      contain: strict;
    }

`,
    '',
  )

  html = html.replace(
    `      .fluid-pastels-background,
      .orbital-field {
        display: none;
      }`,
    '',
  )

  html = html.replace(
    `        status.textContent = \`\${top.shell.dataset.name} is the active card.\`;
      };

      const drawMediaAndGrid = card => {`,
    `        status.textContent = \`\${top.shell.dataset.name} is the active card.\`;
      };

      /* ${SHUFFLE_MARKER} */
      const shuffleStack = () => {
        if (transitioning || activeDrag || pendingDrag || !order.length) return false;

        markInteracted();
        cancelPendingDrag({});
        cancelDrag({});

        const currentTop = order[order.length - 1];
        let next = [...order];
        let attempts = 0;

        do {
          for (let i = next.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [next[i], next[j]] = [next[j], next[i]];
          }
          attempts += 1;
        } while (next[next.length - 1] === currentTop && attempts < 8);

        for (const card of cards) {
          resetShellTransform(card);
        }

        order = next;
        updateStack();
        topCard()?.shell.focus({ preventScroll: true });
        return true;
      };

      window.addEventListener("message", event => {
        if (event.source !== window.parent) return;
        const data = event.data;
        if (!data) return;

        if (data.type === "${LIMITS_MARKER}") {
          fateLimits = {
            cursedFull: Boolean(data.cursedFull),
            blessedFull: Boolean(data.blessedFull),
          };
          return;
        }

        if (data.type !== "${SHUFFLE_MARKER}") return;

        const ok = shuffleStack();
        try {
          window.parent.postMessage(
            { type: "${SHUFFLE_RESULT_MARKER}", ok },
            "*",
          );
        } catch {}
      });

      const drawMediaAndGrid = card => {`,
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
    !html.includes(SITE_FONT_MARKER) ||
    !html.includes(SITE_THEME_MARKER) ||
    !html.includes(NO_FLUID_PASTELS_MARKER) ||
    !html.includes(RELEASE_ONLY_FATE_MARKER) ||
    !html.includes(SHUFFLE_MARKER) ||
    !html.includes(FATE_LIMITS_MARKER) ||
    !html.includes(LIMITS_MARKER) ||
    !html.includes(CARD_SCALE_MARKER) ||
    !html.includes(FATE_RELEASE_MARKER) ||
    !html.includes(FATE_COMMIT_MARKER) ||
    html.includes('id="fluid-pastels-background"') ||
    html.includes('mountFluidPastels') ||
    html.includes('class="orbital-field"') ||
    html.includes('repeating-linear-gradient')
  ) {
    throw new Error('[prepare-koi-asset] Failed to patch koi asset.')
  }

  mkdirSync(dirname(dest), { recursive: true })
  writeFileSync(dest, html)
  extractKoiVideos()
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  prepareKoiAsset()
}
