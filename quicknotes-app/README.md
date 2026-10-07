# QuickNotes App

QuickNotes is a lightweight, responsive note-taking web application designed to help users efficiently capture, categorize, search, and manage daily personal, work, and study notes directly in the browser.

## Features
- **Categorized Organization:** Sort notes cleanly into Personal, Work, and Study categories with distinct visual indicators.
- **Input Validation:** Real-time validation checks ensuring notes are non-empty and under 200 characters.
- **Local Persistence:** Automatic saving and loading of notes via browser `localStorage`.
- **Live Search Filtering:** Instantly filter notes dynamically as you type search terms.
- **Responsive Card Layout:** Adaptive Flexbox layout optimized for both desktop and mobile viewports.

## How to Run Locally
1. Clone the repository to your local machine:
   ```bash
   git clone [https://github.com/your-username/quicknotes-app.git](https://github.com/your-username/quicknotes-app.git)

Navigate into the project folder:

Bash
cd quicknotes-app
Open index.html in your web browser, or launch it using an extension like Live Server in Visual Studio Code.

## What I Learned
1. DOM Security & Construction: Building user interfaces dynamically using createElement and textContent instead of vulnerable innerHTML insertions.

2. State & Local Storage Management: Managing application data arrays reliably alongside browser storage APIs (JSON.stringify / JSON.parse).

3. Modular CSS Variables & Layouts: Utilizing CSS variables for maintainable theme customization and combining   Flexbox with media queries for seamless mobile responsiveness.