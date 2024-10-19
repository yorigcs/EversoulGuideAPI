import './config/modules-alias'

import { cpus } from 'os'
import cluster from 'cluster'
import { executeServer } from '@/main/server'

const runPrimaryProcess = (): void => {
  const processCount = cpus().length
  for (let i = 0; i < processCount; i++) {
    cluster.fork()
  }
  cluster.on('exit', (worker, code) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      cluster.fork()
    }
  })
}

cluster.isPrimary ? runPrimaryProcess() : executeServer()
