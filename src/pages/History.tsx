import { useEffect, useState } from 'react'
import { downloadVideo, getHistory } from '../service/BackendService.ts'
import { Button, Card, Col, Popover, Row } from 'antd'
import video_placeholder from '../assets/video_placeholder.gif'
import { Container } from 'react-bootstrap'
import ReactPlayer from 'react-player'

export default function History() {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    getHistory()
      .then((res) => {
        setVideos(res)
      })
      .catch((error) => console.log(error))
  }, [])

  const formatDate = (inputDate: string) => {
    const date = new Date(inputDate)

    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2) // Months are zero-based
    const day = ('0' + date.getDate()).slice(-2)
    const hours = ('0' + date.getHours()).slice(-2)
    const minutes = ('0' + date.getMinutes()).slice(-2)
    const seconds = ('0' + date.getSeconds()).slice(-2)

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    return formattedDate
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
    await downloadVideo(processId).then(() => {
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
      <Row gutter={[10, 30]} justify='center' align='middle'>
        {videos.map((video: VideoData, index) => (
          <Col xs={24} sm={24} md={8} key={index}>
            <Card
              hoverable
              style={{ width: '100%', margin: 'auto' }} // Set a fixed height
              cover={
                video.video.fileUrl ? (
                  <div
                    className='d-flex p-2 text-center justify-content-center'
                    style={{ height: '100%' }}
                  >
                    <ReactPlayer
                      url={video.video.fileUrl}
                      width='100%'
                      maxHeight='250px'
                      controls
                    />
                  </div>
                ) : (
                  <div
                    className='d-flex p-2 text-center justify-content-center'
                    style={{ height: '100%' }}
                  >
                    <img
                      alt='example'
                      src={video_placeholder}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                )
              }
            >
              <div style={{ height: 250 }}>
                {/*<div>*/}
                {video.state === 'COMPLETED' ? (
                  <>
                    <h5>{video.video.title}</h5>
                    <p>{`Length: ${video.video.length} seconds`}</p>
                    <p>{`Created: ${formatDate(video.video.created)}`}</p>
                    <p>{`Generated: ${formatDate(video.video.uploadDate)}`}</p>
                    <br />
                    <Button
                      type='primary'
                      loading={downloading}
                      onClick={() => handleDownloadVideo(video.video.videoId)}
                    >
                      Download
                    </Button>
                  </>
                ) : video.state === 'FAILED' ? (
                  <>
                    <h5>{video.video.title}</h5>
                    <p>{`Created: ${formatDate(video.video.created)}`}</p>
                    <br />

                    <Popover
                      content={failedError(video.error)}
                      title='Video Generation Failed'
                    >
                      <Button type='primary' danger>
                        Failed - Click to see why
                      </Button>
                    </Popover>
                  </>
                ) : (
                  <>
                    <h5>{video.video.title}</h5>
                    <p>{`Your video is ${video.state.toLowerCase()}.`}</p>
                    <p>Please come back in a few minutes to see your video.</p>
                    <br />

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
