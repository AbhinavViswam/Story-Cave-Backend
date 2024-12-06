const { NlpManager } = require('node-nlp');

// Initialize NLP manager
const manager = new NlpManager({ languages: ['en'] });

// Train the chatbot with some sample intents
async function trainBot() {
    // Greetings
manager.addDocument('en', 'Hello', 'greetings.hello');
manager.addDocument('en', 'Hi', 'greetings.hello');
manager.addDocument('en', 'Hey there', 'greetings.hello');
manager.addDocument('en', 'Good morning', 'greetings.hello');
manager.addDocument('en', 'Good evening', 'greetings.hello');
manager.addAnswer('en', 'greetings.hello', 'Hi! How can I assist you today?');

// Asking about order status
manager.addDocument('en', 'Where is my order?', 'order.status');
manager.addDocument('en', 'Can I track my order?', 'order.status');
manager.addDocument('en', 'When will my order arrive?', 'order.status');
manager.addAnswer('en', 'order.status', 'Please provide your order number, and I can assist you with tracking your order status.');

// Asking about book availability in other formats (e.g., eBooks, audiobooks)
manager.addDocument('en', 'Is [book title] available as an eBook?', 'format.ask');
manager.addDocument('en', 'Do you have audiobooks?', 'format.ask');
manager.addDocument('en', 'Can I get [book title] in audio format?', 'format.ask');
manager.addAnswer('en', 'format.ask', 'We have a wide range of eBooks and audiobooks. Let me check if [book title] is available in your preferred format.');

// Asking about book genres or categories
manager.addDocument('en', 'What genres do you have?', 'genre.ask');
manager.addDocument('en', 'Can you show me books in the [genre] category?', 'genre.ask');
manager.addDocument('en', 'What books are available in [genre]?', 'genre.ask');
manager.addAnswer('en', 'genre.ask', 'We have books in many genres, such as fiction, non-fiction, mystery, fantasy, and more. Which genre are you interested in?');

// Asking about the return policy
manager.addDocument('en', 'What is your return policy?', 'returns.policy');
manager.addDocument('en', 'Can I return a book?', 'returns.policy');
manager.addDocument('en', 'How do I return a book?', 'returns.policy');
manager.addAnswer('en', 'returns.policy', 'You can return books within 30 days of purchase. Please visit our returns page for more information and instructions.');

    await manager.train();
    manager.save();
}

// Call the chatbot model and process user message
async function chatBotResponse(message) {
    const response = await manager.process('en', message);
    return response.answer || "I didn't understand that. Can you try again?";
}

// Train the bot when the server starts
trainBot();

module.exports = { chatBotResponse };
