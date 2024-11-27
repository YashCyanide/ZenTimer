const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // System action handler
    systemAction: (action) => ipcRenderer.invoke('system-action', action),

    // Random quote generator
    getRandomQuote: () => {
        const quotes = [
            "The future depends on what you do today. - Mahatma Gandhi",
            "Believe you can and you're halfway there. - Theodore Roosevelt",
            "Success is not final, failure is not fatal. - Winston Churchill",
            "Your time is limited, don't waste it. - Steve Jobs",
            "The only way to do great work is to love what you do. - Steve Jobs"
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
    }
});