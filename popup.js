```javascript
let comments = [];
let currentURL = '';

document.getElementById('saveButton').addEventListener('click', saveComment);
document.getElementById('optionsButton').addEventListener('click', openOptions);

function saveComment() {
    let commentInput = document.getElementById('commentInput');
    let comment = {
        text: commentInput.value,
        date: new Date(),
        url: currentURL
    };
    comments.push(comment);
    chrome.storage.sync.set({[currentURL]: comments}, function() {
        console.log('Comment saved');
    });
    commentInput.value = '';
}

function loadComments() {
    chrome.storage.sync.get([currentURL], function(result) {
        comments = result[currentURL] || [];
        let commentList = document.getElementById('commentList');
        commentList.innerHTML = '';
        comments.forEach(function(comment) {
            let listItem = document.createElement('li');
            listItem.textContent = `${comment.text} (on ${comment.date})`;
            commentList.appendChild(listItem);
        });
    });
}

function deleteComment(index) {
    comments.splice(index, 1);
    chrome.storage.sync.set({[currentURL]: comments}, function() {
        console.log('Comment deleted');
    });
    loadComments();
}

function openOptions() {
    chrome.runtime.openOptionsPage();
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    currentURL = tabs[0].url;
    loadComments();
});
```