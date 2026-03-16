# API Endpoints Summary — Hotel_Stack

## Authentication

| Endpoint | Method | Description | Body |
|---|---|---|---|
| `/api/SingIn` | POST | Login user | `{ "email": "test@test.com", "password": "1234" }` |
| `/api/SingUp` | POST | Register user | `{ "email": "test@test.com", "password": "1234" }` |
| `/api/current-user` | POST | Get current user (ต้องมี JWT) | None |

---

## Hotel

| Endpoint | Method | Description | Body / Params |
|---|---|---|---|
| `/api/hotel` | GET | Get all hotels | None |
| `/api/hotel/:id` | GET | Get hotel by ID | None |
| `/api/hotel` | POST | Create hotel (owner) | FormData: `images`, `name`, `city`, `country`, `description`, `address` |
| `/api/hotel/:id` | PUT | Edit hotel (owner) | FormData: `images`, fields ที่แก้ไข |
| `/api/hotel/delete` | POST | Delete hotel (owner) | `{ "id": 1 }` |
| `/api/hotelmanager/:id` | GET | Get hotel by owner ID | None |

---

## Rooms

| Endpoint | Method | Description | Body / Params |
|---|---|---|---|
| `/api/hotel/rooms/:idhotel/all` | GET | Get all rooms by hotel | None |
| `/api/hotel/rooms/:idhotel/:id` | GET | Get room by ID | None |
| `/api/hotel/rooms` | POST | Create room (owner) | FormData: `images`, `name`, `max_guests`, `base_price`, `hotel_id` |
| `/api/hotel/rooms/:id` | PUT | Edit room (owner) | FormData: fields ที่แก้ไข |
| `/api/hotel/rooms/Delete` | POST | Delete room (owner) | `{ "id": 1 }` |
| `/api/roomcheck` | POST | Check room availability | `{ "roomid": 1, "datein": "2026-04-01", "dateout": "2026-04-03" }` |
| `/api/listto` | POST | Get room detail | `{ "id": 1 }` |
| `/api/roomimages` | POST | Get room images | `{ "id": 1 }` |
| `/api/hotel/roomsimg/:rid` | POST | Add room image | FormData: `image` |
| `/api/hotel/roomsimg/:id` | DELETE | Remove room image | None |

---

## Search

| Endpoint | Method | Description | Query Params |
|---|---|---|---|
| `/api/search` | GET | Search available rooms | `?city=กระบี่&datein=2026-04-01&dateout=2026-04-03&guests=2` |

---

## Booking

| Endpoint | Method | Description | Body |
|---|---|---|---|
| `/api/booking` | POST | Create booking (ต้องมี JWT) | `{ "room_id": 1, "datein": "2026-04-01", "dateout": "2026-04-03" }` |
| `/api/checkbook/:id` | GET | Get booking by user ID | None |
| `/api/cancelbooking` | POST | Cancel booking (ต้องมี JWT) | `{ "id": 1 }` |
| `/api/bookings/update` | PUT | Update booking status (owner) | `{ "id": 1, "status": "confirmed" }` |
| `/api/dashboard/owner` | POST | Get bookings for owner | `{ "id": 1 }` |
| `/api/dashboard/ownercheck` | POST | Get pending bookings for owner | `{ "id": 1 }` |

---

## Review

| Endpoint | Method | Description | Body |
|---|---|---|---|
| `/api/review` | POST | Add review (ต้องมี JWT) | `{ "hotel_id": 1, "rating": 5, "comment": "ดีมาก" }` |

---

## Admin

| Endpoint | Method | Description | Body / Params |
|---|---|---|---|
| `/api/admin/stats` | GET | Get system stats | None |
| `/api/admin/users` | GET | Get all users | None |
| `/api/admin/users/:id/ban` | PUT | Ban user | None |
| `/api/admin/users/:id/unban` | PUT | Unban user | None |
| `/api/admin/users/:id/role` | PUT | Change user role | `{ "role": "owner" }` |
| `/api/admin/users/:id` | DELETE | Delete user | None |
| `/api/admin/hotels` | GET | Get all hotels (admin) | None |
| `/api/admin/hotels/:id` | DELETE | Delete hotel (admin) | None |

---

> **หมายเหตุ:** Endpoint ที่ต้องมี JWT ให้แนบ Header: `Authorization: Bearer <token>` ทุกครั้ง
