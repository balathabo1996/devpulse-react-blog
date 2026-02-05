// Mock Data: Contains static blog post data for development
import type { Post } from "../types";

/** Static array of blog posts used as mock data. */
export const posts: Post[] = [
  {
    id: 1,
    title: "The Future of React",
    date: "2025-01-15",
    excerpt:
      "Exploring the new features in React 19 and what they mean for developers.",
    content:
      "React 19 brings a host of new features including the compiler, actions, and improved server components support. React Compiler (formerly React Forget) is an automatic memoization compiler that optimizes your application ensuring that only the necessary parts of your UI re-render when state changes. This reduces the need for useMemo and useCallback hooks.",
    category: "Engineering",
    imageUrl: "/images/post1.jpg",
  },
  {
    id: 2,
    title: "The Rise of AI Agents",
    date: "2025-01-20",
    excerpt: "How autonomous agents are reshaping software development.",
    content:
      "Artificial Intelligence is moving beyond simple chat interfaces. AI Agents can now plan, execute, and verify complex tasks. This shift requires developers to understand new patterns like chain-of-thought prompting and tool use. We are entering an era where coding is a collaborative effort between humans and AI.",
    category: "AI",
    imageUrl: "/images/post2.jpg",
  },
  {
    id: 3,
    title: "Navigating Your Tech Career",
    date: "2025-01-25",
    excerpt: "Strategies for growth in a rapidly changing industry.",
    content:
      'The tech landscape changes fast. To stay relevant, focus on fundamental problem-solving skills rather than just syntax. building a "T-shaped" skill set—deep knowledge in one area and broad knowledge in others—is more valuable than ever. Networking and soft skills are just as critical as technical prowess.',
    category: "Career",
    imageUrl: "/images/post3.jpg",
  },
  {
    id: 4,
    title: "React Hooks Tutorial",
    date: "2025-01-28",
    excerpt: "A deep dive into useEffect and clean code patterns.",
    content:
      "Understanding React Hooks is essential for modern React development. The `useEffect` hook handles side effects, but it can be tricky. Always define your dependencies correctly to avoid stale closures. Custom hooks allow you to extract logic and make your components cleaner and more reusable.",
    category: "Tutorials",
    imageUrl: "/images/post4.jpg",
  },
];
