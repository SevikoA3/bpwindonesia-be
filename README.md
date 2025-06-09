# BPW Indonesia Backend API Documentation

This documentation provides a comprehensive overview of the available API endpoints for the BPW Indonesia backend. The API is built using Express.js and follows RESTful conventions. All endpoints require authentication via JWT unless otherwise specified.

---

## Authentication

All endpoints (except authentication endpoints, if any) require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## API Endpoints

### Users API
**Base URL:** `/users`

#### Fields
- `id` (integer, auto-increment, primary key)
- `email` (string, required, unique)
- `username` (string, required, unique)
- `password` (string, required)
- `refreshToken` (text, optional)
- `role` (enum: `user`, `admin`, default: `user`)
- `profile_pic_url` (string, optional)
- `fullName` (string, optional)
- `phone` (string, optional)
- `birthDate` (date, optional)
- `domicile` (string, optional)
- `position` (string, optional)
- `institution` (string, optional)
- `industry` (string, optional)

#### 1. Get All Users
- **Endpoint:** `GET /users/`
- **Auth:** Required
- **Description:** Retrieve a list of all users.
- **Response:**
  - `200 OK`: Array of user objects

#### 2. Get User by ID
- **Endpoint:** `GET /users/:id`
- **Auth:** Required
- **Description:** Retrieve details of a specific user by ID.
- **URL Params:**
  - `id` (string): User ID
- **Response:**
  - `200 OK`: User object
  - `404 Not Found`: User not found

#### 3. Create User
- **Endpoint:** `POST /users/`
- **Auth:** Not required
- **Description:** Register a new user.
- **Request Body:** JSON with user fields (see model)
- **Response:**
  - `201 Created`: Created user object
  - `400 Bad Request`: Validation error

#### 4. Update User
- **Endpoint:** `PUT /users/:id`
- **Auth:** Required
- **Description:** Update an existing user by ID. Supports file upload for `profile_pic`.
- **URL Params:**
  - `id` (string): User ID
- **Request Body (multipart/form-data):**
  - `profile_pic` (file, optional): New profile picture
  - Other user fields (see model)
- **Response:**
  - `200 OK`: Updated user object
  - `404 Not Found`: User not found

#### 5. Delete User
- **Endpoint:** `DELETE /users/:id`
- **Auth:** Required
- **Description:** Delete a user by ID.
- **URL Params:**
  - `id` (string): User ID
- **Response:**
  - `200 OK`: Deletion confirmation
  - `404 Not Found`: User not found

#### 6. Login
- **Endpoint:** `POST /users/login`
- **Auth:** Not required
- **Description:** Authenticate user and receive JWT token.
- **Request Body:** JSON with login credentials
- **Response:**
  - `200 OK`: Auth token and user info
  - `401 Unauthorized`: Invalid credentials

#### 7. Logout
- **Endpoint:** `POST /users/logout`
- **Auth:** Not required
- **Description:** Logout user (token invalidation if implemented).
- **Response:**
  - `200 OK`: Logout confirmation

#### 8. Refresh Token
- **Endpoint:** `POST /users/refresh-token`
- **Auth:** Not required
- **Description:** Refresh JWT access token.
- **Request Body:** JSON with refresh token
- **Response:**
  - `200 OK`: New access token

---

### Blogs API
**Base URL:** `/blogs`

#### Fields
- `title` (string, required)
- `content` (text, required)
- `coverImage` (string, optional)
- `uploadDate` (date, default: now)

#### 1. Get All Blogs
- **Endpoint:** `GET /blogs/`
- **Auth:** Required
- **Description:** Retrieve a list of all blogs.
- **Response:**
  - `200 OK`: Array of blog objects

#### 2. Get Blog by ID
- **Endpoint:** `GET /blogs/:id`
- **Auth:** Required
- **Description:** Retrieve details of a specific blog by ID.
- **URL Params:**
  - `id` (string): Blog ID
- **Response:**
  - `200 OK`: Blog object
  - `404 Not Found`: Blog not found

#### 3. Create Blog
- **Endpoint:** `POST /blogs/`
- **Auth:** Required
- **Description:** Create a new blog. Supports file upload for `coverImage`.
- **Request Body (multipart/form-data):**
  - `coverImage` (file): Blog cover image
  - Other blog fields (see model)
- **Response:**
  - `201 Created`: Created blog object
  - `400 Bad Request`: Validation error

#### 4. Update Blog
- **Endpoint:** `PUT /blogs/:id`
- **Auth:** Required
- **Description:** Update an existing blog by ID. Supports file upload for `coverImage`.
- **URL Params:**
  - `id` (string): Blog ID
- **Request Body (multipart/form-data):**
  - `coverImage` (file, optional): New cover image
  - Other blog fields (see model)
- **Response:**
  - `200 OK`: Updated blog object
  - `404 Not Found`: Blog not found

#### 5. Delete Blog
- **Endpoint:** `DELETE /blogs/:id`
- **Auth:** Required
- **Description:** Delete a blog by ID.
- **URL Params:**
  - `id` (string): Blog ID
- **Response:**
  - `200 OK`: Deletion confirmation
  - `404 Not Found`: Blog not found

---

### Events API
**Base URL:** `/events`

#### Fields
- `title` (string, required)
- `subTitle` (string, optional)
- `description` (text, required)
- `date` (date, required)
- `time` (string, required)
- `location` (string, required)
- `coverImage` (string, optional)
- `registrationStart` (date, required)
- `registrationEnd` (date, required)

#### 1. Get All Events
- **Endpoint:** `GET /events/`
- **Auth:** Required
- **Description:** Retrieve a list of all events.
- **Response:**
  - `200 OK`: Array of event objects

#### 2. Get Event by ID
- **Endpoint:** `GET /events/:id`
- **Auth:** Required
- **Description:** Retrieve details of a specific event by its ID.
- **URL Params:**
  - `id` (string): Event ID
- **Response:**
  - `200 OK`: Event object
  - `404 Not Found`: Event not found

#### 3. Create Event
- **Endpoint:** `POST /events/`
- **Auth:** Required
- **Description:** Create a new event. Supports file upload for `coverImage`.
- **Request Body (multipart/form-data):**
  - `coverImage` (file): Event cover image
  - Other event fields (see model)
- **Response:**
  - `201 Created`: Created event object
  - `400 Bad Request`: Validation error

#### 4. Update Event
- **Endpoint:** `PUT /events/:id`
- **Auth:** Required
- **Description:** Update an existing event by ID. Supports file upload for `coverImage`.
- **URL Params:**
  - `id` (string): Event ID
- **Request Body (multipart/form-data):**
  - `coverImage` (file, optional): New cover image
  - Other event fields (see model)
- **Response:**
  - `200 OK`: Updated event object
  - `404 Not Found`: Event not found

#### 5. Delete Event
- **Endpoint:** `DELETE /events/:id`
- **Auth:** Required
- **Description:** Delete an event by its ID.
- **URL Params:**
  - `id` (string): Event ID
- **Response:**
  - `200 OK`: Deletion confirmation
  - `404 Not Found`: Event not found

---

### RSVP API
**Base URL:** `/rsvps`

#### Fields
- `status` (enum: `going`, `not_going`, `maybe`, default: `going`)

#### 1. Get All RSVPs
- **Endpoint:** `GET /rsvps/`
- **Auth:** Required
- **Description:** Retrieve a list of all RSVPs.
- **Response:**
  - `200 OK`: Array of RSVP objects

#### 2. Get RSVP by ID
- **Endpoint:** `GET /rsvps/:id`
- **Auth:** Required
- **Description:** Retrieve details of a specific RSVP by ID.
- **URL Params:**
  - `id` (string): RSVP ID
- **Response:**
  - `200 OK`: RSVP object
  - `404 Not Found`: RSVP not found

#### 3. Create RSVP
- **Endpoint:** `POST /rsvps/`
- **Auth:** Required
- **Description:** Create a new RSVP.
- **Request Body:** JSON with RSVP fields (see model)
- **Response:**
  - `201 Created`: Created RSVP object
  - `400 Bad Request`: Validation error

#### 4. Update RSVP
- **Endpoint:** `PUT /rsvps/:id`
- **Auth:** Required
- **Description:** Update an existing RSVP by ID.
- **URL Params:**
  - `id` (string): RSVP ID
- **Request Body:** JSON with RSVP fields (see model)
- **Response:**
  - `200 OK`: Updated RSVP object
  - `404 Not Found`: RSVP not found

#### 5. Delete RSVP
- **Endpoint:** `DELETE /rsvps/:id`
- **Auth:** Required
- **Description:** Delete an RSVP by ID.
- **URL Params:**
  - `id` (string): RSVP ID
- **Response:**
  - `200 OK`: Deletion confirmation
  - `404 Not Found`: RSVP not found

---

## Error Handling
- All errors are returned in JSON format with an `error` message.
- Common HTTP status codes: `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`.

---

## File Uploads
- File uploads (e.g., `coverImage` for blogs/events, `profile_pic` for users) use `multipart/form-data`.
- Uploaded files are processed via the `multer` middleware.

---

## Middleware
- **verifyToken:** Ensures the request has a valid JWT token.
- **multer:** Handles file uploads.

---

## Running the Server

Install dependencies:
```
npm install
```

Start the server:
```
npm start
```

---

## Contact
For further information or issues, please contact the project maintainer.
