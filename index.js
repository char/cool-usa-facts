const marked = require("marked");

const DOCUMENT_TITLE = 'Cool USA Facts!'
const DOCUMENT_URL =
  'https://raw.githubusercontent.com/dessalines/essays/master/us_atrocities.md'

const documentCache = {}

const getDocument = async () => {
  if (documentCache.document == null) {
    const document = await fetch(DOCUMENT_URL).then(r => r.text())
    documentCache.document = document
  }

  return documentCache.document
}

const randomLine = document => {
  const entries = document
    .split('\n')
    .filter(s => s.match(/^\- (In|On)/) && s.length > 16)
    .map(s => s.substring(2))

  return entries[Math.floor(Math.random() * entries.length)]
}

const handler = async request => {
  const document = await getDocument()

  const line = randomLine(document)
  const renderedLine = marked(line)

  const responseHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="icon" href="data:">
  <title>${DOCUMENT_TITLE}</title>

  <style>
    html {
      height: 100vh;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      font-size: 18px;
      line-height: 1.5;

      background-color: #fcfcfc;
      color: #24292e;

      max-width: 80ch;

      margin: auto auto;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
    }

    h1 {
      margin-bottom: 2.2rem;
    }
  </style>
</head>

<body>
  <main>
    <h1>Cool USA Facts!</h1>
    ${renderedLine}
  </main>
</body>
</html>`

  return new Response(responseHTML, {
    headers: { 'Content-Type': 'text/html' },
  })
}

addEventListener('fetch', event => {
  event.respondWith(handler(event.request))
})
