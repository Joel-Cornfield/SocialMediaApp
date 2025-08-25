# Social Media Clone

This project is a social media application that allows users to create profiles, post content, follow other users, and like posts. It is structured into a backend API and a frontend client.

## Project Structure

```
social-media-clone
├── backend          # Backend API
│   ├── src         # Source code for the backend
│   ├── package.json # Backend dependencies and scripts
│   └── README.md    # Documentation for the backend
├── frontend         # Frontend client
│   ├── src         # Source code for the frontend
│   ├── package.json # Frontend dependencies and scripts
│   └── README.md    # Documentation for the frontend
├── docker-compose.yml # Docker configuration for the application
└── README.md        # Overall documentation for the project
```

## Features

- **User Authentication**: Users can register, log in, and manage their sessions.
- **User Profiles**: Users can create and update their profiles.
- **Posts**: Users can create, like, and comment on posts.
- **Following**: Users can follow and unfollow other users.

## Technologies Used

- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React, TypeScript
- **Database**: MongoDB for data storage
- **Containerization**: Docker for easy deployment

## Getting Started

### Prerequisites

- Node.js
- Docker (for containerization)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd social-media-clone
   ```

2. Navigate to the backend directory and install dependencies:
   ```
   cd backend
   npm install
   ```

3. Navigate to the frontend directory and install dependencies:
   ```
   cd frontend
   npm install
   ```

### Running the Application

To run the application using Docker, execute:
```
docker-compose up
```

For development, you can run the backend and frontend separately:

- Start the backend:
  ```
  cd backend
  npm run dev
  ```

- Start the frontend:
  ```
  cd frontend
  npm start
  ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License.