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

              const rawSongId = body.songId || body.id
              const fileId = rawSongId 
                ? rawSongId.replace(/[^a-zA-Z0-9_-]/g, '_') 
                : `audio_${Date.now()}`

              // Limpiar archivos anteriores de este songId para evitar duplicados residuales
              if (fs.existsSync(audioDir)) {
                const oldFiles = fs.readdirSync(audioDir)
                oldFiles.forEach(oldF => {
                  if (oldF.startsWith(fileId + '.')) {
                    try { fs.unlinkSync(path.join(audioDir, oldF)) } catch (_) {}
                  }
                })
              }

              const outputPathPattern = path.join(audioDir, `${fileId}.%(ext)s`)
              
              // Extracción de pista de audio puro nativa (251 webm / 140 m4a / 18 mp4)
              const targetQuery = (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) ? cleanUrl : `ytsearch1:${cleanUrl}`
              const cmd = `yt-dlp --js-runtimes node:/usr/bin/node --no-playlist --remote-components ejs:github --extractor-args "youtube:player_client=android,mweb" -f "251/249/140/139/ba/18/b" -o "${outputPathPattern}" "${targetQuery}"`
              exec(cmd, (err) => {
                if (err) {
                  res.statusCode = 500
                  res.setHeader('Content-Type', 'application/json')
                  return res.end(JSON.stringify({ error: 'Error al convertir audio con yt-dlp: ' + err.message }))
                }

                const files = fs.readdirSync(audioDir)
                const downloadedFile = files.find(f => f.startsWith(fileId + '.'))
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

        if (pathname === '/api/plugins') {
          const pluginsDir = path.resolve(__dirname, 'plugins')
          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json')
            try {
              if (!fs.existsSync(pluginsDir)) {
                return res.end(JSON.stringify([]))
              }
              const pluginDirs = fs.readdirSync(pluginsDir)
              const pluginsList = []
              for (const dir of pluginDirs) {
                const pluginPath = path.join(pluginsDir, dir)
                if (fs.statSync(pluginPath).isDirectory()) {
                  const manifestPath = path.join(pluginPath, 'manifest.json')
                  if (fs.existsSync(manifestPath)) {
                    try {
                      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
                      let songs = []
                      const songsDir = path.join(pluginPath, 'songs')
                      if (fs.existsSync(songsDir)) {
                        const sFiles = fs.readdirSync(songsDir).filter(f => f.endsWith('.json'))
                        for (const sf of sFiles) {
                          const content = JSON.parse(fs.readFileSync(path.join(songsDir, sf), 'utf8'))
                          if (Array.isArray(content)) songs.push(...content)
                          else if (content && typeof content === 'object') songs.push(content)
                        }
                      }
                      let figures = []
                      const figuresDir = path.join(pluginPath, 'figures')
                      if (fs.existsSync(figuresDir)) {
                        const fFiles = fs.readdirSync(figuresDir).filter(f => f.endsWith('.json'))
                        for (const ff of fFiles) {
                          const content = JSON.parse(fs.readFileSync(path.join(figuresDir, ff), 'utf8'))
                          if (Array.isArray(content)) figures.push(...content)
                        }
                      }
                      let dictionary = {}
                      const dictDir = path.join(pluginPath, 'dictionary')
                      if (fs.existsSync(dictDir)) {
                        const dFiles = fs.readdirSync(dictDir).filter(f => f.endsWith('.json'))
                        for (const df of dFiles) {
                          const content = JSON.parse(fs.readFileSync(path.join(dictDir, df), 'utf8'))
                          if (content && typeof content === 'object') Object.assign(dictionary, content)
                        }
                      }
                      pluginsList.push({
                        ...manifest,
                        dirName: dir,
                        pluginPath,
                        songsCount: songs.length,
                        figuresCount: figures.length,
                        dictionaryCount: Object.keys(dictionary).length,
                        songs,
                        figures,
                        dictionary
                      })
                    } catch (e) {
                      console.error(`Error leyendo manifest de plugin ${dir}:`, e.message)
                    }
                  }
                }
              }
              return res.end(JSON.stringify(pluginsList))
            } catch (err) {
              res.statusCode = 500
              return res.end(JSON.stringify({ error: err.message }))
            }
          }

          if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              try {
                const { repoUrl } = JSON.parse(body)
                if (!repoUrl) {
                  res.statusCode = 400
                  return res.end(JSON.stringify({ error: 'URL del repositorio no proporcionada.' }))
                }
                const repoName = repoUrl.split('/').pop().replace(/\.git$/, '')
                const targetDir = path.join(pluginsDir, repoName)
                if (fs.existsSync(targetDir)) {
                  exec(`git -C "${targetDir}" pull`, (err) => {
                    if (err) {
                      res.statusCode = 500
                      return res.end(JSON.stringify({ error: 'Error al actualizar repositorio git pull: ' + err.message }))
                    }
                    res.setHeader('Content-Type', 'application/json')
                    return res.end(JSON.stringify({ success: true, message: `Plugin ${repoName} actualizado con éxito.` }))
                  })
                } else {
                  if (!fs.existsSync(pluginsDir)) fs.mkdirSync(pluginsDir, { recursive: true })
                  exec(`git clone "${repoUrl}" "${targetDir}"`, (err) => {
                    if (err) {
                      res.statusCode = 500
                      return res.end(JSON.stringify({ error: 'Error al clonar repositorio git clone: ' + err.message }))
                    }
                    res.setHeader('Content-Type', 'application/json')
                    return res.end(JSON.stringify({ success: true, message: `Plugin ${repoName} clonado e instalado.` }))
                  })
                }
              } catch (err) {
                res.statusCode = 500
                return res.end(JSON.stringify({ error: err.message }))
              }
            })
            return
          }
        }

        if (pathname === '/api/figuras') {
          const figurasFilePath = path.join(dataDir, 'figuras_catalog.json')

          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json')
            let localFigures = []
            if (fs.existsSync(figurasFilePath)) {
              try { localFigures = JSON.parse(fs.readFileSync(figurasFilePath, 'utf8')) } catch (_) {}
            }
            // Agrupar figuras de plugins
            const pluginsDir = path.resolve(__dirname, 'plugins')
            let pluginFigures = []
            if (fs.existsSync(pluginsDir)) {
              for (const dir of fs.readdirSync(pluginsDir)) {
                const fPath = path.join(pluginsDir, dir, 'figures', 'figuras_catalog.json')
                if (fs.existsSync(fPath)) {
                  try { pluginFigures.push(...JSON.parse(fs.readFileSync(fPath, 'utf8'))) } catch (_) {}
                }
              }
            }
            const figureMap = new Map()
            localFigures.forEach(f => figureMap.set(f.id, f))
            pluginFigures.forEach(f => figureMap.set(f.id, f))
            return res.end(JSON.stringify(Array.from(figureMap.values())))
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

                // Si existe el plugin oficial literaturamusical-lessons, actualizar también su fichero para git
                const officialPluginFigPath = path.resolve(__dirname, 'plugins/literaturamusical-lessons/figures/figuras_catalog.json')
                if (fs.existsSync(path.dirname(officialPluginFigPath))) {
                  fs.writeFileSync(officialPluginFigPath, body, 'utf8')
                }

                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, message: 'Fichero figuras_catalog.json guardado en disco y plugin.' }))
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
            let localSongs = []
            if (fs.existsSync(songsFilePath)) {
              try { localSongs = JSON.parse(fs.readFileSync(songsFilePath, 'utf8')) } catch (_) {}
            }
            const pluginsDir = path.resolve(__dirname, 'plugins')
            let pluginSongs = []
            if (fs.existsSync(pluginsDir)) {
              for (const dir of fs.readdirSync(pluginsDir)) {
                const sDir = path.join(pluginsDir, dir, 'songs')
                if (fs.existsSync(sDir)) {
                  for (const sf of fs.readdirSync(sDir).filter(f => f.endsWith('.json'))) {
                    try {
                      const content = JSON.parse(fs.readFileSync(path.join(sDir, sf), 'utf8'))
                      if (Array.isArray(content)) pluginSongs.push(...content)
                      else if (content && typeof content === 'object') pluginSongs.push(content)
                    } catch (_) {}
                  }
                }
              }
            }
            const songMap = new Map()
            localSongs.forEach(s => songMap.set(s.id, s))
            pluginSongs.forEach(s => songMap.set(s.id, s))
            return res.end(JSON.stringify(Array.from(songMap.values())))
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

                // Si existe el plugin oficial literaturamusical-lessons, actualizar también su fichero para git
                const officialPluginSongPath = path.resolve(__dirname, 'plugins/literaturamusical-lessons/songs/songs_catalog.json')
                if (fs.existsSync(path.dirname(officialPluginSongPath))) {
                  fs.writeFileSync(officialPluginSongPath, body, 'utf8')
                }

                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, message: 'Fichero songs_catalog.json guardado en disco y plugin.' }))
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

