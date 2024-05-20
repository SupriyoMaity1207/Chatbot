const messageContent = document.getElementById("message-content");
const messageInput = document.getElementById("msg");

let isFirstInteraction = true; // Flag to track chat state

// Function to display the "Hello" message
function showWelcomeMessage() {
  const welcomeMessage = document.createElement("p");
  const welcomeImage = document.createElement("img");
  const welcomediv = document.createElement("div");

  welcomeMessage.textContent = "Hello! How can I help you today?";
  welcomeImage.src = "/static/img/logo 1.png";


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

// Form submission handling
document.querySelector('form').addEventListener("submit", async function (event) {
  event.preventDefault();

  // Clear message content (including welcome message)
  if (isFirstInteraction) {
    messageContent.innerHTML = "";
    isFirstInteraction = false;
  }

  // Get the value from the input field
  let message = document.getElementById('msg').value;

  // Get the div containing messages
  let chatMessages = document.getElementById('message-content');

  // Show the user's message
  let userContainer = document.createElement('div'); // Container for user message and image
  let userMessage = document.createElement('span');
  let userImage = document.createElement('img');

  userImage.src = "/static/img/images.png";

  userMessage.innerHTML = message;

  userContainer.className = 'message-container right-container'; // Add container class
  userMessage.className = 'message right-message';
  userImage.className = 'image right-image';


  userContainer.appendChild(userMessage); // Append message to container
  userContainer.appendChild(userImage); // Append image to container

  chatMessages.appendChild(userContainer); // Append container to message content

  scrollToBottom();

  // Clear the input field
  document.getElementById('msg').value = "";

  // Send the data to the server (replace with your actual server interaction logic)
  try {
    // Simulate server response (replace with actual fetch call)
    let response = await fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Set content type to JSON
      },
      body: JSON.stringify({ sendQuery: message })
    })

    console.log(response)
    const data = await response.json();
    console.log(data);


    // Show the server's response
    let serverContainer = document.createElement('div'); // Container for server message and image
    let serverMessage = document.createElement('p');
    let serverImage = document.createElement('img');

    serverMessage.innerHTML = data.message;
    serverImage.src = '/static/img/logo 1.png';

    serverContainer.className = 'message-container left-container'; // Add container class
    serverMessage.className = 'message left-message';
    serverImage.className = 'image left-image';

    serverContainer.appendChild(serverImage); // Append image to container
    serverContainer.appendChild(serverMessage); // Append message to container

    chatMessages.appendChild(serverContainer); // Append container to message content

    scrollToBottom();

  } catch (error) {
    console.error("Error sending message:", error);
  }
});

// Auto scroll to bottom
function scrollToBottom() {
  let chatMessages = document.getElementById('message-content');
  chatMessages.scrollTo({
    top: chatMessages.scrollHeight,
    behavior: "smooth"
  });
}