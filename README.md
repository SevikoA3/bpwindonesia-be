# BPW Indonesia Backend API Documentation

## Authentication

Beberapa endpoint membutuhkan JWT token. Login terlebih dahulu untuk mendapatkan token, lalu gunakan di header:

```
Authorization: Bearer <token>
```

---

## User

### Register User

- **POST** `/api/users`
- **Body (JSON):**
  - email, username, password, role, fullName, phone, birthDate, domicile, position, institution, industry, membershipTypeId (opsional)
- **Response:**
  User baru & token akses

### Login

- **POST** `/api/users/login`
- **Body (JSON):**
  - username, password
- **Response:**
  Token akses & refresh

### Logout

- **POST** `/api/users/logout`
- **Header:** Authorization

### Refresh Token

- **POST** `/api/users/refresh-token`
- **Body (opsional):** `{ "refreshToken": "<token>" }`

### Get All Users

- **GET** `/api/users`
- **Header:** Authorization

### Get User by ID

- **GET** `/api/users/:id`
- **Header:** Authorization

### Update User

- **PUT** `/api/users/:id`
- **Header:** Authorization
- **Body:** form-data (gunakan form, bukan JSON!)
  - Semua field user (lihat register)
  - **profile_pic** (file, opsional)
- **Catatan:** Untuk upload foto profil, gunakan form-data dan field `profile_pic`.

### Delete User

- **DELETE** `/api/users/:id`
- **Header:** Authorization

---

## Blog

### Get All Blogs

- **GET** `/api/blogs`
- **Header:** Authorization

### Get Blog by ID

- **GET** `/api/blogs/:id`
- **Header:** Authorization

### Create Blog

- **POST** `/api/blogs`
- **Header:** Authorization
- **Body:** form-data (gunakan form, bukan JSON!)
  - title, content, authorId
  - **coverImage** (file, wajib)
- **Catatan:** Upload cover image dengan form-data field `coverImage`.

### Update Blog

- **PUT** `/api/blogs/:id`
- **Header:** Authorization
- **Body:** form-data (gunakan form, bukan JSON!)
  - title, content, authorId
  - **coverImage** (file, opsional)
- **Catatan:** Upload cover image baru jika ingin mengganti.

### Delete Blog

- **DELETE** `/api/blogs/:id`
- **Header:** Authorization

---

## Event

### Get All Events

- **GET** `/api/events`
- **Header:** Authorization

### Get Event by ID

- **GET** `/api/events/:id`
- **Header:** Authorization

### Create Event

- **POST** `/api/events`
- **Header:** Authorization
- **Body:** form-data (gunakan form, bukan JSON!)
  - title, subTitle, description, date, time, location, registrationStart, registrationEnd, creatorId
  - **coverImage** (file, wajib)
- **Catatan:** Upload cover image dengan form-data field `coverImage`.

### Update Event

- **PUT** `/api/events/:id`
- **Header:** Authorization
- **Body:** form-data (gunakan form, bukan JSON!)
  - Semua field event
  - **coverImage** (file, opsional)
- **Catatan:** Upload cover image baru jika ingin mengganti.

### Delete Event

- **DELETE** `/api/events/:id`
- **Header:** Authorization

---

## RSVP

### Get All RSVPs

- **GET** `/api/rsvps`
- **Header:** Authorization

### Get RSVP by ID

- **GET** `/api/rsvps/:id`
- **Header:** Authorization

### Create RSVP

- **POST** `/api/rsvps`
- **Header:** Authorization
- **Body (JSON):**
  - userId, eventId, status

### Update RSVP

- **PUT** `/api/rsvps/:id`
- **Header:** Authorization
- **Body (JSON):**
  - status

### Delete RSVP

- **DELETE** `/api/rsvps/:id`
- **Header:** Authorization

---

**Catatan Umum:**

- Untuk endpoint yang membutuhkan upload gambar (`coverImage` atau `profile_pic`), gunakan form-data di Postman/Insomnia, bukan raw JSON.
- Semua endpoint yang butuh login harus menyertakan header `Authorization: Bearer <token>`.
