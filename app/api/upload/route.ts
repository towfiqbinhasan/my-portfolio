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

// Check if a file already exists on GitHub, return its sha (version id) if so
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

// Create or update a file on GitHub using the Contents API
async function putFile(path: string, base64Content: string, message: string) {
  const existingSha = await getFileSha(path);
  const body: any = {
    message,
    content: base64Content,
    branch: GITHUB_BRANCH,
  };
  if (existingSha) body.sha = existingSha;

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
    throw new Error(`GitHub PUT failed (${path}): ${res.status} ${err}`);
  }
  return res.json();
}

// Read an existing JSON array file and append a new entry to it
async function appendToJsonFile(path: string, newEntry: any) {
  let existing: any[] = [];
  const sha = await getFileSha(path);

  if (sha) {
    const res = await fetch(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
      { headers: githubHeaders() }
    );
    const data = await res.json();
    const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
    existing = JSON.parse(decoded);
  }

  existing.push(newEntry);
  const updatedBase64 = Buffer.from(JSON.stringify(existing, null, 2)).toString('base64');
  await putFile(path, updatedBase64, `Add new ${path} entry via mobile app`);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { secret, category, fields, files } = body;

    // Security check
    if (secret !== process.env.UPLOAD_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!category || !fields) {
      return NextResponse.json({ error: 'Missing category or fields' }, { status: 400 });
    }

    const entryId = Date.now().toString();
    const finalEntry: any = { id: entryId, ...fields };

    // Upload any images/PDFs to GitHub first, then store their path in finalEntry
    if (files && Array.isArray(files)) {
      for (const file of files) {
        const { fieldKey, fileName, base64 } = file;
        const safeFileName = `${entryId}-${fileName}`.replace(/\s+/g, '-');
        const filePath = `public/uploads/${category}/${safeFileName}`;
        await putFile(filePath, base64, `Upload ${safeFileName} via mobile app`);
        finalEntry[fieldKey] = `/uploads/${category}/${safeFileName}`;
      }
    }

    // Append the entry to the category's JSON data file
    const dataPath = `data/${category}.json`;
    await appendToJsonFile(dataPath, finalEntry);

    return NextResponse.json({ success: true, entry: finalEntry });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}