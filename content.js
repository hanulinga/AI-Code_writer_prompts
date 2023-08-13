```javascript
let comments = [];
let currentURL = '';

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'SAVE_COMMENT') {
        saveComment(request.data);
    } else if (request.message === 'LOAD_COMMENTS') {
        loadComments();
    } else if (request.message === 'DELETE_COMMENT') {
        deleteComment(request.data);
    }
});

// Save a comment
function saveComment(commentData) {
    comments.push(commentData);
    chrome.storage.sync.set({[currentURL]: comments}, function() {
        console.log('Comment saved');
    });
}

// Load comments for the current webpage
function loadComments() {
    chrome.storage.sync.get([currentURL], function(result) {
        comments = result[currentURL] || [];
        chrome.runtime.sendMessage({message: 'COMMENTS_LOADED', data: comments});
    });
}

// Delete a comment
function deleteComment(commentIndex) {
    comments.splice(commentIndex, 1);
    chrome.storage.sync.set({[currentURL]: comments}, function() {
        console.log('Comment deleted');
    });
}

// Get the current URL
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    currentURL = tabs[0].url;
    loadComments();
});
```