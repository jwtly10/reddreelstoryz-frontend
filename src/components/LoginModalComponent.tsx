import {Form, Input, Modal} from 'antd'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

function LoginModalComponent({
  handleClose,
  open,
}: {
  handleClose: () => void
  open: boolean
}) {
  const { login, signup } = useAuth()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorText, setErrorText] = useState('')
  const [showSignup, setShowSignup] = useState(false)

  const [form] = Form.useForm()

  // TODO: Fix types
  const handleOk = async () => {
    if (!email || !password) return setErrorText('Please fill in all required fields')

    if (showSignup) {
      setConfirmLoading(true)
      try {
        await signup(firstname, lastname, email, password)
        handleClose()
      } catch (error: any) {
        setErrorText(error.message)
      } finally {
        setConfirmLoading(false)
      }
    } else {
      try {
        setConfirmLoading(true)
        await login(email, password)
        handleClose()
      } catch (error: any) {
        setErrorText(error.message)
      } finally {
        setConfirmLoading(false)
      }
    }
  }

  const handleSignupButtonClick = () => {
    setShowSignup(!showSignup)
  }

  const handleCloseClick = () => {
    if (confirmLoading) return
    handleClose()
  }


  return (
    <>
      <Modal
        title={showSignup ? 'Sign up' : 'Login'}
        centered
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCloseClick}
      >
        {showSignup ? (
          <>
            <Form layout='vertical' form={form} name='signup-login-form'>
              <Form.Item
                label='First name'
                name='firstname'
                rules={[
                  { required: true, message: 'Please input your first name!' },
                ]}
              >
                <Input
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label='Last name'
                name='lastname'
              >
                <Input
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label='Email'
                name='email'
                rules={[
                  { required: true, message: 'Please input your email!' },
                ]}
              >
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label='Password'
                name='password'
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}
              >
                <Input.Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>
            </Form>

            <p>
              Already have an account?{' '}
              <a className='link' onClick={handleSignupButtonClick}>
                Sign In
              </a>
            </p>
          </>
        ) : (
          <>
            <Form layout='vertical'>
              <Form.Item
                label='Email'
                name='email'
                rules={[
                  { required: true, message: 'Please input your email!' },
                ]}
              >
                <Input
                  value={email}
                  style={{ width: '100%' }}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label='Password'
                name='password'
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}
              >
                <Input.Password
                  value={password}
                  style={{ width: '100%' }}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>
            </Form>


            <p>
              Don't have an account?{' '}
              <a className='link' onClick={handleSignupButtonClick}>
                Sign up
              </a>
            </p>
          </>
        )}

        <p className="error">{errorText}</p>
      </Modal>
    </>
  )
}

export default LoginModalComponent
