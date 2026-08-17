/** Convert a BASE_MONSTERS slug to the MHWiki page title (without suffix). */
export function slugToWikiTitle(slug: string): string {
  const titled = slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return titled.replace(/\bKut Ku\b/, 'Kut-Ku')
}

/** Full MHWilds wiki page title, e.g. `Ajarakan_(MHWilds)`. */
export function slugToWikiPageTitle(slug: string): string {
  return `${slugToWikiTitle(slug).replace(/ /g, '_')}` + '_(MHWilds)'
}

/** Canonical wiki URL for a monster slug. */
export function slugToWikiUrl(slug: string): string {
  const title = slugToWikiPageTitle(slug)
  return `https://monsterhunterwiki.org/wiki/${encodeURIComponent(title)}`
}
