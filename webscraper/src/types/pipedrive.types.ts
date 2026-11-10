export type PipedriveFieldValue =
    | string
    | number
    | boolean
    | null
    | string[]
    | number[]
    | Record<string, unknown>;

export interface PipedriveLead {
    id: string;
    title?: string | null;

    [fieldKey: string]:
    PipedriveFieldValue
    | undefined;

}


export type PipedriveLeadUpdate = Record<string, PipedriveFieldValue | undefined>;

export interface PipedriveWebhookEvent {
    eventId:string;
    leadId:string;
    entity: "lead";
    action: "create" | "change";
}

export interface PipedriveAPIResponse<T> {
    success: boolean;
    data: T | null;
    error?: string;
    error_info?: string;
}


export type PlaywrightReturn={
    lead: PipedriveLead,
    website: string,
    webBody: string,
}