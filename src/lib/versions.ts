import fs from "fs";
import path from "path";

export type VersionsManifest = {
  order: string[];
  latest: string;
  deprecated?: string[];
};

let cache: VersionsManifest | null = null;

export function readVersions(): VersionsManifest {
  if (cache) return cache;
  const fp = path.join(process.cwd(), "contents", "docs", "versions.json");
  const raw = fs.readFileSync(fp, "utf8");
  cache = JSON.parse(raw);
  return cache!;
}

export function fallbackChain(fromVersion: string): string[] {
  const { order } = readVersions();
  const start = order.indexOf(fromVersion);
  return start >= 0 ? order.slice(start) : order;
}

export function allVersions(): string[] {
  return readVersions().order;
}

export function latestVersion(): string {
  return readVersions().latest;
}