# Math editor walkthrough

The MP4 files show the real @barocss/math-editor 0.1.0 UI, recorded with browser automation. Formula selection, wrapping, new-line insertion, suggestion acceptance and cell edits use actual pointer/keyboard/input events. Korean query insertion is programmatic and is not an OS IME demonstration.

There is no audio. Each locale has matching captions and a poster frame. Playback is user initiated; videos use preload="none" on the landing page.

To regenerate from the workspace root while the demo dev server runs on port 5184:

    node apps/math-demo/scripts/record-showcase.mjs

The script requires Playwright Chromium and ffmpeg. It writes Korean and English MP4, JPG and WebVTT assets into this directory. The recording-only /showcase.html page is intentionally excluded from the public production build.
