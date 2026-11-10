import { DNMContacts, importReturn, MailingContacts } from "../types/csvs.types";
import { parse } from 'csv-parse/browser/esm/sync';

export async function importLeads(): Promise<importReturn> {
    let mailingImport: MailingContacts[] = [];
    let DNMImport: DNMContacts[] = [];
    let ret: importReturn;


    try {
        const mailingResponse = await fetch(`/mailingList.csv`);
        if(!mailingResponse.ok) {
            console.log("Mailing await - fetch file - isn't working");
        }
        const mailingText = await mailingResponse.text();
        mailingImport = parse<MailingContacts>(mailingText, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
    }
    catch (error) {
        throw new Error('Couldnt load mailing sheet' );
    }

    try {
        const DNMResponse = await fetch(`/doNotMail.csv`);
        if(!DNMResponse.ok) {
            console.log("DNM await - fetch file - isn't working");
        }
        const DNMText = await DNMResponse.text();
        DNMImport = parse<DNMContacts>(DNMText, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        }); 
    }
    catch (error) {
        throw new Error('Couldnt load do not contact sheet;')
    }
    ret = {
        mailingContacts: mailingImport,
        DNMContacts: DNMImport
    };
    return ret;
}