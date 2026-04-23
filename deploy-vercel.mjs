import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const token = process.env.VERCEL_TOKEN;
const projectName = "wheel-strategy-options";
const baseUrl = "https://api.vercel.com";

if (!token) {
  throw new Error("VERCEL_TOKEN is not set.");
}

const envVars = [
  {
    key: "APCA_API_KEY_ID",
    value: "PK4NR6VJPAQEYQO2ZI6HZEVU5N",
    type: "encrypted",
    target: ["production", "preview", "development"],
  },
  {
    key: "APCA_API_SECRET_KEY",
    value: "EbS2W4KsatNseGULPWuzLnqYemef4Eabr8XApKrCZ9JX",
    type: "encrypted",
    target: ["production", "preview", "development"],
  },
  {
    key: "APCA_API_BASE_URL",
    value: "https://paper-api.alpaca.markets/v2",
    type: "plain",
    target: ["production", "preview", "development"],
  },
];

async function vercelFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`Vercel API ${response.status}: ${JSON.stringify(body)}`);
  }

  return body;
}

async function ensureProject() {
  try {
    return await vercelFetch(`${baseUrl}/v9/projects/${projectName}`);
  } catch (issue) {
    const message = issue instanceof Error ? issue.message : "";
    if (!message.includes("404")) {
      throw issue;
    }
  }

  return vercelFetch(`${baseUrl}/v11/projects`, {
    method: "POST",
    body: JSON.stringify({
      name: projectName,
      framework: "nextjs",
      installCommand: "npm install",
      buildCommand: "next build",
      devCommand: "next dev",
      outputDirectory: ".next",
    }),
  });
}

async function ensureEnvVars() {
  return vercelFetch(`${baseUrl}/v10/projects/${projectName}/env?upsert=true`, {
    method: "POST",
    body: JSON.stringify(envVars),
  });
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (
      entry.name === ".git" ||
      entry.name === ".next" ||
      entry.name === "node_modules"
    ) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(root, fullPath).replaceAll(path.sep, "/");

    if (
      relPath === ".env.local" ||
      relPath === "deploy-vercel.mjs" ||
      relPath === "vercel-deploy-result.json"
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

async function buildFilesPayload() {
  const sourceFiles = await walk(root);
  return Promise.all(
    sourceFiles.map(async (fullPath) => {
      const relPath = path.relative(root, fullPath).replaceAll(path.sep, "/");
      const ext = path.extname(relPath).toLowerCase();
      const binary = [".png", ".jpg", ".jpeg", ".webp", ".ico"].includes(ext);
      const data = await readFile(fullPath, binary ? "base64" : "utf8");
      return {
        file: relPath,
        data,
        encoding: binary ? "base64" : "utf-8",
      };
    }),
  );
}

async function createDeployment(files) {
  return vercelFetch(
    `${baseUrl}/v13/deployments?forceNew=1&skipAutoDetectionConfirmation=1`,
    {
      method: "POST",
      body: JSON.stringify({
        name: projectName,
        project: projectName,
        target: "production",
        public: true,
        files,
        projectSettings: {
          framework: "nextjs",
          installCommand: "npm install",
          buildCommand: "next build",
          devCommand: "next dev",
          outputDirectory: ".next",
        },
        meta: {
          purpose: "wheel-strategy-options",
        },
      }),
    },
  );
}

const project = await ensureProject();
await ensureEnvVars();
const files = await buildFilesPayload();
const deployment = await createDeployment(files);

await writeFile(
  path.join(root, "vercel-deploy-result.json"),
  `${JSON.stringify({ project, deployment }, null, 2)}\n`,
);

console.log(
  JSON.stringify(
    {
      projectId: project.id,
      deploymentId: deployment.id,
      readyState: deployment.readyState,
      url: deployment.url,
    },
    null,
    2,
  ),
);
