# Accessibility AI Assistant

Designed to enhance internet accessibility for everyone, whether you have visual impairments, difficulty reading, or simply prefer a more user-friendly experience.

This Chrome extension includes a screen reader with an auto-translate feature and an AI Assistant for summarizing and providing prompts about website content.

![Accessibility AI Assistant](https://github.com/user-attachments/assets/cc9e1729-2bc0-403d-b7c1-81c038ed9bc7)


## Functionality

This application is designed with scalability in mind, leveraging several chrome built-in AI APIs to enhance functionality. The APIs used include:

- **Translator API:** Translates user-selected content into the user's preferred language.
- **Language Detector API:** Detects the language of the user-selected content.
- **Summarizer API:** Summarizes the content of the webpage the user is browsing.
- **Prompt API:** Answers user questions based on the webpage content data.

The application is highly versatile and can be used by a diverse audience, including non-native English speakers and individuals with visual impairments. It is designed to be accessible globally, allowing users to browse websites and utilize the screen reader with translation features to see or listen to content in their primary language.

This Chrome extension is suitable for anyone who needs assistance with understanding web content, whether due to language barriers or visual impairments. Users can benefit from the screen reader and translation features to access content in their preferred language, making web browsing more inclusive and accessible.

## Purpose

There are several screen reader extensions available on the Chrome Web Store. Some simply read aloud the text, while others require a GPT token for summarization and translation, which involves internet connectivity, latency, and the cost of the GPT token. However, with Chrome’s built-in AI features, users can utilize this application to perform summarization and translation tasks locally. This approach can significantly reduce latency and eliminate the need for an internet connection, making the application faster and more reliable. Additionally, performing these tasks locally helps to avoid the ongoing costs associated with GPT tokens, providing a cost-effective solution for users. This local processing also enhances user privacy, as sensitive data does not need to be transmitted over the internet. Overall, this approach makes the application more efficient, affordable, and secure, encouraging users to rely on it for their accessibility needs.

## Installation

To create a production version of this app:

```bash
npm run build
```

To experiment with these samples, please clone this repo and use 'Load Unpacked Extension'. Read more on [Development Basics](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).

## Developing

To monitor file changes and automatically build the app, run the following command:

```bash
npm run build:watch
```

## License

`accessibility-ai-assistant` is licensed under the MIT License. See the LICENSE file for more details.
