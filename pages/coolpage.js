import { render, html, Component } from "/reender.js";
export default class CoolPage extends Component {
  render() {
    return html`<div className="flex min-h-screen flex-col items-center justify-center py-2 dark:text-white">
    <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
      <h1 className="text-6xl font-bold">
        Welcome to${' '}
        <a className="text-blue-600" href="/">
          Ree.js!
        </a>
      </h1>

      <p className="mt-3 text-2xl">
        Get started by editing${' '}
        <code className="rounded-md bg-gray-100 dark:bg-gray-700 p-3 font-mono text-lg dark:text-white">
          pages/index.tsx
        </code>
      </p>

      <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
        <a
          href="/docs"
          className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
        >
          <h3 className="text-2xl font-bold">Documentation →</h3>
          <p className="mt-4 text-xl">
            Find in-depth information about Ree.js features and its API.
          </p>
        </a>

        <a
          href="/learn"
          className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
        >
          <h3 className="text-2xl font-bold">Learn →</h3>
          <p className="mt-4 text-xl">
            Learn about Ree.js in an interactive course with quizzes!
          </p>
        </a>

        <a
          href="/"
          className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
        >
          <h3 className="text-2xl font-bold">Examples →</h3>
          <p className="mt-4 text-xl">
            Discover and deploy boilerplate example Ree.js projects.
          </p>
        </a>

        <a
          href="/"
          className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
        >
          <h3 className="text-2xl font-bold">Deploy →</h3>
          <p className="mt-4 text-xl">
            Instantly deploy your Ree.js site to a public URL with Vercel.
          </p>
        </a>
      </div>
    </main>

    <footer className="flex h-24 w-full items-center justify-center mt-6 border-t">
      <a
        className="flex items-center justify-center gap-2"
        href="/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by${' '}Ree.js
      </a>
    </footer>
  </div>`
  }
}