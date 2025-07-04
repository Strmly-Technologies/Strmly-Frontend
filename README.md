# Strmly-Frontend

## API Request & Response Format

### Endpoint: `/api/videos`

#### Request Parameters
| Name      | Type    | Required | Description                                 |
|-----------|---------|----------|---------------------------------------------|
| type      | string  | Yes      | Type of videos to fetch (`short` or `long`) |
| page      | number  | Yes      | Page number for pagination                  |
| limit     | number  | Yes      | Maximum number of videos to fetch           |
| token     | string  | Yes      | Bearer authentication token (in header)     |

**Example Request:**
```http
GET /api/videos?type=short&page=1&limit=10
Authorization: Bearer <token>
Content-Type: application/json
```

---

#### Response Format
Returns an array of video objects. Each object has the following structure:

```json
[
  {
    "_id": "string",
    "title": "string",
    "description": "string",
    "videoUrl": "string",
    "thumbnailUrl": "string",
    "type": "short" | "long",
    "status": "DRAFT" | "PROCESSING" | "PUBLISHED" | "FAILED" | "PRIVATE",
    "user": {
      "id": "string",
      "name": "string",
      "username": "string",
      "avatar": "string"
    },
    "likes": number,
    "comments": number,
    "shares": number,
    "views": number,
    "earnings": number,
    "progress": number,
    "community": "string | null",
    "series": "string | null",
    "currentEpisode": number,
    "episodes": [
      {
        "id": number,
        "videoURL": "string"
      }
    ],
    "tags": ["string"],
    "isLiked": boolean,
    "createdAt": "string (ISO date)"
  }
]
```

**Notes:**
- All fields are required unless otherwise specified.
- `episodes` can be an empty array if not applicable.
- `community` and `series` can be `null` if not set.
- `progress` is a frontend-only field and may be set to 0 by default.

---

For any questions, contact the frontend team.
