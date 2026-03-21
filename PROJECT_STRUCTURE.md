# Timblenge Chat – Project Structure & Flow

This document provides a high-level overview of the Timblenge Chat architecture, organized by major features. The project is built on **Next.js (App Router)** with a custom **Express + Socket.IO** server.

---

## 1. Real-time Text Chat

The text chat pairs random strangers together based on optional shared interests, relying on Socket.IO for real-time bi-directional messaging.

### Key Files

- **`server.js`**: The custom backend server. It hosts the Socket.IO instance and manages queues for finding strangers (`join` event), matching them (`matched`), proxying messages (`message`, `image`), and handling disconnections (`partner-left`).
- **`src/lib/socket.js`**: A centralized singleton client that exports `connectSocket()` and `disconnectSocket()`. Ensuring the frontend only maintains a single WebSocket connection.
- **`src/app/chat/[chatID]/page.js`**: The core interactive chat UI. It orchestrates the React state for messages, handles typing indicators, manages the 60-second auto-disconnect timer, and connects to the backend socket room.
- **`src/app/api/upload/route.js`**: An API endpoint that securely uploads chat images from the client to **Cloudinary** returning a secure URL that is then emitted to the chat partner.

---

## 2. WebRTC Video Chat

The video functionality utilizes WebRTC for direct Peer-to-Peer (P2P) audio/video streaming, using the Socket.IO server purely as a signaling server to exchange session descriptions and ICE candidates.

### Key Files

- **`src/app/video/[videoID]/page.js`**: The interactive video room. It requests camera/mic permissions using `navigator.mediaDevices.getUserMedia()`, initializes an `RTCPeerConnection`, and binds the local/remote streams to `<video>` elements.
- **`server.js` (Signaling)**: The same backend server contains dedicated video queues. It listens for `video-ready`, matches two users, and instructs one to be the `initiator`. It then relays the `video-offer`, `video-answer`, and `new-ice-candidate` packets to perform the WebRTC handshake between the two clients.

---

## 3. SEO-Optimized Blog System

The blog system is statically generated to ensure fast load times and maximum SEO visibility, with content cleanly decoupled from the UI components.

### Key Files

- **`src/lib/blogRegistry.js`**: The central index for all blog posts. It exports an array of metadata (title, excerpt, slug, date, tags) used to predictably route and render the listings.
- **`src/lib/blogContent/`**: A directory containing individual files for each post (e.g., `stay-safe-chatting-strangers.js`). These export the rich HTML string content of the article.
- **`src/app/blog/page.js`**: The blog index page, which iterates over the `blogRegistry` to display clickable cards.
- **`src/app/blog/[slug]/page.js`**: The dynamic route for reading a post. Since it's deeply integrated for SEO, it exports a dynamic `generateMetadata()` function, retrieves the specific HTML from `blogContent`, and injects robust JSON-LD schema (structured `@graph` data) into the `<head>`.

---

## Global Architecture & Performance

- **`src/app/page.js`**: The SEO-optimized Server Component homepage using `next/dynamic` to lazy load interactive client sections (like `HomeFaqSection` and `HeroCTA`).
- **`src/app/layout.js`**: The root setup, dictating global fonts, analytics wrappers (Google Analytics), metadata/viewport configuration, and importing the core `globals.css` structure.
- **`next.config.mjs`**: Contains optimizations for image hosts, caching headers, performance bundle analysis plugins, and modern compiler options (such as stripping logs in production).
