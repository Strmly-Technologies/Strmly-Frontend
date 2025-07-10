export interface Notification {
  _id: string
  group: string //Revenue or Non revenue
  content: string
  type: string  
  videoId?: string
  timestamp: string
  avatar: string
  read: boolean
  URL: string
}

//For revenue:
// Type : 'gifting', 'content purchase', 'community fee'

//For non-revenue:
// Type : 'video upvote', 'comment', 'follow', 'reply', 

//gifting:
//{ _id : "390494", group: "revenue", content: "Samarth gifted you ₹100 for your comment on video (title)/your video (title)", type: "gifting", videoId: "12345", timestamp: "2023-10-01T12:00:00Z", avatar: "/avatars/samarth.png", read: false, URL: "/api/v1/videos/12345" }

//content purchase:
// { _id : "390495", group: "revenue", content: "Samarth purchased your video (title) for ₹100", type: "content purchase", videoId: "12345", timestamp: "2023-10-01T12:00:00Z", avatar: "/avatars/samarth.png", read: false, URL: "/api/v1/videos/12345" }

//community fee:
// { _id : "390496", group: "revenue", content: "Samarth paid ₹100 for community (name)", type: "community fee", timestamp: "2023-10-01T12:00:00Z", avatar: "/avatars/samarth.png", read: false, URL: "/community/name" }

//video upvote:
// { _id : "390497", group: "non-revenue", content: "Samarth upvoted your comment on the video (title)", type: "video upvote", videoId: "12345", timestamp: "2023-10-01T12:00:00Z", avatar: "/avatars/samarth.png", read: false, URL: "/api/v1/videos/12345" }

//comment:
// { _id : "390498", group: "non-revenue", content: "Samarth commented on your video (title)", type: "comment", videoId: "12345", timestamp: "2023-10-01T12:00:00Z", avatar: "/avatars/samarth.png", read: false, URL: "/api/v1/videos/12345" }

//follow:
// { _id : "390499", group: "non-revenue", content: "Samarth just followed you!", type: "follow", timestamp: "2023-10-01T12:00:00Z", avatar: "/avatars/samarth.png", read: false, URL: "/api/v1/users/samarth" }

//reply:
// { _id : "390500", group: "non-revenue", content: "Samarth replied to your comment on the video (title)", type: "reply", videoId: "12345", timestamp: "2023-10-01T12:00:00Z", avatar: "/avatars/samarth.png", read: false, URL: "/api/v1/videos/12345" }
