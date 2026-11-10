import { OpenAI } from "openai";
import { PlaywrightReturn } from "../types/pipedrive.types";
import { LeadReturn, Leads } from "../types/leads.types";
import { env } from "../config/env";
import { createLiamsPrompt, createPersonalPrompt, createPipedrivePrompt, LiamsPrompt, PersonalPrompt, PipedrivePrompt } from "../types/prompts.types";

export async function openAIConnect(params: PlaywrightReturn | LeadReturn, personalPrompt?: string): Promise<Leads | Leads[]> {
  const client = new OpenAI({
    apiKey: env.openAIApiKey,
    timeout: 300000,
  });
  let option: PipedrivePrompt | LiamsPrompt | PersonalPrompt;

  if ('lead' in params) {
    option = createPipedrivePrompt(params);
  }
  else if (personalPrompt?.trim()) {
    option = createPersonalPrompt({
      prompt: personalPrompt,
      website: params.website,
      webBody: params.webBody,
      valid: true
    });
  }
  else {
    option = createLiamsPrompt(params);
  }


  try {
    const response = await client.chat.completions.create({
      model: env.openAIModel,
      messages: [
        {
          role: 'system',
          content: option.systemPrompt,
        },
        {
          role: 'user',
          content: JSON.stringify({
            website: option.website,
            webBody: option.webBody,
            ...("lead" in option ? { lead: option.lead } : {})
          })
        }
      ],
    });


    const result = response.choices[0]?.message?.content?.trim();
    if (!result) {
      throw new Error('Bad Response - openAI connect response');
    }
    const cleaned = result.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
    if (!cleaned || cleaned === null || cleaned === "") {
      throw new Error('Bad Response - openAI connect cleaned response');
    }
    const parsed = JSON.parse(cleaned);

    return parsed;
  } catch (error) {
    throw new Error(`Failed processing ${params.website}`);
  }

}