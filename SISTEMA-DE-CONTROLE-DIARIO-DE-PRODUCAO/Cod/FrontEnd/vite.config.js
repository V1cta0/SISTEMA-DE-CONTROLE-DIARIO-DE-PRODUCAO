import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// O Chrome só libera a câmera ao vivo em HTTPS (ou em localhost). Por isso o site roda em HTTPS
// com um certificado local autoassinado (na 1ª vez o navegador avisa: Avançado > Continuar).
//
// Como o site em HTTPS não pode chamar um back-end em http:// (o Chrome bloqueia), o Vite repassa
// tudo que começa com /api para o Spring Boot que roda neste mesmo computador (porta 8080).
// Resultado: o celular só precisa enxergar a porta 5173 do PC.
const proxy = {
  '/api': {
    target: 'http://127.0.0.1:8080',
    changeOrigin: true,
    configure: (p) => {
      // o back-end só aceita origens http://...:5173; sem o cabeçalho Origin ele trata como chamada normal
      p.on('proxyReq', (req) => req.removeHeader('origin'))
    }
  }
}

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: { port: 5173, host: true, proxy },
  preview: { port: 4173, host: true, proxy }
})
