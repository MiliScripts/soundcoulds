export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      
      // Handle CORS preflight requests
      if (request.method === 'OPTIONS') {
        return handleOptions(request);
      }
      
      // Handle search endpoint
      if (url.pathname.startsWith('/search/')) {
        const query = decodeURIComponent(url.pathname.split('/search/')[1]);
        if (!query) {
          return jsonResponse({ error: "Search query is required" }, 400);
        }
        
        // Get optional parameters
        const limit = url.searchParams.get('limit') || '20';
        const offset = url.searchParams.get('offset') || '0';
        const facet = url.searchParams.get('facet') || 'model'; // Default to 'model' for general search
        
        return handleSearchRequest(query, facet, parseInt(limit), parseInt(offset), env, ctx);
      }
      
      // Handle get user ID endpoint
      if (url.pathname.startsWith('/get_user_id/')) {
        const username = url.pathname.split('/')[2];
        return handleGetUserId(username, request, env, ctx);
      }
  
      if (url.pathname.startsWith('/playlist/')) {
        const playlistUrl = decodeURIComponent(url.pathname.split('/playlist/')[1]);
        if (!playlistUrl || !playlistUrl.includes('soundcloud.com')) {
          return jsonResponse({ error: "Invalid SoundCloud playlist URL" }, 400);
        }
        return handlePlaylistRequest(playlistUrl, env, ctx);
      }
      
      // Handle get likes endpoint
      if (url.pathname.startsWith('/get_likes/')) {
        const userId = url.pathname.split('/')[2];
        if (!userId || !/^\d+$/.test(userId)) {
          return jsonResponse({ error: "Invalid user ID" }, 400);
        }
        
        // Get limit parameter from query string, default to 10000 if not specified
        const limit = url.searchParams.get('limit') || '10000';
        if (!/^\d+$/.test(limit)) {
          return jsonResponse({ error: "Invalid limit parameter" }, 400);
        }
        
        return handleGetLikesRequest(userId, parseInt(limit), env, ctx);
      }
      
      // Handle get user tracks endpoint
      if (url.pathname.startsWith('/get_user_tracks/')) {
        const userId = url.pathname.split('/')[2];
        if (!userId || !/^\d+$/.test(userId)) {
          return jsonResponse({ error: "Invalid user ID" }, 400);
        }
        
        // Get limit and offset parameters from query string
        const limit = url.searchParams.get('limit') || '20';
        const offset = url.searchParams.get('offset') || '0';
        
        if (!/^\d+$/.test(limit)) {
          return jsonResponse({ error: "Invalid limit parameter" }, 400);
        }
        if (!/^\d+$/.test(offset)) {
          return jsonResponse({ error: "Invalid offset parameter" }, 400);
        }
        
        return handleGetUserTracksRequest(userId, parseInt(limit), parseInt(offset), env, ctx);
      }
      
      // Handle track streaming URL endpoint
      if (url.pathname.startsWith('/stream_url/')) {
        const trackUrl = decodeURIComponent(url.pathname.split('/stream_url/')[1]);
        if (!trackUrl || !trackUrl.includes('soundcloud.com')) {
          return jsonResponse({ error: "Invalid SoundCloud track URL" }, 400);
        }
        return handleStreamUrlRequest(trackUrl, env, ctx);
      }
      
      // Handle track details endpoint
      if (url.pathname.startsWith('/track_details/')) {
        const trackUrl = decodeURIComponent(url.pathname.split('/track_details/')[1]);
        if (!trackUrl || !trackUrl.includes('soundcloud.com')) {
          return jsonResponse({ error: "Invalid SoundCloud track URL" }, 400);
        }
        return handleTrackDetailsRequest(trackUrl, env, ctx);
      }
      
      // Handle client ID endpoint (optional, for debugging)
      if (url.pathname === '/client_id') {
        return handleClientIdRequest(env, ctx);
      }
      
      return jsonResponse({ 
        endpoints: {
          search: "/search/{query}?limit={number}&offset={number}&facet={model|tracks|users|playlists}",
          get_user_id: "/get_user_id/{username}",
          get_likes: "/get_likes/{user_id}?limit={number}",
          get_user_tracks: "/get_user_tracks/{user_id}?limit={number}&offset={number}",
          stream_url: "/stream_url/{track_url}",
          track_details: "/track_details/{track_url}",
          playlist: "/playlist/{playlist_url}",
          client_id: "/client_id"
        } 
      }, 404);
    }
  }
  
  // [Previous helper functions remain the same until here...]
  
  async function handleTrackDetailsRequest(trackUrl, env, ctx) {
    try {
      const clientId = await getOrRefreshClientId(env, ctx);
      
      const resolveUrl = `https://api-v2.soundcloud.com/resolve?url=${encodeURIComponent(trackUrl)}&client_id=${clientId}&app_version=1751621700&app_locale=en`;
      
      const response = await fetch(resolveUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const trackData = await response.json();
      
      if (trackData.kind !== 'track') {
        throw new Error("URL does not point to a valid track");
      }
      
      // Format the track details
      const trackDetails = {
        id: trackData.id,
        title: trackData.title,
        description: trackData.description,
        genre: trackData.genre,
        tags: trackData.tag_list,
        created_at: trackData.created_at,
        release_date: trackData.release_date || trackData.created_at,
        duration: trackData.duration,
        permalink_url: trackData.permalink_url,
        artwork_url: trackData.artwork_url,
        waveform_url: trackData.waveform_url,
        user: {
          id: trackData.user.id,
          username: trackData.user.username,
          full_name: trackData.user.full_name,
          avatar_url: trackData.user.avatar_url,
          followers_count: trackData.user.followers_count,
          following_count: trackData.user.followings_count
        },
        stats: {
          playback_count: trackData.playback_count,
          likes_count: trackData.likes_count,
          reposts_count: trackData.reposts_count,
          comment_count: trackData.comment_count,
          download_count: trackData.download_count
        },
        permissions: {
          downloadable: trackData.downloadable,
          streamable: trackData.streamable,
          embeddable: trackData.embeddable_by === 'all'
        },
        media: {
          transcodings: trackData.media?.transcodings?.map(t => ({
            url: t.url,
            protocol: t.format.protocol,
            mime_type: t.format.mime_type,
            quality: t.quality
          })) || []
        },
        monetization: {
          monetization_model: trackData.monetization_model,
          policy: trackData.policy
        }
      };
      
      return jsonResponse(trackDetails);
      
    } catch (error) {
      return jsonResponse({ 
        error: error.message,
        stack: error.stack 
      }, 500);
    }
  }
  
  // [Rest of the existing functions remain unchanged...]
  
  async function handleSearchRequest(query, facet, limit, offset, env, ctx) {
    try {
      const clientId = await getOrRefreshClientId(env, ctx);
      
      const apiUrl = `https://api-v2.soundcloud.com/search?q=${encodeURIComponent(query)}&client_id=${clientId}&facet=${facet}&limit=${limit}&offset=${offset}&linked_partitioning=1&app_version=1751621700&app_locale=en`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filter and format the results to only include tracks with the requested fields
      const tracks = data.collection
        .filter(item => item.kind === 'track') // Only include tracks
        .map(track => ({
          title: track.title,
          permalink_url: track.permalink_url,
          artwork_url: track.artwork_url || null,
          artist: track.user?.username || 'Unknown artist',
          duration: track.duration,
          playback_count: track.playback_count,
          likes_count: track.likes_count
        }));
      
      return jsonResponse({
        query: query,
        facet: facet,
        limit: limit,
        offset: offset,
        total_results: tracks.length,
        next_href: data.next_href || null,
        tracks: tracks
      });
      
    } catch (error) {
      return jsonResponse({ 
        error: error.message,
        stack: error.stack 
      }, 500);
    }
  }
  
  // [All your existing helper functions remain unchanged...]
  // [Previous helper functions remain the same...]
  
  async function handleGetUserTracksRequest(userId, limit, offset, env, ctx) {
    try {
      const clientId = await getOrRefreshClientId(env, ctx);
      
      const apiUrl = `https://api-v2.soundcloud.com/users/${userId}/tracks?representation=&client_id=${clientId}&limit=${limit}&offset=${offset}&linked_partitioning=1&app_version=1751621700&app_locale=en`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.collection || data.collection.length === 0) {
        return jsonResponse({ 
          user_id: userId,
          message: "No tracks found for this user",
          limit: limit,
          offset: offset,
          tracks: []
        });
      }
      
      // Format the tracks data
      const tracks = data.collection.map(track => ({
        id: track.id,
        title: track.title,
        description: track.description,
        genre: track.genre,
        created_at: track.created_at,
        release_date: track.release_date,
        duration: track.duration,
        permalink_url: track.permalink_url,
        artwork_url: track.artwork_url,
        likes_count: track.likes_count,
        playback_count: track.playback_count,
        reposts_count: track.reposts_count,
        comment_count: track.comment_count,
        downloadable: track.downloadable,
        streamable: track.streamable,
        stream_url: track.media?.transcodings?.find(t => t.format.protocol === 'progressive')?.url || null
      }));
      
      return jsonResponse({
        user_id: userId,
        limit: limit,
        offset: offset,
        total_tracks: data.collection.length,
        next_href: data.next_href || null,
        tracks: tracks
      });
      
    } catch (error) {
      return jsonResponse({ 
        error: error.message,
        stack: error.stack 
      }, 500);
    }
  }
  
  // [Rest of the existing functions remain unchanged...]
  
  // Handle CORS preflight requests
  function handleOptions(request) {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  }
  
  async function handleGetUserId(username, request, env, ctx) {
    try {
      // Validate username format
      if (!username || !/^[a-zA-Z0-9_-]+$/.test(username)) {
        return jsonResponse({ error: "Invalid SoundCloud username format" }, 400);
      }
  
      const soundcloudUrl = `https://soundcloud.com/${encodeURIComponent(username)}`;
      
      // Fetch the user's SoundCloud page
      const response = await fetch(soundcloudUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        return jsonResponse({ 
          error: "Failed to fetch user profile",
          status: response.status
        }, response.status);
      }
      
      const html = await response.text();
      
      // Try multiple patterns to extract user ID
      const patterns = [
        /soundcloud:\/\/users:(\d+)/,
        /api\.soundcloud\.com%2Fusers%2F(\d+)/,
        /"id":(\d+),"kind":"user"/,
        /"urn":"soundcloud:users:(\d+)"/
      ];
      
      let userId = null;
      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match && match[1]) {
          userId = match[1];
          break;
        }
      }
      
      if (!userId) {
        return jsonResponse({ error: "Could not find user ID in profile page" }, 404);
      }
  
      return jsonResponse({
        username: username,
        user_id: userId,
        profile_url: soundcloudUrl
      });
      
    } catch (error) {
      return jsonResponse({ 
        error: error.message,
        stack: error.stack 
      }, 500);
    }
  }
  async function handlePlaylistRequest(playlistUrl, env, ctx) {
    try {
      const clientId = await getOrRefreshClientId(env, ctx);
  
      const resolveUrl = `https://api-v2.soundcloud.com/resolve?url=${encodeURIComponent(playlistUrl)}&client_id=${clientId}`;
      const resolveResponse = await fetch(resolveUrl);
  
      if (!resolveResponse.ok) {
        throw new Error(`Failed to resolve playlist: ${resolveResponse.status}`);
      }
  
      const playlistData = await resolveResponse.json();
  
      if (playlistData.kind !== 'playlist') {
        throw new Error("URL is not a playlist");
      }
  
      const trackIds = playlistData.tracks.map(track => track.id);
      if (trackIds.length === 0) {
        return jsonResponse({ error: "No tracks found in playlist" }, 404);
      }
  
      // Split track IDs into chunks of 20
      const chunkSize = 20;
      const chunks = [];
      for (let i = 0; i < trackIds.length; i += chunkSize) {
        chunks.push(trackIds.slice(i, i + chunkSize));
      }
  
      // Fetch tracks in parallel for each chunk
      const fetchPromises = chunks.map(chunk => {
        const idsParam = chunk.join('%2C');
        const batchUrl = `https://api-v2.soundcloud.com/tracks?ids=${idsParam}&client_id=${clientId}`;
        return fetch(batchUrl).then(res => {
          if (!res.ok) throw new Error(`Failed batch fetch: ${res.status}`);
          return res.json();
        });
      });
  
      const results = await Promise.all(fetchPromises);
      const allTracks = results.flat();
  
      const formattedTracks = allTracks.map(track => ({
        id: track.id,
        title: track.title,
        artist: track.user?.username || 'Unknown artist',
        artwork_url: track.artwork_url,
        permalink_url: track.permalink_url,
        duration: track.duration,
        likes_count: track.likes_count,
        playback_count: track.playback_count,
        genre: track.genre,
        release_date: track.release_date,
        stream_url: track.media?.transcodings?.find(t => t.format.protocol === 'progressive')?.url || null
      }));
  
      return jsonResponse({
        playlist_id: playlistData.id,
        playlist_title: playlistData.title,
        playlist_artwork: playlistData.artwork_url,
        total_tracks: playlistData.track_count,
        tracks: formattedTracks.filter(track => track.title)
      });
  
    } catch (error) {
      return jsonResponse({ 
        error: error.message,
        stack: error.stack 
      }, 500);
    }
  }
  
  
  async function handleGetLikesRequest(userId, limit, env, ctx) {
    try {
      // Get or refresh client ID (auto-refreshes if expired)
      const clientId = await getOrRefreshClientId(env, ctx);
      
      const apiUrl = `https://api-v2.soundcloud.com/users/${userId}/track_likes?limit=${limit}&client_id=${clientId}&app_version=1746717941&app_locale=en`;
      
      // Fetch the data from SoundCloud API
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.collection || data.collection.length === 0) {
        return jsonResponse({ error: "No likes found for this user" }, 404);
      }
      
      // Format the response with only relevant track information
      const likes = data.collection.map(like => ({
        id: like.track?.id,
        title: like.track?.title,
        artist: like.track?.user?.username,
        permalink_url: like.track?.permalink_url,
        artwork_url: like.track?.artwork_url,
        duration: like.track?.duration,
        created_at: like.created_at
      }));
      
      return jsonResponse({
        user_id: userId,
        limit: limit,
        likes_count: likes.length,
        likes
      });
      
    } catch (error) {
      return jsonResponse({ 
        error: error.message,
        stack: error.stack 
      }, 500);
    }
  }
  
  async function handleStreamUrlRequest(trackUrl, env, ctx) {
    try {
      // Get or refresh client ID (auto-refreshes if expired)
      const clientId = await getOrRefreshClientId(env, ctx);
      return jsonResponse(await getStreamUrl(trackUrl, clientId));
    } catch (error) {
      return jsonResponse({ 
        error: error.message,
        stack: error.stack 
      }, 500);
    }
  }
  
  async function handleClientIdRequest(env, ctx) {
    try {
      const clientId = await getOrRefreshClientId(env, ctx);
      return jsonResponse({ client_id: clientId });
    } catch (error) {
      return jsonResponse({ 
        error: error.message,
        stack: error.stack 
      }, 500);
    }
  }
  
  async function getStreamUrl(trackUrl, clientId) {
    // First resolve the track URL to get track metadata
    const resolveUrl = `https://api-v2.soundcloud.com/resolve?url=${encodeURIComponent(trackUrl)}&client_id=${clientId}`;
    const resolveResponse = await fetch(resolveUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!resolveResponse.ok) {
      throw new Error(`Failed to resolve track: ${resolveResponse.status}`);
    }
    
    const trackData = await resolveResponse.json();
    
    // Check if it's actually a track
    if (trackData.kind !== 'track') {
      throw new Error("URL is not a track (might be a playlist)");
    }
    
    // Find the best available stream URL
    let streamUrl = null;
    let isProgressive = false;
    
    // First try to find progressive stream
    for (const transcoding of trackData.media.transcodings) {
      if (transcoding.format.protocol === 'progressive') {
        const streamResponse = await fetch(`${transcoding.url}?client_id=${clientId}`);
        const streamData = await streamResponse.json();
        streamUrl = streamData.url;
        isProgressive = true;
        break;
      }
    }
    
    // If no progressive, try HLS MP3
    if (!streamUrl) {
      for (const transcoding of trackData.media.transcodings) {
        if (transcoding.preset.includes('mp3')) {
          const streamResponse = await fetch(`${transcoding.url}?client_id=${clientId}`);
          const streamData = await streamResponse.json();
          streamUrl = streamData.url;
          break;
        }
      }
    }
    
    if (!streamUrl) {
      throw new Error("No supported streaming format found");
    }
    
    return {
      stream_url: streamUrl,
      is_progressive: isProgressive,
      track_info: {
        id: trackData.id,
        title: trackData.title,
        artist: trackData.user.username,
        artwork_url: trackData.artwork_url,
        duration: trackData.duration,
        permalink_url: trackData.permalink_url
      }
    };
  }
  
  async function getOrRefreshClientId(env, ctx) {
    // Check KV for existing client ID
    const cachedData = await env.SC_CID.get('client_data', { type: 'json' });
    const now = Date.now();
    const TEN_HOURS = 36_000_000;
    
    // If cached data exists and isn't expired
    if (cachedData && cachedData.client_id && cachedData.timestamp && (now - cachedData.timestamp < TEN_HOURS)) {
      return cachedData.client_id;
    }
    
    // If we get here, we need to fetch a fresh client ID
    const clientId = await fetchFreshClientId();
    
    // Store in KV with timestamp
    await env.SC_CID.put('client_data', JSON.stringify({
      client_id: clientId,
      timestamp: now
    }));
    
    return clientId;
  }
  
  async function fetchFreshClientId() {
    const sourceUrl = "https://soundcloud.com/soundcloud/upload-your-first-track";
    const pageResponse = await fetch(sourceUrl);
    const pageHtml = await pageResponse.text();
    
    // Extract script URLs
    const scriptUrls = [];
    const scriptRegex = /<script\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
    let match;
    
    while ((match = scriptRegex.exec(pageHtml)) !== null) {
      scriptUrls.push(match[1]);
    }
    
    // Search scripts for client_id
    let clientId = null;
    
    for (const scriptUrl of scriptUrls) {
      try {
        const fullScriptUrl = scriptUrl.startsWith('http') ? scriptUrl : 
          `https://soundcloud.com${scriptUrl.startsWith('/') ? '' : '/'}${scriptUrl}`;
        
        const scriptResponse = await fetch(fullScriptUrl);
        const scriptText = await scriptResponse.text();
        
        const clientIdMatch = scriptText.match(/client_id=([a-zA-Z0-9]+)/);
        if (clientIdMatch && clientIdMatch[1]) {
          if (!clientId || clientIdMatch[1].length > clientId.length) {
            clientId = clientIdMatch[1];
          }
        }
      } catch (e) {
        console.log(`Skipping script ${scriptUrl} due to error:`, e);
      }
    }
    
    if (!clientId) throw new Error("Could not find client_id in any scripts");
    return clientId;
  }
  
  // Helper function for JSON responses with CORS headers
  function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data, null, 2), {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
      }
    });
  }