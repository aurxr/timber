import { env } from "../config/env";
import { PipedriveLeadUpdate } from "../types/pipedrive.types";
import { updateLead } from "./updateLead";

export async function status(leadId: string, status: string, errorMessage?: string | null): Promise<void> {
    const update: PipedriveLeadUpdate = { [env.pipedriveStatusFieldKey]: status };

    if (errorMessage !== undefined) {
        update[env.pipedriveErrorFieldKey] = errorMessage;
    }
    if (status === 'Processing' || status === 'Complete') {
        update[env.pipedriveErrorFieldKey] = null;
    }
    await updateLead(leadId, update);
}