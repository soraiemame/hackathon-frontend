export interface SignedUrlRequest {
  filename: string;
  content_type: string;
}

export interface SignedUrlResponse {
  upload_url: string;
  file_key: string;
}