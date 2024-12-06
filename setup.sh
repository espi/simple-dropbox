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