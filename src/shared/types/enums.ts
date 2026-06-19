export const Role = {
    CLIENT: "CLIENT",
    PROVIDER: "PROVIDER",
} as const;

export type Role = (typeof Role)[keyof typeof Role];
