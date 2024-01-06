import { Container } from 'react-bootstrap'
import { Button, Form, Input, notification, Select } from 'antd'
import { useState } from 'react'
import { generateFromRedditURL } from '../service/BackendService.ts'
import { Link } from 'react-router-dom'

export default function RedditUrlGenComponent() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [api, contextHolder] = notification.useNotification()

  const bgOptions = ['Minecraft Parkour', 'Mirrors Edge']

  const handleGeneration = (values: any) => {
    console.log(values.url)
    // Clear error
    setError('')

    // Create req object
    const req = {
      url: values.url,
      backgroundVideo: values.backgroundVideo,
    }

    generateFromRedditURL(req)
      .then((res) => {
        handleQueuedVideo(res)
        setError('')
      })
      .catch((error) => {
        setError(error.message)
      })
  }

  const handleQueuedVideo = (res: any) => {
    api.open({
      message: 'Video generation queued',
      description: (
        <div>
          <p
            style={{
              fontStyle: 'italic',
              color: 'DimGrey',
            }}
          >{`ProcessID: ${res}`}</p>
          <p>
            Your video is now in the queue to be process. This can take a few
            minutes. You can check the status of your video{' '}
            <Link to='/history'>here</Link>.
            <br />
            <br />
            Or you can go ahead and generate another video :)
          </p>
        </div>
      ),
      duration: 10,
    })
  }

  return (
    <>
      {contextHolder}
      <Container className='d-flex mt-5 mb-5 flex-column justify-content-center text-center'>
        <Form
          layout='vertical'
          name='reddit-url-generation-form'
          onFinish={handleGeneration}
          onFinishFailed={() => {}}
        >
          <Form.Item
            label='Reddit Url'
            name='url'
            rules={[{ required: true, message: 'Please enter a reddit URL' }]}
            initialValue={
              'https://www.reddit.com/r/AmItheAsshole/comments/1905uij/aita_for_not_continuing_my_reception_after_my/'
            }
          >
            <Input value={url} onChange={(e) => setUrl(e.target.value)} />
          </Form.Item>

          <Form.Item
            label='Background Video'
            name='backgroundVideo'
            rules={[
              { required: true, message: 'Please select a background video' },
            ]}
          >
            <Select placeholder='Select a background video' allowClear>
              {bgOptions.map((bg, index) => (
                <Select.Option key={index} value={bg}>
                  {bg}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Generate video
            </Button>
          </Form.Item>
        </Form>

        <p className='error m-3'>{error}</p>
      </Container>
    </>
  )
}
