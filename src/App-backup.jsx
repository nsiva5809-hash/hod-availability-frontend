import { useEffect, useState } from 'react'

const API_URL = 'https://hod-availability-backend.onrender.com'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!sessionStorage.getItem('hodToken')
  )

  const [hodId, setHodId] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  const [status, setStatus] = useState('Loading...')
  const [expectedReturnTime, setExpectedReturnTime] = useState('')

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault()

    setLoginError('')
    setLoggingIn(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          hodId,
          password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setLoginError(data.error || 'Login failed')
        setLoggingIn(false)
        return
      }

      sessionStorage.setItem('hodToken', data.token)

      setIsLoggedIn(true)
      setPassword('')
      setLoginError('')
      setLoggingIn(false)
    } catch (error) {
      console.error('Login error:', error)

      setLoginError('Unable to connect to backend')
      setLoggingIn(false)
    }
  }

  // LOAD STATUS
  useEffect(() => {
    if (!isLoggedIn) {
      return
    }

    const loadStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/api/status`)

        if (!response.ok) {
          throw new Error('Backend error')
        }

        const data = await response.json()

        setStatus(data.status)
        setExpectedReturnTime(data.expectedReturnTime || '')
      } catch (error) {
        console.error('Status error:', error)
        setStatus('Unable to connect to backend')
      }
    }

    loadStatus()
  }, [isLoggedIn])

  // UPDATE STATUS
  const updateStatus = async (newStatus) => {
    const token = sessionStorage.getItem('hodToken')

    try {
      const response = await fetch(`${API_URL}/api/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          expectedReturnTime
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (
          data.error === 'Invalid or expired token' ||
          data.error === 'Authentication required'
        ) {
          sessionStorage.removeItem('hodToken')
          setIsLoggedIn(false)
          setLoginError('Your session has expired. Please login again.')
          return
        }

        throw new Error(data.error || 'Unable to update status')
      }

      setStatus(data.status)
      setExpectedReturnTime(data.expectedReturnTime || '')
    } catch (error) {
      console.error('Update status error:', error)
      setStatus('Unable to update status')
    }
  }

  // LOGOUT
  const handleLogout = () => {
    sessionStorage.removeItem('hodToken')

    setIsLoggedIn(false)
    setHodId('')
    setPassword('')
    setLoginError('')
    setStatus('Loading...')
    setExpectedReturnTime('')
  }

  // FORMAT TIME
  const formatTime = (time) => {
    if (!time || time === '00:00') {
      return 'Not specified'
    }

    const [hours, minutes] = time.split(':')
    const hour = Number(hours)

    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12

    return `${displayHour}:${minutes} ${period}`
  }

  // STATUS CLASS
  const getStatusClass = () => {
    if (status === 'Available') {
      return 'available'
    }

    if (status === 'In Meeting') {
      return 'meeting'
    }

    if (status === 'Away') {
      return 'away'
    }

    if (status === 'Not Available') {
      return 'not-available'
    }

    return 'unknown'
  }

  // =========================
  // LOGIN PAGE
  // =========================

  if (!isLoggedIn) {
    return (
      <div className="app">
        <div className="container">

          <div className="header">
            <div className="header-icon">
              H
            </div>

            <h1>
              HOD Availability System
            </h1>

            <p>
              HOD Login
            </p>
          </div>

          <div className="card">

            <h2>
              HOD Login
            </h2>

            <form onSubmit={handleLogin}>

              <div className="return-section">

                <label>
                  HOD ID
                </label>

                <input
                  type="text"
                  value={hodId}
                  onChange={(e) => setHodId(e.target.value)}
                  placeholder="Enter HOD ID"
                  autoComplete="username"
                  required
                />

              </div>

              <div className="return-section">

                <label>
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />

              </div>

              {loginError && (
                <p className="viewer-message">
                  {loginError}
                </p>
              )}

              <div
                className="buttons"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >

                <button
                  type="submit"
                  className="available-btn"
                  disabled={loggingIn}
                >
                  {loggingIn ? 'Logging in...' : 'Login'}
                </button>

              </div>

            </form>

          </div>

          <p className="footer">
            HOD Availability Management System
          </p>

        </div>
      </div>
    )
  }

  // =========================
  // HOD DASHBOARD
  // =========================

  return (
    <div className="app">

      <div className="container">

        <div className="header">

          <div className="header-icon">
            H
          </div>

          <h1>
            HOD Availability System
          </h1>

          <p>
            Check the current availability of the Head of Department
          </p>

        </div>

        <div className="card">

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}
          >

            <h2>
              HOD Status
            </h2>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                padding: '8px 14px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>

          </div>

          <div className={`status-badge ${getStatusClass()}`}>

            <span className="status-dot"></span>

            {status}

          </div>

          {(status === 'In Meeting' || status === 'Away') && (
            <div className="return-section">

              <label>
                Expected Return Time
              </label>

              <input
                type="time"
                value={expectedReturnTime}
                onChange={(e) =>
                  setExpectedReturnTime(e.target.value)
                }
              />

              <div className="return-display">

                Expected Return:{' '}

                <strong>
                  {formatTime(expectedReturnTime)}
                </strong>

              </div>

            </div>
          )}

          <div className="divider"></div>

          <h3>
            Update Availability
          </h3>

          <div className="buttons">

            <button
              className="available-btn"
              onClick={() => updateStatus('Available')}
            >
              Available
            </button>

            <button
              className="meeting-btn"
              onClick={() => updateStatus('In Meeting')}
            >
              In Meeting
            </button>

            <button
              className="away-btn"
              onClick={() => updateStatus('Away')}
            >
              Away
            </button>

            <button
              className="unavailable-btn"
              onClick={() => updateStatus('Not Available')}
            >
              Not Available
            </button>

          </div>

        </div>

        <p className="footer">
          HOD Availability Management System
        </p>

      </div>

    </div>
  )
}

export default App