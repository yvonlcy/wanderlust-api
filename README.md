> **⚠️ This project is currently a work in progress and serves as a template/backup. Core features and documentation are not yet complete.**

# Wanderlust Travel API

A modern, secure, and fully documented RESTful API for the Wanderlust Travel Agency, built with Node.js, TypeScript, Koa, and MongoDB. This API serves as the backend for a React Single Page Application (SPA), enabling hotel and flight management, user authentication, and seamless integration with external travel data providers.

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

## Documentation

- **API Docs:** OpenAPI/Swagger spec included in `/docs` folder.
- **Code Style:** Enforced by ESLint and Prettier config files.
- **Demo Video:** [Add YouTube/Stream link here before submission]

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
