import { compareReturn, DNMContacts, importReturn, MailingContacts } from "../types/csvs.types";
import { Leads } from "../types/leads.types";

export function rankLeads(leads: Leads[]): Leads[] {
    let sortMap: [number, Leads][]=[];
    let sortLeads: Leads[]=[];
    
    for (const lead of leads) {
        let count = 0;
        for (const [key, value] of Object.entries(lead)) {
            if (value === "-") {
                count += 1;
                (lead as any)[key] = "";
            }
        }
        sortMap.push([count, lead]);
    }
    const sortedEntries = [...sortMap].sort((a, b) => a[0] - b[0]);

    if(!sortedEntries) {
        throw new Error('Failed to properly sort leads');
    }

    for (const [place, info] of sortedEntries) {
        sortLeads.push(info);
    }
    return sortLeads;
}

export function compareLeads(allLeads: importReturn, leads: Leads[]): compareReturn {
    const ranked = rankLeads(leads);
    let ret: compareReturn = {
        newLeads: [],
        oldLeads: null,
    };
    const mailingMap = new Map<string, MailingContacts>();
    const DNMMap = new Map<string, DNMContacts>();
    const leadsMap = new Map<string, Leads>();

    for (const inMailing of allLeads.mailingContacts) {
        mailingMap.set(inMailing.organization_name, inMailing);
    }
    for (const inDNM of allLeads.DNMContacts) {
        DNMMap.set(inDNM.organization, inDNM);
    }
    for (const inLeads of ranked) {
        leadsMap.set(inLeads.businessName, inLeads);
    }

    let newLeads: Leads[] = [];
    let oldLeads: Leads[] = [];

    for (const [org, lead] of leadsMap) {
        const mailingName = mailingMap.get(org);
        const DNMName = DNMMap.get(org);

        if (mailingName?.organization_name === lead?.businessName &&
            (mailingName?.mailing_address === lead.mailingAddress ||
                mailingName?.physical_address === lead.mailingAddress)) {
            oldLeads.push(lead);
        }
        if (DNMName?.organization === lead?.businessName &&
            (DNMName?.number === lead.number ||
                DNMName?.email === lead.email)) {
            continue;
        }
        else {
            newLeads.push(lead);
        }

        ret = {
            newLeads: newLeads,
            oldLeads: oldLeads,
        };
    }
    return ret;
}