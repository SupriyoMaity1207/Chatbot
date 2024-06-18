const messageContent = document.getElementById("message-content");
// Track the first message
let isFirstInteraction = true;
// Variable to track recognition state
let isRecognizing = false;
// Variable to track the last transcript
let lastTranscript = "";
// Variable to track if speech synthesis is currently speaking
let isSpeaking = false;

// Welcome message for user
function showWelcomeMessage() {
    const welcomeMessage = document.createElement("p");
    const welcomeImage = document.createElement("p");
    const welcomediv = document.createElement("div");

    welcomeMessage.textContent = "Hello! How can I help you today?";
    welcomeImage.textContent = "SM";

    welcomeMessage.className = 'welcomeMessage';
    welcomeImage.className = 'welcomeImage';
    welcomediv.className = 'welcomeDiv';

    welcomediv.appendChild(welcomeImage);
    welcomediv.appendChild(welcomeMessage);
    messageContent.appendChild(welcomediv);
}

if (isFirstInteraction) {
    showWelcomeMessage();
}

// Check for SpeechRecognition API support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    console.error("SpeechRecognition is not supported in this browser.");
    document.getElementById('microphone-btn').disabled = true;
} else {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = true;
    recognition.interimResults = false;
    const synth = window.speechSynthesis;

    // Handle the end of speech recognition
    recognition.onend = () => {
        if (isRecognizing) {
            recognition.start();
        }
    };

    recognition.onresult = async (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript.trim();

            // Check if the transcript is final and different from the last processed transcript
            if (event.results[i].isFinal && transcript !== lastTranscript) {
                lastTranscript = transcript; // Update the last transcript

                console.log(transcript);
                // Where the user message shows
                let chatMessages = document.getElementById('message-content');
                // Container for user message and image
                let userContainer = document.createElement('div');
                let userMessage = document.createElement('span');
                let userImage = document.createElement('img');

                userImage.src = "/static/images/user.png";
                // Add user speech to the container
                userMessage.innerHTML = transcript;
                userContainer.className = 'message-container right-container'; // Add container class
                userMessage.className = 'message right-message';
                userImage.className = 'image right-image';

                userContainer.appendChild(userMessage); // Append message to container
                userContainer.appendChild(userImage); // Append image to container
                chatMessages.appendChild(userContainer); // Append container to message content
                scrollToBottom();

                // Send the message to the server
                try {
                    let response = await fetch('/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json' // Set content type to JSON
                        },
                        body: JSON.stringify({ sendQuery: transcript })
                    });

                    const data = await response.json();

                    // Container for server message and image
                    let serverContainer = document.createElement('div'); // Container for server message and image
                    let serverMessage = document.createElement('p');
                    let serverImage = document.createElement('div');
                    let serverFooter = document.createElement('div');
                    let serverSpeech = document.createElement('span');

                    serverMessage.innerHTML = data.message;
                    serverImage.textContent = 'SM';
                    serverSpeech.innerHTML = '<i class="fa-solid fa-volume-high"></i>';

                    serverContainer.className = 'message-container left-container'; // Add container class
                    serverMessage.className = 'message left-message ';
                    serverImage.className = 'image left-image welcomeDiv';
                    serverFooter.className = 'serverFooter';
                    serverSpeech.className = 'serverSpeech';

                    serverFooter.appendChild(serverSpeech); // Append speech icon to footer
                    serverMessage.appendChild(serverFooter);
                    serverContainer.appendChild(serverImage); // Append image to container
                    serverContainer.appendChild(serverMessage); // Append message to container
                    chatMessages.appendChild(serverContainer); // Append container to message content

                    const utterance1 = new SpeechSynthesisUtterance(data.message);
                    synth.speak(utterance1);

                    // Toggle speech synthesis on/off when the speech icon is clicked
                    serverSpeech.addEventListener("click", () => {
                        if (isSpeaking) {
                            synth.cancel(); // Stop speaking
                            isSpeaking = false;
                        } else {
                            synth.speak(utterance1); // Start speaking
                            isSpeaking = true;
                        }
                    });
                    scrollToBottom();

                    // Clear lastTranscript after processing the response
                    lastTranscript = "";
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };

    // Button for speech recognition
    document.getElementById('microphone-btn').addEventListener('click', async function () {
        const microphoneButton = document.getElementById('microphone-btn');

        if (isFirstInteraction) {
            messageContent.innerHTML = "";
            isFirstInteraction = false;
        }

        if (!isRecognizing) {
            recognition.start();
            microphoneButton.classList.add('active');
            isRecognizing = true; // Set recognition state to true
        } else {
            recognition.stop();
            synth.cancel();
            microphoneButton.classList.remove('active');
            isRecognizing = false; // Set recognition state to false
        }
    });

    // Stop speech synthesis when the page is refreshed or closed
    window.addEventListener('beforeunload', () => {
        synth.cancel();
    });
}

// Auto scroll to bottom
function scrollToBottom() {
    let chatMessages = document.getElementById('message-content');
    chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: "smooth"
    });
}

