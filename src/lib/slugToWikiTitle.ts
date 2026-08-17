/** Maps app monster slug to MHWiki page title (without _(MHWilds) suffix). */
export function slugToWikiTitle(slug: string): string {
  const titled = slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

  return titled.replace(/\bKut Ku\b/, 'Kut-Ku')
}

export function slugToMhwildsWikiUrl(slug: string): string {
  const title = `${slugToWikiTitle(slug)}_(MHWilds)`
  return `https://monsterhunterwiki.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`
}
