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

const serializeUserAvatar = (user) => {
  return {
    avatarURL: user.avatarURL,
  }
}

exports.serializeUser = serializeUser
exports.serializeUserWithToken = serializeUserWithToken
exports.serializeUserAvatar = serializeUserAvatar
