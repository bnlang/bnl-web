export type SidebarFlat = {
    href: string;
    label: string;
    depth: number;
    active: boolean;
};

export type SidebarNode = {
    href: string;
    label: string;
    active: boolean;
    children: SidebarNode[];
};

export type Heading = { id: string; text: string; depth: number };