## ReddReelStoryz

## Overview

The AI Content Generator frontend is built using React and TypeScript to provide users with a seamless and intuitive interface for content generation. It complements the Java Spring Boot backend by offering a easy to use experience.

## Key Features

### 1. Content Generation Form

The frontend features a dynamic form where users can input parameters for content generation. This can include a direct Reddit URL, or manually adding the post content. The form is designed to be straightforward, ensuring users can easily navigate and submit their content generation requests.

### 2. Real-time Status Updates

Upon submitting a content generation job, users can track its progress in real-time. The interface displays the status of the job, allowing users to monitor the processing stages. This transparency enhances the overall user experience by providing instant feedback on the status of their content generation request.

### 3. Responsive Design

The frontend is designed with responsiveness in mind, ensuring compatibility across various devices and screen sizes. Whether accessed on a desktop or mobile device, users can interact with the application seamlessly, maintaining a consistent experience.

### 4. Secure Authentication

The frontend integrates with the Spring Security system, ensuring secure user authentication through JWT tokens. The frontend handles the session of this JWT token and prompts the user to login again should their session expire.

## Technological Stack

- **React**: Built using react and bootstrap for styling, with Ant Design for UI Components.

- **TypeScript**

- **RESTful API Integration**: The frontend communicates with the Java Spring Boot backend through RESTful APIs, enabling direct data exchange/usage.

- **AWS S3 Integration**: Users can retrieve generated content seamlessly from an S3 bucket, with the frontend facilitating easy access to the stored URLs, to allow a preview on the frontend
