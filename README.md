# Task Manager

## Prerequisites
- Assumes a local ```mongod``` instance running on port ```27017```.
- Alternatively update ```.env``` file with the appropriate ```DB_CONNECTION_URI``` for your setup.

## Setup
create ```.env``` file in ```/server``` with the following:
```
DB_CONNECTION_URI="mongodb://127.0.0.1:27017"
DB_NAME="TaskManager"
```

## Installation

```
npm install
```

## Development Server
```
# start local development server
npm run dev

# open in your browser
http://localhost:8080/
```