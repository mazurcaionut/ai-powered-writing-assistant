# AI-Powered Writing Assistant

A modern web application that helps users improve their writing through AI-powered text rewriting and analysis. Built with Next.js, TypeScript, and OpenAI's GPT models.

## Demo

Try out the live application at: [https://ai-powered-writing-assistant.vercel.app](https://ai-powered-writing-assistant.vercel.app)

## Features

- Real-time text rewriting with AI assistance
- Adjustable tone settings (Formal, Casual, Persuasive)
- Customizable output length
- Detailed explanations of AI-made changes
- History tracking of all rewrites
- Responsive design for all devices
- Export functionality for writing history

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **AI Integration**: LangChain + OpenAI
- **Font**: Geist (Sans & Mono)

## Prerequisites

- Node.js 18.0 or later
- OpenAI API key
- npm, yarn, or pnpm

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/mazurcaionut/ai-powered-writing-assistant.git
cd ai-powered-writing-assistant
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env` file in the root directory and add your OpenAI API key:

```bash
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Enter your text in the "Original Text" textarea
2. Select your desired tone (Formal, Casual, or Persuasive)
3. Adjust the length factor using the slider (0.5x to 2x)
4. Click the "Rewrite" button to generate AI-enhanced content
5. View the rewritten text and explanation of changes
6. Access your writing history in the accordion section below
7. Export your writing history as needed

## Deployment

The easiest way to deploy this application is through Vercel:

1. Push your code to a GitHub repository
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Add your environment variables (OPENAI_API_KEY)
5. Deploy

You can also deploy to other platforms that support Next.js applications.

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
