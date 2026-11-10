export type Leads={
    businessName:string
    personOfContact:string
    number:string
    email:string
    mailingAddress:string
    city:string
    state:string
    zip:string
    services:string
    size:string
    landowner:string
    forestry:string
    timberAccess:string
    businessWebsite:string
}

export type LeadReturn={
    website: string,
    webBody: string,
}

export type UploadReponses = {
    success:boolean;
    message:string;
    leads:Leads[];
}