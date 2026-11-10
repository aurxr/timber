import { PersonalPrompt } from "../types/prompts.types";

export async function getPromptSafety(prompt: string | null): Promise<PersonalPrompt | null> {
    if (typeof prompt!== "string" || prompt.trim()==="") {
        return null;
    }
    const clenaedWord = prompt.trim();
    const cleanedWordPrompt = clenaedWord.split(/\s/);
    let personalPrompt: PersonalPrompt | null;

    const banned = await fetch(`/banned.csv`);
    const bannedText = banned.text();
    const bannedWords = (await bannedText).trim().split(/\s+.  /);

    for (const words of cleanedWordPrompt) {
        if (bannedWords.includes(words)) {
            console.warn("Bad word found", words)
            return null;
        }
    }
    personalPrompt= {
        systemPrompt: clenaedWord,
        website: "",
        webBody: "",
        valid: true
    }

    if (personalPrompt===undefined) {
        console.warn("Personal prompt is null")
        personalPrompt=null
    }
    return personalPrompt;

}
