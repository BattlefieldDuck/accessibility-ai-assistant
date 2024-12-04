interface Options {
    [key: string]: any;
    accessibility: AccessibilityOptions;
    tts: TtsOptions;
    translator: TranslatorOptions;
    summarizer: AISummarizerOptions;
}

interface AccessibilityOptions {
    screenReaderEnabled: boolean;
    autoTranslateEnabled: boolean;
}

interface TtsOptions {
    voiceName: string;
    rate: number;
    pitch: number;
    volume: number;
}

interface TranslatorOptions {
    targetLanguage: Intl.UnicodeBCP47LocaleIdentifier;
}

interface AISummarizerOptions {
    type: AISummarizerType;
    format: AISummarizerFormat;
    length: AISummarizerLength;
}