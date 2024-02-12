# Material UI - Next.js Pages Router TypeScript Project

This project is a full-stack application built with Next.js, TypeScript, and Material UI. It demonstrates the use of Next.js Pages Router with Material UI components in a TypeScript environment.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository.
2. Install the dependencies with `npm install`.
3. Start the development server with `npm run dev`.
4. Make sure to set the `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_API_TOKEN` environment variables in a `.env` file.

The application should now be running at [http://localhost:3000](http://localhost:3000).

## Features

This project includes:

- Material UI components for a consistent and attractive UI.
- Formik for form handling, with Yup for form validation.
- Integration with a backend API for fetching and updating data.

## Project Structure

The project is structured as follows:

- `src/components/forms`: This directory contains all the form components used in the application, including `OrdersForm.tsx`, `ProductForm.tsx`, and `ProductListForm.tsx`.
- `src/components/modal`: This directory contains modal components for orders and products.
- `src/service`: This directory contains the `Client.ts` file, which handles all API requests.
