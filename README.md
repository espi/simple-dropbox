# Simple Dropbox 📦

A rather splendid little web app for shifting files about when you can't be bothered with all that proper setup nonsense.

## What's all this then?

Ever found yourself stuck on some remote machine, desperately wanting to grab a file but can't remember how to set up SSH/SFTP/FTP or whatever other blasted protocol? Well, this is your ticket out of that pickle!

Simply:
1. Pop this on your machine
2. Let it do its thing
3. Chuck your files at the web interface
4. Bob's your uncle! 🎉

## Getting Started

Right then, let's get cracking. Copy this rather dashing one-liner into your terminal:

```bash
curl -sSL "https://raw.githubusercontent.com/espi/simple-dropbox/main/setup.sh" -o setup.sh && \
chmod +x setup.sh && \
./setup.sh
```

Or if you prefer to do things the proper way:

```bash
#!/bin/bash
set -euo pipefail

# Fancy terminal colours because we're not savages
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Right then, let's get this show on the road...${NC}"

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Blimey! Python 3 isn't installed. Can't do much without that, mate.${NC}"
    exit 1
fi

# Clone the repository
echo -e "${BLUE}Fetching the goods...${NC}"
git clone https://github.com/espi/simple-dropbox.git
cd simple-dropbox

# Set up virtual environment
echo -e "${BLUE}Setting up a proper development environment...${NC}"
python3 -m venv venv
source venv/bin/activate

# Install dependencies
echo -e "${BLUE}Installing the necessary bits and bobs...${NC}"
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating a fresh .env file...${NC}"
    echo "NGROK_AUTH_TOKEN=" > .env
    echo -e "${GREEN}Pop your ngrok token in .env if you fancy reaching this from the outside world${NC}"
fi

echo -e "${GREEN}All done! Run 'python run.py' to fire it up.${NC}"
echo -e "${BLUE}Cheerio! 🇬🇧${NC}"
```

## How it Works

Rather straightforward, really. Drop your files onto the web interface, and they'll be neatly tucked away in timestamped folders. Download them whenever you fancy, and they'll be there waiting for you like a loyal British butler.

## Features

- Drag and drop? ✅ Obviously!
- Progress bars? ✅ Wouldn't be cricket without them
- Timestamped batches? ✅ Keeps things tidy, what what
- Automatic ngrok tunneling? ✅ For when you're feeling adventurous

## Requirements

- Python 3.x (Because, like I already said, we're not savages!)
- Flask (For serving up our lovely web interface)
- A sense of humour (Optional, but highly recommended)

## Contributing

Found a bug? Got a brilliant idea? Feel free to send a pull request. Just make sure your code is as neat as a new pin - we're British, after all.

## License

MIT License - Because sharing is caring, innit?

## A Final Note

If you're wondering why this exists when there are proper file-sharing solutions out there, well... sometimes you just want something that does the job without all the faff. This is that something.

Cheerio! 🇬🇧
