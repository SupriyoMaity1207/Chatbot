const messageContent = document.getElementById("message-content");
const messageInput = document.getElementById("msg");

const toggleButton = document.getElementById('toggle-recognition');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
if (!SpeechRecognition) {
    console.error("SpeechRecognition is not supported in this browser.");
    toggleButton.disabled = true;
}

let isFirstInteraction = true; // Flag to track chat state
let isSpeaking = false; // Flag to track if speech synthesis is currently speaking
const synth = window.speechSynthesis;

// Function to display the "Hello" message
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

// Initial display (optional)
if (isFirstInteraction) {
    showWelcomeMessage();
}

// Event listener for microphone icon click
document.getElementById('microphone').addEventListener('click', () => {
    recognition.start();
});

// Event listener for speech recognition result
recognition.onresult = (event) => {
    const data = event.results[0][0].transcript;
    console.log(data)
    messageInput.value = data;
};

// Form submission handling
document.querySelector('form').addEventListener("submit", async function (event) {
    event.preventDefault();

    // Clear message content (including welcome message)
    if (isFirstInteraction) {
        messageContent.innerHTML = "";
        isFirstInteraction = false;
    }

    // Get the value from the input field
    let message = messageInput.value;

    // Get the div containing messages
    let chatMessages = document.getElementById('message-content');

    // Show the user's message
    let userContainer = document.createElement('div'); // Container for user message and image
    let userMessage = document.createElement('span');
    let userImage = document.createElement('img');

    userImage.src = "/static/images/user.png";
    userMessage.innerHTML = message;

    userContainer.className = 'message-container right-container'; // Add container class
    userMessage.className = 'message right-message';
    userImage.className = 'image right-image';

    userContainer.appendChild(userMessage); // Append message to container
    userContainer.appendChild(userImage); // Append image to container

    chatMessages.appendChild(userContainer); // Append container to message content

    scrollToBottom();

    // Clear the input field
    messageInput.value = "";

    // Send the data to the server (replace with your actual server interaction logic)
    try {
        // Simulate server response (replace with actual fetch call)
        let response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Set content type to JSON
            },
            body: JSON.stringify({ sendQuery: message })
        });

        console.log(response);
        const data = await response.json();
        console.log(data);

        // Show the server's response
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
    } catch (error) {
        console.error("Error sending message:", error);
    }
});
window.addEventListener('beforeunload', () => {
    synth.cancel();
});
// Auto scroll to bottom
function scrollToBottom() {
    let chatMessages = document.getElementById('message-content');
    chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: "smooth"
    });
}
