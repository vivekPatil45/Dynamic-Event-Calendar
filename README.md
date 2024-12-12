# Dynamic Event Calendar

The Dynamic Event Calendar is a web application that allows users to create, edit, view, and delete events on a calendar interface. It provides intuitive functionality for managing events and ensures no overlapping events occur. Users can export events in JSON or CSV format for further use.

## Features

- **Interactive Calendar**: View events by date with a clean and responsive calendar interface.
- **Add and Edit Events**: Create new events or modify existing ones with details like name, date, start time, end time, description, and color coding.
- **Event List**: View a list of events for a selected date.
- **Event Filtering**: Search and filter events based on keywords.
- **Event Export**: Export current month's events in JSON or CSV format.
- **Local Storage**: Events are saved locally in the browser's storage to persist data across sessions.

## Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

### Running the App Locally

1. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Open your browser and navigate to:

   ```
   http://localhost:3000
   ```

## Link to Deployed App

[Deployed App URL](#)

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: React Hooks
- **Storage**: LocalStorage for persistent data
- **Utilities**: FileSaver.js for event export
