# AcidLines

AcidLines is a grid sequencer which uses the Web MIDI protocol to
control an external synthesizer device or software plugin. It is geared
specificallt towards 303 clones such as the TB-03 and TD-3, but is usable
with any synthesizer that can accept MIDI input.

**Server not yet online, coming soon!**
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

I would like to find collaborators to help me bring this project to its
full potential. If you are interested, please reach out.
