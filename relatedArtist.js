document.addEventListener("DOMContentLoaded", function () {
  let progress = document.getElementById("progress");
  let song = document.getElementById("song");
  let ctrlIcon = document.getElementById("playBtn");
  let timerStart = document.getElementById("timer-start");
  let timerEnd = document.getElementById("timer-end");
  let userInteracted = false;

  song.onloadedmetadata = function () {
    const durationMinutes = Math.floor(song.duration / 60);
    const durationSeconds = Math.floor(song.duration % 60);
    timerEnd.textContent = `${durationMinutes}:${durationSeconds}`;
  };

  song.addEventListener("canplaythrough", function () {
    console.log("Audio is loaded.");
  });

  document.addEventListener("click", function () {
    if (!userInteracted) {
      userInteracted = true;
      fetchRelatedArtistListData();
    } else {
      playPause();
    }
  });

  async function fetchRelatedArtistListData() {
    const url =
      "https://spotify-web2.p.rapidapi.com/artist_related/?id=2w9zwq3AktTeYYMuhMjju8";
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "1d124fbbc5mshe8d9cc0f02ea7edp1e71e7jsnf0b12e52af76",
        "X-RapidAPI-Host": "spotify-web2.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const responseData = await response.json();

      console.log(responseData); // Log the entire API response to inspect its structure

      const artists = responseData.artists;

      if (artists && artists.length > 0) {
        const relatedArtistList = document.getElementById("relatedArtistList");
        relatedArtistList.innerHTML = ""; // Clear the existing list

        for (let i = 0; i < artists.length; i++) {
          const artist = artists[i];
          const relatedArtistListItem = document.createElement("li");

          const img = document.createElement("img");
          img.src = artist.images[0].url; // Use the first image
          relatedArtistListItem.appendChild(img);

          const heading = document.createElement("h2");
          heading.textContent = artist.name;
          relatedArtistListItem.appendChild(heading);

          relatedArtistListItem.addEventListener("click", () => {
            // You need to implement the playArtist function
            // playArtist(artist);
          });

          relatedArtistList.appendChild(relatedArtistListItem);
        }
      } else {
        console.error("Invalid data structure from API");
      }
    } catch (error) {
      console.error("Error fetching related artist data:", error);
    }
  }

  function playPause() {
    if (song.paused || song.currentTime <= 0 || song.ended) {
      const playPromise = song.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Playback started");
          })
          .catch((error) => {
            console.error("Play failed:", error);
          });
      }

      ctrlIcon.classList.add("fa-pause");
      ctrlIcon.classList.remove("fa-play");
    } else {
      song.pause();
      ctrlIcon.classList.remove("fa-pause");
      ctrlIcon.classList.add("fa-play");
    }
  }

  function playAlbum(album) {
    // Add your logic to play the selected album
    console.log("Playing album:", album);
  }

  song.addEventListener("timeupdate", function () {
    const currentTimeMinutes = Math.floor(song.currentTime / 60);
    const currentTimeSeconds = Math.floor(song.currentTime % 60);
    timerStart.textContent = `${currentTimeMinutes}:${currentTimeSeconds}`;

    progress.value = song.currentTime;
  });

  progress.addEventListener("input", function () {
    song.currentTime = progress.value;
  });

  ctrlIcon.addEventListener("click", playPause);

  // Load the audio
  song.load();
});


