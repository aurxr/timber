import { Leads } from "../types/leads.types";
import { compareLeads, rankLeads } from "./compareLeads";
import { importLeads } from "./importLeads";

function csvHelp(value: any): string {
    const escaped = value.replace(/"/g, '""');

    if (/[",\r\n]/.test(value)) {
        return `"${escaped}"`;
    }
    return escaped;

};

export function download(content:string, fileName:string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export async function getData(leads: Leads[]) {
    const ranked = rankLeads(leads);
    const sorted = await seperateLeads(ranked);

    const headers: string[] = ['businessName', 'personOfContact', 'number', 'email', 'mailingAddress', 'city', 'state', 'zip', 'services', 'size', 'landowner', 'forestry work', 'timber access', 'businessWebsite'];
    const leadsTable: string[][] = [];
    const mailingTable: string[][] = [];
    leadsTable.push(headers);
    let leadsContent='';
    let mailingContent='';

    for (const lead of sorted.newLeads) {
        leadsTable.push([
            lead.businessName,
            lead.personOfContact,
            lead.number,
            lead.email,
            lead.mailingAddress,
            lead.city,
            lead.state,
            lead.zip,
            lead.services,
            lead.size,
            lead.landowner,
            lead.forestry,
            lead.timberAccess,
            lead.businessWebsite

        ]);
    }
    leadsContent = leadsTable.map(row => row.map(csvHelp).join(',')).join('\r\n');

    if (sorted.oldLeads !== null && sorted.oldLeads.length!==0) {
        mailingTable.push(headers);
        for (const lead of sorted.oldLeads) {
            mailingTable.push([
                lead.businessName,
                lead.personOfContact,
                lead.number,
                lead.email,
                lead.mailingAddress,
                lead.city,
                lead.state,
                lead.zip,
                lead.services,
                lead.size,
                lead.landowner,
                lead.forestry,
                lead.timberAccess,
                lead.businessWebsite

            ]);
        }
        mailingContent = mailingTable.map(row => row.map(csvHelp).join(',')).join('\r\n');
    }
    return {leadsContent, mailingContent}; 
};

export async function seperateLeads(leads: Leads[]) {
    const allLeads = await importLeads();
    return compareLeads(allLeads, leads);
}
