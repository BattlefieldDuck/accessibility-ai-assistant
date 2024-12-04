// Translator API
// https://developer.chrome.com/docs/ai/translator-api#availability

export async function translate(
    input: string,
    options: AITranslatorCreateOptions,
) {
    const translator = await window.ai.translator.create(options);

    const result = await translator.translate(input);
    translator.destroy();

    return result;
}