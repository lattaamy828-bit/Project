#!/usr/bin/env node
/**
 * Fetches public-domain photographs of the works this site interprets, from
 * Wikimedia Commons, into `src/art/plates/`.
 *
 * Nothing here is required: with the folder empty the site renders its own
 * generated canvases, exactly as it does today. Drop plates in and every
 * painting — gallery walls, product cards, the glass projections, the opening
 * sequence's brush mask — switches to the photograph automatically. Remove them
 * and it switches back.
 *
 * Run it on a machine with ordinary internet access:
 *
 *     npm run fetch:art            # everything that is missing
 *     npm run fetch:art -- --force # re-download, replacing what is there
 *     npm run fetch:art -- starry-night irises
 *
 * Licensing: these are photographs of works whose copyright has long expired.
 * A faithful photographic reproduction of a 2D public-domain work carries no
 * new copyright in the United States (Bridgeman v. Corel), which is why
 * Commons hosts them as PD-Art. Rules differ by jurisdiction, so the actual
 * licence tag and credit line for every file downloaded is recorded in
 * `src/art/plates/CREDITS.md` — check it before using this commercially.
 */

import { mkdir, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src/art/plates');
const API = 'https://commons.wikimedia.org/w/api.php';
const WIDTH = 1600;

/* Wikimedia asks every client to identify itself; anonymous hits get throttled. */
const UA = 'AtelierEtoileDemo/1.0 (educational demo; https://github.com/lattaamy828-bit/Project)';

/**
 * For each painting: a preferred Commons file title, plus a search phrase used
 * when that exact title has been renamed — which happens often enough that
 * relying on titles alone would make this script rot.
 */
const PLATES = [
  { id: 'starry-night',    title: 'File:Van Gogh - Starry Night - Google Art Project.jpg',                    search: 'Van Gogh Starry Night 1889 MoMA' },
  { id: 'sunflowers',      title: 'File:Vincent Willem van Gogh 127.jpg',                                      search: 'Van Gogh Sunflowers 1888 National Gallery London' },
  { id: 'irises',          title: 'File:Irises-Vincent van Gogh.jpg',                                          search: 'Van Gogh Irises 1889 Getty' },
  { id: 'cafe-terrace',    title: 'File:Vincent Willem van Gogh - Cafe Terrace at Night (Yorck).jpg',          search: 'Van Gogh Cafe Terrace at Night Arles' },
  { id: 'wheatfield',      title: 'File:Vincent van Gogh - Wheat Field with Cypresses (National Gallery version).jpg', search: 'Van Gogh Wheat Field with Cypresses' },
  { id: 'almond-blossom',  title: 'File:Vincent van Gogh - Almond blossom - Google Art Project.jpg',           search: 'Van Gogh Almond Blossom 1890' },
  { id: 'bedroom',         title: 'File:Vincent van Gogh - De slaapkamer - Google Art Project.jpg',            search: 'Van Gogh Bedroom in Arles' },
  { id: 'self-portrait',   title: 'File:Vincent van Gogh - Self-Portrait - Google Art Project (454045).jpg',   search: 'Van Gogh self portrait 1889' },
  { id: 'mona-lisa',       title: 'File:Mona Lisa, by Leonardo da Vinci, from C2RMF retouched.jpg',            search: 'Mona Lisa Leonardo da Vinci Louvre' },
  { id: 'venus',           title: 'File:Sandro Botticelli - La nascita di Venere - Google Art Project - edited.jpg', search: 'Botticelli Birth of Venus Uffizi' },
  { id: 'pearl-earring',   title: 'File:Meisje met de parel.jpg',                                              search: 'Vermeer Girl with a Pearl Earring Mauritshuis' },
  { id: 'night-watch',     title: 'File:The Nightwatch by Rembrandt - Rijksmuseum.jpg',                        search: 'Rembrandt Night Watch Rijksmuseum' },
  { id: 'water-lilies',    title: 'File:Claude Monet - Water Lilies - 1906, Ryerson.jpg',                      search: 'Monet Water Lilies 1906' },
  { id: 'sunrise',         title: 'File:Monet - Impression, Sunrise.jpg',                                      search: 'Monet Impression Sunrise 1872' },
  { id: 'the-kiss',        title: 'File:The Kiss - Gustav Klimt - Google Cultural Institute.jpg',              search: 'Gustav Klimt The Kiss Belvedere' },
  { id: 'creation',        title: 'File:Michelangelo - Creation of Adam (cropped).jpg',                        search: 'Michelangelo Creation of Adam Sistine Chapel' },
  { id: 'olympia',         title: 'File:Edouard Manet - Olympia - Google Art Project 3.jpg',                   search: 'Manet Olympia 1863 Orsay' },
  { id: 'last-supper',     title: 'File:Leonardo da Vinci (1452-1519) - The Last Supper (1495-1498).jpg',      search: 'Leonardo Last Supper Santa Maria delle Grazie' },
];

const get = async (params) => {
  const url = `${API}?${new URLSearchParams({ format: 'json', origin: '*', ...params })}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Commons API ${res.status} ${res.statusText}`);
  return res.json();
};

const IMAGEINFO = {
  action: 'query',
  prop: 'imageinfo',
  iiprop: 'url|extmetadata|mime',
  iiurlwidth: String(WIDTH),
};

/** Resolve a plate to a thumbnail URL and its credit line. */
async function resolve(plate) {
  // 1. The preferred title, if it still exists.
  const byTitle = await get({ ...IMAGEINFO, titles: plate.title });
  const direct = Object.values(byTitle?.query?.pages ?? {})[0];
  if (direct?.imageinfo?.[0]?.thumburl) return { page: direct, via: 'title' };

  // 2. Otherwise search the File namespace and take the best match.
  const found = await get({
    ...IMAGEINFO,
    generator: 'search',
    gsrsearch: plate.search,
    gsrnamespace: '6',
    gsrlimit: '5',
  });
  const pages = Object.values(found?.query?.pages ?? {})
    .filter((p) => p?.imageinfo?.[0]?.thumburl && /^image\/(jpeg|png)$/.test(p.imageinfo[0].mime ?? ''))
    .sort((a, b) => (a.index ?? 99) - (b.index ?? 99));
  if (pages[0]) return { page: pages[0], via: 'search' };

  return null;
}

const meta = (page, key) => page?.imageinfo?.[0]?.extmetadata?.[key]?.value?.replace(/<[^>]*>/g, '').trim() ?? '';

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const only = args.filter((a) => !a.startsWith('--'));
  const wanted = only.length ? PLATES.filter((p) => only.includes(p.id)) : PLATES;

  if (!wanted.length) {
    console.error(`No plate matched ${only.join(', ')}. Known ids:\n  ${PLATES.map((p) => p.id).join('\n  ')}`);
    process.exitCode = 1;
    return;
  }

  await mkdir(OUT, { recursive: true });
  const existing = new Set((await readdir(OUT)).map((f) => f.replace(/\.[^.]+$/, '')));
  const credits = [];
  let got = 0;
  let skipped = 0;
  let failed = 0;

  for (const plate of wanted) {
    const dest = path.join(OUT, `${plate.id}.jpg`);
    if (!force && existsSync(dest)) {
      console.log(`  ·  ${plate.id.padEnd(16)} already present`);
      skipped++;
      existing.add(plate.id);
      continue;
    }
    try {
      const hit = await resolve(plate);
      if (!hit) throw new Error('not found on Commons (title and search both missed)');

      const info = hit.page.imageinfo[0];
      const res = await fetch(info.thumburl, { headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error(`download ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await writeFile(dest, buf);

      const kb = Math.round(buf.length / 1024);
      console.log(`  ✓  ${plate.id.padEnd(16)} ${String(kb).padStart(5)} kB  (${hit.via})`);
      credits.push({
        id: plate.id,
        file: hit.page.title,
        page: info.descriptionurl,
        artist: meta(hit.page, 'Artist'),
        licence: meta(hit.page, 'LicenseShortName') || 'see file page',
        credit: meta(hit.page, 'Credit'),
      });
      got++;
      /* Be a polite API client. */
      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      console.error(`  ✗  ${plate.id.padEnd(16)} ${err.message}`);
      failed++;
    }
  }

  if (credits.length) {
    const body = [
      '# Plate credits',
      '',
      'Photographs downloaded from Wikimedia Commons by `npm run fetch:art`.',
      'The works themselves are in the public domain; the licence tag below is the',
      'one Commons records for each photograph. Verify these before any commercial use.',
      '',
      ...credits.flatMap((c) => [
        `## ${c.id}`,
        '',
        `- **File:** [${c.file}](${c.page})`,
        `- **Artist:** ${c.artist || '—'}`,
        `- **Licence:** ${c.licence}`,
        c.credit ? `- **Credit:** ${c.credit}` : null,
        '',
      ].filter(Boolean)),
    ].join('\n');
    await writeFile(path.join(OUT, 'CREDITS.md'), body);
  }

  console.log(
    `\n${got} downloaded, ${skipped} already present, ${failed} failed.` +
      `\nPlates live in src/art/plates/ — rebuild to pick them up.` +
      (failed ? `\nAnything that failed simply keeps its generated canvas.` : ''),
  );
  if (failed && !got) process.exitCode = 1;
}

main().catch((err) => {
  console.error('\nfetch:art failed:', err.message);
  process.exitCode = 1;
});
