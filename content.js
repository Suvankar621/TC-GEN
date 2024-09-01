// Function to generate the XPath of a given element
function getXPath(element) {
    try {
        if (element.id !== '') {
            return `//*[@id="${element.id}"]`;
        }
        if (element === document.body) {
            return '/html/body';
        }

        let ix = 0;
        const siblings = element.parentNode.childNodes;

        for (let i = 0; i < siblings.length; i++) {
            const sibling = siblings[i];
            if (sibling === element) {
                return `${getXPath(element.parentNode)}/${element.tagName.toLowerCase()}[${ix + 1}]`;
            }
            if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
                ix++;
            }
        }
    } catch (error) {
        console.error("Error in getXPath:", error);
        return null; // Return null if error occurs
    }
}

// Send event data to the background
function sendEventToBackground(eventName, element, extraData = {}) {
    try {
        const xpath = getXPath(element);
        const eventDetail = {
            eventName: eventName,
            url: window.location.href,
            xpath: xpath,
            element: element.innerText || element.name || element.type,
            htmltag: element.tagName,
            value: element.value,
            ...extraData
        };
        chrome.runtime.sendMessage({ type: 'EVENT', data: eventDetail }, function(response) {
            if (chrome.runtime.lastError) {
                console.error("Error sending message to background script:", chrome.runtime.lastError.message);
            }
        });
    } catch (error) {
        console.error("Error in sendEventToBackground:", error);
    }
}

// Track hover times
let hoverStartTime = null;
let hoveredElement = null;
let isRecording = false;  // State to control recording

// Event listeners
document.addEventListener('click', function(event) {
    try {
        if (isRecording) {
            sendEventToBackground('Click', event.target);
            console.log(event.target);
        }
    } catch (error) {
        console.error("Error in click event listener:", error);
    }
});

document.addEventListener('change', function(event) {
    try {
        if (isRecording) {
            sendEventToBackground('Change', event.target);
            console.log(event.target);
        }
    } catch (error) {
        console.error("Error in change event listener:", error);
    }
});

chrome.storage.local.get('recording', function(result) {
    try {
        if (result.recording) {
            isRecording = true;
        }
    } catch (error) {
        console.error("Error in chrome.storage.local.get:", error);
    }
});

// Handle messages from the popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    try {
        if (message.command === 'START_RECORDING') {
            isRecording = true;
            console.log("Recording started");
        } else if (message.command === 'STOP_RECORDING') {
            isRecording = false;
            console.log("Recording stopped");
        }
    } catch (error) {
        console.error("Error in onMessage listener:", error);
    }
});




// // Function to generate the XPath of a given element
// function getXPath(element) {
//     if (element.id !== '') {
//         return `//*[@id="${element.id}"]`;
//     }
//     if (element === document.body) {
//         return '/html/body';
//     }

//     let ix = 0;
//     const siblings = element.parentNode.childNodes;

//     for (let i = 0; i < siblings.length; i++) {
//         const sibling = siblings[i];
//         if (sibling === element) {
//             return `${getXPath(element.parentNode)}/${element.tagName.toLowerCase()}[${ix + 1}]`;
//         }
//         if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
//             ix++;
//         }
//     }
// }

// // Send event data to the background
// function sendEventToBackground(eventName, element, extraData = {}) {
//     const xpath = getXPath(element);
//     const eventDetail = {
//         eventName: eventName,
//         url:window.location.href,
//         xpath: xpath,
//         element: element.innerText || element.name || element.type ,
//         htmltag:element.tagName,
//         // name: element.name,
//         value: element.value,
//         ...extraData
//     };
//     chrome.runtime.sendMessage({ type: 'EVENT', data: eventDetail }, function(response) {
//         if (chrome.runtime.lastError) {
//             console.error("Error sending message to background script:", chrome.runtime.lastError.message);
//         }
    
//     });
// }

// // Track hover times
// let hoverStartTime = null;
// let hoveredElement = null;
// let isRecording = false;  // State to control recording




// // Event listeners
// document.addEventListener('click', function(event) {
//     if (isRecording) {
//         sendEventToBackground('Click', event.target);
//         console.log(event.target);
//     }
// });

// // document.addEventListener('scroll', function(event) {
// //     if (isRecording) {
// //         sendEventToBackground('Scroll', document.scrollingElement);
// //     }
// // });

// document.addEventListener('change', function(event) {
//     if (isRecording) {
//         sendEventToBackground('Change', event.target);
//         console.log(event.target);
//     }
// });

// // Optional: Uncomment to enable mouseover tracking
// // document.addEventListener('mouseover', function(event) {
// //     if (isRecording) {
// //         hoveredElement = event.target;
// //         hoverStartTime = new Date().getTime();
// //         sendEventToBackground('Mouseover', event.target);
// //     }
// // });

// // document.addEventListener('mousemove', function(event) {
// //     if (isRecording && hoverStartTime !== null && hoveredElement === event.target) {
// //         sendEventToBackground('Mousemove', event.target);
// //     }
// // });

// // document.addEventListener('keypress', function(event) {
// //     if (isRecording) {
// //         sendEventToBackground('Keypress', event.target);
// //     }
// // });

// // document.addEventListener('focus', function(event) {
// //     if (isRecording) {
// //         sendEventToBackground('Focus', event.target);
// //     }
// // }, true);

// // document.addEventListener('blur', function(event) {
// //     if (isRecording) {
// //         if (hoverStartTime !== null && hoveredElement === event.target) {
// //             const hoverEndTime = new Date().getTime();
// //             const hoverDuration = hoverEndTime - hoverStartTime;
// //             sendEventToBackground('Blur', event.target, { hoverDuration });
// //             hoverStartTime = null;
// //             hoveredElement = null;
// //         } else {
// //             sendEventToBackground('Blur', event.target);
// //         }
// //     }
// // }, true);

// chrome.storage.local.get('recording', function(result) {
//     if (result.recording) {
//         isRecording=true;
//     }
// });
// // Handle messages from the popup
// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//     if (message.command === 'START_RECORDING') {
//         isRecording = true;
//         console.log("Recording started");
//     } else if (message.command === 'STOP_RECORDING') {
//         isRecording = false;
//         console.log("Recording stopped");
//     }
// });
