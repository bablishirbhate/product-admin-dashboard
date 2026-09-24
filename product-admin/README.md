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

```
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
```

## What's finished

- [x] Login with DummyJSON `/auth/login`, inline error on wrong credentials
- [x] Route protection via middleware (redirects to `/login`, sends you back after)
- [x] Logout button
- [x] Product list: image, title, category, price, rating, stock
- [x] Responsive layout: table on desktop, cards on mobile
- [x] Pagination: page numbers, Previous/Next, page size (10/20/50), "Showing X–Y of Z"
- [x] Debounced search (400ms) against `/products/search`, resets to page 1
- [x] Search results can't be overwritten by stale/slow responses (request-id guard + AbortController)
- [x] Category filter (`/products/categories`) and sort by price/rating/title
- [x] Product details page with images, description, price, reviews
- [x] "Not found" state for an invalid product id
- [x] Add/edit form with validation (required fields, price > 0, non-negative integer stock, rating 0–5)
- [x] Delete with a confirm modal
- [x] Loading, empty, and error (with Retry) states everywhere data is fetched
- [x] All filter/search/sort/page state lives in the URL (shareable, survives refresh)
- [x] Invalid URL values (`?page=abc`, `?page=999`) are handled without crashing
- [x] Login and Save buttons ignore extra clicks while a request is in flight
- [x] One shared Axios instance; all API calls live in `lib/api/`, not in components

## Notes on the trickier requirements

See **NOTES.md** for the write-up on: search-vs-category conflict, why add/edit/delete are faked locally, the stale-request problem, and where AI tools helped.
