# MHWilds Crate Hunt

A Rocket League–style crate-opening animation, reimagined for Monster Hunter Wilds. Instead of unboxing an item, you "hunt" a random Large Monster (or its rarer Tempered variant) from the game's roster.

Built with React, TypeScript, Vite, and Tailwind CSS.

## How it works

- Click **Open Crate** to spin a vertical reel of monster icons, styled after Rocket League's crate-opening screen (blurred spin, ease-out deceleration, center marker, glowing reveal).
- The reel lands on a randomly chosen Large Monster from the base Monster Hunter Wilds roster, or its Tempered variant when one exists.
- The revealed monster's name and rarity ("Large Monster" or "Tempered Large Monster") animate in on the right, color-coded like Rocket League rarities (blue for common, pink for rare/Tempered).
- Click **Hunt Again** to re-roll.

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run the linter |

## Attribution

Monster icon artwork is sourced from the [Monster Hunter Wiki on Fandom](https://monsterhunter.fandom.com/) and is © Capcom. This is an unofficial fan-made project and is not affiliated with Capcom or Psyonix/Rocket League.
