# Product Admin Dashboard

A small admin dashboard for managing products, built with Next.js, React, Tailwind CSS and Axios, using the [DummyJSON](https://dummyjson.com) API.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000. You'll be redirected to `/login`.

**Demo login:** username `emilys`, password `emilyspass` (pre-filled on the form).

## Project structure

app/
  login/page.js            Login form
  products/page.js         Product list: search, filter, sort, pagination
  products/new/page.js     Add product
  products/[id]/page.js    Product details + reviews
  products/[id]/edit/page.js  Edit product
lib/
  axios.js                 One shared Axios instance (token header + error handling)
  auth.js                  Token/user storage (cookie + localStorage)
  api/                     All API calls, kept out of components
  localOverrides.js        Local "diff" layer for add/edit/delete (see NOTES.md)
context/AuthContext.js     Login state shared across the app
components/                Small, single-purpose UI pieces
middleware.js              Blocks /products/* for logged-out users
