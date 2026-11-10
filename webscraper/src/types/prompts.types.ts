import { PipedriveLead } from "./pipedrive.types";

export type PipedrivePrompt = {
  systemPrompt: string;
  lead: PipedriveLead;
  website: string;
  webBody: string;
};

export type LiamsPrompt = {
  systemPrompt: string;
  website: string;
  webBody: string;
};

export type PersonalPrompt = {
  systemPrompt: string;
  website: string;
  webBody: string;
  valid: boolean;
}

export const createPipedrivePrompt = (params: { lead: PipedriveLead; website: string; webBody: string }): PipedrivePrompt => ({
  systemPrompt: `Extract more information about the client passed.
Return RAW JSON ONLY.
String businessName: 
String personOfContact: 
String number: 
String email: 
String mailingAddress: 
String city: 
String state: 
String zip: 
String services: 
String size: 
String landowner: 
String forestry: 
String timberAccess: 
String businessWebsite: 
Ensure the 'landowner', 'forestry', and 'timberAccess' fields are strictly formatted as 'Yes' or 'No'.
Summarize services to be no longer than 10 words.
If a specific field is not found in the text, assign it a value of "".
If there are multiple people in the same business with the same number, only include the person of contact passed.
Do NOT list the directory / page name as a lead.
Do NOT included any business or individual who are NOT in the United States.`,
  lead: params.lead,
  website: params.website,
  webBody: params.webBody,
});

export const createLiamsPrompt = (params: { website: string; webBody: string }): LiamsPrompt => ({
  systemPrompt: `Extract EVERY company / member from this text.
Return RAW JSON ONLY.
String businessName: 
String personOfContact: 
String number: 
String email: 
String mailingAddress: 
String city: 
String state: 
String zip: 
String services: 
String size: 
String landowner: 
String forestry: 
String timberAccess: 
String businessWebsite: 
Ensure the 'landowner', 'forestry', and 'timberAccess' fields are strictly formatted as 'Yes' or 'No'.
Summarize services to be no longer than 10 words.
If a specific field is not found in the text, assign it a value of '-'.
If there are multiple people in the same business with the same number, only include on person of contact. 
Do NOT list the directory / page name as a lead.
Do NOT included any business or individual who are NOT in the United States.`,
  website: params.website,
  webBody: params.webBody,
});

export const createPersonalPrompt = (params: {prompt:string, website: string; webBody: string, valid:boolean }): PersonalPrompt => ({
  systemPrompt: `Below are the possible keys a user would want to search for.
Return RAW JSON ONLY.
String businessName: 
String personOfContact: 
String number: 
String email: 
String mailingAddress: 
String city: 
String state: 
String zip: 
String services: 
String size: 
String landowner: 
String forestry: 
String timberAccess: 
String businessWebsite: 
Ensure the 'landowner', 'forestry', and 'timberAccess' fields are strictly formatted as 'Yes' or 'No'.
Summarize services to be no longer than 10 words.
If a specific field is not found in the text, assign it a value of "".
If there are multiple people in the same business with the same number, only include on person of contact. 
Do NOT list the directory / page name as a lead.
Do NOT included any business or individual who are NOT in the United States. 
Categorize what the user is searching for into one of the given fields.
If the field can't be categorized, ignore it. 
The following is the user's specification(s):` + params.prompt,
  website: params.website,
  webBody: params.webBody,
  valid: params.valid,
});
