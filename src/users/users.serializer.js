const serializeUser = (user) => {
  return {
    email: user.email,
    subscription: user.subscription,
  }
}

const serializeUserWithToken = (userWithToken) => {
  return {
    user: serializeUser(userWithToken.user),
    token: userWithToken.token,
  }
}

exports.serializeUser = serializeUser
exports.serializeUserWithToken = serializeUserWithToken
