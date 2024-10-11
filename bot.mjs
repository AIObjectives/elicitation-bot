import OpenAI from "openai";
import readline from "readline";

// Initialize the OpenAI API
const openai = new OpenAI();

// Bot configuration
const bot = {
    topic: "The new Labour government has commissioned an independent National Curriculum Review...",
    aim: "We aim to engage the general public and stakeholders in state education...",
    principles: `
Elicitation bot asks questions to draw out personal stories.
Elicitation bot asks questions to draw out the reasoning behind users’ opinions.
Elicitation bot brings various perspectives to the users' attention, pulled from another bot called 🌩️Wisdom bot that stores current claims.
At the end of the conversation, Elicitation bot summarizes and presents claims the users might make, and asks their consent to bring those claims to the Wisdom bot.`,
    mode1: "ask curious questions to draw out user opinions, their personal stories...",
    mode2: "bring the users the views of others, ask questions whether they could empathize or understand others' views",
    mode3: "encourage users to generate opinions or recommendations that incorporate both their own views and others",
    score1: "user has shared a few opinions, personal stories, and feels heard",
    score2: "user has been presented with other views from the 🌩️Wisdom bot, and showed understanding of the nuances",
    score3: "user has attempted or generated a few more revised opinions that incorporate the views of others",
};

// Initialize an array to store the conversation history
const conversationHistory = [
    {
        role: "system",
        content: `You are an “Elicitation bot”, a chatbot designed to engage in a conversation to draw out user opinions and personal stories related to the following topic: ${bot.topic}. 
    The aim is: ${bot.aim}. The conversation should be engaging and friendly, with the following principles: ${bot.principles}. 
    You will transition between different conversation modes: ${bot.mode1}, ${bot.mode2}, and ${bot.mode3}, as the user shares more insights. 
    Your goal is to achieve these outcomes: ${bot.score1}, ${bot.score2}, and ${bot.score3}. 
    At the end of the conversation, you will summarize the user's opinions and ask for their consent to submit their views to the 🌩️Wisdom bot.
  ` }
];

// Create a readline interface to capture input from the terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to handle user input and keep the conversation going
async function sendMessage(userMessage) {
    // Add the user's message to the conversation history
    conversationHistory.push({ role: "user", content: userMessage });

    // Make the API call with the conversation history
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: conversationHistory,
    });

    // Extract the assistant's response
    const assistantMessage = completion.choices[0].message;

    // Add the assistant's response to the conversation history
    conversationHistory.push({ role: "assistant", content: assistantMessage.content });

    // Output the assistant's response
    console.log(`AI: ${assistantMessage.content}`);

    // Prompt the user for the next input
    promptUser();
}

// Function to prompt the user for input
function promptUser() {
    rl.question("User: ", (input) => {
        sendMessage(input);  // Send the user's message
    });
}

// Start the conversation by prompting the user
console.log("Conversation started. Type your message:");
promptUser();
