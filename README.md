# Notivos AI

## About
Notivos AI is a desktop note-taking application developed using Electron.js. It integrates Google Gemini for AI powered features, such as answering queries, providing inspiration, and summarizing content. The app supports core CRUD functionalities like creating, reading, updating, and deleting notes, along with options for sorting and searching. The built in text-to-speech (TTS) feature enhances accessibility by reading out note content. The application aims to streamline the note-taking process while offering intelligent assistance through an interactive chatbot interface.

Notivos AI was created as a project for the **23CSE113 (User Interface Design)** course.

## Installation
1. Download the `Source Code` or Clone the repository:

   ```bash
   git clone https://github.com/adithya-menon-r/Notivos-AI.git
   cd Notivos-AI
   ```

2. Install dependencies (required packages):

    ```bash
    npm install
    ```

3. Rename the `.env.sample` file to `.env`

4. For the AI integration to work, you will need to get your own Gemini API Key from [Google AI Studio](https://aistudio.google.com/). Once you get your API key, add it to the `.env` file.

5. To start the application, run the following command:

    ```bash
    npm start
    ```

## Project Structure
```
Notivos-AI/
 ├── src/                      
 │    ├── assets/                # Contains static assets like logos and icons
 │    ├── index.html             # Main HTML file for the application
 │    ├── styles.css             # CSS file for styling the application
 │    ├── index.js               # Main JavaScript file for frontend functionality
 │    ├── app.js                 # Electron main process for managing the application window
 │    └── text-to-speech.js      # Implements the Text-to-Speech functionality
 ├── .env                        # Stores the Gemini API Key
 └── server.js                   # Proxy server for secure Gemini API communication     
```

## Core Features
### Note Management
- Notes are stored with a unique `noteId`, generated based on the current time using `Date.now()`, ensuring each note has a distinct identifier. Each note also contains a `title`, `content`, and a `timestamp` in ISO format. These details are saved in `localStorage` for persistence across sessions. The application supports full CRUD operations, allowing users to create, read, update, and delete notes as needed.
- Notes can also be easily searched and sorted for efficient management. By default, they are sorted by the most recent creation or update date, but users can choose other sorting criteria from the available options. The search functionality filters notes based on their title, helping users easily locate content.

### AI Integration (Google Gemini)
- The application integrates Google Gemini to provide AI-powered assistance, including answering questions, summarizing content, and more. Users can access these features through an interactive chatbot interface, which ensures context-aware responses by including the note content with every query. The chatbot also maintains chat history until it is closed, allowing users to continue their conversation seamlessly.
- A proxy server, set up in `server.js`, manages communication with the Gemini API, ensuring a secure and smooth integration.

### Text-to-Speech (TTS) 
- The built-in Text-to-Speech (TTS) feature allows users to listen to their note content, enhancing accessibility and convenience. This functionality is implemented through the `text-to-speech.js` file, which utilizes browser-based TTS APIs to convert text into speech. Users can play, pause, and select their preferred voice from the available options.

## Conclusion
Notivos AI simplifies the note-taking process by combining efficient note management with AI-powered assistance. It features text-to-speech functionality and a user-friendly interface, making it easy to create, organize, and access notes. The AI integration with Gemini helps enhance productivity by offering intelligent features.

## License
This project is licensed under the [MIT LICENSE](LICENSE).

## Developers
- [Adithya Menon R](https://www.linkedin.com/in/adithya-menon-r)
- [Anurup R Krishnan](https://www.linkedin.com/in/anurup-r-krishnan-9877b1289)
- [Siddharth Ladda](https://www.linkedin.com/in/siddharth-ladda)
