import { env } from "../config/env";
import { Leads } from "../types/leads.types";
import { PipedriveLeadUpdate } from "../types/pipedrive.types";

export function buildPipedriveLeadUpdate(extractedLead: Leads,normalizedWebsite: string): PipedriveLeadUpdate {
  const update: PipedriveLeadUpdate = {};

  if (
    isUsefulValue(
      extractedLead.businessName,
    )
  ) {
    update[
      env.pipedriveBusinessNameFieldKey
    ] = extractedLead.businessName;
  }

  if (
    isUsefulValue(
      extractedLead.personOfContact,
    )
  ) {
    update[
      env.pipedriveContactFieldKey
    ] = extractedLead.personOfContact;
  }

  if (
    isUsefulValue(extractedLead.number)
  ) {
    update[
      env.pipedrivePhoneFieldKey
    ] = extractedLead.number;
  }

  if (
    isUsefulValue(extractedLead.email)
  ) {
    update[
      env.pipedriveEmailFieldKey
    ] = extractedLead.email;
  }

  const address = buildAddress(
    extractedLead,
  );

  if (address) {
    update[
      env.pipedriveAddressFieldKey
    ] = address;
  }

  if (
    isUsefulValue(extractedLead.services)
  ) {
    update[
      env.pipedriveServicesFieldKey
    ] = extractedLead.services;
  }

  if (
    isUsefulValue(extractedLead.size)
  ) {
    update[
      env.pipedriveSizeFieldKey
    ] = extractedLead.size;
  }

  if (
    isUsefulValue(extractedLead.landowner)
  ) {
    update[
      env.pipedriveLandownerFieldKey
    ] = extractedLead.landowner;
  }

  if (
    isUsefulValue(extractedLead.forestry)
  ) {
    update[
      env.pipedriveForestryFieldKey
    ] = extractedLead.forestry;
  }

  if (
    isUsefulValue(extractedLead.timberAccess)
  ) {
    update[
      env.pipedriveTimberFieldKey
    ] = extractedLead.timberAccess;
  }

  update[
    env.pipedriveLastEnrichedWebsiteFieldKey
  ] = normalizedWebsite;

  update[
    env.pipedriveStatusFieldKey
  ] = "Complete";

  update[
    env.pipedriveErrorFieldKey
  ] = null;

  return update;
}

function isUsefulValue(value: string | null | undefined): value is string {
  return (
    typeof value == "string" &&
    value.trim() !== "" &&
    value.trim() !== "-" &&
    value !== "unknown" && 
    value !== "Unknown" && 
    value !== "N.A." &&
    value !== "N/A" &&
    value !== "n/a"
  );
}

export function buildAddress(lead: Leads): string | null {
  const parts = [
    lead.mailingAddress,
    lead.city,
    lead.state,
    lead.zip].filter(isUsefulValue);

  if (parts.length == 0) {
    return null;
  }

  return parts.join(", ");
}

export function normalizeText(
  value: string | null | undefined,
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (
    trimmedValue === "" ||
    trimmedValue === "-" ||
    trimmedValue.toLowerCase() === "n/a" ||
    trimmedValue.toLowerCase() === "n.a." ||
    trimmedValue.toLowerCase() === "na" ||
    trimmedValue.toLowerCase() === "unknown"  ||
    trimmedValue.toLowerCase() === "unkwown" ||
    trimmedValue.toLowerCase() === "unknow"
  ) {
    return null;
  }

  return trimmedValue;
}