AI Community Notes Summarizer 🚀
![alt text](https://img.shields.io/badge/License-MIT-blue.svg)
An intelligent Google Chrome extension that harnesses the power of Google's Gemini 1.5 Flash API to summarize comment sections on popular social media platforms. It generates a neutral, "Community Note" style summary from the top comments, helping you understand public opinion without the endless scrolling.
This tool is perfect for quickly gauging the sentiment and key discussion points on YouTube, Instagram, and Reddit.
![alt text](https://via.placeholder.com/800x400.png?text=Project+Demo+GIF+Here)
✨ Features
One-Click Summaries: Generate a concise summary of the most relevant comments with a single click.
Multi-Platform Support: Fully functional on YouTube, Instagram, and Reddit.
Powered by Gemini 1.5 Flash: Leverages Google's latest, high-speed AI model to provide context-aware and nuanced summaries.
Intelligent Fallback: If the AI service is unavailable or an API key is missing, it provides a simple list of the top comments so you never get nothing.
Privacy-Focused: The extension runs entirely in your browser. Comments are sent directly to the Google Gemini API and are not stored or tracked.
⚙️ How It Works
The extension's logic is straightforward but powerful:
Platform Detection: The extension identifies when you are on a supported page (a YouTube video, Instagram post, or Reddit thread).
Comment Scraping: Using platform-specific adapters, the extension carefully scrapes the top-rated or most recent comments directly from the page's data.
Prompt Engineering: The collected comments are formatted into a carefully crafted prompt, instructing the Gemini AI to act as a neutral summarizer, mimicking the style of X (Twitter) Community Notes.
API Call: The prompt and comments are sent to the Gemini 1.5 Flash API.
Display Summary: The generated summary is then rendered and displayed in a clean, non-intrusive overlay on the page.
🔧 Tech Stack
Core Logic: JavaScript (ES6+)
Browser Integration: Google Chrome Extension API (Manifest V3)
AI Model: Google Gemini 1.5 Flash API
Platform Adapters: Custom scraping logic for each supported website.
🛠️ Installation and Setup
To use this extension, you need to load it locally in Chrome's Developer Mode.
Step 1: Get Your Google Gemini API Key
Visit Google AI Studio.
Log in and click "Get API key" > "Create API key in new project".
Copy the generated API key. Keep this key private and secure.
Step 2: Configure the Project
Download or Clone: Get the project files onto your computer.
Create config.js:
Find the file named config.js.example in the project's root folder.
Duplicate this file and rename the copy to config.js.
Add Your API Key:
Open the new config.js file.
Paste your Gemini API key as the value for the GEMINI_API_KEY constant.
code
JavaScript
// config.js
const GEMINI_API_KEY = 'PASTE_YOUR_GEMINI_API_KEY_HERE';
Step 3: Load the Extension in Chrome
Open Chrome and go to the extensions page: chrome://extensions.
Turn on the "Developer mode" toggle, usually in the top-right corner.
Click the "Load unpacked" button.
Select the entire project folder from your computer.
The extension is now installed but will not have a toolbar icon until you configure the manifest.json (see below).
🚀 Usage
Navigate to a page with a comment section on YouTube, Instagram, or Reddit.
Find the "Generate Community Note" button injected by the extension (typically located near the top of the comment section).
Click it. The button will show a loading state.
After a few seconds, the AI-generated summary will be displayed.
📂 Project Structure
code
Code
.
├── adapters/
│   ├── instagram.js
│   ├── reddit.js
│   └── youtube.js
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── scripts/
│   ├── main.js
│   └── summarizer.js
├── config.js.example
├── config.js
├── manifest.json
└── README.md
🤝 Contributing
We welcome contributions! If you have ideas for improvements or want to add support for new platforms, please follow these steps:
Fork the repository.
Create a new branch (git checkout -b feature/add-new-platform).
Make your changes and commit them.
Push to the branch (git push origin feature/add-new-platform).
Open a Pull Request.
📄 License
This project is licensed under the MIT License. See the LICENSE file for more details.
