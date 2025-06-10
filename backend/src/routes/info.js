import express from 'express'
import fs from 'fs'
import path from 'path'

const router = express.Router()

router.get('/', (req, res) => {
  const pkgPath = path.join(process.cwd(), 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

  res.json({
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    author: pkg.author,
    repository: pkg.repository,
    buildDate: new Date().toISOString()
  })
})

export default router
