# NikkeTeamsAPI
<div>
  <img src="https://github.com/yorigcs/NikkeTeamsAPI/actions/workflows/test.yml/badge.svg" />
</div>

The NikkeTeams project consists of a Restful API still in development for sharing teams among Nikke game players, in order to efficiently help them progress more easily. The API was built following the principles of clean architecture along with best software development practices such as TDD (Test Driven Development), SOLID, and design patterns.

The chosen technologies were selected based on their efficiency and suitability for the project, including Node.js with Typescript as the main language, Express.js as the web application framework, Jest as the unit testing framework, Prisma as the ORM for accessing the Postgres database, Redis as the in-memory database for caching and performance optimization, AWS S3 as the cloud file storage service, and Docker to facilitate the deployment and scalability process of the application.

I developed all the code with a focus on ensuring the maintainability, scalability, and robustness of the application.


## Installation

```sh
git clone git@github.com:yorigcs/NikkeTeamsAPI.git && cd NikkeTeamsAPI
```

```sh
npm install
```

## Tests
-unit
```sh
npm run test
```
-integration
```sh
npm run test:integration
```
-coverage
```sh
npm run test:coverage
```

## Usage

### - In dev mode
```sh
npm run prisma:migrate:dev
```
```sh
npm run dev
```

## Notes

Don't forget to config .env and .env.test the same as the .env.example

## Dependencies
- [@aws-sdk/client-s3](https://www.npmjs.com/package/@aws-sdk/client-s3): AWS SDK for JavaScript S3 Client for Node.js, Browser and React Native.
- [@prisma/client](https://www.npmjs.com/package/@prisma/client): auto-generated query builder that enables type-safe.
- [bcrypt](https://www.npmjs.com/package/bcrypt): A library to help you hash passwords.
- [cors](https://www.npmjs.com/package/cors): node.js package for providing a Connect/Express middleware.
- [dotenv-cli](https://www.npmjs.com/package/dotenv-cli): manage multiple envs.
- [express](https://www.npmjs.com/package/express): Fast, unopinionated, minimalist web framework for Node.js.
- [module-alias](https://www.npmjs.com/package/module-alias): Create aliases of directories and register custom module paths in NodeJS.
- [uuid](https://www.npmjs.com/package/uuid): For the creation of RFC4122 UUIDs.
- [multer](https://www.npmjs.com/package/multer): A middleware for handling multipart/form-data.
- [rimraf](https://www.npmjs.com/package/bcrypt): The UNIX command rm -rf for node.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): An implementation of JSON Web Tokens.


## Dev Dependencies
- [dotenv](https://www.npmjs.com/package/dotenv): Dotenv is a zero-dependency module that loads environment variables from a .env.
- [eslint-config-standard-with-typescript](https://www.npmjs.com/package/eslint-config-standard-with-typescript): An ESLint shareable config for TypeScript that is based on eslint-config-standard.
- [husky](https://www.npmjs.com/package/husky): Modern native Git hooks made easy.
- [lint-staged](https://ghub.io/eslint-plugin-standard): Run linters against staged git files.
- [jest](https://www.npmjs.com/package/jest): Delightful JavaScript Testing.
- [jest-mock-extended](https://www.npmjs.com/package/jest-mock-extended): Type safe mocking extensions for Jest.
- [prisma](https://www.npmjs.com/package/prisma): Prisma is a next-generation ORM.
- [supertest](https://www.npmjs.com/package/supertest): HTTP assertions made easy via superagent. Maintained for Forward Email and Lad.
- [ts-jest](https://www.npmjs.com/package/ts-jest): A Jest transformer with source map support that lets you use Jest to test projects written in TypeScript.
- [ts-node-dev](https://www.npmjs.com/package/ts-node-dev): Tweaked version of node-dev that uses ts-node under the hood.
- [typescript](https://www.npmjs.com/package/typescript):  Language for application-scale JavaScript.
- [@jest-mock/express](https://www.npmjs.com/package/@jest-mock/express): A lightweight Jest mock for unit testing Express.
- [@types/bcrypt](https://www.npmjs.com/package/@types/bcrypt): TypeScript definitions for bcrypt.
- [@types/cors](https://www.npmjs.com/package/@types/cors): TypeScript definitions for cors.
- [@types/express](https://www.npmjs.com/package/@types/express): TypeScript definitions for express.
- [@types/jest](https://www.npmjs.com/package/@types/jest): TypeScript definitions for jest.
- [@types/supertest](https://www.npmjs.com/package/@types/supertest): TypeScript definitions for supertest.
- [@types/uuid](https://www.npmjs.com/package/@types/uuid): TypeScript definitions for uuid.
- [@types/module-alias](https://www.npmjs.com/package/@types/module-alias): TypeScript definitions for module-alias.
- [@types/jsonwebtoken](https://www.npmjs.com/package/@types/jsonwebtoken): TypeScript definitions for jsonwebtoken.
- [@types/multer](https://www.npmjs.com/package/@types/multer): TypeScript definitions for multer.


## License
MIT
