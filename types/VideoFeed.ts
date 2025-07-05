 export interface Video {
  _id: string // Unique identifier for the video
  title: string // Title of the video
  description: string // Description of the video
  videoUrl: string // URL of the video file
  thumbnailUrl: string // URL of the video's thumbnail image
  type: "short" | "long" // Type of the video, either short or long
  userid : string // Unique identifier for the uploader
  user: {
    id: string // Unique identifier for the uploader
    name: string // Name of the uploader
    avatar: string // URL of the uploader's avatar image
  }
  likes: number // Number of likes the video has received
  comments: number // Number of comments on the video
  shares: number // Number of times the video has been shared
  views: number // Number of views the video has received
  earnings: number // Earnings from the video, if applicable
  community?: string // Optional field if the video is a part of a community 
  series?: string // Optional field if the video is part of a series
  episodes?: Array<{
    id: number // Unique identifier for the episode
    videoURL: string // URL of the episode video
  }>
  tags?: string[]   // Optional field for tags(future plans)
  isLiked: boolean  // Whether the viewer has liked the video
  createdAt: string // When was the video created
  updatedAt?: string // Optional field for updatedAt
}