import React from 'react'
import { Redirect } from 'react-router-dom'

function Protected({ isSignedIn, children }) {
  console.log("sid===>", isSignedIn)
  if (!isSignedIn) {
    return <Redirect
      to={{
        pathname: "/",
      }}
    />

  }
  return children
}
export default Protected