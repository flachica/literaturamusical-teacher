import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

// Plugin para persistencia directa en ficheros JSON y descarga de audio de YouTube
function jsonStoragePlugin() {
  const dataDir = path.resolve(__dirname, 'public/data')
  const audioDir = path.resolve(__dirname, 'public/audio')

  return {
    name: 'json-storage-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = req.url.split('?')[0]

        if (pathname.startsWith('/api/songs') || pathname.startsWith('/api/check-audio')) {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        }

        if (pathname === '/api/download-audio' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const { url } = JSON.parse(body)
              if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                return res.end(JSON.stringify({ error: 'URL de YouTube no válida.' }))
              }

              if (!fs.existsSync(audioDir)) {
                fs.mkdirSync(audioDir, { recursive: true })
              }

              let cleanUrl = url
              const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
              const match = url.match(regExp)
              const videoId = (match && match[2].length === 11) ? match[2] : null
              if (videoId) {
                cleanUrl = `https://www.youtube.com/watch?v=${videoId}`
              }

              const fileId = `audio_${Date.now()}`
              const outputPathPattern = path.join(audioDir, `${fileId}.%(ext)s`)
              
              // Extracción de pista de audio puro nativa (251 webm / 140 m4a)
              const targetQuery = (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) ? cleanUrl : `ytsearch1:${cleanUrl}`
              const cmd = `yt-dlp --no-playlist -f "251/249/140/139/ba" -o "${outputPathPattern}" "${targetQuery}"`
              exec(cmd, (err) => {
                if (err) {
                  res.statusCode = 500
                  res.setHeader('Content-Type', 'application/json')
                  return res.end(JSON.stringify({ error: 'Error al convertir audio con yt-dlp: ' + err.message }))
                }

                const files = fs.readdirSync(audioDir)
                const downloadedFile = files.find(f => f.startsWith(fileId))
                if (!downloadedFile) {
                  res.statusCode = 500
                  res.setHeader('Content-Type', 'application/json')
                  return res.end(JSON.stringify({ error: 'No se encontró el archivo procesado.' }))
                }

                const audioPath = `/audio/${downloadedFile}`
                res.setHeader('Content-Type', 'application/json')
                return res.end(JSON.stringify({ success: true, audioPath, filename: downloadedFile }))
              })
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              return res.end(JSON.stringify({ error: err.message }))
            }
          })
          return
        }

        if (pathname === '/api/check-audio' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const { filename } = JSON.parse(body)
              if (!filename) {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                return res.end(JSON.stringify({ error: 'Falta el parámetro filename.' }))
              }
              const cleanFilename = path.basename(filename)
              const filePath = path.join(audioDir, cleanFilename)
              const exists = fs.existsSync(filePath)
              res.setHeader('Content-Type', 'application/json')
              return res.end(JSON.stringify({ success: true, exists }))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              return res.end(JSON.stringify({ error: err.message }))
            }
          })
          return
        }

        if (pathname === '/api/figuras') {
          const figurasFilePath = path.join(dataDir, 'figuras_catalog.json')

          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json')
            if (fs.existsSync(figurasFilePath)) {
              return res.end(fs.readFileSync(figurasFilePath, 'utf8'))
            }
            return res.end(JSON.stringify([]))
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              try {
                if (!fs.existsSync(dataDir)) {
                  fs.mkdirSync(dataDir, { recursive: true })
                }
                fs.writeFileSync(figurasFilePath, body, 'utf8')
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, message: 'Fichero figuras_catalog.json guardado en disco.' }))
              } catch (err) {
                res.statusCode = 500
                res.end(JSON.stringify({ error: err.message }))
              }
            })
            return
          }
        }

        if (pathname === '/api/songs') {
          const songsFilePath = path.join(dataDir, 'songs_catalog.json')

          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json')
            if (fs.existsSync(songsFilePath)) {
              return res.end(fs.readFileSync(songsFilePath, 'utf8'))
            }
            return res.end(JSON.stringify([]))
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              try {
                if (!fs.existsSync(dataDir)) {
                  fs.mkdirSync(dataDir, { recursive: true })
                }
                fs.writeFileSync(songsFilePath, body, 'utf8')
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, message: 'Fichero songs_catalog.json guardado en disco.' }))
              } catch (err) {
                res.statusCode = 500
                res.end(JSON.stringify({ error: err.message }))
              }
            })
            return
          }
        }

        if (pathname === '/api/progress') {
          const progressFilePath = path.join(dataDir, 'user_progress.json')

          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json')
            if (fs.existsSync(progressFilePath)) {
              return res.end(fs.readFileSync(progressFilePath, 'utf8'))
            }
            return res.end(JSON.stringify({ puntos: 450, nivel: 3, estrellas: 5 }))
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              try {
                if (!fs.existsSync(dataDir)) {
                  fs.mkdirSync(dataDir, { recursive: true })
                }
                fs.writeFileSync(progressFilePath, body, 'utf8')
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, message: 'Fichero user_progress.json guardado en disco.' }))
              } catch (err) {
                res.statusCode = 500
                res.end(JSON.stringify({ error: err.message }))
              }
            })
            return
          }
        }

        if (pathname === '/api/detectives') {
          const detectivesFilePath = path.join(dataDir, 'detectives.json')

          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json')
            if (fs.existsSync(detectivesFilePath)) {
              return res.end(fs.readFileSync(detectivesFilePath, 'utf8'))
            }
            return res.end(JSON.stringify([]))
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              try {
                if (!fs.existsSync(dataDir)) {
                  fs.mkdirSync(dataDir, { recursive: true })
                }
                fs.writeFileSync(detectivesFilePath, body, 'utf8')
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, message: 'Fichero detectives.json guardado en disco.' }))
              } catch (err) {
                res.statusCode = 500
                res.end(JSON.stringify({ error: err.message }))
              }
            })
            return
          }
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), jsonStoragePlugin()],
  server: {
    port: 3000,
    open: true
  }
})
