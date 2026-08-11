import { NextRequest, NextResponse } from 'next/server';

const GITHUB_OWNER = 'towfiqbinhasan';
const GITHUB_REPO = 'my-portfolio';
const GITHUB_BRANCH = 'main';
const GITHUB_API = 'https://api.github.com';

function githubHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };
}

async function getFileSha(path: string): Promise<string | null> {
  const res = await fetch(
    `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
    { headers: githubHeaders() }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET failed: ${res.status}`);
  const data = await res.json();
  return data.sha;
}

async function readJsonFile(path: string): Promise<any[]> {
  const sha = await getFileSha(path);
  if (!sha) return [];

  const res = await fetch(
    `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
    { headers: githubHeaders() }
  );
  const data = await res.json();
  const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
  return JSON.parse(decoded);
}

// GET /api/content?category=certificate&secret=xxx
// Returns the full list of entries for a category, each tagged with its index
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const secret = searchParams.get('secret');

    if (secret !== process.env.UPLOAD_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!category) {
      return NextResponse.json({ error: 'Missing category' }, { status: 400 });
    }

    const dataPath = `data/${category}.json`;
    const items = await readJsonFile(dataPath);

    // Tag each item with its array index so the app can reference it later
    const tagged = items.map((item, index) => ({ ...item, _index: index }));

    return NextResponse.json({ success: true, items: tagged });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

// A shared helper: fetch the full JSON array + its current sha
async function getJsonWithSha(path: string): Promise<{ items: any[]; sha: string | null }> {
  const sha = await getFileSha(path);
  if (!sha) return { items: [], sha: null };

  const res = await fetch(
    `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
    { headers: githubHeaders() }
  );
  const data = await res.json();
  const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
  return { items: JSON.parse(decoded), sha: data.sha };
}

async function writeJsonFile(path: string, items: any[], sha: string | null, message: string) {
  const body: any = {
    message,
    content: Buffer.from(JSON.stringify(items, null, 2)).toString('base64'),
    branch: GITHUB_BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: githubHeaders(),
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub PUT failed: ${res.status} ${err}`);
  }
}

// PUT /api/content — body: { secret, category, index, fields }
// Replaces the entry at `index` with the new `fields`
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { secret, category, index, fields } = body;

    if (secret !== process.env.UPLOAD_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!category || index === undefined || !fields) {
      return NextResponse.json({ error: 'Missing category, index, or fields' }, { status: 400 });
    }

    const dataPath = `data/${category}.json`;
    const { items, sha } = await getJsonWithSha(dataPath);

    if (index < 0 || index >= items.length) {
      return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
    }

    // Convert comma-separated text fields into proper arrays, same as create
    const arrayFields = ['skills', 'tech', 'categories'];
    for (const key of arrayFields) {
      if (typeof fields[key] === 'string') {
        fields[key] = fields[key]
          .split(',')
          .map((item: string) => item.trim())
          .filter((item: string) => item.length > 0);
      }
    }

    // Preserve existing fields, merge in the edits
    items[index] = { ...items[index], ...fields };

    await writeJsonFile(dataPath, items, sha, `Update ${category} entry via mobile app`);

    return NextResponse.json({ success: true, entry: items[index] });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

// DELETE /api/content — body: { secret, category, index }
// Removes the entry at `index`
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { secret, category, index } = body;

    if (secret !== process.env.UPLOAD_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!category || index === undefined) {
      return NextResponse.json({ error: 'Missing category or index' }, { status: 400 });
    }

    const dataPath = `data/${category}.json`;
    const { items, sha } = await getJsonWithSha(dataPath);

    if (index < 0 || index >= items.length) {
      return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
    }

    items.splice(index, 1);

    await writeJsonFile(dataPath, items, sha, `Delete ${category} entry via mobile app`);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}