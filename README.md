# Wanderlust Travel API

A modern, secure RESTful API for Wanderlust Travel Agency, built with Node.js, TypeScript, Koa, and MongoDB. The API is fully documented with OpenAPI and rigorously tested. Recent improvements include strict environment variable checks, safe database operations, and robust authentication on sensitive endpoints.

---

## Table of Contents

- [Wanderlust Travel API](#wanderlust-travel-api)
  - [Table of Contents](#table-of-contents)
  - [Project Info](#project-info)
  - [Scenario](#scenario)
  - [Features](#features)
  - [Project Structure](#project-structure)
  - [Environment Variables](#environment-variables)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
  - [Running the API](#running-the-api)
  - [Running Tests](#running-tests)
    - [Test Utilities](#test-utilities)
    - [Reading the Test Report](#reading-the-test-report)
  - [API Endpoints](#api-endpoints)
  - [API Documentation](#api-documentation)
  - [API Documentation & Testing](#api-documentation--testing)
  - [Using Postman to Test All API Endpoints](#using-postman-to-test-all-api-endpoints)
    - [1. Import the OpenAPI Spec](#1-import-the-openapi-spec)
    - [2. Set the Base URL](#2-set-the-base-url)
    - [3. Register and Log In](#3-register-and-log-in)
    - [4. Authorize Requests](#4-authorize-requests)
    - [5. Test All Endpoints](#5-test-all-endpoints)
      - [Sample JSON Bodies for Postman](#sample-json-bodies-for-postman)
    - [6. Explore Responses](#6-explore-responses)
    - [7. Troubleshooting](#7-troubleshooting)
  - [Common Troubleshooting & Error Solutions](#common-troubleshooting--error-solutions)
  - [License](#license)
    - [Good luck and happy coding!](#good-luck-and-happy-coding)

---

## Project Info

**GitHub Repo:** [wanderlust-api](https://github.com/yvonlcy/wanderlust-api)

**Purpose**  
This project demonstrates best practices in secure, maintainable RESTful API development using Node.js, TypeScript, Koa, and MongoDB. It features:
- Secure JWT authentication and role-based authorization
- OpenAPI/Swagger documentation for all endpoints
- Automated endpoint tests (Jest + Supertest)
- Strict environment variable checks (e.g., mandatory PORT)
- Safe database operations (no mutation of DB objects)
- Commercial-grade code, docs, and test coverage

---

## Scenario

Wanderlust Travel is a new agency aiming to provide a seamless platform for customers to explore hotels and air tickets. The system includes:
- A React SPA frontend for users
- A RESTful API backend for data management and integration with hotel/flight APIs

**Suggested APIs:**
- [Hotelbeds](https://developer.hotelbeds.com/)
- [Flight Data by RapidAPI](https://rapidapi.com/Travelpayouts/api/flight-data)

---

## Features

- Operator registration/login (with sign-up code)
- Member registration/login
- Hotel CRUD (operators only)
- Public hotel browsing, search, and filtering
- JWT authentication and role-based access
- Profile photo upload (protected: only the user can upload their own photo)
- Personal favourites for members
- Messaging system between users and operator
- OpenAPI (Swagger) documentation (`/docs`)
- Automated endpoint testing (Jest + Supertest)
- Mandatory environment variables (including `PORT`)
- Safe DB operations (no mutation of DB objects)

---

## Project Structure

- `src/` — Application source code (controllers, routes, middleware, services)
- `test/` — Automated tests (Jest + Supertest + mongodb-memory-server)
- `openapi.yaml` — API documentation (served at `/docs`)
- `package.json` — Scripts and dependencies

---

## Environment Variables

Create a `.env` file in the project root with **all** of the following (the API will fail fast if any are missing):

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
Test Suites: 14 passed, 14 total
Tests:       48 passed, 48 total
Snapshots:   0 total
Time:        9.8 s
Ran all test suites.
```

- **All tests passing** means your API is functioning as expected, with authentication, hotel CRUD, messaging, and other features working and protected as intended.
- If you see any failures (e.g. `Tests: 47 passed, 1 failed, 48 total`), Jest will show the error message and stack trace below the summary. Investigate and fix the root cause before deploying or submitting your project.
- For more detailed output, you can run:
  ```bash
  npm test -- --verbose
  ```
This will show each individual test case and its status.

- Each test suite corresponds to a file in the `test/` directory.
- Each test is described with a readable string (e.g., `should register an operator`).
- If a test fails, Jest will print the error message and stack trace to help you debug.

---

## API Endpoints

| Method | Path                                         | Description                                 |
|--------|----------------------------------------------|---------------------------------------------|
| POST   | /api/members/register                        | Register a new member                       |
| POST   | /api/members/login                           | Member login                                |
| POST   | /api/members/refresh-token                   | Refresh JWT token for member                |
| POST   | /api/members/:id/photo                       | Upload profile photo (auth, self only)      |
| GET    | /api/members/:id/favourites                  | List member's favorite hotels (auth)        |
| POST   | /api/members/:id/favourites/:hotelId         | Add a hotel to favorites (auth)             |
| DELETE | /api/members/:id/favourites/:hotelId         | Remove a hotel from favorites (auth)        |
| POST   | /api/operators/register                      | Register a new operator                     |
| POST   | /api/operators/login                         | Login for operator                          |
| POST   | /api/operators/refresh-token                 | Refresh JWT token for operator              |
| GET    | /api/profile                                 | Get current user's profile (auth)           |
| GET    | /api/hotels                                  | List all hotels                             |
| POST   | /api/hotels                                  | Create hotel (operator only)                |
| GET    | /api/hotels/:id                              | Get hotel by ID                             |
| PUT    | /api/hotels/:id                              | Update hotel (operator only)                |
| DELETE | /api/hotels/:id                              | Delete hotel (operator only)                |
| POST   | /api/messages                                | Send a message (auth)                       |
| GET    | /api/messages                                | List messages for user (auth)               |
| POST   | /api/messages/:id/reply                      | Reply to a message (auth)                   |
| DELETE | /api/messages/:id                            | Delete a message (auth)                     |
| GET    | /api/health                                  | Health check                                |

See full docs at [`/docs`](http://localhost:3000/docs).

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

- **Add to Favorites** (`POST /api/members/{id}/favourites/{hotelId}`): *(Requires member authentication)*
  - No JSON body required. Send the request with the member ID and hotel ID in the URL.
  - Example URL: `http://localhost:3000/api/members/YOUR_MEMBER_ID/favourites/TARGET_HOTEL_ID`

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

## Curl Examples

Here are some `curl` examples demonstrating key API workflows (replace placeholders like `MEMBER_ID`, `OPERATOR_ID`, `HOTEL_ID`, `MESSAGE_ID`, and `YOUR_TOKEN` as needed):

```bash
# --- Health Check ---
curl http://localhost:3000/api/health

# --- Member Flow ---
# Register Member
curl -X POST -H "Content-Type: application/json" -d '{"username": "curltest1", "password": "password123", "email": "curl.test@example.com"}' http://localhost:3000/api/members/register

# Login Member (get tokens)
curl -X POST -H "Content-Type: application/json" -d '{"username": "curltest1", "password": "password123"}' http://localhost:3000/api/members/login
# (Save the token from the response)
MEMBER_TOKEN="YOUR_MEMBER_TOKEN"

# Get Member Profile (Requires Token)
curl -H "Authorization: Bearer $MEMBER_TOKEN" http://localhost:3000/api/profile

# Add Hotel to Favourites (Requires Member Token)
MEMBER_ID="YOUR_MEMBER_ID" # From registration or profile endpoint
HOTEL_ID="TARGET_HOTEL_ID" # e.g., 67e79f8865c021330bf1afad
curl -X POST -H "Authorization: Bearer $MEMBER_TOKEN" http://localhost:3000/api/members/$MEMBER_ID/favourites/$HOTEL_ID

# List Member Favourites (Requires Member Token)
curl -H "Authorization: Bearer $MEMBER_TOKEN" http://localhost:3000/api/members/$MEMBER_ID/favourites

# Remove Hotel from Favourites (Requires Member Token)
curl -X DELETE -H "Authorization: Bearer $MEMBER_TOKEN" http://localhost:3000/api/members/$MEMBER_ID/favourites/$HOTEL_ID

# --- Operator Flow ---
# Register Operator (Ensure SIGNUP_CODE in .env is set, e.g., WL-AGENCY-2025)
curl -X POST -H "Content-Type: application/json" -d '{"username": "curlOperator1", "password": "opPassword123", "email": "curl.operator.1@example.com", "agency": "Curl Test Agency", "signupCode": "WL-AGENCY-2025"}' http://localhost:3000/api/operators/register

# Login Operator (get tokens)
curl -X POST -H "Content-Type: application/json" -d '{"username": "curlOperator1", "password": "opPassword123"}' http://localhost:3000/api/operators/login
# (Save the token from the response)
OPERATOR_TOKEN="YOUR_OPERATOR_TOKEN"

# Get Operator Profile (Requires Token)
curl -H "Authorization: Bearer $OPERATOR_TOKEN" http://localhost:3000/api/profile

# --- Hotel CRUD (Operator Only) ---
# Create Hotel
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $OPERATOR_TOKEN" -d '{"name": "Curl Test Hotel", "star": 3, "city": "Kowloon", "address": "123 Test St", "country": "HK"}' http://localhost:3000/api/hotels
# (Save the hotel ID from the response)
CREATED_HOTEL_ID="NEW_HOTEL_ID"

# Get Hotels (Public)
curl http://localhost:3000/api/hotels

# Get Specific Hotel (Public)
curl http://localhost:3000/api/hotels/$CREATED_HOTEL_ID

# Update Hotel (Requires Operator Token)
curl -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer $OPERATOR_TOKEN" -d '{"name": "Curl Test Hotel Updated", "star": 4, "city": "Kowloon", "address": "123 Test St", "country": "HK"}' http://localhost:3000/api/hotels/$CREATED_HOTEL_ID

# Delete Hotel (Requires Operator Token)
curl -X DELETE -H "Authorization: Bearer $OPERATOR_TOKEN" http://localhost:3000/api/hotels/$CREATED_HOTEL_ID

# --- Messaging Flow ---
OPERATOR_ID="YOUR_OPERATOR_ID" # From operator registration or profile

# Send Message (Member to Operator)
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $MEMBER_TOKEN" -d '{"fromId": "$MEMBER_ID", "toId": "$OPERATOR_ID", "content": "Hello operator, curl test message."}' http://localhost:3000/api/messages
# (Save the message ID from the response)
MESSAGE_ID="NEW_MESSAGE_ID"

# List Messages for Member
curl -H "Authorization: Bearer $MEMBER_TOKEN" "http://localhost:3000/api/messages?userId=$MEMBER_ID"

# Reply to Message (Operator to Member)
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $OPERATOR_TOKEN" -d '{"fromId": "$OPERATOR_ID", "content": "Received your message, replying as operator."}' http://localhost:3000/api/messages/$MESSAGE_ID/reply

# List Messages for Member (Verify Reply)
curl -H "Authorization: Bearer $MEMBER_TOKEN" "http://localhost:3000/api/messages?userId=$MEMBER_ID"

# Delete Message (Member)
curl -X DELETE -H "Authorization: Bearer $MEMBER_TOKEN" http://localhost:3000/api/messages/$MESSAGE_ID

```

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

## License

This project is for academic assessment purposes only.

---

### Good luck and happy coding!
