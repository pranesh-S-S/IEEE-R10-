/**
 * IEEE vTools Events API client.
 *
 * Confirmed working (via Postman) against the real response schema:
 *   GET https://events.vtools.ieee.org/api/public/v8/events/list?tags=ieee&limit=2
 *
 * Note: this is NOT the `/RST/events/api/public/v8/...` path shown in the
 * public docs — that path appears to require an authenticated session. The
 * bare `/api/public/v8/...` path is the one that actually works unauthenticated.
 *
 * The API filters by tag server-side via `?tags=`, so we ask for `ieee`
 * directly instead of fetching everything and filtering after the fact.
 * We still re-check each event's `tags` array locally as a safety net, in
 * case the server-side match is partial/fuzzy.
 */

const EVENTS_URL =
  process.env.VTOOLS_EVENTS_URL ||
  "https://events.vtools.ieee.org/api/public/v8/events/list";

// The API's `tags` param wants the tag without the leading `#`.
const HASHTAG_RAW = (process.env.VTOOLS_HASHTAG_FILTER || "ieee").replace(/^#/, "");
const HASHTAG = `#${HASHTAG_RAW}`.toLowerCase();

// vTools doesn't expose a `region=` query param on events/list, so region is
// filtered locally against each event's `primary-host.region_spoids` (e.g.
// "R0" or "R10"). In IEEE vTools database, Region 10 is represented as "R0".
// Set to an empty string to disable region filtering entirely.
const REGION = (process.env.VTOOLS_REGION_FILTER ?? "R10").toUpperCase();

function matchesRegion(eventRegion: string | null | undefined, filterRegion: string): boolean {
  if (!filterRegion) return true;
  if (!eventRegion) return false;
  const e = eventRegion.toUpperCase();
  const f = filterRegion.toUpperCase();
  if (f === "R10" || f === "R0") {
    return e === "R10" || e === "R0";
  }
  return e === f;
}

export type XtremeEvent = {
  id: string;
  title: string;
  description: string;
  photo: string | null;
  registerUrl: string | null;
  hashtags: string[];
  section: string | null;
  studentBranch: string | null;
  region: string | null;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  isVirtual: boolean;
};

type RawEvent = Record<string, any>;

function firstString(...vals: any[]): string | null {
  for (const v of vals) {
    if (typeof v === "string" && v.trim().length > 0) return v.trim();
  }
  return null;
}

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  "#39": "'",
  nbsp: " ",
  rsquo: "\u2019",
  lsquo: "\u2018",
  rdquo: "\u201D",
  ldquo: "\u201C",
  mdash: "\u2014",
  ndash: "\u2013"
};

/** Strips HTML tags from vTools' rich-text `description` field and decodes common entities. */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&([a-z#0-9]+);/gi, (m, code) => ENTITIES[code.toLowerCase()] ?? m)
    .replace(/\s+/g, " ")
    .trim();
}

/** Pulls the first embedded image out of the description HTML, as a fallback banner photo. */
function firstEmbeddedImage(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function extractHashtags(attrs: RawEvent): string[] {
  const fromTags: string[] = Array.isArray(attrs.tags) ? attrs.tags.map(String) : [];
  const fromKeywords: string[] =
    typeof attrs.keywords === "string" ? attrs.keywords.split(/\s+/) : [];

  const merged = [...fromTags, ...fromKeywords]
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => (t.startsWith("#") ? t : `#${t}`));

  return Array.from(new Set(merged));
}

function normalizeEvent(raw: RawEvent): XtremeEvent {
  const attrs: RawEvent = raw.attributes ?? raw;
  const host = attrs["primary-host"] ?? {};
  const description = attrs.description ?? "";

  const photo = firstString(attrs.image) ?? firstEmbeddedImage(description);

  const registerUrl = firstString(attrs["registration-url"], attrs.link);

  return {
    id: String(raw.id ?? attrs.id ?? crypto.randomUUID()),
    title: firstString(attrs.title) ?? "Untitled event",
    description: stripHtml(description),
    photo,
    registerUrl,
    hashtags: extractHashtags(attrs),
    // vTools doesn't return a plain-text Section name — `type_description`
    // tells you whether the host itself is a Section, Student Branch, etc.
    section: host.type_description === "Section" ? firstString(host.name) : null,
    studentBranch:
      host.type_description === "Student Branch" ? firstString(host.name) : null,
    region: firstString(host.region_spoids),
    startTime: firstString(attrs["start-time"]),
    endTime: firstString(attrs["end-time"]),
    location: firstString(attrs.city),
    isVirtual: Boolean(attrs.virtual)
  };
}

/**
 * Fetches events already filtered server-side to the configured hashtag
 * (default "ieee"), then double-checks locally against each event's tags.
 */
export async function fetchIEEEEvents(): Promise<XtremeEvent[]> {
  const params = new URLSearchParams({
    tags: HASHTAG_RAW,
    limit: "60",
    sort: "-start-time"
  });
  const url = `${EVENTS_URL}?${params.toString()}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "r10-xtreme-site/1.0 (+https://xtreme.ieee.lk)"
      },
      next: { revalidate: 900 }
    });
  } catch (networkErr) {
    throw new Error(`Network error reaching vTools: ${(networkErr as Error).message}`);
  }

  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    throw new Error(
      `vTools Events API responded with ${res.status} ${res.statusText}. Body: ${bodyText.slice(0, 500)}`
    );
  }

  let json: any;
  try {
    json = await res.json();
  } catch {
    throw new Error("vTools returned a non-JSON response (check the URL/headers).");
  }

  const rawEvents: RawEvent[] = json?.data ?? [];

  return rawEvents
    .map(normalizeEvent)
    .filter((event) => event.hashtags.some((tag) => tag.toLowerCase() === HASHTAG))
    .filter((event) => !REGION || matchesRegion(event.region, REGION));
}