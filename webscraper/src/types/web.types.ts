import { KnownLeadInfo, LeadEnrichRes } from "./enrichment.types";

export interface UploadReq {
    websites: [];
}

export interface WebsiteInput {
    website:string;
    knowInfo?:KnownLeadInfo;
}

export type webUploadStatus =
|"pending"
|"processing"
|"complete"
|"failed"

export interface WebsiteRes {
    inputWebsite:string;
    status:webUploadStatus;
    enrichment: LeadEnrichRes[] | null;
    error: string | null
}

export type webJobStatus = 
|"queued"
|"processing"
|"complete"
|"complete_w_errors"
|"failed"

export interface BulkJob {
    jobId:string;
    status: webJobStatus;
    failed:number;
    results: WebsiteRes;
}

export interface WebJobCreated {
    jobId:string;
    status:"queued";
}