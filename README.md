# AcidLines

Try AcidLines at [acid.musictools.live](acid.musictools.live).

## Development Setup Instructions

Installing dependencies:

```
# Install npm and update it
sudo apt-get install -y nodejs npm
sudo npm install -g npm

# Install dependencies for this project
npm install
sudo npm install --global --only=dev
```

To start the server locally:

```
node server.js
```

App is then accessible at `http://localhost:7774/`

## Planned Features

Features planned for future versions of AcidLines:
- Ability to queue multiple patterns into a track
- Online sharing and browsing of patterns
- Built-in acid synth to preview patterns or tinker without a hardware 303-clone
