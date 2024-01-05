import { useEffect, useState } from 'react'
import * as service from '../service/BackendService.ts'
import { Button, Card, Col, Popover, Row } from 'antd'
import video_placeholder from '../assets/video_placeholder.gif'
import { Container } from 'react-bootstrap'

export default function History() {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    service
      .getHistory()
      .then((res) => {
        setVideos(res)
      })
      .catch((error) => console.log(error))
  }, [])

  const formatDate = (date: string) => {
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString()
  }

  const failedError = (error: string) => {
    return (
      <div>
        <p className='error'>{error}</p>
        <p>
          If this message isn't useful please get in contact at <br></br>
          <a href='contact@ai-content-generator.com'>
            contact@ai-content-generator.com
          </a>
        </p>
      </div>
    )
  }

  const handleDownloadVideo = async (processId: string) => {
    setDownloading(true)
    await service.downloadVideo(processId).then(() => {
      setDownloading(false)
    })
  }

  return (
    <Container>
      <div className='d-flex mt-5 mb-5 flex-column justify-content-center text-center'>
        <h1>History</h1>
        <p>
          Videos will be auto-deleted after 7 days. Download the ones you want
          to keep!
        </p>
      </div>
      <Row gutter={[16, 16]} justify='center' align='middle'>
        {videos.map((video: VideoData, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card
              hoverable
              style={{ width: '100%', margin: 'auto' }}
              cover={
                <img
                  alt='example'
                  src={video_placeholder}
                  style={{ width: '100%', height: 'auto' }}
                />
              }
            >
              <div style={{ height: 170 }}>
                {video.state === 'COMPLETED' ? (
                  <>
                    <h5>{video.video.fileName}</h5>
                    <p>{`Length: ${video.video.length} seconds`}</p>
                    <p>{`Created: ${formatDate(video.video.uploadDate)}`}</p>
                    <br></br>
                    <Button
                      type='primary'
                      loading={downloading}
                      onClick={() => handleDownloadVideo(video.video.videoId)}
                    >
                      Download
                    </Button>
                  </>
                ) : video.state === 'FAILED' ? (
                  <Popover
                    content={failedError(video.error)}
                    title='Video Generation Failed'
                  >
                    <Button type='primary' danger>
                      Failed - Click to see why
                    </Button>
                  </Popover>
                ) : (
                  <>
                    <p>{`Your video is ${video.state.toLowerCase()}.`}</p>
                    <p>Please come back in a few minutes to see your video.</p>
                    <br></br>

                    <Button type='primary' loading={true}>
                      {video.state.charAt(0).toUpperCase() +
                        video.state.slice(1).toLowerCase()}
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
