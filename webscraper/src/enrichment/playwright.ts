import { LeadReturn } from "../types/leads.types";
import { PipedriveLead, PlaywrightReturn } from "../types/pipedrive.types";
import { getDriver } from "./getDriver";
import normalizeWebsite from "./normalizeWebsite";

export async function playwright(url: string, lead?: PipedriveLead): Promise<PlaywrightReturn | LeadReturn> {
    const browser = await getDriver();
    let leadSiteText: PlaywrightReturn = {} as PlaywrightReturn;
    let webText: LeadReturn = {} as LeadReturn;
    let ret: PlaywrightReturn | LeadReturn = {} as PlaywrightReturn | LeadReturn;

    try {
        const website = normalizeWebsite(url);
        const page = await browser.newPage();

        console.log(`Opening (${website}). . .`);
        const checkWeb = await page.goto(website, {
            waitUntil: "domcontentloaded",
            timeout: 30_000
        });
        if (!checkWeb) {
            throw new Error(`No HTTP response from ${website}`)
        }
        if (!checkWeb.ok()) {
            throw new Error(`${website} returned HTTP ${checkWeb.status()}`)
        }

        const webBody = await page.locator('body').innerText({ timeout: 15_000 });

        if (!webBody || webBody.trim() === "") {
            throw new Error("No information can be extracted from the site.");
        }

        if (lead) {
            leadSiteText = {
                lead,
                website,
                webBody
            }
            ret = leadSiteText;
        }
        if (!lead) {
            webText = {
                website,
                webBody
            }
            ret = webText;
        }
    }
    catch (error) {
        throw new Error(`Connection to ${url} failed.`);
    }
    finally {
        await browser.close();
    }
    return ret;
}
