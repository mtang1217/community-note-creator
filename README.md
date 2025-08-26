# AI Community Notes Summarizer 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

An intelligent Google Chrome extension that harnesses the power of Google's Gemini 1.5 Flash API to summarize comment sections on popular social media platforms. It generates a neutral, "Community Note" style summary from the top comments, helping you understand public opinion without the endless scrolling.

This tool is perfect for quickly gauging the sentiment and key discussion points on YouTube, Instagram, and Reddit.

![Image](https://github.com/user-attachments/assets/c03f588b-459c-42bc-a75c-720f36db347c)

---

## ✨ Features

-   **One-Click Summaries:** Generate a concise summary of the most relevant comments with a single click.
-   **Multi-Platform Support:** Fully functional on **YouTube**, **Instagram**, and **Reddit**.
-   **Powered by Gemini 1.5 Flash:** Leverages Google's latest, high-speed AI model to provide context-aware and nuanced summaries.
-   **Intelligent Fallback:** If the AI service is unavailable or an API key is missing, it provides a simple list of the top comments so you never get nothing.
-   **Privacy-Focused:** The extension runs entirely in your browser. Comments are sent directly to the Google Gemini API and are not stored or tracked.

## ⚙️ How It Works

The extension's logic is straightforward but powerful:

1.  **Platform Detection:** The extension identifies when you are on a supported page (a YouTube video, Instagram post, or Reddit thread).
2.  **Comment Scraping:** Using platform-specific adapters, the extension carefully scrapes the top-rated or most recent comments directly from the page's data.
3.  **Prompt Engineering:** The collected comments are formatted into a carefully crafted prompt, instructing the Gemini AI to act as a neutral summarizer, mimicking the style of X (Twitter) Community Notes.
4.  **API Call:** The prompt and comments are sent to the Gemini 1.5 Flash API.
5.  **Display Summary:** The generated summary is then rendered and displayed in a clean, non-intrusive overlay on the page.

## 🔧 Tech Stack

-   **Core Logic:** JavaScript (ES6+)
-   **Browser Integration:** Google Chrome Extension API (Manifest V3)
-   **AI Model:** Google Gemini 1.5 Flash API
-   **Platform Adapters:** Custom scraping logic for each supported website.

## 🛠️ Installation and Setup

To use this extension, you need to load it locally in Chrome's Developer Mode.

### Step 1: Get Your Google Gemini API Key

1.  Visit [Google AI Studio](https://aistudio.google.com/).
2.  Log in and click **"Get API key"** > **"Create API key in new project"**.
3.  Copy the generated API key. **Keep this key private and secure.**

### Step 2: Configure the Project

1.  **Download or Clone:** Get the project files onto your computer.
2.  **Create `config.js`:**
    -   Find the file named `config.js.example` in the project's root folder.
    -   Duplicate this file and rename the copy to `config.js`.
3.  **Add Your API Key:**
    -   Open the new `config.js` file.
    -   Paste your Gemini API key as the value for the `GEMINI_API_KEY` constant.

    ```javascript
    // config.js
    const GEMINI_API_KEY = 'PASTE_YOUR_GEMINI_API_KEY_HERE';
    ```

### Step 3: Load the Extension in Chrome

1.  Open Chrome and go to the extensions page: `chrome://extensions`.
2.  Turn on the **"Developer mode"** toggle, usually in the top-right corner.
3.  Click the **"Load unpacked"** button.
4.  Select the entire project folder.

The extension icon should now appear in your Chrome toolbar.

## 🚀 Usage

1.  Navigate to a page with a comment section on YouTube, Instagram, or Reddit.
2.  Find the **"Generate Community Note"** button injected by the extension (typically located near the top of the comment section).
3.  Click it. The button will show a loading state.
4.  After a few seconds, the AI-generated summary will be displayed.

## 📂 Project Structure

```
.
├── adapters/
│   ├── instagram.js
│   └── ...
├── icons/
│   └── icon482.png
├── config.js
├── manifest.json
├── background.js
├── util.js
├── content.js
├── summarizer.js
└── README.md
```

## 🤝 Contributing

We welcome contributions! If you have ideas for improvements or want to add support for new platforms, please open a pull request.

## 📄 License

This project is licensed under the MIT License.
