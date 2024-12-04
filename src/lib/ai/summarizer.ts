// Summarizer API
// https://developer.chrome.com/docs/ai/summarizer-api

export async function summarize(input: string, options: AISummarizerOptions) {
    const session = await createSummarizationSession(
        options.type,
        options.format,
        options.length,
    );

    const summary = await session.summarize(input);
    session.destroy();

    return summary;
}

// https://github.com/GoogleChromeLabs/web-ai-demos/blob/main/summarization-api-playground/src/main.ts

/*
 * Creates a summarization session. If the model has already been downloaded, this function will
 * create the session and return it. If the model needs to be downloaded, this function will
 * wait for the download to finish before resolving the promise.
 *
 * If a downloadProgressCallback is provided, the function will add the callback to the session
 * creation.
 *
 * The function expects the model availability to be either `readily` or `after-download`, so the
 * availability must be checked before calling it. If availability is `no`, the function will throw
 * an error.
 */
export const createSummarizationSession = async (
    type: AISummarizerType,
    format: AISummarizerFormat,
    length: AISummarizerLength,
    downloadProgressListener?: (ev: DownloadProgressEvent) => void): Promise<AISummarizer> => {
    let monitor = undefined;
    if (downloadProgressListener) {
        monitor = (m: AICreateMonitor) => {
            m.addEventListener('downloadprogress', downloadProgressListener);
        };
    }

    if (!(await checkSummarizerSupport())) {
        throw new Error('AI Summarization is not supported');
    }

    return window.ai.summarizer.create({ type, format, length, monitor });
}

/*
 * Checks if the device supports the Summarizer API (rather than if the browser supports the API).
 * This method returns `true` when the device is capable of running the Summarizer API and `false`
 * when it is not.
 *
 * Ideally this check would only require the code code section below:
 *
 * ```javascript
 * let capabilites = await window.ai.summarizer.capabilities();
 * if (capabilites.available === 'readily' || capabilites.available === 'after-download') {
 *   return true;
 * }
 * ```
 *
 * However, due to https://crbug.com/379074334, the API may return `no` when
 * `window.ai.summarizer.create()` was never called, so this function implements a workaround for
 * this scenario, ensuring `create()` is called at least once before returning `false`.
 */
const checkSummarizerSupport = async (): Promise<boolean> => {
    // Do a first capabilities check. If 'no' is returned, it might mean the model hasn't been
    // bootstrapped by calling `create()`. In this case, `create()` is called, which should result
    // in an exception being raised. The exception is ignored, but now `capabilities()` should
    // reflect the actual state of the API, with `no` meaning the device is unable to run the API.
    let capabilites = await window.ai.summarizer.capabilities();
    if (capabilites.available === 'readily' || capabilites.available === 'after-download') {
        return true;
    }

    try {
        await window.ai.summarizer.create();
    } catch (e) { }

    capabilites = await window.ai.summarizer.capabilities();
    return capabilites.available !== 'no';
}
