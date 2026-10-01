import { useState } from 'react'
import { Link } from 'react-router-dom'

// Lets a visitor log in, or navigate to the Create Account view. Since this
// project has no backend, "logging in" just validates the form client-side
// and shows a confirmation — no real authentication happens.
function AccountView() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  function validate() {
    const nextErrors = {}
    if (!login.trim()) nextErrors.login = 'Username or email is required.'
    if (!password) nextErrors.password = 'Password is required.'
    return nextErrors
  }

  function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    setSuccess(Object.keys(nextErrors).length === 0)
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <h1 className="h3 mb-4 text-center">Account</h1>

          <div className="card mb-4">
            <div className="card-body">
              <h2 className="h5 card-title">Log In</h2>

              {success && (
                <div className="alert alert-success py-2" role="status">
                  Form validated successfully. (This demo has no backend, so no real
                  sign-in occurs.)
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label htmlFor="login" className="form-label">
                    Username or Email
                  </label>
                  <input
                    id="login"
                    type="text"
                    className={`form-control ${errors.login ? 'is-invalid' : ''}`}
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                  />
                  {errors.login && <div className="invalid-feedback">{errors.login}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Log In
                </button>
              </form>
            </div>
          </div>

          <div className="text-center">
            <p className="mb-2 text-muted">New to Digital Art Supplies?</p>
            <Link to="/account/create" className="btn btn-outline-secondary w-100">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountView
