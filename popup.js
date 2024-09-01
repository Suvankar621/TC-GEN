document.addEventListener('DOMContentLoaded', function() {
    const stepsContainer = document.getElementById('steps-container');
    const downloadButton = document.getElementById('download-btn');

    chrome.storage.local.get(['steps'], function(result) {
        const steps = result.steps || [];
        stepsContainer.innerHTML = ''; // Clear existing content

        steps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'step';

            const stepTitle = document.createElement('div');
            stepTitle.className = 'step-title';
            stepTitle.textContent = `Step ${index + 1}: ${step.eventName}`;

            const stepContent = document.createElement('div');
            stepContent.className = 'step-content';
            stepContent.innerHTML = `
                <strong>XPath:</strong> ${step.xpath}<br>
                <strong>Element:</strong> ${step.element}
                 <strong>Html Tag Name:</strong> ${step.htmltag}
                <strong>Value:</strong> ${step.value}
            `;

            stepDiv.appendChild(stepTitle);
            stepDiv.appendChild(stepContent);

            stepsContainer.appendChild(stepDiv);
        });
    });

    downloadButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({ type: 'DOWNLOAD' });
    });
});

// document.getElementById('clearStorage').addEventListener('click', function() {
//     // Clear the steps from chrome.storage.local
//     chrome.storage.local.remove('steps', function() {
//         if (chrome.runtime.lastError) {
//             console.error(chrome.runtime.lastError);
//         } else {
//             console.log('Steps cleared from storage.');
//             // Clear the steps from the UI
//             const stepsContainer = document.getElementById('steps-container');
//             stepsContainer.innerHTML = '';
//         }
//     });
// });

document.getElementById('clearStorage').addEventListener('click', function() {
    chrome.runtime.sendMessage({ type: 'CLEAR_STORAGE' }, function(response) {
        console.log(response.status); // Should log "cleared"
        const stepsContainer = document.getElementById('steps-container');
            stepsContainer.innerHTML = '';
    });
});


document.getElementById('startRecording').addEventListener('click', function() {
   
        // Now start the recording
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.storage.local.set({ recording: true }, function() {
                chrome.tabs.sendMessage(tabs[0].id, { command: 'START_RECORDING' });
            });
        });
        window.location.reload();
   
});

document.getElementById('stopRecording').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.storage.local.set({ recording: false }, function() {
            chrome.tabs.sendMessage(tabs[0].id, { command: 'STOP_RECORDING' });
        });
    });
    window.location.reload();
 
});

function updateButtonStyles(recording) {
  
    if (recording) {
       
        document.getElementById('startRecording').style.backgroundColor = "green ";
        document.getElementById('startRecording').style.color = "white";
        document.getElementById('stopRecording').style.backgroundColor = "white";
    } else {
        document.getElementById('stopRecording').style.backgroundColor = "red";
        document.getElementById('stopRecording').style.color = "white";
        document.getElementById('startRecording').style.backgroundColor = "white";
    }
}

// Retrieve recording state from storage and update button styles
chrome.storage.local.get('recording', function(result) {
    // Use default value false if 'recording' is not set
    const isRecording = result.recording !== undefined ? result.recording : false;
    updateButtonStyles(isRecording);
});
   

document.getElementById('minimize-btn').addEventListener('click', function() {
    // Minimize popup
        window.close()
  });
  