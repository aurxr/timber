export type OptionalText =
string|null;

export interface KnownLeadInfo {
    businessName?:OptionalText;
    personOfContact?:OptionalText;
    number?:OptionalText;
    email?:OptionalText;
    mailingAddress?:OptionalText;
    city?:OptionalText;
    state?:OptionalText;
    zip?:OptionalText;
}

export interface WebsiteEnrichmentReq {
    website:string;
    knownInfo?: KnownLeadInfo;
}

export interface WebsiteScrapeRes {
    reqWebsite: string;
    normWebsite:string;
    pageText:string;
    pageTitle:OptionalText;
}

export interface LeadEnrichRes {
    businessName:OptionalText;
    personOfContact:OptionalText;
    number?:OptionalText;
    email:OptionalText;
    mailingAddress:OptionalText;
    city:OptionalText;
    state:OptionalText;
    zip:OptionalText;
    services:OptionalText;
    size:OptionalText;
    landownder:OptionalText;
    forestry:OptionalText;
    timberAccess:OptionalText;
    businessWeb:OptionalText;
}

export interface LeadExtractReq {
    website:string;
    pageText:string;
    knownInfo?:KnownLeadInfo;
}