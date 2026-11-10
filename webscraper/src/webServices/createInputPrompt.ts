import { createPersonalPrompt, PersonalPrompt } from "../types/prompts.types";
import { getPromptSafety } from "./getPromptSafety";
import { createLiamsPrompt, LiamsPrompt } from "../types/prompts.types";

export async function createInputPrompt(prompt: string, website: string, webBody: string): Promise<PersonalPrompt | LiamsPrompt> {
    const check = await getPromptSafety(prompt);
    let ret!: PersonalPrompt | LiamsPrompt ;

    if (check) {
        ret = createPersonalPrompt({
            prompt: prompt,
            website: website,
            webBody: webBody,
            valid:true
        });
    }
    if (!check)
        ret = createLiamsPrompt({
            website: website,
            webBody: webBody
        });

    return ret;
}