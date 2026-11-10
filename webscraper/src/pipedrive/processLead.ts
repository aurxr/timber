import { env } from "../config/env";
import { enrichWebsite } from "../enrichment/enrichWebsite";
import { getLead } from "./getPipedriveLead";
import normalizeWebsite from "../enrichment/normalizeWebsite";
import { updateLead } from "./updateLead";
import { buildPipedriveLeadUpdate } from "./builder";
import { getField } from "./getField";
import { status } from "./statusCheck";


export async function processLead(leadId: string): Promise<void> {
    if (!leadId || leadId.trim() === "") {
        throw new Error('No lead given - processing lead failed');
    }
    try {
        const lead = await getLead(leadId);
        if(!lead || lead==null) {
            console.log('Lead cannot be processed - falsey or null');
            await status(
                leadId,
                "Failed",
                "Lead Id not valid",
            )
            return;
        }
        const statusCheck = getField(lead, env.pipedriveStatusFieldKey);
        const leadWebsite = getField(lead, env.pipedriveWebsiteFieldKey);
        
        if (statusCheck === "Failed" && env.pipedriveLastEnrichedWebsiteFieldKey===leadWebsite) {
            console.log('Passed website was the previous one that failed - skipping');
            return;
        }

        if (!leadWebsite) {
            console.log('Lead has no website - skipping');
            await status(
                leadId,
                "Failed",
                "Lead has no website - skipped",
            )
            return;
        }
        const currWeb = normalizeWebsite(leadWebsite);
        const prev = getField(lead, env.pipedriveLastEnrichedWebsiteFieldKey);
        const prevWeb = prev ? normalizeWebsite(prev) : null;

        if (currWeb === prevWeb) {
            console.log("Current task is the same as the previous");
            return;
        }

        const extractedLead = await enrichWebsite(currWeb, lead);
        if (extractedLead === null || extractedLead === undefined) {
            throw new Error('OpenAI returned no lead information when processing the lead');
        }

        const update = buildPipedriveLeadUpdate(extractedLead, currWeb);
        if(!update || update===null) {
            throw new Error('Pipdrive lead update failed when processing the lead');
        }
        await updateLead(leadId, update);

    }
    catch (error) {
        try {
            await status(
                leadId,
                "Failed",
                error instanceof Error ?
                    error.message
                    : "Lead not processed",
            )

        }
        catch (error) {
            console.log('Could not record failed status',
                error);
        }
        throw error;
    }
}