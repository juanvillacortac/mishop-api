import jwt from 'jsonwebtoken'
import { Context } from './context'

export const getUserFromJWT = async (ctx: Context) => {
  const authHeader = ctx.request?.headers['authorization']
  const bearerLength = 'Bearer '.length
  if (authHeader?.length > bearerLength) {
    const token = authHeader.slice(bearerLength)
    const { ok, result } = await new Promise(resolve =>
      jwt.verify(token, import.meta.env.VITE_JWT_SECRET, (err, result) => {
        if (err) {
          resolve({
            ok: false,
            result: err
          })
        } else {
          resolve({
            ok: true,
            result,
          })
        }
      })
    )
    if (ok) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: result.id,
        },
        include: {
          shop: {
            include: {
              logo: true
            },
          },
        }
      })
      return user
    } else {
      throw new Error(result)
    }
  }
  throw new Error('Not authorized')
}
