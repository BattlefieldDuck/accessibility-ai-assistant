// Language Detector API
// https://developer.chrome.com/docs/ai/language-detection

export async function detect(input: string) {
    const detector = await window.ai.languageDetector.create();
    const results = await detector.detect(input);

    if (results.length > 0) {
        return results[0].detectedLanguage ?? "en";
    }

    return "en";
}
