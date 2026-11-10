import { PipedriveLead } from "../types/pipedrive.types";

export function getField(lead: PipedriveLead, fieldKey: string): string | null {
    const value = lead[fieldKey];

    if (value === null || value === undefined) {
        return null;
    }
    if (typeof value !== "string") {
        return null;
    }
    const trimmed = (value as string).trim();

    if (trimmed === "") {
        return null;
    }

    const checked = trimmed.toLowerCase();
    if (checked === "unknown" || checked === "unknonw" || checked === "unkwown" || checked === "n/a" || checked ==="na" || checked ==="n.a." || checked ==="n.a") {
        lead[fieldKey]=null;
        return null;
    }
    
    return trimmed;

}