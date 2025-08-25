# Social Media Clone Backend

This is the backend for the Social Media Clone application. It is built using Node.js and Express, and it utilizes MongoDB for data storage.

## Features

- User Authentication: Users can register, log in, and manage their sessions.
- User Profiles: Users can create and update their profiles.
- Posts: Users can create, like, and comment on posts.
- Following: Users can follow and unfollow each other.

## Project Structure

```
backend
├── src
│   ├── app.ts                # Entry point of the application
│   ├── controllers           # Contains controller classes for handling requests
│   │   ├── authController.ts
│   │   ├── postController.ts
│   │   ├── profileController.ts
│   │   └── userController.ts
│   ├── models                # Contains Mongoose models for MongoDB
│   │   ├── postModel.ts
│   │   ├── profileModel.ts
│   │   └── userModel.ts
│   ├── routes                # Contains route definitions
│   │   ├── authRoutes.ts
│   │   ├── postRoutes.ts
│   │   ├── profileRoutes.ts
│   │   └── userRoutes.ts
│   ├── services              # Contains business logic for the application
│   │   ├── authService.ts
│   │   ├── postService.ts
│   │   ├── profileService.ts
│   │   └── userService.ts
│   ├── types                 # TypeScript interfaces
│   │   └── index.ts
│   └── utils                 # Utility functions
│       └── db.ts            # Database connection logic
├── package.json              # NPM configuration file
└── README.md                 # Documentation for the backend
```

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory:
   ```
   cd social-media-clone/backend
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up your MongoDB database and update the connection string in `src/utils/db.ts`.

5. Start the server:
   ```
   npm start
   ```

## API Documentation

Refer to the individual controller files for details on the available API endpoints and their usage.

## License

This project is licensed under the MIT License.