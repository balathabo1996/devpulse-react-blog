import mongoose from "mongoose";
import dotenv from "dotenv";
import { Post } from "./models/Post.js";

dotenv.config();

const initialPosts = [
  // Engineering Category
  {
    title: "Next.js 15: The New App Router Era",
    date: "2026-06-01",
    author: "Admin",
    readTime: "7 min",
    excerpt: "Diving deep into Server Components and the new data fetching paradigms in Next.js 15.",
    content: "Next.js has fundamentally shifted how we build React applications. By embracing React Server Components (RSC) by default, Next.js 15 allows developers to ship zero client-side JavaScript for parts of their application that don't need interactivity. This drastically improves initial page load times and SEO. We'll explore how to handle mutations using Server Actions without writing API endpoints.",
    category: "Engineering",
    imageUrl: "/images/post1.jpg",
  },
  {
    title: "Vite vs Webpack in 2026",
    date: "2026-05-15",
    author: "Admin",
    readTime: "8 min",
    excerpt: "Why the entire ecosystem is moving towards ESM-based bundlers.",
    content: "Webpack served us well for a decade, but Vite's unbundled development server has proven to be the superior developer experience. By leveraging native ES modules in the browser, Vite starts instantly regardless of your application's size. In this post, we'll benchmark Vite, Turbopack, and Webpack across several large-scale monorepos.",
    category: "Engineering",
    imageUrl: "/images/post2.jpg",
  },
  {
    title: "Why PostgreSQL is Eating the World",
    date: "2026-04-25",
    author: "Admin",
    readTime: "9 min",
    excerpt: "Relational databases are back in fashion, thanks to JSONB and pgvector.",
    content: "For a while, NoSQL was the default choice for new startups. Now, PostgreSQL is reclaiming its crown. With native JSONB support, you get the flexibility of MongoDB with the safety of ACID transactions. Furthermore, the pgvector extension has made Postgres the default vector database for AI applications.",
    category: "Engineering",
    imageUrl: "/images/post3.jpg",
  },
  {
    title: "WebSockets vs Server-Sent Events",
    date: "2026-04-05",
    author: "Admin",
    readTime: "6 min",
    excerpt: "Choosing the right real-time protocol for your application.",
    content: "When you need real-time updates, WebSockets are often the default choice. However, if your application only needs to stream data from the server to the client (like a live feed or AI generation), Server-Sent Events (SSE) are significantly simpler to implement and scale. We'll compare both approaches.",
    category: "Engineering",
    imageUrl: "/images/post4.jpg",
  },
  {
    title: "The Anatomy of a Modern Monorepo",
    date: "2026-03-28",
    author: "Admin",
    readTime: "8 min",
    excerpt: "Managing complex codebases with Turborepo and pnpm.",
    content: "As organizations scale, managing multiple repositories becomes a nightmare. Monorepos solve code sharing and dependency management, but introduce build time challenges. Turborepo addresses this with remote caching and task orchestration. Here is how we structure our full-stack TypeScript monorepo.",
    category: "Engineering",
    imageUrl: "/images/cat-engineering.jpg",
  },
  {
    title: "Design Systems in React",
    date: "2026-03-01",
    author: "Admin",
    readTime: "7 min",
    excerpt: "Building reusable component libraries with Radix UI and Storybook.",
    content: "Don't build your accessible primitives from scratch. Tools like Radix UI provide unstyled, accessible components that you can wrap with your own design tokens. Combined with Storybook for documentation, you can build a robust design system that your entire company can rely on.",
    category: "Engineering",
    imageUrl: "/images/cat-ai.jpg",
  },

  // AI Category
  {
    title: "The Rise of AI Coding Assistants",
    date: "2026-05-10",
    author: "Admin",
    readTime: "10 min",
    excerpt: "How agentic AI is changing the daily workflow of software engineers.",
    content: "We've moved past simple autocomplete. Modern AI coding assistants can now plan features, read documentation, and execute multi-file refactors autonomously. Tools like Cursor and GitHub Copilot Workspace are turning engineers into reviewers and architects. Here is how to effectively pair-program with your AI assistant without losing control of your architecture.",
    category: "AI",
    imageUrl: "/images/cat-tutorials.jpg",
  },
  {
    title: "Understanding Large Language Models",
    date: "2026-04-12",
    author: "Admin",
    readTime: "12 min",
    excerpt: "A developer-friendly introduction to Transformer architecture.",
    content: "You don't need a PhD to understand how LLMs work. At their core, models like GPT-4 are incredibly advanced text prediction engines powered by the Transformer architecture and attention mechanisms. Let's break down tokens, context windows, and fine-tuning so you can build better AI applications.",
    category: "AI",
    imageUrl: "/images/cat-career.jpg",
  },
  {
    title: "RAG vs Fine-Tuning",
    date: "2026-03-22",
    author: "Admin",
    readTime: "8 min",
    excerpt: "Which approach is best for giving AI access to your private data?",
    content: "If you want an AI to answer questions about your company's internal wiki, should you fine-tune a model or use Retrieval-Augmented Generation (RAG)? In 95% of cases, RAG is the cheaper, faster, and more accurate solution. Let's explore how to build a simple RAG pipeline using LangChain and Pinecone.",
    category: "AI",
    imageUrl: "/images/post1.jpg",
  },
  {
    title: "Running AI Models Locally",
    date: "2026-02-18",
    author: "Admin",
    readTime: "6 min",
    excerpt: "How to use Ollama to run Llama 3 on your MacBook without API fees.",
    content: "You no longer need massive server clusters to experiment with powerful open-source models. Tools like Ollama allow you to run models like Llama 3 locally on consumer hardware. This guarantees complete privacy and zero API costs. Here's a step-by-step guide to setting it up.",
    category: "AI",
    imageUrl: "/images/post2.jpg",
  },

  // Tutorials Category
  {
    title: "Tailwind CSS v4 is Finally Here",
    date: "2026-05-28",
    author: "Admin",
    readTime: "5 min",
    excerpt: "What to expect from the new Lightning CSS engine and zero-config setup.",
    content: "Tailwind CSS v4 brings a complete rewrite of the engine. The JIT compiler is now significantly faster, but the real magic is the unified zero-config architecture. You no longer need a tailwind.config.js file for basic customizations; everything is driven by CSS variables in your index.css. Let's look at how to migrate your existing projects.",
    category: "Tutorials",
    imageUrl: "/images/post3.jpg",
  },
  {
    title: "Mastering TypeScript 5.8",
    date: "2026-05-02",
    author: "Admin",
    readTime: "6 min",
    excerpt: "New inference capabilities and performance improvements.",
    content: "TypeScript continues to evolve. Version 5.8 introduces smarter type narrowing for arrays and better exactOptionalPropertyTypes enforcement. We also look at how the TypeScript compiler has gotten faster by avoiding unnecessary re-checks during incremental builds.",
    category: "Tutorials",
    imageUrl: "/images/post4.jpg",
  },
  {
    title: "Building Microservices with Go",
    date: "2026-04-20",
    author: "Admin",
    readTime: "7 min",
    excerpt: "A beginner's guide to Go's concurrency model and standard library.",
    content: "Go (Golang) is the language of the cloud. Its lightweight goroutines make it trivial to build high-performance, concurrent network services. We'll walk through building a simple REST API in Go without any external frameworks, relying solely on the powerful standard library.",
    category: "Tutorials",
    imageUrl: "/images/cat-engineering.jpg",
  },
  {
    title: "Mastering Docker Multi-Stage Builds",
    date: "2026-03-12",
    author: "Admin",
    readTime: "5 min",
    excerpt: "Keep your production images lean and secure.",
    content: "A common mistake when dockerizing Node.js applications is shipping the devDependencies and source code in the final image. Multi-stage builds allow you to compile your code in a heavy 'builder' image and copy only the built artifacts into a lightweight, secure 'runner' image like Alpine or Distroless.",
    category: "Tutorials",
    imageUrl: "/images/cat-ai.jpg",
  },
  {
    title: "Introduction to Rust for Web Developers",
    date: "2026-02-10",
    author: "Admin",
    readTime: "11 min",
    excerpt: "Why JavaScript developers are falling in love with the borrow checker.",
    content: "Rust's memory safety guarantees without garbage collection make it incredibly fast. More importantly, the Rust toolchain (Cargo) is a joy to use. While the learning curve is steep, integrating Rust into your Node.js apps via WebAssembly or N-API can drastically improve performance for CPU-bound tasks.",
    category: "Tutorials",
    imageUrl: "/images/cat-tutorials.jpg",
  },
  {
    title: "Zustand vs Redux in Modern React",
    date: "2026-01-30",
    author: "Admin",
    readTime: "7 min",
    excerpt: "Is it finally time to ditch Redux for a simpler state manager?",
    content: "Redux Toolkit improved Redux significantly, but Zustand offers a much simpler API with zero boilerplate. It relies on hooks and doesn't require wrapping your app in a Provider. We'll compare both libraries and show you how to migrate a small app from Redux to Zustand in under an hour.",
    category: "Tutorials",
    imageUrl: "/images/cat-career.jpg",
  },

  // Career Category
  {
    title: "Navigating Tech Layoffs",
    date: "2026-04-15",
    author: "Admin",
    readTime: "5 min",
    excerpt: "Strategies for resilience and upskilling in a volatile job market.",
    content: "The tech industry has seen massive corrections recently. Surviving and thriving requires a shift in mindset. It's no longer just about knowing React; it's about product sense, understanding business value, and being adaptable. Let's discuss how to build a T-shaped profile to stay hirable.",
    category: "Career",
    imageUrl: "/images/post1.jpg",
  },
  {
    title: "How to Ace the System Design Interview",
    date: "2026-03-05",
    author: "Admin",
    readTime: "14 min",
    excerpt: "A practical framework for breaking down complex architectural problems.",
    content: "System design interviews can be intimidating. The key is to avoid jumping straight into technologies. Start with requirements, define your API, sketch the high-level architecture, and then discuss trade-offs in scaling, caching, and database partitioning. Here is a step-by-step framework to follow.",
    category: "Career",
    imageUrl: "/images/post2.jpg",
  },
  {
    title: "The Transition to Engineering Manager",
    date: "2026-02-22",
    author: "Admin",
    readTime: "9 min",
    excerpt: "Why the skills that made you a great developer won't make you a great manager.",
    content: "Moving from individual contributor to manager is not a promotion; it's a completely different job. Your success is no longer measured by the code you write, but by the impact of your team. Let's discuss how to let go of your IDE, handle 1-on-1s, and protect your team from burnout.",
    category: "Career",
    imageUrl: "/images/post3.jpg",
  },
  {
    title: "Remote Work in 2026",
    date: "2026-01-10",
    author: "Admin",
    readTime: "6 min",
    excerpt: "As return-to-office mandates increase, how do you secure a remote role?",
    content: "The remote work landscape has shifted. Many companies are demanding hybrid schedules. To remain fully remote, you need to stand out as an exceptional async communicator. We discuss how to demonstrate reliability, use async video updates effectively, and find fully distributed companies.",
    category: "Career",
    imageUrl: "/images/post4.jpg",
  },

  // Cloud & DevOps Category
  {
    title: "Kubernetes for Beginners",
    date: "2026-05-05",
    author: "Admin",
    readTime: "12 min",
    excerpt: "Demystifying Pods, Services, and Deployments.",
    content: "Kubernetes is complex, but the core concepts are surprisingly intuitive once you strip away the YAML boilerplate. A Pod is just a running container. A Service exposes it to the network. A Deployment ensures it stays running. Let's build a mental model of K8s architecture.",
    category: "Cloud",
    imageUrl: "/images/cat-engineering.jpg",
  },
  {
    title: "The Shift to Serverless",
    date: "2026-04-01",
    author: "Admin",
    readTime: "8 min",
    excerpt: "Why AWS Lambda and edge computing are taking over the backend.",
    content: "Managing your own servers is increasingly seen as undifferentiated heavy lifting. Serverless computing allows you to focus purely on business logic. We'll explore the pros and cons of AWS Lambda, cold start mitigations, and how edge computing via Cloudflare Workers changes the game.",
    category: "Cloud",
    imageUrl: "/images/cat-ai.jpg",
  },
  {
    title: "CI/CD Best Practices",
    date: "2026-03-18",
    author: "Admin",
    readTime: "7 min",
    excerpt: "How to safely deploy code 10 times a day using GitHub Actions.",
    content: "Continuous Deployment is scary without automated tests. A robust CI/CD pipeline acts as your safety net. We'll walk through setting up a GitHub Action that lints, tests, builds, and deploys your React application automatically upon merging to the main branch.",
    category: "Cloud",
    imageUrl: "/images/cat-tutorials.jpg",
  },

  // Security Category
  {
    title: "Securing Your JWTs",
    date: "2026-05-20",
    author: "Admin",
    readTime: "9 min",
    excerpt: "Why storing tokens in localStorage is dangerous and what to do instead.",
    content: "Cross-Site Scripting (XSS) attacks can easily steal tokens from localStorage. The industry standard is moving towards HttpOnly cookies for session management. Let's discuss how to implement secure, HttpOnly refresh tokens while keeping access tokens short-lived in memory.",
    category: "Security",
    imageUrl: "/images/cat-career.jpg",
  },
  {
    title: "Understanding OAuth 2.0",
    date: "2026-04-08",
    author: "Admin",
    readTime: "10 min",
    excerpt: "A plain-english explanation of authorization flows.",
    content: "OAuth 2.0 seems complicated because of the sheer number of 'flows' available. But at its heart, it's just a protocol that allows a user to grant a third-party application access to their data without sharing their password. We'll break down the Authorization Code flow step-by-step.",
    category: "Security",
    imageUrl: "/images/post1.jpg",
  }
];

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error("Please provide MONGODB_URI in .env");
    process.exit(1);
  }
  
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");
    
    await Post.deleteMany({});
    console.log("Cleared existing posts.");
    
    await Post.insertMany(initialPosts);
    console.log("Seeded initial posts!");
    
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
