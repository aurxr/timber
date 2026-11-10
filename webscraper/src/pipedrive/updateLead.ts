import { PipedriveLeadUpdate, PipedriveLead } from "../types/pipedrive.types";
import { createPipedriveUrl } from "./createPipedriveURL";

export async function updateLead(leadId: string, fields: PipedriveLeadUpdate): Promise<PipedriveLead> {
    if (leadId === null || leadId === "" || fields === null) {
        throw new Error(`Error: Lead and or feilds are null - update lead failed`);
    }

    const url = createPipedriveUrl(`/api/v1/leads/${encodeURIComponent(leadId)}`);

    try {
        const response = await fetch(`${url}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fields)
        });
        if (!response.ok) {
            throw new Error(`Error: Falsy response when updating lead`);
        }
        if (response === null) {
            throw new Error(`Error: Response is null when updating lead`);
        }
        const data = await response.json();

        if (!data || !data.data) {
            throw new Error(`Error: Returned data was invalid when updating lead`);
        }

        const leadInfo = data.data;
        if(!leadInfo || leadInfo === null || leadInfo==="") {
            throw new Error('Data property storage faield when updating lead');
        }
        return leadInfo;
    }
    catch (error) {
        throw new Error('Failed to update user');
    }
}
