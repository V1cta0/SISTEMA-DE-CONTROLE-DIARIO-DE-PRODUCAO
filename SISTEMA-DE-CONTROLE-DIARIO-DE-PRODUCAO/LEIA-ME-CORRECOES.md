# Correções e novidades

## Para rodar
1. MySQL ligado (usuario root / senha do application.properties). O banco `cical` é criado sozinho.
2. Backend (precisa de JDK 25): `cd Cod/BackEnd/pint` e `./mvnw spring-boot:run`
3. Front-end: `cd Cod/FrontEnd`, `npm install` (1ª vez) e `npm run dev`
4. Abra https://localhost:5173 (admin@cical.com.br / admin123). Agora é HTTPS: na 1ª vez o Chrome avisa
   que a conexão não é particular (certificado local). Clique em Avançado > Continuar.
   Para abrir pelo celular, use o endereço "Network" que o `npm run dev` mostra, por exemplo https://192.168.0.61:5173
   (PC e celular na mesma rede Wi-Fi). Use o IP 192.168.x.x; endereços 26.x.x.x são de VPN (Radmin/Hamachi).

## Corrigido
- pom.xml: springdoc 2.8.5 é para Spring Boot 3. Trocado por 3.0.3 (compatível com o Boot 4 do projeto).
- application.properties: a URL do MySQL agora cria o banco sozinha e evita o erro
  "Public Key Retrieval is not allowed".
- Database/schema.sql criava o banco `cical_producao`, mas o sistema usa `cical`. Corrigido.
- Rotas antigas /usuarios e /producoes estavam abertas, sem login, e devolviam o hash das senhas.
  Agora exigem o token e o hash não é mais enviado.
- Front-end usava sempre localhost:8080 e o CORS só aceitava localhost: no celular nada funcionava.
  Agora usa o endereço em que o site foi aberto.
- Data do cadastro usava horário UTC: depois das 21h gravava o dia seguinte. Corrigido.
- Validação no backend: turno, produto, torra, moagem, tamanho do código de barras e um limite de
  quantidade (100.000 kg, ajustável em PainelService.LIMITE_KG). Erros do banco viram mensagem legível.

## Leitor de código de barras
- O Enter do leitor USB não envia mais o formulário.
- A página abre com o cursor no código; se o cursor estiver fora de um campo de texto, o que o leitor digita volta para ele.
- Código já registrado antes preenche produto, torra e moagem (GET /api/codigo-barras/{codigo}).
- Depois de salvar, data e turno ficam e o cursor volta para o código.

## Câmera ao vivo (nova)
- `Cod/FrontEnd/src/components/LeitorAoVivo.jsx`: leitor com a câmera em tempo real, que não fica preto:
  solta a câmera ao fechar e ao ir para segundo plano, reabre ao voltar, reinicia se o Chrome cortar a câmera
  ou o vídeo congelar, e descarta a câmera aberta em duplicidade pelo StrictMode.
- O Chrome só libera câmera ao vivo em HTTPS ou em localhost; em http://IP o botão "Câmera ao vivo" some.
  Por isso o front-end agora roda em HTTPS (plugin @vitejs/plugin-basic-ssl) e o Vite repassa /api para o back-end
  (porta 8080), então o celular só precisa acessar a porta 5173 do PC. Depois de atualizar, rode `npm install` de novo.
- A foto agora é reduzida no navegador antes de enviar (mais rápido e mais confiável).
- O ZXing do back-end agora só tenta formatos de código de barras de produto (EAN, UPC, CODE-128, CODE-39, ITF), como a documentação já dizia.
- README corrigido: o banco é `cical`, não `cical_producao`.
