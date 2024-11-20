
document.addEventListener('DOMContentLoaded', () => {
    // Create the overlay element
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black
    overlay.style.zIndex = '1000'; // High z-index to cover all content
    overlay.style.display = 'none'; // Initially hidden
    overlay.id = 'screen-overlay';
    document.body.appendChild(overlay);

    // Function to show the overlay
    window.showOverlay = function() {
        overlay.style.display = 'block';
    };

    // Function to hide the overlay
    window.hideOverlay = function() {
        overlay.style.display = 'none';
    };

    // Example usage: Attach the showOverlay to specific button clicks
    document.addEventListener('click', (event) => {
        const target = event.target;

        if (
            (target.classList.contains('button')) || // Class = button
            (target.type === 'submit') ||           // Type = submit
            (target.id === 'exploreButton')         // ID = exploreButton
        ) {
            showOverlay();
        }
    });
});


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

    const menuDiv = div(centeredBlock, {class: 'menuDiv'});

    const createButton = div(menuDiv, { class: 'button', innerHTML: 'Create Lesson' });
    createButton.addEventListener('click', () => navigate('createLesson'));

    const viewButton = div(menuDiv, { class: 'button', innerHTML: 'View Lessons' });
    viewButton.addEventListener('click', () => navigate('view_lessons'));
    
    //const app = createAndAppendElement('div', {id: 'app'}, centeredBlock);
    console.log('after app');
    h1(app, {id:'indexh1', innerHTML:'Lesson Planner'});

    setTimeout(() => {
        console.log("Delayed call to hideOverlay");
        hideOverlay();
    }, 100);
};

function loadCreateLessonPage(titleContent, metaContent) {

    localStorage.setItem('currentPage', 'documentation');

    const headBlock = document.getElementById('index_head');
    const centeredBlock = document.getElementById('centered_block');

    startOffAPage(headBlock, centeredBlock, titleContent, metaContent);

    const menuDiv = div(centeredBlock, {class: 'menuDiv'});

    const createButton = div(menuDiv, { class: 'button', innerHTML: 'Home' });
    createButton.addEventListener('click', () => navigate('home'));

    const viewButton = div(menuDiv, { class: 'button', innerHTML: 'View Lessons' });
    viewButton.addEventListener('click', () => navigate('view_lessons'));
    

    const app = div(centeredBlock, {id: 'app'});

    h1(app, { innerHTML: 'Create a New Lesson' });

    const formElement = form(centeredBlock, {id:'formElement'});
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
                //console.log('data: ', data);
                // Store the subfolders list as a hidden parameter in index_body
                //const indexBody = document.getElementById('index_body');
                //indexBody.setAttribute('value', JSON.stringify(data.subfolders));
                navigate('view_lessons');
            } else {
                alert('Failed to create lesson. Please try again.');
            }
        } else {
            alert('Please fill out all fields.');
        }
    });
    setTimeout(() => {
        console.log("Delayed call to hideOverlay");
        hideOverlay();
    }, 100);
};


function loadViewLessonsPage(titleContent, metaContent) {

    console.log('here2');
    localStorage.setItem('currentPage', 'documentation');

    const headBlock = document.getElementById('index_head');
    const centeredBlock = document.getElementById('centered_block');

    startOffAPage(headBlock, centeredBlock, titleContent, metaContent);

    const menuDiv = div(centeredBlock, {class: 'menuDiv', id: 'menuDiv'});

    const homeButton = div(menuDiv, { class: 'button', innerHTML: 'Home' });
    homeButton.addEventListener('click', () => navigate('home'));
    
    const createButton = div(menuDiv, { class: 'button', innerHTML: 'Create Lesson' });
    createButton.addEventListener('click', () => navigate('createLesson'));

    const viewButton = div(menuDiv, { class: 'button', innerHTML: 'View Lessons' });
    viewButton.addEventListener('click', () => navigate('view_lessons'));
    

    const app = div(centeredBlock, { id: 'app' });

    console.log('here3');

    // Make an AJAX call to fetch the subfolders using .then()
    fetch('/get_subfolders', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse JSON response
        })
        .then(data => {
            const subfoldersList = data.subfolders; // Adjust based on server response structure
            console.log(subfoldersList);

            if (!subfoldersList || subfoldersList.length === 0) {
                alert('No lessons available.');
                setTimeout(() => {
                    console.log("Delayed call to hideOverlay");
                    hideOverlay();
                }, 100);
                return;
            }

            h1(app, { innerHTML: 'Lessons' });
            
            // Create a button for each subfolder
            subfoldersList.forEach((folderName) => {
                console.log(folderName);
                const lessonButton = div(app, { class: 'button', id:'classroom', innerHTML: folderName });
                lessonButton.addEventListener('click', () => {
                    // Make an AJAX call to fetch the HTML content for the lesson
                    fetch(`/get_lesson_directory?lesson=${encodeURIComponent(folderName)}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            return response.text(); // Expect HTML content as a string
                        })
                        .then(htmlString => {
                            console.log(htmlString);
                            //const the_h1_start = '<h1>';
                            //let the_rest = the_h1_start.concat(folderName, '</h1>');
                            //let result_concat = the_h1_start.concat(folderName, '</h1>', htmlString);
                            //let result_concat = the_h1.concat(htmlString);
                            // Clear the app container and display the HTML content
                            renderLessonContent(htmlString, document.getElementById('app'), folderName, lessonButton);
                            setTimeout(() => {
                                console.log("Delayed call to hideOverlay");
                                hideOverlay();
                            }, 100);
                            //app.innerHTML = result_concat;
                        })
                        .catch(error => {
                            console.error('Error fetching lesson content:', error);
                            alert('Failed to load lesson content. Please try again later.');
                            setTimeout(() => {
                                console.log("Delayed call to hideOverlay");
                                hideOverlay();
                            }, 100);
                        });
                });
                console.log(lessonButton);
            });
        })
        .catch(error => {
            console.error('Error fetching subfolders:', error);
            alert('Failed to load lessons. Please try again later.');
        });
    setTimeout(() => {
        console.log("Delayed call to hideOverlay");
        hideOverlay();
    }, 100);
}


// Function to render the lesson content and add "Explore" buttons
function renderLessonContent(htmlContent, app, folderName, lessonButton) {
    // Parse the provided HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Find the <ol> element
    const olElement = doc.querySelector('ol');
    if (!olElement) {
        console.error("No <ol> element found in the HTML content.");
        return;
    }
    
    // Clear the current app content and add the <ol> to the app
    app.innerHTML = '';
    h1(app, {innerHTML: folderName});
    app.appendChild(olElement);

    // Add an "Explore" button under each <li>
    const listItems = olElement.querySelectorAll('li');
    listItems.forEach((li, index) => {

        // Extract the text content of the <li>
        const liText = li.textContent.trim();
        // Create the "Explore" button
        const exploreButton = document.createElement('button');
        exploreButton.id = 'exploreButton';
        exploreButton.textContent = 'Explore';
        //exploreButton.style.display = 'block';
        //exploreButton.style.marginTop = '10px';

        // Add click event listener
        exploreButton.addEventListener('click', () => {
            // Determine the lesson file name based on list position (1-indexed)
            const lessonNumber = index + 1;
            const lessonFile = folderName.concat('/', `Lesson_${lessonNumber}.html`);

            // Perform an AJAX call to fetch the lesson content
            fetch(`/get_lesson_detail?file=${encodeURIComponent(lessonFile)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    file: lessonFile,
                    text: liText,
                }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text(); // Expect HTML content as a string
                })
                .then(lessonHtml => {

                    const theMenu = document.getElementById('menuDiv');
                    theMenu.appendChild(lessonButton);
                    // Replace the app content with the returned HTML
                    app.innerHTML = lessonHtml;
                    hideOverlay();
                })
                .catch(error => {
                    console.error('Error fetching lesson detail:', error);
                    app.innerHTML = '<p>Failed to load lesson details. Please try again later.</p>';
                    hideOverlay();
                });
        });

        // Append the button under the <li>
        li.appendChild(exploreButton);
    });
}

