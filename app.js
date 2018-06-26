const { BotFrameworkAdapter, MemoryStorage, ConversationState } = require('botbuilder');
const restify = require('restify');

// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

// Create adapter
const adapter = new BotFrameworkAdapter({ 
    appId: process.env.MICROSOFT_APP_ID, 
    appPassword: process.env.MICROSOFT_APP_PASSWORD 
});

// Add conversation state middleware
const conversationState = new ConversationState(new MemoryStorage());
adapter.use(conversationState);

// Listen for incoming requests 
server.post('/api/messages', (req, res) => {
    // Route received request to adapter for processing
    adapter.processActivity(req, res, async (context) => {
        if (context.activity.type !== 'message') {
            // Handle any non-message activity.
            // await context.sendActivity(`[${context.activity.type} event detected]`);
            switch(context.activity.type){
                // Not all channels send a ConversationUpdate activity.
                // However, both the Emulator and WebChat do.
                case "conversationUpdate":
                // If a user is being added to the conversation, send them an initial greeting.
                if(context.activity.membersAdded[0].name !== 'Bot'){
                    await context.sendActivity("Hello, I'm the Contoso Cafe bot.")
                    await context.sendActivity(`How can I help you? (Type "book a table" to set up a table reservation.)`)
                }
                
            }
        } else {
            // Capture any input text.
            const text = (context.activity.text || '').trim().toLowerCase();

            switch(text){
                case "who are you":
                case "who are you?":
                    // Stub for answering questions.
                    await context.sendActivity("Hi, I'm the Contoso Cafe bot.");
                    break;

                case "book table":
                case "book a table":
                    // Stub for booking a table.
                    await context.sendActivities([
                        { type: 'typing' },
                        { type: 'delay', value: 2000 },
                        { type: 'message', text: 'Your table is booked. Reference number: #K89HG38SZ' }
                    ]);
                    break;

                case "help":
                    // Provide some guidance to the user.
                    await context.sendActivity(`Type "book a table" to make a reservation.`);
                    break;

                default:
                    // Provide a default response for anything we didn't understand.
                    await context.sendActivity("I'm sorry; I do not understand.");
                    await context.sendActivity(`Type "book a table" to make a reservation.`);
                    break;

            }
        }
    });
});