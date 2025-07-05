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
    "_id": "string", // Unique identifier for the video
    "title": "string", // Title of the video
    "description": "string", // Description of the video
    "videoUrl": "string", // URL of the video file
    "thumbnailUrl": "string", // URL of the video's thumbnail image
    "type": "short" | "long", // Type of the video
    "user": {
      "id": "string", // Unique identifier for the uploader
      "name": "string", // Name of the uploader
      "avatar": "string" // URL of the uploader's avatar image
    },
    "likes": number, // Number of likes
    "comments": number, // Number of comments
    "shares": number, // Number of shares
    "views": number, // Number of views
    "earnings": number, // Earnings from the video
    "community": "string | null", // Community ID (optional)
    "series": "string | null", // Series ID (optional)
    "episodes": [ // List of episodes (optional)
      {
        "id": number, // Unique identifier for the episode
        "videoURL": "string" // URL of the episode video
      }
    ],
    "tags": ["string"], // Tags (optional)
    "isLiked": boolean, // Whether the viewer has liked the video
    "createdAt": "string (ISO date)", // Creation date
    "updatedAt": "string (ISO date)", // Last update date (optional)
  }
]
```

**Notes:**
- All fields are required unless otherwise specified.
- `episodes`, `community`, `series`, `tags`, and `updatedAt` are optional and may be omitted or set to `null`/empty.
- `isLiked` is a boolean indicating if the current user has liked the video.
- `createdAt` and `updatedAt` are ISO date strings.
- `progress` is not part of the backend response and is managed on the frontend only.

---

For any questions, contact the frontend team.
