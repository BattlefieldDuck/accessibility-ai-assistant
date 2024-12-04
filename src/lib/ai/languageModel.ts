// Prompt API in Chrome Extensions
// https://developer.chrome.com/docs/extensions/ai/prompt-api

export const createLanguageModelSession = async (options?: AILanguageModelCreateOptionsWithSystemPrompt | AILanguageModelCreateOptionsWithoutSystemPrompt) => {
    // @ts-ignore
    const languageModel = chrome.aiOriginTrial.languageModel as typeof window.ai.languageModel;

    const capabilities = await languageModel.capabilities();
    if (capabilities.available === "no") {
        throw new Error("AI capabilities not available");
    }

    return await languageModel.create(options);
}
