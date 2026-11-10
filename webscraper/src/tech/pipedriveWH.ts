import { Router } from "express";
import { env } from "../config/env";
import { processLead } from "../pipedrive/processLead";

export const pipedriveWHR =
  Router();

interface PipedriveWebhookMeta {
  action?: unknown;
  entity?: unknown;
  entity_id?: unknown;
  id?: unknown;
  timestamp?: unknown;
  version?: unknown;
}

interface PipedriveWebhookBody {
  meta?: PipedriveWebhookMeta;
  data?: unknown;
  previous?: unknown;
}


pipedriveWHR.post("/leads", async (request, response) => {
  try {
    const req = request.headers.authorization;
    const expected = env.pipedriveWebhookSecret;
    if (req!==expected) {
      return response.status(401).json({
        error: "Unauthorized user"
      });
    }

    const payload =
      request.body as PipedriveWebhookBody;
    const meta = payload.meta;

    const entity = typeof meta?.entity === "string"
      ? meta.entity
      : null;

    const action = typeof meta?.action === "string"
      ? meta.action
      : null;

    if (
      entity !== "lead" ||
      (action !== "create" && action !== "change")
    ) {
      response.status(200).json({
        received: true,
        ignored: true,
      });
      return;
    }

    const event =
      parsePipedriveWebhook(payload);
      
    processLead(event.leadId)
      .catch((error) => {
        console.error(
          `Failed to process lead ${event.leadId}`,
          error,
        );
      });
  }
  catch (error) {
    response.status(503).json({
      error: "Failed to process request - Pipedrvie WHR"
    });
  }
}
);

interface ParsedLeadWebhook {
  leadId: string;
  eventId: string;
  entity: "lead";
  action: "create" | "change";
}

function parsePipedriveWebhook(payload: PipedriveWebhookBody): ParsedLeadWebhook {
  if (
    !payload ||
    typeof payload !== "object"
  ) {
    throw new Error(
      "Webhook body is missing",
    );
  }

  const meta = payload.meta;

  if (
    !meta ||
    typeof meta !== "object"
  ) {
    throw new Error(
      "Webhook meta data is missing",
    );
  }

  const entity =
    typeof meta.entity === "string"
      ? meta.entity
      : null;

  const action =
    typeof meta.action === "string"
      ? meta.action
      : null;

  const rawLeadId =
    meta.entity_id;

  const rawEventId =
    meta.id;

  const leadId =
    typeof rawLeadId === "string"
      ? rawLeadId
      : typeof rawLeadId === "number"
        ? String(rawLeadId)
        : null;

  const eventId =
    typeof rawEventId === "string"
      ? rawEventId
      : null;

  if (!leadId) {
    throw new Error(
      "Webhook does not contain a lead ID",
    );
  }

  if (!eventId) {
    throw new Error(
      "Webhook does not contain an event ID",
    );
  }

  if (entity !== "lead") {
    throw new Error(
      `Unsupported webhook entity: ${entity}`,
    );
  }

  if (
    action !== "create" &&
    action !== "change"
  ) {
    throw new Error(
      `Unsupported webhook action: ${action}`,
    );
  }

  return {
    leadId,
    eventId,
    entity: "lead",
    action,
  };
}