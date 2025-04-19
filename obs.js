#!/usr/bin/env node

import OBSWebSocket from 'obs-websocket-js';
import { exec as execCb } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';

const exec = promisify(execCb);

// Config
const config = {
  obsUrl: 'ws://127.0.0.1:4455',
  obsPassword: 'JeQic9cGJ2DCOcRT',
  sources: [
    { name: 'Spotify', type: 'source', sceneName: 'overlay' },
    { name: 'Spotify Card', type: 'folder', sceneName: 'overlay' }
  ],
  reloadDelay: 1000,
  cacheFile: './.spotify-current-song.json',
  checkInterval: 1000
};

// Spotify helpers
async function getCurrentSong() {
  try {
    const { stdout } = await exec('sp current');
    const lines = stdout.trim().split('\n');

    const info = Object.fromEntries(lines.map(line => {
      const [key, ...rest] = line.trim().split(/\s+/);
      return [key, rest.join(' ')];
    }));

    return {
      album: info.Album || '',
      artist: info.Artist || '',
      title: info.Title || '',
      albumArtist: info.AlbumArtist || ''
    };
  } catch (err) {
    console.error('Failed to get current song:', err.message);
    return null;
  }
}

async function isSpotifyPlaying() {
  try {
    const { stdout } = await exec('sp status');
    return stdout.trim() === 'Playing';
  } catch (err) {
    console.error('Failed to check Spotify status:', err.message);
    return false;
  }
}

// Cache helpers
async function readCachedSong() {
  try {
    const data = await fs.readFile(config.cacheFile, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function writeCachedSong(info) {
  try {
    await fs.writeFile(config.cacheFile, JSON.stringify(info), 'utf8');
  } catch (err) {
    console.error('Failed to write cache file:', err.message);
  }
}

// OBS control
async function toggleSourceVisibility(obs, name, scene, visible) {
  const { sceneItems } = await obs.call('GetSceneItemList', { sceneName: scene });
  const item = sceneItems.find(i => i.sourceName === name);

  if (!item) {
    throw new Error(`Source "${name}" not found in scene "${scene}"`);
  }

  console.log(`Toggling "${name}" to ${visible ? 'visible' : 'hidden'}`);
  await obs.call('SetSceneItemEnabled', {
    sceneName: scene,
    sceneItemId: item.sceneItemId,
    sceneItemEnabled: visible
  });
}

async function reloadOBSSources_new(doReload = true) {
  const obs = new OBSWebSocket();

  try {
    console.log(`Connecting to OBS at ${config.obsUrl}...`);
    await obs.connect(config.obsUrl, config.obsPassword);
    console.log('Connected.');

    if (!doReload) return;

    /* for (const source of config.sources) { */
    /*   await refreshBrowserSource(obs, source.name); */
    /* } */

    config.sources.forEach(async (source) => {
      const { type, name } = source;
      if (type === 'source') {
	await toggleSourceVisibility(obs, name, source.sceneName, false);
      } else if (type === 'folder') {
	console.log(`Refreshing folder source: ${name}`);
	await obs.call('RefreshBrowserSource', { sourceName: name });
      }
    });
    console.log('Browser sources refreshed.');
  } catch (err) {
    console.error('OBS error:', err.message);
  } finally {
    await obs.disconnect().catch(() => {});
  }
}

async function reloadOBSSources(doReload = true) {
  const obs = new OBSWebSocket();

  try {
    console.log(`Connecting to OBS at ${config.obsUrl}...`);
    await obs.connect(config.obsUrl, config.obsPassword);
    console.log('Connected.');

    for (const source of config.sources) {
      await toggleSourceVisibility(obs, source.name, source.sceneName, false);
    }

    if (!doReload) return;

    console.log(`Waiting ${config.reloadDelay}ms...`);
    await new Promise(r => setTimeout(r, config.reloadDelay));

    for (const source of config.sources) {
      await toggleSourceVisibility(obs, source.name, source.sceneName, true);
    }

    console.log('OBS sources refreshed.');
  } catch (err) {
    console.error('OBS error:', err.message);
  } finally {
    await obs.disconnect().catch(() => {});
  }
}

// Song check loop
async function checkForSongChanges() {
  if (!(await isSpotifyPlaying())) {
    console.log('Spotify not playing. Skipping.');
    await reloadOBSSources(false);
    return;
  }

  const current = await getCurrentSong();
  if (!current) return;

  const cached = await readCachedSong();
  const hasChanged = ['title', 'artist', 'album'].some(key => current[key] !== cached[key]);

  if (hasChanged) {
    console.log(`Song changed: ${cached.artist || 'N/A'} - ${cached.title || 'N/A'} → ${current.artist} - ${current.title}`);
    await writeCachedSong(current);
    await reloadOBSSources();
  } else {
    console.log(`No change: ${current.artist} - ${current.title}`);
  }
}


async function refreshBrowserSource(obs, sourceName) {
  try {
    const { inputSettings } = await obs.call('GetInputSettings', { inputName: sourceName });
    const url = inputSettings.url;
    if (url) {
      console.log(`Refreshing browser source: ${sourceName}`);
      await obs.call('SetInputSettings', {
        inputName: sourceName,
        inputSettings: { url }, // Setting it to the same URL triggers a refresh
        overlay: false
      });
    } else {
      console.warn(`Source "${sourceName}" does not appear to be a browser source.`);
    }
  } catch (err) {
    console.error(`Failed to refresh browser source "${sourceName}":`, err.message);
  }
}

// Entry points
async function runContinuous() {
  console.log(`Checking every ${config.checkInterval / 1000}s...`);
  await checkForSongChanges();
  setInterval(checkForSongChanges, config.checkInterval);
}

async function runOnce() {
  console.log('Single check...');
  await checkForSongChanges();
}

async function forceRefresh() {
  console.log('Forcing refresh...');
  await reloadOBSSources();
}

// CLI arg routing
const args = process.argv.slice(2);
if (args.includes('--once')) runOnce();
else if (args.includes('--force')) forceRefresh();
else runContinuous();

