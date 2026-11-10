import "dotenv/config";
import express from "express";
import { env, pipedriveConfigured } from "../config/env";
import { pipedriveWHR } from "./pipedriveWH";
import { processLead } from "../pipedrive/processLead";
import { enrichWebsite } from "../enrichment/enrichWebsite";
import path from "node:path";
import { Leads } from "../types/leads.types";

const app = express();

app.use(express.json({
    limit: "1mb"
}));


app.get("/api/health", (_request, response) => {
    response.status(200).json({
        status: "healthy",
        message: "Backend is running",
    });
});

if (pipedriveConfigured) {
    app.use("/webhooks/pipedrive", pipedriveWHR);
}
else {
    app.use("/webhooks/pipedrive", (_request, response) => {
        return response.status(503).json({
            error: "Pipedrive integration is not configured - server webhook routing"
        });
    })
}


app.post("/api/lead", async (request, response) => {
    try {
        if (!pipedriveConfigured) {
            return response.status(503).json({
                error: "Pipedrive integration is not configured - server api lead"
            });
        }

        const req = request.headers.authorization;
        const expected = env.pipedriveWebhookSecret;
        if (req !== expected) {
            return response.status(401).json({
                error: "Unauthorized user"
            });
        }


        const leadId = request.body.leadId;

        if (typeof leadId !== "string" || leadId.trim() === "") {
            return response.status(400).json({
                error: "LeadId must be a non empty string"
            });

        }
        await processLead(leadId.trim());

        response.status(200).json({
            processed: true,
            leadId: leadId.trim()
        });
    }

    catch (error) {
        console.error("Failed to process lead");
        return response.status(500).json({
            error: "Server failed - api lead",
        });
    };
});

app.post("/api/leads", async (request, response) => {
    try {
        const fetchSite = request.headers['sec-fetch-site'];
        if (fetchSite === 'same-origin' || fetchSite === 'same-site') {
            const { websites, prompt } = request.body;
            console.log(`${websites}`);
            console.log(`${prompt}`);

            const leads: Leads[] = [];


            if (!websites) {
                console.error("Failed to process lead");
                return response.status(500).json({
                    error: "Bad requests - server website processing",
                });
            }

            if (!Array.isArray(websites) || websites.length===0) {
                return response.status(400).json({
                    error: "Bad request - 'websites' must be an array of strings",
                });
            }

            for (const website of websites) {
                if (typeof website !== "string" || website.trim() === "") {
                    return response.status(400).json({
                        error: "Every website must be a non-empty string"
                    });
                }
                if (!prompt) {
                    console.log("I've entered the !prompt loop");
                    const websiteLeads = await enrichWebsite(website);
                    leads.push(...websiteLeads);
                }
                else {
                    console.log("I've entered the prompt loop");
                    const websiteLeads = await enrichWebsite(website, null, prompt);
                    leads.push(...websiteLeads);
                }
            }
            response.status(200).json(leads);

        } else {
            console.error("Failed to extract leads");
            return response.status(500).json({
                error: "Bad requests - server not from same origin",
            });
        }
    }

    catch (error) {
        console.error("Failed to create leads");
        response.status(500).json({
            error: `Server failed - api lead`,
        });
        return;
    };
});

const webDist = path.resolve(process.cwd(), "dist-web");
app.use(express.static(webDist));
app.get(/^\/(?!api|webhooks).*/, (_req, res) => {
    res.sendFile(path.join(webDist, "index.html"));
});

app.listen(env.port, env.host, () => {
    console.log(`Backend running at http://${env.host}:${env.port}`);
});

