


function loadPage(page) {

    switch (page) {

        case 'home':
            titleContent = 'Lesson Creator';
            metaContent = 'A tool to help you learn new topics.';
            loadHomePage(titleContent, metaContent);
            break;
        case 'createLesson':
            titleContent = 'Create Lesson';
            metaContent = 'Create a new lesson!';
            loadCreateLessonPage(titleContent, metaContent);
            break;
        case 'view_lessons':
            titleContent = 'View Lessons';
            metaContent = 'View all your lessons';
            console.log('here');
            loadViewLessonsPage(titleContent, metaContent);
            break;
        // ADD MORE CASES FOR EACH OF YOUR PAGES AS NEEDED

        default:
            titleContent = 'Summit Framework';
            metaContent = 'A framework built to get you from base camp to the summit quickly!';
            loadHomePage(titleContent, metaContent);
            break;
    }

    // Update current page in localStorage
    localStorage.setItem('currentPage', page);
    document.body.setAttribute('data-page', '');
    
}

    

window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
        window.scrollTo(0, 0);
    } else {
        // Scroll to the top of the page
        window.scrollTo(0, 0);
    }
};

// handleStates
window.addEventListener('popstate', function(event) {
    if (event.state) {
        loadPage(event.state.page);
    } else {
        // Handle the initial state or fallback if no state is present
        const page = document.body.getAttribute('data-page');
        loadPage(page);
    }
});

// mainListener
// main function on page loading everytime
document.addEventListener('DOMContentLoaded', function() {

    const serverPage = document.body.getAttribute('data-page');

    const storedPage = localStorage.getItem('currentPage');

    if (serverPage === '') {
        loadPage(storedPage);
    } else {
        loadPage(serverPage);
    }

});


// navigate
function navigate(page) {
    history.pushState({ page }, "", "?page=" + page);
    loadPage(page);
}


// home
function loadHomePage(titleContent, metaContent) {

    localStorage.setItem('currentPage', 'home');

    const headBlock = document.getElementById('index_head');
    const centeredBlock = document.getElementById('centered_block');

    startOffAPage(headBlock, centeredBlock, titleContent, metaContent);
    console.log('before app');
    const app = div(centeredBlock, {id: 'app'});
    //const app = createAndAppendElement('div', {id: 'app'}, centeredBlock);
    console.log('after app')
    const createButton = div(app, { class: 'button', innerHTML: 'Create Lesson' });
    createButton.addEventListener('click', () => navigate('createLesson'));

    const viewButton = div(app, { class: 'button', innerHTML: 'View Lessons' });
    viewButton.addEventListener('click', () => alert('View Lessons feature not implemented yet!'));
    
};

function loadCreateLessonPage(titleContent, metaContent) {

    localStorage.setItem('currentPage', 'documentation');

    const headBlock = document.getElementById('index_head');
    const centeredBlock = document.getElementById('centered_block');

    startOffAPage(headBlock, centeredBlock, titleContent, metaContent);

    const app = div(centeredBlock, {id: 'app'});

    h1(app, { innerHTML: 'Create a New Lesson' });

    const formElement = form(app, {});
    input(formElement, { type: 'text', name: 'lessonName', placeholder: 'Lesson Name', required: true });
    input(formElement, { type: 'text', name: 'topicDescription', placeholder: 'Topic Description', required: true });
    input(formElement, { type: 'submit', value: 'Submit' });

    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();

        const lessonName = formElement.lessonName.value.trim();
        const topicDescription = formElement.topicDescription.value.trim();

        if (lessonName && topicDescription) {
            // Make a request to Flask backend
            const response = await fetch('/create_lesson', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonName, topicDescription }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('data: ', data);
                // Store the subfolders list as a hidden parameter in index_body
                const indexBody = document.getElementById('index_body');
                indexBody.setAttribute('value', JSON.stringify(data.subfolders));
                navigate('view_lessons');
            } else {
                alert('Failed to create lesson. Please try again.');
            }
        } else {
            alert('Please fill out all fields.');
        }
    });
    
};


function loadViewLessonsPage(titleContent, metaContent) {

    console.log('here2');
    localStorage.setItem('currentPage', 'documentation');

    const headBlock = document.getElementById('index_head');
    const centeredBlock = document.getElementById('centered_block');

    startOffAPage(headBlock, centeredBlock, titleContent, metaContent);

    const app = div(centeredBlock, {id: 'app'});

    const indexBody = document.getElementById('index_body');
    const subfoldersString = indexBody.getAttribute('value');
    
    console.log('here3');
    console.log(subfoldersString);
    if (!subfoldersString) {
        alert('No lessons available.');
        return;
    }

    const subfoldersList = JSON.parse(subfoldersString); // Convert to a list
    console.log(subfoldersList);

    h1(app, {innerHTML: 'Lessons'});

    // Create a button for each subfolder
    subfoldersList.forEach((folderName) => {
        console.log(folderName)
        const lessonButton = div(app, { class: 'button', innerHTML: folderName });
        lessonButton.addEventListener('click', () => {
            alert(`You clicked on lesson: ${folderName}`);
            // You can add more functionality here to display the lesson content
        });
        console.log(lessonButton);
    });

}
