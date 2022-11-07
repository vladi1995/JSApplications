function attachEvents() {
    const urlPosts = 'http://localhost:3030/jsonstore/blog/posts';
    const urlComments = 'http://localhost:3030/jsonstore/blog/comments';
    document.getElementById('btnLoadPosts').addEventListener('click', posts);
    const selectElement = document.getElementById('posts');
    const ulElement = document.getElementById('post-comments');

    async function posts(event) {
        const response = await fetch(urlPosts);
        const data = await response.json();
        
        selectElement.innerHTML = '';
        document.getElementById('post-title').textContent = 'Post Details';
        document.getElementById('post-body').textContent = '';
        ulElement.innerHTML = '';

        Object.entries(data).forEach(([key, value]) => {
            const newOptionElement = document.createElement('option');
            newOptionElement.value = key;
            newOptionElement.textContent = value.title;
            selectElement.appendChild(newOptionElement);
        });

        document.getElementById('btnViewPost').addEventListener('click', comments);
    }


    async function comments(event) {
        const [response, responseData] = await Promise.all([fetch(urlComments), fetch(urlPosts)]);
        const data = await response.json();
        const responseDataValue = await responseData.json();

        const foundElementComment = Object.values(data).filter(x => x.postId == selectElement.value);
        document.getElementById('post-title').textContent = selectElement.options[selectElement.selectedIndex].text;
        document.getElementById('post-body').textContent = responseDataValue[selectElement.value].body;
        ulElement.innerHTML = '';

        foundElementComment.forEach(x => {
            const liElement = document.createElement('li');
            liElement.id = x.id;
            liElement.textContent = x.text;
            ulElement.appendChild(liElement);
        });
    }
}

attachEvents();