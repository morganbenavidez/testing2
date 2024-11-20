from flask import Flask, render_template, send_from_directory, request, jsonify
from summit import summit
import os


app = Flask(__name__)

print('hello')
# Root path for lesson storage
LESSONS_DIR = 'LESSONS'

# Ensure LESSONS folder exists
os.makedirs(LESSONS_DIR, exist_ok=True)


@app.route('/summit/<path:filename>')
def summit_static(filename):
    return send_from_directory('summit', filename)



# EDIT ANYTHING YOU WANT AFTER HERE

@app.route('/documentation')
def documentation():
    page = request.args.get('page', 'documentation')
    return render_template('index.html', page=page)

@app.route('/')
def home():
    page = request.args.get('page', 'home')
    return render_template("index.html", page=page)

@app.route('/get_subfolders', methods=['GET'])
def get_subfolders():
    print('subfolders')
    # Get all subfolders in LESSONS and sort them alphabetically
    subfolders = sorted([name for name in os.listdir(LESSONS_DIR) if os.path.isdir(os.path.join(LESSONS_DIR, name))])

    return jsonify({'message': 'Lesson created successfully', 'subfolders': subfolders})


@app.route('/get_lesson_detail', methods=['POST'])
def get_lesson_detail():
    # Parse JSON request data
    data = request.get_json()
    if not data or 'file' not in data or 'text' not in data:
        return "Invalid request data.", 400

    file_name = data['file']
    li_text = data['text']

    # Define the directory where the lesson files are stored
    lessons_dir = 'LESSONS'

    # Construct the file path
    file_path = os.path.join(lessons_dir, file_name)

    # Check if the file exists
    if os.path.exists(file_path) and os.path.isfile(file_path):
        # Read and return the file content
        with open(file_path, 'r', encoding='utf-8') as file:
            return file.read()
    else:
        chat_prompt = "Teach me the following topic: " + li_text + """ 
        Your entire response should be html, do not include any additional text. 
        Do not include any html, head or body elements in your response.
        You should fully encapsulate the topic and teach it by the end of the page.
        Your response is going to immediately be converted to html and displayed.
        DO NOT include anything that needs additional CSS to make sense, the page should
        flow and make sense.
        """
        gpt_response = summit.gpt_connection(chat_prompt, OPEN_AI_KEY)
        # Return a default HTML string if the file doesn't exist
        the_html = gpt_response

        # Save lesson content as an HTML file
        with open(file_path, 'w') as file:
            file.write(the_html)

        #default_html = f"<h1>{file_name} not found</h1><p>This lesson is not available at the moment.</p>"
        return the_html



@app.route('/get_lesson_directory', methods=['GET'])
def get_lesson_directory():

    lesson = request.args.get('lesson')
    print('lesson: ', lesson)
    if not lesson:
        return "Lesson not found.", 404

    # Define the path to the lesson directory
    lesson_dir = os.path.join('LESSONS', lesson)
    
    if not os.path.exists(lesson_dir) or not os.path.isdir(lesson_dir):
        return "Lesson directory not found.", 404

    # Find the file containing 'directory' in its name and with an .html extension
    directory_file = None
    for filename in os.listdir(lesson_dir):
        if 'directory' in filename and filename.endswith('.html'):
            directory_file = os.path.join(lesson_dir, filename)
            break

    if not directory_file or not os.path.isfile(directory_file):
        return "Lesson content file not found.", 404
    
    # Read the file contents
    try:
        with open(directory_file, 'r', encoding='utf-8') as file:
            html_content = file.read()
    except Exception as e:
        return f"Error reading the file: {str(e)}", 500

    # Return the HTML content as a string
    return html_content

@app.route('/create_lesson', methods=['POST'])
def create_lesson():

    data = request.json
    lesson_name = data.get('lessonName')
    print('lesson_name: ', lesson_name)
    topic_description = data.get('topicDescription')
    print('topic_description: ', topic_description)
    if not lesson_name or not topic_description:
        return jsonify({'error': 'Missing fields'}), 400

    # Create a subfolder for the lesson
    lesson_folder = os.path.join(LESSONS_DIR, lesson_name)
    os.makedirs(lesson_folder, exist_ok=True)

    chat_prompt = "Create a bulleted lesson plan to teach the topic: " + topic_description + """ 
    Your response should be very simple html. I want an ordered list with list items for each 
    supporting thing to learn as list items. Each list item should be a supporting subtopic that build on each other to reach the goal
    of learning the topic. Include as many building blocks as possible (as many list items). The first list item
    should be the most fundamental piece, the second list item should be the next and so on. If all list items were learned or completed, 
    the reader should end with a comprehensive understanding of the topic. DO NOT INCLUDE anything in your response besides the <ol></ol> and list items <li></li>
    """

    gpt_response = summit.gpt_connection(chat_prompt, OPEN_AI_KEY)

    # Generate lesson content by calling ChatGPT (mocked here)
    #lesson_content = f"<html><body><h1>{lesson_name}</h1>{gpt_response}</body></html>"

    # Save lesson content as an HTML file
    lesson_file_path = os.path.join(lesson_folder, 'Lesson_1_directory.html')
    with open(lesson_file_path, 'w') as file:
        file.write(gpt_response)

    # Get all subfolders in LESSONS and sort them alphabetically
    subfolders = sorted([name for name in os.listdir(LESSONS_DIR) if os.path.isdir(os.path.join(LESSONS_DIR, name))])

    return jsonify({'message': 'Lesson created successfully', 'subfolders': subfolders})


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5003)
