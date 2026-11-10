function requireEnvironmentVariable(name: string): string {
  const value = process.env[name];

  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${name}`,
    );
  }

  return value.trim();
}

function optionalEnvironmentVariable(name:string): string {
  return process.env[name]?.trim()?? "";
}

function readPort(): number {
  const value = process.env.PORT ?? "3000";
  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive integer");
  }

  return port;
}

export const env = {
  port: readPort(),
  host: process.env.HOST ?? "0.0.0.0",

  openAIApiKey:
    requireEnvironmentVariable("OPENAI_API_KEY"),

  openAIModel:
    process.env.OPENAI_MODEL ?? "gpt-5.4-mini",

  renderedSiteKey:
    process.env.RENDERED_SITE_KEY ??
    "https://timbersync-webscraper.onrender.com/",

  pipedriveBaseUrl:
    process.env.PIPEDRIVE_BASE_URL ??
    "https://api.pipedrive.com",

  pipedriveApiToken:
    optionalEnvironmentVariable(
      "PIPEDRIVE_API_TOKEN",
    ),

  pipedriveBusinessNameFieldKey:
    optionalEnvironmentVariable(
      "PIPEDRIVE_BUSINESS_NAME_FIELD_KEY",
    ),

  pipedriveContactFieldKey:
    optionalEnvironmentVariable(
      "PIPEDRIVE_CONTACT_FIELD_KEY",
    ),

    pipedrivePhoneFieldKey:
    optionalEnvironmentVariable(
      "PIPEDRIVE_PHONE_FIELD_KEY",
    ),

    pipedriveEmailFieldKey:
    optionalEnvironmentVariable(
      "PIPEDRIVE_EMAIL_FIELD_KEY",
    ),

  pipedriveAddressFieldKey:
    optionalEnvironmentVariable(
      "PIPEDRIVE_ADDRESS_FIELD_KEY",
    ),
  
  pipedriveServicesFieldKey:
    optionalEnvironmentVariable(
      "PIPEDRIVE_SERVICES_FIELD_KEY",
    ),

  pipedriveSizeFieldKey:
    optionalEnvironmentVariable(
      "PIPEDRIVE_SIZE_FIELD_KEY",
    ),

  pipedriveLandownerFieldKey:
    optionalEnvironmentVariable(
      "PIPEDRIVE_LANDOWNER_FIELD_KEY",
    ),

  pipedriveForestryFieldKey:
    optionalEnvironmentVariable(
      "PIPEDRIVE_FORESTRY_FIELD_KEY",
    ),

  pipedriveTimberFieldKey:
    optionalEnvironmentVariable(
      "PIPEDRIVE_TIMBER_FIELD_KEY",
    ),
  
  pipedriveWebsiteFieldKey:
    optionalEnvironmentVariable(
      "PIPEDRIVE_WEBSITE_FIELD_KEY",
    ),
  
  pipedriveLastEnrichedWebsiteFieldKey:
    optionalEnvironmentVariable(
      "PIPEDRIVE_LAST_ENRICHED_WEBSITE_FIELD_KEY",
    ),

  pipedriveStatusFieldKey:
    optionalEnvironmentVariable(
      "PIPEDRIVE_STATUS_FIELD_KEY",
    ),

  pipedriveErrorFieldKey:
    optionalEnvironmentVariable(
      "PIPEDRIVE_ERROR_FIELD_KEY",
    ),

  pipedriveWebhookSecret:
    optionalEnvironmentVariable(
      "PIPEDRIVE_WEBHOOK_SECRET",
    ),
};

export const pipedriveConfigured = [
  env.pipedriveApiToken,
  env.pipedriveAddressFieldKey,
  env.pipedriveBaseUrl,
  env.pipedriveBusinessNameFieldKey,
  env.pipedriveContactFieldKey,
  env.pipedriveEmailFieldKey,
  env.pipedriveErrorFieldKey,
  env.pipedriveForestryFieldKey,
  env.pipedriveForestryFieldKey,
  env.pipedriveLandownerFieldKey,
  env.pipedriveLastEnrichedWebsiteFieldKey,
  env.pipedrivePhoneFieldKey,
  env.pipedriveServicesFieldKey,
  env.pipedriveSizeFieldKey,
  env.pipedriveStatusFieldKey,
  env.pipedriveTimberFieldKey,
  env.pipedriveWebhookSecret,
  env.pipedriveWebsiteFieldKey
].every(Boolean);