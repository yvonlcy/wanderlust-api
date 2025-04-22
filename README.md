# Wanderlust Travel API

A modern, secure RESTful API for Wanderlust Travel Agency, built with Node.js, TypeScript, Koa, and MongoDB.

---

## Table of Contents

- [Project Info](#project-info)
- [Scenario](#scenario)
- [Features](#features)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Running the API](#running-the-api)
- [Running Tests](#running-tests)
- [Testing Utilities](#test-utilities)
- [Reading the Test Report](#reading-the-test-report)
- [API Endpoints](#api-endpoints)
- [API Documentation](#api-documentation)
- [Using Postman to Test](#using-postman-to-test-all-api-endpoints)
- [Common Troubleshooting & Error Solutions](#common-troubleshooting--error-solutions)
- [License](#license)

---

## Project Info

**GitHub Repo:** [wanderlust-api](https://github.com/yvonlcy/wanderlust-api)

**Purpose**  
This project demonstrates critical awareness and technical skills in HTTP-based API design and development by building a secure, maintainable, and industry-standard RESTful API. It covers:
- Secure RESTful API development using Node.js/TypeScript.
- OpenAPI/Swagger documentation for all endpoints and data representations.
- Automated endpoint tests with mock HTTP requests.
- Commercial-grade coding, documentation, and testing practices.
- A short demonstration video (see link below).

---

## Scenario

Wanderlust Travel is a new agency aiming to provide customers with a seamless platform to explore hotels and air tickets for their travel plans. The system includes:
- A React SPA frontend for users.
- A RESTful API backend for data management and integration with public hotel and flight APIs.

**Suggested APIs:**
- [Hotelbeds](https://developer.hotelbeds.com/)
- [Flight Data by RapidAPI](https://rapidapi.com/Travelpayouts/api/flight-data)

---

## Features

### Essential
- Operator registration/login (with sign-up code), hotel CRUD (Create, Read, Update, Delete).
- Public hotel browsing, search, and filtering.
- Secure authentication/authorization (JWT).
- OpenAPI (Swagger) documentation for all endpoints and data.
- Automated endpoint testing with mock HTTP requests.
- Comprehensive code and project documentation.
- [Demo video link – to be added before submission]

### Important
- User profile photo upload.
- Public user registration and personal favourites.
- Messaging system between users and operator.

### Useful
- Social media integration for new listings.
- Secure coding and best Git practices.
- Optional: Google OAuth2 login for public users.

### Nice to Have
- External API hotel/flight data integration.
- Hotel & Flight package services.
- Other creative features.

---

## Project Structure

- `src/` — Application source code (controllers, routes, middleware, services)
- `test/` — Automated tests (Jest + Supertest + mongodb-memory-server)
- `openapi.yaml` — API documentation (served at `/docs`)
- `package.json` — Scripts and dependencies

---

## Environment Variables

Create a `.env` file in the project root with at least:

```
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
SIGNUP_CODE=your_operator_signup_code
MONGODB_URI=your_mongodb_uri
PORT=3000
```
> For MongoDB Atlas, use the URI provided by the Atlas dashboard (starts with `mongodb+srv://...`). For local testing, you may use `mongodb://localhost:27017/wanderlust`.
> For testing, MongoDB is handled in-memory and does not require configuration.

---

## Tech Stack

- **Backend:** Node.js, TypeScript, Koa
- **Database:** MongoDB (or local JSON for dev)
- **Documentation:** OpenAPI/Swagger (YAML/JSON)
- **Testing:** Jest or similar, with mock HTTP requests
- **Linting/Formatting:** ESLint, Prettier
- **Version Control:** Git, GitHub

---

## Getting Started

1. **Clone the repository**
   ```bash
   git clone git@github.com:yvonlcy/wanderlust-api.git
   cd wanderlust-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the API in development mode**
   ```bash
   npm run dev
   ```

4. **Lint and format code**
   ```bash
   npm run lint
   npm run format
   ```

5. **Run tests**
   ```bash
   npm test
   ```

---

## Running the API

```bash
npm install
npm run dev      # Start in development mode
npm start        # Start in production mode
```

API is served on `http://localhost:3000` by default.

---

## Running Tests

- Tests are located in the `test/` directory.
- Run all tests with:

```bash
npm test
```

- To check test coverage:

```bash
npm run test -- --coverage
```

- Tests use an in-memory MongoDB instance (`mongodb-memory-server`), so no external DB setup is needed.

### Test Utilities

The test files import helpers from `test/utils/mongo.ts` to manage the in-memory MongoDB lifecycle:
- `connect()`: Starts the in-memory database and connects the app.
- `closeDatabase()`: Stops the database after all tests.
- `clearDatabase()`: Clears all collections between tests, ensuring isolation.

You do **not** need to run or set up MongoDB yourself when running tests. These utilities ensure a clean, isolated environment for every test run.

### Reading the Test Report

After running `npm test`, you will see a summary of all test suites and their results in your terminal. Example output:

```
Test Suites: 8 passed, 8 total
Tests:       29 passed, 29 total
Snapshots:   0 total
Time:        7.3 s
Ran all test suites.
```

- Each test suite corresponds to a file in the `test/` directory.
- Each test is described with a readable string (e.g., `should register an operator`).
- If a test fails, Jest will print the error message and stack trace to help you debug.

For more detailed output, run:

```bash
npm test -- --verbose
```

This will show the individual status of each test case.

---

## API Endpoints

| Method | Path                   | Description           |
|--------|------------------------|-----------------------|
| POST   | /api/auth/register     | Register user         |
| POST   | /api/auth/login        | Login user            |
| GET    | /api/profile           | Get current user's profile (JWT required) |
| POST   | /api/members/register  | Register member       |
| POST   | /api/operators/register| Register operator     |
| GET    | /api/hotels            | List hotels           |
| POST   | /api/hotels            | Create hotel (operator only)   |
| GET    | /api/hotels/:id        | Get hotel by ID       |
| PUT    | /api/hotels/:id        | Update hotel (operator only) |
| DELETE | /api/hotels/:id        | Delete hotel (operator only) |
| GET    | /api/health            | Health check          |

See full docs at [`/docs`](http://localhost:3000/docs).

### Example Responses

#### Register Operator (POST /api/operators/register)
**Success:**
```json
{
  "id": "60c7b9c2e1d3c2a1b8c0f123",
  "message": "Operator registered"
}
```
**Error (missing signupCode):**
```json
{
  "error": "Invalid signup code"
}
```

#### Login Operator (POST /api/operators/login)
**Success:**
```json
{
  "token": "<jwt_token>"
}
```
**Error (wrong password):**
```json
{
  "error": "Invalid username or password"
}
```

#### Get Profile (GET /api/profile)
**Success:**
```json
{
  "id": "60c7b9c2e1d3c2a1b8c0f123",
  "role": "operator",
  "username": "apitestoperator",
  "email": "apitestoperator@hk.com"
}
```
**Error (no token):**
```json
{
  "error": "Authentication Error"
}
```

#### Create Hotel (POST /api/hotels)
**Success:**
```json
{
  "id": "60c7b9c2e1d3c2a1b8c0f456",
  "name": "Hotel Name",
  ...
}
```
**Error (unauthorized):**
```json
{
  "error": "Authentication Error"
}
```

#### Health Check (GET /api/health)
**Success:**
```json
{
  "status": "ok"
}
```

---

## API Documentation

- OpenAPI/Swagger UI is available at [`/docs`](http://localhost:3000/docs).
- Import `openapi.yaml` into Postman for testing.

---

## API Documentation & Testing

- **API Docs:** The OpenAPI/Swagger specification is provided as `openapi.yaml` and is served at `/docs` (http://localhost:3000/docs) when the server is running.
- **Postman:** Import `openapi.yaml` directly into Postman to automatically generate a full API testing collection.
- **JWT Workflow:**
  1. Register a user via `/api/auth/register` (or `/members/register`, `/operators/register`).
  2. Log in via `/api/auth/login` (or `/members/login`, `/operators/login`) to obtain a JWT token.
  3. In Postman, set the Authorization tab to Bearer Token and paste the token to test protected endpoints (e.g., `/api/profile`).

- **Protected Endpoint Example:**
  - `GET http://localhost:3000/api/profile` requires a valid JWT. Returns current user's id and role. Returns 401 if token is missing or invalid.

---

## Using Postman to Test All API Endpoints

Postman is a powerful tool for testing and exploring REST APIs. Follow these steps to test all endpoints of the Wanderlust API:

### 1. Import the OpenAPI Spec
- Open Postman.
- Click **Import** (top left), then select the `openapi.yaml` file from this project.
- Postman will automatically create a collection with all available endpoints.

### 2. Set the Base URL
- Ensure your API server is running locally (default: `http://localhost:3000`).
- In Postman, set the collection's base URL variable to `http://localhost:3000` if prompted.

### 3. Register and Log In
- Use the **POST** `http://localhost:3000/api/members/register` or `http://localhost:3000/api/operators/register` endpoint to create a user.
- Use the **POST** `http://localhost:3000/api/members/login` or `http://localhost:3000/api/operators/login` endpoint to log in.
- Copy the `access` token (JWT) from the login response.

### 4. Authorize Requests
- For protected endpoints (e.g., `http://localhost:3000/api/profile`, `http://localhost:3000/api/hotels` for operators), click the **Authorization** tab in Postman.
- Set type to **Bearer Token** and paste your JWT token.
- Alternatively, set the Authorization header manually: `Authorization: Bearer <your-token>`.

### 5. Test All Endpoints
- Select any endpoint in the imported collection and click **Send**.
- For endpoints that require a request body (e.g., creating hotels), use the **Body** tab (set to JSON) and provide the required fields.
- For endpoints with URL parameters (e.g., `/api/hotels/:id`), fill in the parameter in the URL or Params tab.

#### Sample JSON Bodies for Postman

- **Register Member** (`POST /api/members/register`):
  ```json
  {
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "test1234"
  }
  ```

- **Register Operator** (`POST /api/operators/register`):
  ```json
  {
    "username": "operator1",
    "email": "operator1@example.com",
    "password": "operatorpass",
    "agency": "Sample Agency",
    "signupCode": "WL-AGENCY-2025"
  }
  ```
  *The `signupCode` field is required and must match the value of `SIGNUP_CODE` in the `.env` file.*

- **Login Member/Operator** (`POST /api/members/login` or `/api/operators/login`):
  ```json
  {
    "username": "testuser",
    "password": "test1234"
  }
  ```

- **Send Message** (`POST /api/messages`):
  ```json
  {
    "fromId": "<sender_user_id>",
    "toId": "<recipient_user_id>",
    "content": "Hello, this is a test message!"
  }
  ```
  Replace `<sender_user_id>` and `<recipient_user_id>` with actual user IDs from your database or registration responses.

- **Create Hotel** (`POST /api/hotels`): *(Requires operator authentication)*
  ```json
  {
    "name": "Grand Plaza Hotel",
    "city": "Hong Kong",
    "star": 5,
    "address": "123 Main St, Hong Kong",
    "description": "A luxury hotel in the heart of the city.",
    "photos": ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"]
  }
  ```

- **Add to Favorites** (`POST /api/members/{id}/favourites`): *(Requires member authentication)*
  ```json
  {
    "hotelId": "<hotel_id>"
  }
  ```
  Replace `<hotel_id>` with the ID of the hotel you want to favorite.

- **Remove from Favorites** (`DELETE http://localhost:3000/api/members/{id}/favourites/{hotelId}`): *(Requires member authentication)*
  - No body required. Just send the request with the correct member and hotel IDs in the URL.

- **Reply to Message** (`POST http://localhost:3000/api/messages/{id}/reply`): *(Requires authentication)*
  ```json
  {
    "fromId": "<sender_user_id>",
    "content": "This is a reply to your message."
  }
  ```
  Replace `<sender_user_id>` with the user ID of the replier, and use the message ID in the URL.

### 6. Explore Responses
- View the full JSON response, status codes, and headers in Postman.
- Use **Save Response** to document or share test results.

### 7. Troubleshooting
- If you get a 401 Unauthorized error, ensure your JWT is valid and set in the Authorization tab.
- Use the `/api/health` endpoint to check if your API server is running.

---

## Common Troubleshooting & Error Solutions

- **401 Unauthorized / Authentication Error:**
  - Ensure you are sending the correct JWT token in the Authorization header as `Bearer <token>`.
  - If your token is expired, log in again to get a new one.
  - Make sure you are not missing the `signupCode` when registering an operator.
- **MongoDB Connection Errors:**
  - For local development, ensure MongoDB is running (or use the default in-memory setup for tests).
  - For Atlas, check your URI and network/firewall settings.
- **Port in Use:**
  - If you see an error about port 3000 in use, stop other processes or change the `PORT` in your `.env`.
- **CORS Issues:**
  - If calling from a browser, ensure CORS is enabled on the API server.
- **Validation Errors:**
  - Check that your request body matches the expected schema (see OpenAPI docs or examples above).
- **General Debugging:**
  - Use the `/api/health` endpoint to verify the server is running.
  - Check the server logs for detailed error messages.
- Refer to the Swagger UI at [`/docs`](http://localhost:3000/docs) for detailed API documentation and example requests.

---

**Tip:** You can use Postman environments and variables to manage tokens and base URLs for easier repeated testing.

---

## Submission

- **Portfolio ZIP:** Only include TypeScript project code developed by you, with documentation and links (no node_modules or external code).
- **Demo video link:** Add to this README before submission.
- **Moodle Submission:** Upload ZIP and video link before the deadline.

---

## License

This project is for academic assessment purposes only.

---

### Good luck and happy coding!

