import jwt from 'jsonwebtoken'

export function verifyToken(req, res, next) {
  const token = req.cookies?.discord_token
  // console.log(token)
  if (!token) return res.sendStatus(401)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.sendStatus(403)
  }
}
