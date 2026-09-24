import { useEffect, useState } from 'react'

function Viewer() {
  const [status, setStatus] = useState('Loading...')
  const [expectedReturnTime, setExpectedReturnTime] = useState('')

  const loadStatus = () => {
    fetch('https://hod-availability-backend.onrender.com/api/status')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Backend error')
        }

        return response.json()
      })
      .then((data) => {
        setStatus(data.status)
        setExpectedReturnTime(data.expectedReturnTime || '')
      })
      .catch((error) => {
        console.log(error)
        setStatus('Unable to connect to backend')
      })
  }

  useEffect(() => {
    loadStatus()

    const timer = setInterval(loadStatus, 5000)

    return () => clearInterval(timer)
  }, [])

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

  const getStatusClass = () => {
    if (status === 'Available') return 'available'
    if (status === 'In Meeting') return 'meeting'
    if (status === 'Away') return 'away'
    if (status === 'Not Available') return 'not-available'

    return 'unknown'
  }

  return (
    <div className="app">
      <div className="container">

        <div className="header">

          <div className="header-icon">H</div>

          <h1>HOD Availability</h1>

          <p>
            Check the current availability of the Head of Department
          </p>

        </div>

        <div className="card">

          <h2>Current Status</h2>

          <div className={`status-badge ${getStatusClass()}`}>
            <span className="status-dot"></span>
            {status}
          </div>

          {(status === 'In Meeting' || status === 'Away') && (
            <div className="return-section">

              <label>Expected Return</label>

              <div className="return-display">
                <strong>
                  {formatTime(expectedReturnTime)}
                </strong>
              </div>

            </div>
          )}

          <div className="divider"></div>

          <p className="viewer-message">
            This information is updated automatically.
          </p>

        </div>

        <p className="footer">
          HOD Availability Management System
        </p>

      </div>
    </div>
  )
}

export default Viewer