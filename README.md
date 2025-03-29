# Display Project

## Setup

- Choose a username and a strong password for minio.env
- Create buckets according to [S3 setup](#s3-setup)
- Configure region in minio
- Create token for minio user
- Populate main.env with bucket names and tokens

## S3 setup

You need to create a bucket for calibrations. It needs to be readable by anyone.

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

- [ ] Add different bucket for media
- [ ] Add video option
- [ ] Add presentation option (?)
- [ ] Make sure size is responsive
- [ ] Actually remove screen on disconnect
- [ ] Close subscription
- [ ] Remove all homographies on file processing
- [ ] Add proper error handling when no tags appear on image
- [ ] Make sure rooms actually exist when changing them
- [ ] Remove prism
