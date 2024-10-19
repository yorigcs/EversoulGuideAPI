import './config/modules-alias'
import { env } from '@/main/config/env'
import { app } from '@/main/config/app'

export const executeServer = (): void => {
  const server = app.listen(env.port, () => {
    const processId = process.pid
    console.log(`Server listening on process ${processId} and port ${env.port}`)
  })

  process.on('SIGTERM', () => {
    server.close(() => process.exit())
  })
}
