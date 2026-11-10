import { PipedriveAPIResponse, PipedriveLead } from "../types/pipedrive.types";
import { createPipedriveUrl } from "./createPipedriveURL";

export async function getLead(leadId: string): Promise<PipedriveLead> {
    const url = createPipedriveUrl(`/api/v1/leads/${encodeURIComponent(leadId)}`);

    if (!leadId || leadId.trim() === "") {
        throw new Error("Lead ID is required");
    }
    try {
        const response = await fetch(`${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: Falsy response when getting lead data}`);
        }
        if (response === null) {
            throw new Error(`Error: Response is null when gettign lead data`);
        }

        const body = await response.json() as PipedriveAPIResponse<PipedriveLead>;

        if (!body.success || !body.data) {
            throw new Error('Pipedrive did not return the lead');
        }
        return body.data;

    }
    catch (error) {
        console.log(`Failed to fetch ${leadId}:`, error);
        throw error;
    }
}