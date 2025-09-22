import { SupportedLocale } from "./locale.types";

export type Props = { locale: SupportedLocale };
export type OSKey = "windows" | "linux" | "macos";
export type ArchKey = "x64" | "x86" | "arm64";
export type ArtifactType = "installer" | "binary" | "source";

export type ApiFile = {
    name: string;
    type?: string;
    platform?: string;
    arch?: string;
    sizeBytes?: number;
    sizeLabel?: string;
    sha256?: string;
    contentType?: string;
};

export type ApiScript = {
    name: string;
    platform: string;
    arch?: string;
    sizeBytes?: number;
    sha256?: string;
};

export type ApiRelease = {
    version: string;
    date: string;
    status?: string;
    channel?: string;
    noteEnglish?: string;
    noteBangla?: string;
    noteBanglish?: string;
    files: ApiFile[];
    scripts?: ApiScript[];
};

export type ApiResponse = {
    baseUrl: string;
    latest: string;
    releases: ApiRelease[];
};