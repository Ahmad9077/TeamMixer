# قرعة لعبة سين جيم - ديوانية الجيران

High-fidelity responsive Arabic RTL web app for a three-group name draw, styled with the Light Modern Minimal design system. The wheel selects a name from the active group, then the app assigns the player to الفريق الأول or الفريق الثاني using the alternating workflow. App state (players, draw progress, picked categories) persists in `localStorage`.

## Run Locally

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/index.html
```
