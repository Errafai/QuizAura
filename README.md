# QuizAura

## Introduction

QuizAura is a dynamic and interactive web platform designed to help users explore their personalities through fun and engaging quizzes. The platform offers personalized experiences by saving user progress and results, making it easy for users to revisit and discover new insights about themselves.

## Features

### Core Features

1. **Dynamic Quizzes**:
   - Multiple-choice questions with point-based scoring.
   - Dynamic layouts based on question type.
2. **Personalized Results**:
   - Results tailored to user scores.
   - Detailed breakdown of results.
3. **User Accounts**:
   - Secure authentication using JWT (JSON Web Tokens).
   - Persistent user sessions with automatic token refresh.
4. **Progress Saving**:
   - Users can resume quizzes from where they left off.
5. **Responsive Design**:
   - Optimized for mobile, tablet, and desktop devices.

### Additional Features

1. **Contact Form**:
   - Allows users to reach out to the team with questions or feedback.
2. **Dynamic Content**:
   - Quizzes and content loaded dynamically from the database.
3. **Admin Panel**:
   - Easily add, update, or remove quizzes without redeploying the website.
4. **Shareable Results**:
   - Users can share their quiz results on social media.

## Technologies Used

### Frontend

- **HTML5**, **CSS3**, **JavaScript**: For building responsive and interactive user interfaces.
- **EJS (Embedded JavaScript Templates)**: For dynamic rendering of content.
- **Bootstrap**: For pre-styled components and responsive layouts.

### Backend

- **Node.js** and **Express.js**: For building a scalable and robust RESTful API.
- **MongoDB**: For storing user accounts, quiz data, and results.
- **Nodemailer**: For sending emails via the contact form.

### Authentication & Security

- **JWT (JSON Web Tokens)**: For secure user authentication.
- **bcrypt**: For hashing user passwords.
- **HTTPS**: Enforced for secure data transfer.


## Project Structure

```
project-directory
|
|-- public/             # Static files (CSS, JavaScript, images)
|-- views/              # EJS templates
|-- server/             # Express routes, mongodb models, database setup
|-- app.js              # Main entry point
|-- package.json        # Dependencies and scripts
```

## Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/quizaura.git
   ```
2. Navigate to the project directory:
   ```bash
   cd quizaura
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file with the following keys:
     ```env
     PORT=3000
     MONGO_URI=<Your MongoDB Connection String>
     JWT_SECRET=<Your JWT Secret>
     EMAIL_USER=<Your Email Address>
     EMAIL_PASS=<Your Email Password>
     ```
5. Start the server:
   ```bash
   npm start
   ```
6. Visit the website:
   - Open your browser and navigate to `http://localhost:3000`.

## Development Workflow

### Adding New Quizzes

1. Create a new quiz entry in the MongoDB database.
2. Use the Admin Panel or directly modify the `quizzes` collection.

### Running Tests

Run tests to ensure everything works as expected:

```bash
npm test
```

## Challenges & Lessons Learned

### Challenges

- Designing a scalable quiz structure to support dynamic layouts.
- Implementing secure token-based authentication.

### Lessons Learned

- Importance of efficient database queries for performance.
- Value of user feedback in refining the user experience.


## Contribution

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a Pull Request.

## Contact

If you have any questions or suggestions, feel free to reach out:

- **Errafai Achraf** - Software Engineering Student.
- Email: aerrafai03\@gmail.com

##

