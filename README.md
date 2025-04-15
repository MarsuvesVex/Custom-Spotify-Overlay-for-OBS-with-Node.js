# 🎵 Custom Spotify Overlay for OBS (Node.js + WebSocket)

A slick, real-time OBS overlay that shows your current Spotify track — built with Node.js, WebSocket, and just enough CSS flair.


[![Custom Spotify Overlay for OBS (Node.js + WebSocket)](https://img.youtube.com/vi/pYa_6KV2zOw/0.jpg)](https://www.youtube.com/watch?v=pYa_6KV2zOw)


![Spotify Overlay Demo](https://marsuvesvex.xyz/_next/image?url=%2Fassets%2Fimages%2Fblog%2Fobs%2F2025-04-15_19-22.png&w=828&q=75)

---

## ✨ Features

- **Live Song Updates**: No refreshes or hacks — just smooth WebSocket magic.
- **Fully Customizable**: Style it however you want with HTML/CSS.
- **Minimalist by Design**: Just the essentials — track, artist, album art.

---

## 🧠 How It Works

1. **Node.js server** polls Spotify’s current playback.
2. Sends updates via **WebSocket** to all connected clients.
3. An **HTML overlay page** listens for changes and updates the DOM.
4. OBS displays the overlay via a **Browser Source**.

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/spotify-obs-overlay.git
cd spotify-obs-overlay
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Spotify API Access

Create a Spotify app at [developer.spotify.com](https://developer.spotify.com) and grab your:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`

To generate a refresh token, follow this guide: 👉 **Create a Spotify Refresh Token**

Then, create a `.env` file:

```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token
```

---

### ▶️ Run the Server

```bash
npm start
```

This will:

- Start the Express server at `http://localhost:3000`
- Begin polling Spotify for track info
- Broadcast updates over WebSocket

---

### 🖥️ Add to OBS

1. Open OBS.
2. Add a **Browser Source**.
3. Set the URL to: `http://localhost:3000/overlay`
4. Set the size (e.g. `800x200`).
5. Uncheck **"Control audio via OBS"**.

That’s it! When a new song plays, your overlay updates live. 🎶

---

## 🧰 Dev Tools & Tech Stack

- Node.js + Express
- Spotify Web API
- WebSocket
- OBS WebSocket (optional)
- HTML/CSS overlay frontend

---

## ⚙️ Optional OBS Auto-Refresh Script

Want to reload overlay sources when the track changes?

```bash
node obs-refresh.js
```

Or with flags:

```bash
node obs-refresh.js --once     # One-time refresh
node obs-refresh.js --force    # Force toggle without checking track
```

Make sure OBS WebSocket is enabled and the `obsPassword` is set correctly in the script config.

---

## 📦 File Structure

```bash
.
├── overlay/                 # HTML/CSS/JS overlay page
├── server.js                # Express + WebSocket server
├── spotify.js               # Spotify API logic
├── obs-refresh.js           # Optional OBS source toggle script
├── .env                     # Spotify credentials
├── package.json
└── README.md
```

---

## 📸 Screenshots

<img src="./assets/images/blog/obs/2025-04-15_19-22.png" alt="Overlay Preview" width="600" />

---

## 🧪 Tech Links

- [Spotify Web API Docs](https://developer.spotify.com/documentation/web-api/)
- [OBS WebSocket](https://github.com/obsproject/obs-websocket)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Animated CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/transition)

---

## 🙌 Shoutout

Inspired by the need to show off great music taste while live — with a little overengineering.

If you build on top of this, drop me a link — I’d love to see it!
