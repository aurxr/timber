import { Leads } from "./leads.types";

export interface MailingContacts {
organization_name: string;
mailing_address:string;
physical_address:string;
mailing_city:string;
mailing_state: string;
zip: string;
}

export interface DNMContacts {
organization: string;
personOfContact:string;
number:string;
email:string;
}

export interface importReturn{
mailingContacts: MailingContacts[];
DNMContacts: DNMContacts[];
}

export interface compareReturn {
newLeads: Leads[];
oldLeads: Leads[] | null;
}