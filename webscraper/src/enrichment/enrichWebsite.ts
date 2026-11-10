import { Leads } from "../types/leads.types";
import { PipedriveLead } from "../types/pipedrive.types";
import { openAIConnect } from "./openAIConnect";
import { playwright } from "./playwright";

export function enrichWebsite(website: string, lead: PipedriveLead): Promise<Leads>;
export function enrichWebsite(website: string, lead?:null, prompt?: string | null): Promise<Leads[]>;


export async function enrichWebsite(website: string, lead?: PipedriveLead | null, prompt?: string | null): Promise<Leads | Leads[]> {
    if (typeof website !== "string" || website.trim() === "" || website.length <= 4) {
        throw new Error('A website is required');
    }

    let ret;

    if (lead && prompt) {
        const data = await playwright(website, lead);
        ret = await openAIConnect(data, prompt);
    }
    else if (!lead && prompt) {
        const data = await playwright(website);
        ret =  await openAIConnect(data, prompt);
    }
    else {
        const data = await playwright(website);
        ret = await openAIConnect(data);
    }
    return ret;
}
