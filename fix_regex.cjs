const fs = require('fs');
let code = fs.readFileSync('src/components/Chatbot.tsx', 'utf8');

code = code.replace(/\[ADD_SERVICE:s\*\(\.\*\?\)\\\]/, '\\[ADD_SERVICE:\\\\s*(.*?)\\]');
code = code.replace(/\[NAVIGATE:s\*\(\.\*\?\)\\\]/, '\\[NAVIGATE:\\\\s*(.*?)\\]');

fs.writeFileSync('src/components/Chatbot.tsx', code);
