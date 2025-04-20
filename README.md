# Wanderlust Travel API

A modern, secure RESTful API for Wanderlust Travel Agency, built with Node.js, TypeScript, Koa, and MongoDB.

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
PORT=3000
```
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

- Tests use an in-memory MongoDB instance (`mongodb-memory-server`), so no external DB setup is needed.

---

## API Endpoints

| Method | Path                   | Description           |
|--------|------------------------|-----------------------|
| POST   | /api/auth/register     | Register user         |
| POST   | /api/auth/login        | Login user            |
| POST   | /api/members/register  | Register member       |
| POST   | /api/operators/register| Register operator     |
| GET    | /api/hotels            | List hotels           |
| POST   | /api/hotels            | Create hotel (auth)   |
| ...    | ...                    | ...                   |

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
  1. Register a member/operator via `/members/register` or `/operators/register`.
  2. Log in via `/members/login` or `/operators/login` to obtain a JWT token.
  3. In Postman, set the Authorization tab to Bearer Token and paste the token to test protected endpoints.
- **Automated Testing Script (Bash Example):**

```bash
#!/bin/bash
register_response=$(curl -s -X POST http://localhost:3000/members/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass","email":"test@example.com"}')
echo "$register_response"
member_id=$(echo $register_response | grep -oP '"id"\s*:\s*"\K[^"]+')
login_response=$(curl -s -X POST http://localhost:3000/members/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass"}')
echo "$login_response"
token=$(echo $login_response | grep -oP '"token"\s*:\s*"\K[^"]+')
hotel_response=$(curl -s -X POST http://localhost:3000/hotels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $token" \
  -d '{"name":"My Hotel","star":5,"city":"Hong Kong","country":"Hong Kong","address":"Central"}')
echo "$hotel_response"
echo
echo "Your JWT token:"
echo "$token"
```

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

---

## Contribution

PRs and issues welcome! Please lint and test before submitting changes.

---

## License

For academic/portfolio use only.
