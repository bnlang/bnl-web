import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import HeadComponent from "@/components/head-component";
import { useT, normalizeLocale } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Copy, Check, TerminalSquare } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SupportedLocale } from "@/types/locale.types";
import {
  ApiFile,
  ApiRelease,
  ApiResponse,
  ArchKey,
  ArtifactType,
  OSKey,
  Props,
} from "@/types/download.types";

const OS_ICONS: Record<OSKey, React.ReactNode> = {
  windows: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path d="M6.555 1.375 0 2.237v5.45h6.555zM0 13.795l6.555.933V8.313H0zm7.278-5.4.026 6.378L16 16V8.395zM16 0 7.33 1.244v6.414H16z" />
    </svg>
  ),
  linux: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className="h-5 w-5"
      viewBox="0 0 16 16"
    >
      <path d="M8.996 4.497c.104-.076.1-.168.186-.158s.022.102-.098.207c-.12.104-.308.243-.46.323-.291.152-.631.336-.993.336s-.647-.167-.853-.33c-.102-.082-.186-.162-.248-.221-.11-.086-.096-.207-.052-.204.075.01.087.109.134.153.064.06.144.137.241.214.195.154.454.304.778.304s.702-.19.932-.32c.13-.073.297-.204.433-.304M7.34 3.781c.055-.02.123-.031.174-.003.011.006.024.021.02.034-.012.038-.074.032-.11.05-.032.017-.057.052-.093.054-.034 0-.086-.012-.09-.046-.007-.044.058-.072.1-.089m.581-.003c.05-.028.119-.018.173.003.041.017.106.045.1.09-.004.033-.057.046-.09.045-.036-.002-.062-.037-.093-.053-.036-.019-.098-.013-.11-.051-.004-.013.008-.028.02-.034" />
      <path
        fill-rule="evenodd"
        d="M8.446.019c2.521.003 2.38 2.66 2.364 4.093-.01.939.509 1.574 1.04 2.244.474.56 1.095 1.38 1.45 2.32.29.765.402 1.613.115 2.465a.8.8 0 0 1 .254.152l.001.002c.207.175.271.447.329.698.058.252.112.488.224.615.344.382.494.667.48.922-.015.254-.203.43-.435.57-.465.28-1.164.491-1.586 1.002-.443.527-.99.83-1.505.871a1.25 1.25 0 0 1-1.256-.716v-.001a1 1 0 0 1-.078-.21c-.67.038-1.252-.165-1.718-.128-.687.038-1.116.204-1.506.206-.151.331-.445.547-.808.63-.5.114-1.126 0-1.743-.324-.577-.306-1.31-.278-1.85-.39-.27-.057-.51-.157-.626-.384-.116-.226-.095-.538.07-.988.051-.16.012-.398-.026-.648a2.5 2.5 0 0 1-.037-.369c0-.133.022-.265.087-.386v-.002c.14-.266.368-.377.577-.451s.397-.125.53-.258c.143-.15.27-.374.443-.56q.036-.037.073-.07c-.081-.538.007-1.105.192-1.662.393-1.18 1.223-2.314 1.811-3.014.502-.713.65-1.287.701-2.016.042-.997-.705-3.974 2.112-4.2q.168-.015.321-.013m2.596 10.866-.03.016c-.223.121-.348.337-.427.656-.08.32-.107.733-.13 1.206v.001c-.023.37-.192.824-.31 1.267s-.176.862-.036 1.128v.002c.226.452.608.636 1.051.601s.947-.304 1.36-.795c.474-.576 1.218-.796 1.638-1.05.21-.126.324-.242.333-.4.009-.157-.097-.403-.425-.767-.17-.192-.217-.462-.274-.71-.056-.247-.122-.468-.26-.585l-.001-.001c-.18-.157-.356-.17-.565-.164q-.069.001-.14.005c-.239.275-.805.612-1.197.508-.359-.09-.562-.508-.587-.918m-7.204.03H3.83c-.189.002-.314.09-.44.225-.149.158-.276.382-.445.56v.002h-.002c-.183.184-.414.239-.61.31-.195.069-.353.143-.46.35v.002c-.085.155-.066.378-.029.624.038.245.096.507.018.746v.002l-.001.002c-.157.427-.155.678-.082.822.074.143.235.22.48.272.493.103 1.26.069 1.906.41.583.305 1.168.404 1.598.305.431-.098.712-.369.75-.867v-.002c.029-.292-.195-.673-.485-1.052-.29-.38-.633-.752-.795-1.09v-.002l-.61-1.11c-.21-.286-.43-.462-.68-.5a1 1 0 0 0-.106-.008M9.584 4.85c-.14.2-.386.37-.695.467-.147.048-.302.17-.495.28a1.3 1.3 0 0 1-.74.19.97.97 0 0 1-.582-.227c-.14-.113-.25-.237-.394-.322a3 3 0 0 1-.192-.126c-.063 1.179-.85 2.658-1.226 3.511a5.4 5.4 0 0 0-.43 1.917c-.68-.906-.184-2.066.081-2.568.297-.55.343-.701.27-.649-.266.436-.685 1.13-.848 1.844-.085.372-.1.749.01 1.097.11.349.345.67.766.931.573.351.963.703 1.193 1.015s.302.584.23.777a.4.4 0 0 1-.212.22.7.7 0 0 1-.307.056l.184.235c.094.124.186.249.266.375 1.179.805 2.567.496 3.568-.218.1-.342.197-.664.212-.903.024-.474.05-.896.136-1.245s.244-.634.53-.791a1 1 0 0 1 .138-.061q.005-.045.013-.087c.082-.546.569-.572 1.18-.303.588.266.81.499.71.814h.13c.122-.398-.133-.69-.822-1.025l-.137-.06a2.35 2.35 0 0 0-.012-1.113c-.188-.79-.704-1.49-1.098-1.838-.072-.003-.065.06.081.203.363.333 1.156 1.532.727 2.644a1.2 1.2 0 0 0-.342-.043c-.164-.907-.543-1.66-.735-2.014-.359-.668-.918-2.036-1.158-2.983M7.72 3.503a1 1 0 0 0-.312.053c-.268.093-.447.286-.559.391-.022.021-.05.04-.119.091s-.172.126-.321.238q-.198.151-.13.38c.046.15.192.325.459.476.166.098.28.23.41.334a1 1 0 0 0 .215.133.9.9 0 0 0 .298.066c.282.017.49-.068.673-.173s.34-.233.518-.29c.365-.115.627-.345.709-.564a.37.37 0 0 0-.01-.309c-.048-.096-.148-.187-.318-.257h-.001c-.354-.151-.507-.162-.705-.29-.321-.207-.587-.28-.807-.279m-.89-1.122h-.025a.4.4 0 0 0-.278.135.76.76 0 0 0-.191.334 1.2 1.2 0 0 0-.051.445v.001c.01.162.041.299.102.436.05.116.109.204.183.274l.089-.065.117-.09-.023-.018a.4.4 0 0 1-.11-.161.7.7 0 0 1-.054-.22v-.01a.7.7 0 0 1 .014-.234.4.4 0 0 1 .08-.179q.056-.069.126-.073h.013a.18.18 0 0 1 .123.05c.045.04.08.09.11.162a.7.7 0 0 1 .054.22v.01a.7.7 0 0 1-.002.17 1.1 1.1 0 0 1 .317-.143 1.3 1.3 0 0 0 .002-.194V3.23a1.2 1.2 0 0 0-.102-.437.8.8 0 0 0-.227-.31.4.4 0 0 0-.268-.102m1.95-.155a.63.63 0 0 0-.394.14.9.9 0 0 0-.287.376 1.2 1.2 0 0 0-.1.51v.015q0 .079.01.152c.114.027.278.074.406.138a1 1 0 0 1-.011-.172.8.8 0 0 1 .058-.278.5.5 0 0 1 .139-.2.26.26 0 0 1 .182-.069.26.26 0 0 1 .178.081c.055.054.094.12.124.21.029.086.042.17.04.27l-.002.012a.8.8 0 0 1-.057.277c-.024.059-.089.106-.122.145.046.016.09.03.146.052a5 5 0 0 1 .248.102 1.2 1.2 0 0 0 .244-.763 1.2 1.2 0 0 0-.11-.495.9.9 0 0 0-.294-.37.64.64 0 0 0-.39-.133z"
      />
    </svg>
  ),
  macos: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className="h-5 w-5"
      viewBox="0 0 16 16"
    >
      <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
      <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
    </svg>
  ),
};

function isOS(x?: string): x is OSKey {
  return x === "windows" || x === "linux" || x === "macos";
}
function isArch(x?: string): x is ArchKey {
  return x === "x64" || x === "x86" || x === "arm64";
}
function isType(x?: string): x is ArtifactType {
  return x === "installer" || x === "binary" || x === "source";
}

function fileKind(f: ApiFile): ArtifactType {
  if (isType(f.type)) return f.type;
  if (!f.platform) return "source";
  return "binary";
}

function formatBytes(n?: number) {
  if (!n || n < 0) return "";
  const u = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < u.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(v < 10 && i > 0 ? 2 : 0)} ${u[i]}`;
}

function Terminal({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-full min-w-0 overflow-hidden rounded-xl border shadow-lg">
      <div className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border-b border-neutral-800">
        <span className="h-3 w-3 rounded-full bg-bd-red" />
        <span className="h-3 w-3 rounded-full bg-yellow-500" />
        <span className="h-3 w-3 rounded-full bg-bd-green" />
        <span className="ml-3 text-xs text-neutral-400 flex items-center gap-1">
          <TerminalSquare className="h-4 w-4" /> bnlang — installer
        </span>
      </div>
      <pre className="w-full max-w-full min-w-0 bg-neutral-950 text-neutral-100 text-xs sm:text-sm md:text-base leading-relaxed p-4 sm:p-5 overflow-x-auto">
        {children}
      </pre>
    </div>
  );
}

function makeInstallCommand(
  os: OSKey,
  arch: ArchKey,
  version: string,
  release: ApiRelease | null
) {
  if (release) {
    if (os === "windows") {
      return `iwr -useb https://cdn.bnlang.dev/scripts/install-${os}-${arch}-${version}.ps1 | iex`;
    } else {
      return `curl -fsSL https://cdn.bnlang.dev/scripts/install-${os}-${arch}-${version}.sh | bash`;
    }
  }
  return "# No installer script or artifact found for this selection.";
}

export default function DownloadPage({ locale }: Props) {
  const t = useT(locale);

  const pageTitle = `${t("download.meta.title")} | Bnlang`;
  const pageDesc = t("download.meta.description");

  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CDN_URL}/releases.json`,
          {
            headers: { Accept: "application/json" },
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as ApiResponse;
        if (!cancelled) setData(json);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Failed to load download data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const versions = useMemo(
    () => (data?.releases ?? []).map((r) => r.version),
    [data]
  );

  const [version, setVersion] = useState<string>("");
  const [artifact, setArtifact] = useState<ArtifactType>("binary");
  const [os, setOS] = useState<OSKey>("windows");
  const [arch, setArch] = useState<ArchKey>("x64");
  const [copied, setCopied] = useState<string>("");

  useEffect(() => {
    if (!data) return;
    const desired =
      (data.latest && versions.includes(data.latest) && data.latest) ||
      versions[0];
    setVersion((prev) => prev || desired || "");
  }, [data, versions]);

  const release = useMemo(
    () => data?.releases.find((r) => r.version === version) || null,
    [data, version]
  );

  const availableTypes = useMemo(() => {
    const set = new Set<ArtifactType>();
    release?.files.forEach((f) => set.add(fileKind(f)));
    return Array.from(set);
  }, [release]);

  useEffect(() => {
    if (!availableTypes.length) return;
    if (!availableTypes.includes(artifact)) {
      const pref: ArtifactType[] = ["installer", "binary", "source"];
      setArtifact(
        pref.find((p) => availableTypes.includes(p)) || availableTypes[0]
      );
    }
  }, [availableTypes]);

  const availableOS = useMemo(() => {
    if (!release) return [] as OSKey[];
    if (artifact === "source") return [];
    const set = new Set<OSKey>();
    release.files
      .filter((f) => fileKind(f) === artifact && isOS(f.platform))
      .forEach((f) => set.add(f.platform as OSKey));
    return Array.from(set);
  }, [release, artifact]);

  useEffect(() => {
    if (artifact === "source") return;
    if (!availableOS.length) return;
    if (!availableOS.includes(os)) setOS(availableOS[0]);
  }, [availableOS, artifact]);

  const availableArches = useMemo(() => {
    if (!release || artifact === "source") return [] as ArchKey[];
    const set = new Set<ArchKey>();
    release.files
      .filter(
        (f) =>
          fileKind(f) === artifact &&
          isOS(f.platform) &&
          f.platform === os &&
          isArch(f.arch)
      )
      .forEach((f) => set.add(f.arch as ArchKey));
    return Array.from(set);
  }, [release, artifact, os]);

  useEffect(() => {
    if (artifact === "source") return;
    if (!availableArches.length) return;
    if (!availableArches.includes(arch)) setArch(availableArches[0]);
  }, [availableArches, artifact]);

  const selectedFile: ApiFile | null = useMemo(() => {
    if (!release) return null;
    const filesForType = release.files.filter((f) => fileKind(f) === artifact);

    if (artifact === "source") {
      return filesForType[0] || null;
    }

    const exact =
      filesForType.find(
        (f) =>
          isOS(f.platform) &&
          f.platform === os &&
          isArch(f.arch) &&
          f.arch === arch
      ) ||
      filesForType.find(
        (f) => isOS(f.platform) && f.platform === os && !f.arch
      ) ||
      null;

    return exact;
  }, [release, artifact, os, arch]);

  const baseUrl = data?.baseUrl ?? "";
  const url = selectedFile ? `${baseUrl}${version}/${selectedFile.name}` : "";
  const filename = selectedFile?.name ?? "";
  const size = selectedFile
    ? selectedFile.sizeLabel || formatBytes(selectedFile.sizeBytes)
    : "";
  const checksum = selectedFile?.sha256 ?? "";

  const copy = async (txt: string, key: string) => {
    try {
      await navigator.clipboard.writeText(txt);
      setCopied(key);
      setTimeout(() => setCopied(""), 1500);
    } catch {}
  };

  const chosenCmd = makeInstallCommand(os, arch, version, release);

  const faqItems =
    t
      .raw<Array<{ q: string; a: string }>>("download.faq.items")
      ?.map((item) => ({ q: item.q, a: item.a.replace("{bin}", "bnl") })) ?? [];

  return (
    <>
      <HeadComponent
        title={pageTitle}
        description={pageDesc}
        locale={locale}
        pathname={`/${locale}/download`}
      />
      <Header locale={locale} />

      <main className="min-h-screen p-6 md:p-10">
        <section className="mx-auto max-w-7xl">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(16,185,129,0.08),transparent_60%),radial-gradient(1200px_600px_at_50%_110%,rgba(239,68,68,0.08),transparent_60%)]" />
          <Badge
            className="mb-3 px-3 py-1 text-[0.8rem] border border-bd-green text-bd-green"
            variant="outline"
          >
            {t("download.hero.badge")}
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight">
            {t("download.hero.title")}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-3xl">
            {t("download.hero.lead")}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 max-w-md">
            {loading ? (
              <>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </>
            ) : err ? (
              <div className="col-span-3 text-sm text-red-500">
                Failed to load platforms. {err}
              </div>
            ) : artifact === "source" ? (
              <div className="col-span-3 text-sm text-muted-foreground">
                {t("download.os.agnostic")}
              </div>
            ) : (
              (availableOS as OSKey[]).map((k) => {
                const active = os === k;
                return (
                  <button
                    key={k}
                    onClick={() => setOS(k)}
                    className={[
                      "flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition",
                      active
                        ? "border-bd-green bg-bd-green/10 text-bd-green"
                        : "border hover:border-bd-green/40 hover:bg-bd-green/5",
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    <span className="opacity-80">{OS_ICONS[k]}</span>
                    {t(`download.os.${k}`)}
                  </button>
                );
              })
            )}
          </div>
        </section>

        <Separator className="my-8 mx-auto max-w-7xl" />

        <section className="mx-auto max-w-7xl grid lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">
              {t("download.selectors.title")}
            </h2>
            <div className="mb-4">
              <label
                htmlFor="sel-version"
                className="block text-sm font-medium mb-2"
              >
                {t("download.selectors.version")}
              </label>
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : err ? (
                <div className="text-sm text-red-500">
                  Failed to load versions. {err}
                </div>
              ) : (
                <select
                  id="sel-version"
                  className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-bd-green"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                >
                  {versions.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="sel-artifact"
                className="block text-sm font-medium mb-2"
              >
                {t("download.selectors.artifact")}
              </label>
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <select
                  id="sel-artifact"
                  className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-bd-green"
                  value={artifact}
                  onChange={(e) => setArtifact(e.target.value as ArtifactType)}
                >
                  {availableTypes.map((ty) => (
                    <option key={ty} value={ty}>
                      {ty === "installer"
                        ? t("download.artifact.installer")
                        : ty === "binary"
                        ? t("download.artifact.binary")
                        : t("download.artifact.source")}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="sel-os"
                className="block text-sm font-medium mb-2"
              >
                {t("download.selectors.os")}
              </label>
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : artifact === "source" ? (
                <input
                  disabled
                  className="w-full rounded-md border bg-muted px-3 py-2 text-muted-foreground"
                  value={t("download.os.agnostic")}
                />
              ) : (
                <select
                  id="sel-os"
                  className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-bd-green"
                  value={os}
                  onChange={(e) => setOS(e.target.value as OSKey)}
                >
                  {(availableOS as OSKey[]).map((k) => (
                    <option key={k} value={k}>
                      {t(`download.os.${k}`)}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="sel-arch"
                className="block text-sm font-medium mb-2"
              >
                {t("download.selectors.arch")}
              </label>
              {loading ? (
                <Skeleton className="h-10 w-full" />
              ) : artifact === "source" || availableArches.length === 0 ? (
                <input
                  disabled
                  className="w-full rounded-md border bg-muted px-3 py-2 text-muted-foreground"
                  value={
                    artifact === "source"
                      ? t("download.arch.na")
                      : t("download.arch.auto")
                  }
                />
              ) : (
                <select
                  id="sel-arch"
                  className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-bd-green"
                  value={arch}
                  onChange={(e) => setArch(e.target.value as ArchKey)}
                >
                  {availableArches.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Button
                asChild
                className="bg-bd-green hover:bg-bd-green/90"
                disabled={loading || !!err || !selectedFile}
              >
                <a href={url || "#"} aria-disabled={!selectedFile}>
                  {selectedFile
                    ? t("download.selectors.downloadCta", { filename })
                    : t("download.selectors.downloadUnavailable")}
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-bd-red text-bd-red"
              >
                <Link href={`/${locale}/releases`}>
                  {t("download.selectors.allReleases")}
                </Link>
              </Button>
            </div>
          </Card>

          <div className="lg:col-span-2 grid gap-6 min-w-0">
            <Card className="p-6 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="text-xl font-semibold">
                  {t("download.terminal.title")}
                </h2>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="border-bd-green text-bd-green"
                    onClick={() => copy(chosenCmd, "cmd")}
                    title={t("download.terminal.copyTooltip")}
                    disabled={loading || !!err || !release}
                  >
                    {copied === "cmd" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {loading ? (
                <Skeleton className="h-40 w-full" />
              ) : !release ? (
                <div className="text-sm text-muted-foreground">
                  {t("download.terminal.unavailable")}
                </div>
              ) : (
                <>
                  <Terminal>{chosenCmd}</Terminal>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {t("download.terminal.tip", { bin: "bnl", path: "PATH" })}
                  </p>
                </>
              )}
            </Card>

            <Card className="p-6 min-w-0">
              <h2 className="text-xl font-semibold mb-4">
                {t("download.details.title")}
              </h2>

              {loading ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-full sm:col-span-2" />
                  <Skeleton className="h-5 w-full sm:col-span-2" />
                </div>
              ) : !selectedFile ? (
                <div className="text-sm text-muted-foreground">
                  {t("download.details.unavailable")}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="min-w-0">
                    <div className="text-sm text-muted-foreground mb-1">
                      {t("download.details.file")}
                    </div>
                    <div className="font-mono text-sm break-all">
                      {filename}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {t("download.details.size")}
                    </div>
                    <div className="font-mono text-sm">{size || "—"}</div>
                  </div>
                  <div className="sm:col-span-2 min-w-0">
                    <div className="text-sm text-muted-foreground mb-1">
                      {t("download.details.url")}
                    </div>
                    <div className="font-mono text-sm break-all overflow-x-auto">
                      {url ? (
                        <a className="text-bd-green underline" href={url}>
                          {url}
                        </a>
                      ) : (
                        "—"
                      )}
                    </div>
                  </div>
                  <div className="sm:col-span-2 min-w-0">
                    <div className="text-sm text-muted-foreground mb-1">
                      {t("download.details.sha")}
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-[11px] sm:text-xs md:text-sm bg-neutral-100 dark:bg-gray-900 px-2 py-1 rounded break-all">
                        {checksum || "—"}
                      </code>
                      {checksum && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="border-bd-green text-bd-green"
                          onClick={() => copy(checksum, "sha")}
                          title={t("download.details.copySha")}
                        >
                          {copied === "sha" ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-7xl mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("download.faq.title")}
            </h2>
            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                {faqItems.map((item, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-foreground">{item.q}</h3>
                    <p className="mt-1">{item.a}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>

        <div className="h-10" />
      </main>

      <Footer locale={locale} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const locales: SupportedLocale[] = ["en", "bn", "banglish"];
  const paths = locales.map((l) => ({ params: { locale: l } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const rawLocale = (params as any)?.locale as string | undefined;
  const normalized = normalizeLocale(rawLocale);
  const locale: SupportedLocale =
    rawLocale === "banglish" ? "banglish" : (normalized as any);
  return { props: { locale } };
};
