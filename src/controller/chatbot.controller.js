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

// Asking about stock
manager.addDocument('en', 'Do you have [book title] in stock?', 'stock.ask');
manager.addDocument('en', 'Is [book title] available?', 'stock.ask');
manager.addDocument('en', 'Do you have books on [subject]?', 'stock.ask');
manager.addDocument('en', 'How many copies of [book title] do you have?', 'stock.ask');
manager.addAnswer('en', 'stock.ask', 'Let me check that for you. Please hold on a moment.');

// Asking about book recommendations
manager.addDocument('en', 'Can you recommend a good book?', 'recommendation.ask');
manager.addDocument('en', 'What book do you suggest I read?', 'recommendation.ask');
manager.addDocument('en', 'Any good books for [genre/subject]?', 'recommendation.ask');
manager.addAnswer('en', 'recommendation.ask', 'Sure! Could you tell me what genre or type of book you’re looking for?');

// Asking for prices
manager.addDocument('en', 'How much is [book title]?', 'price.ask');
manager.addDocument('en', 'What’s the price of [book title]?', 'price.ask');
manager.addDocument('en', 'How much do I need to pay for [book title]?', 'price.ask');
manager.addAnswer('en', 'price.ask', 'Let me check the price for you. One moment, please.');

// Asking about shipping options
manager.addDocument('en', 'How do you ship books?', 'shipping.ask');
manager.addDocument('en', 'What shipping methods do you offer?', 'shipping.ask');
manager.addDocument('en', 'Can I get express shipping?', 'shipping.ask');
manager.addAnswer('en', 'shipping.ask', 'We offer standard and express shipping options. Would you like more details on them?');

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

// Asking about account creation
manager.addDocument('en', 'How do I create an account?', 'account.create');
manager.addDocument('en', 'I want to sign up for your site', 'account.create');
manager.addDocument('en', 'How can I join your bookstore?', 'account.create');
manager.addAnswer('en', 'account.create', 'You can create an account by clicking on the "Sign Up" button on our homepage. It only takes a minute!');

// Asking about password reset
manager.addDocument('en', 'I forgot my password', 'account.password_reset');
manager.addDocument('en', 'How can I reset my password?', 'account.password_reset');
manager.addDocument('en', 'I need to recover my password', 'account.password_reset');
manager.addAnswer('en', 'account.password_reset', 'Don’t worry! You can reset your password by clicking "Forgot Password" on the login page. We’ll send you a link to reset it.');

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
