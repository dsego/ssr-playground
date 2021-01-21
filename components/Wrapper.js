import { html } from "../deps.js";

export default function({ title, children }) {
  return 
    html`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${ title }</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/holiday.css" />
          <script defer src="https://unpkg.com/htmx.org@1.1.0"></script>
        </head>
        <body>
          ${ children }
        </body>
      </html>
    `
  )
}
