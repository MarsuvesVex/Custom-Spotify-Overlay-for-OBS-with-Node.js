# 🎵 Custom Spotify Overlay for OBS (Node.js + WebSocket)

A slick, real-time OBS overlay that shows your current Spotify track — built with Node.js, WebSocket, and just enough CSS flair.

![Spotify Overlay Demo](./assets/images/blog/gifs/2025-04-15-19-02-46.gif)

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
2. Install Dependencies
bash
Copy
Edit
npm install
3. Set Up Spotify API Access
Create a Spotify app at developer.spotify.com and grab:

SPOTIFY_CLIENT_ID

SPOTIFY_CLIENT_SECRET

SPOTIFY_REFRESH_TOKEN

To generate a refresh token, follow this guide:
👉 Create a Spotify Refresh Token

Add them to a .env file:

env
Copy
Edit
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token
▶️ Run the Server
bash
Copy
Edit
npm run start
This will:

Start the Express server on http://localhost:3000

Begin polling Spotify for track info

Broadcast updates over WebSocket

🖥️ Add to OBS
Open OBS.

Add a Browser Source.

Set the URL to: http://localhost:3000/overlay

Set size (e.g. 800x200).

Make sure "Control audio via OBS" is unchecked.

That’s it. When a new song plays, your overlay updates live.

🧰 Dev Tools & Tech Stack
Node.js + Express

Spotify Web API

WebSocket

OBS WebSocket (optional) for advanced control

HTML/CSS overlay frontend

⚙️ Optional OBS Auto-Refresh Script
Want to reload overlay sources when the track changes?

Run:

bash
Copy
Edit
node obs-refresh.js
Or with flags:

bash
Copy
Edit
node obs-refresh.js --once     # One-time refresh
node obs-refresh.js --force    # Force toggle without checking track
Make sure OBS WebSocket is enabled and the obsPassword is set correctly in the script config.

📦 File Structure
bash
Copy
Edit
.
├── overlay/                 # HTML/CSS/JS overlay page
├── server.js                # Express + WebSocket server
├── spotify.js               # Spotify API logic
├── obs-refresh.js           # Optional OBS source toggle script
├── .env                     # Spotify credentials
├── package.json
└── README.md
📸 Screenshots
<img src="./assets/images/blog/obs/2025-04-15_19-22.png" alt="Overlay Preview" width="600" />
🧪 Tech Links
Spotify Web API Docs

OBS WebSocket

WebSocket API

Animated CSS Transitions

🙌 Shoutout
Inspired by the need to show off great music taste while live — with a little overengineering.
If you build on top of this, drop me a link — I’d love to see it!

go
Copy
Edit
