let events = [];

// Listener for messages from content scripts
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === 'EVENT') {
        events.push(message.data);
        chrome.storage.local.set({ steps: events }); // Save to storage
        sendResponse({ status: 'received' }); // Ensure the response is sent back
    } else if (message.type === 'DOWNLOAD') {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "URL, EventName, Name, Value, XPath, Element\n"
            + events.map(e => `${e.url},${e.eventName},${e.htmltag},${e.value}, ${e.xpath}, "${e.element.replace(/"/g, '""')}"`).join("\n") ;

        const encodedUri = encodeURI(csvContent);
        chrome.downloads.download({
            url: encodedUri,
            filename: 'user_actions.csv',
            conflictAction: 'overwrite'
        });
        sendResponse({ status: 'download started' }); // Ensure the response is sent back
    }
    return true; // Keep the message channel open for async response
});

// Listener for clear storage command
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === 'CLEAR_STORAGE') {
        // Clear the events array in memory
        events = [];
        // Clear the steps from chrome.storage.local
        chrome.storage.local.set({ steps: events }, function() {
            console.log('Steps cleared and events array reset.');
            sendResponse({ status: 'cleared' });
        });
    }
    return true;
});

// TEXT
// let events = [];

// // Listener for messages from content scripts
// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   if (message.type === 'EVENT') {
//     events.push(message.data);
//     chrome.storage.local.set({ steps: events }); // Save to storage
//     sendResponse({ status: 'received' }); // Ensure the response is sent back
//   } else if (message.type === 'DOWNLOAD') {
//     // Create the TXT content string
//     const txtContent = events.map(e => `${e.url}\n${e.eventName}\n${e.htmltag}\n${e.value} ${e.xpath}\n${e.element.replace(/"/g, '""')}\n\n`).join('');

//     // Encode the content for safe download
//     const encodedContent = encodeURIComponent(txtContent);

//     // Download options for TXT file
//     const downloadOptions = {
//       url: `data:text/plain;charset=utf-8,${encodedContent}`,
//       filename: 'user_actions.txt',
//       conflictAction: 'overwrite'
//     };

//     chrome.downloads.download(downloadOptions);
//     sendResponse({ status: 'download started' }); // Ensure the response is sent back
//   }
//   return true; // Keep the message channel open for async response
// });

// Excel
// let events = [];

// // Listener for messages from content scripts
// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   if (message.type === 'EVENT') {
//     events.push(message.data);
//     chrome.storage.local.set({ steps: events }); // Save to storage
//     sendResponse({ status: 'received' }); // Ensure the response is sent back
//   } else if (message.type === 'DOWNLOAD') {
//     const xlsxContent = '<table><tr><th>URL</th><th>Event Name</th><th>Name</th><th>Value</th><th>XPath</th><th>Element</th></tr>';
//     events.forEach(e => {
//       xlsxContent += `<tr><td>${e.url}</td><td>${e.eventName}</td><td>${e.htmltag}</td><td>${e.value}</td><td>${e.xpath}</td><td>${e.element.replace(/"/g, '""')}</td></tr>`;
//     });
//     xlsxContent += '</table>';

//     const blob = new Blob([xlsxContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//     const url = URL.createObjectURL(blob);

//     const downloadOptions = {
//       url: url,
//       filename: 'user_actions.xlsx',
//       conflictAction: 'overwrite'
//     };

//     chrome.downloads.download(downloadOptions);

//     URL.revokeObjectURL(url); // Revoke the URL after download

//     sendResponse({ status: 'download started' }); // Ensure the response is sent back
//   }
//   return true; // Keep the message channel open for async response
// });

