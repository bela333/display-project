# Display Project

## Setup

- Choose a username and a strong password for minio.env
- Create buckets according to [S3 setup](#s3-setup)
- Configure region in minio
- Create token for minio user
- Populate main.env with bucket names and tokens

## S3 setup

You need to create a bucket for calibrations. It needs to be readable by anyone.

You need to create a bucket for media. It needs to be readable by anyone.

Example policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
          "Effect": "Allow",
          "Principal": "*",
          "Action": "s3:GetObject",
          "Resource": "arn:aws:s3:::*"
        }
    ]
}
```

## Others

TODO:

- [x] Clear file input after it is used
- [x] Add different bucket for media
- [x] Remove all homographies on file processing
- [x] Dockerfile.example is very suspicious. Docker doesn't like it a lot either
- [x] Close subscription
- [x] Actually remove screen on disconnect
  - Not revelant anymore
- [x] Add proper error handling when no tags appear on image
- [x] Resolve TODOs in source code files
- [x] Make sure rooms actually exist when changing them
- [x] Make sure size is responsive
- [ ] Add uploaded video option
- [ ] Add presentation option (?)
- [ ] Potentially use websockets for better reliability
- [ ] Auto synchronize YouTube videos (alternatively remove non-uploaded video option)
- [ ] Tests