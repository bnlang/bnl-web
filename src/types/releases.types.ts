import { SupportedLocale } from "./locale.types";

export type ApiFile = {
    name: string;
    type: "binary" | "installer" | string;
    platform: "linux" | "macos" | "windows" | string;
    arch?: "x64" | "x86" | "arm64" | string;
    sizeBytes?: number;
    sizeLabel?: string;
    sha256?: string;
    contentType?: string;
};

export type ApiRelease = {
    version: string;
    date: string;
    status?: string;
    channel?: string;
    noteEnglish?: string;
    noteBangla?: string;
    files: ApiFile[];
};

export type ApiResponse = {
    baseUrl: string;
    latest: string;
    releases: ApiRelease[];
};

export type Props = { locale: SupportedLocale };