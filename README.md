# ChatVault

A modern web application for searching, filtering, and analyzing WhatsApp chat exports. Upload your `.txt` chat files and explore conversations with powerful search tools, date filtering, and comprehensive analytics.

## 📖 Description

ChatVault is a powerful web application that helps you explore and analyze your WhatsApp conversations. Simply upload your exported chat files and gain insights into your messaging patterns, search through conversations, and export filtered results.

### Key Capabilities:

## ✨ Features

- 📱 **Chat Parsing**: Parse WhatsApp chat exports (.txt files) with standard formatting
- 🔍 **Search & Filter**: Real-time search by keyword, date range, time range, and sender
- 💬 **Chat Interface**: Beautiful chat-style UI with message grouping and timestamps
- 🌙 **Dark/Light Mode**: Toggle between dark and light themes
- 📤 **Export Options**: Export filtered chat data to TXT or JSON format
- 📱 **Mobile Responsive**: Works perfectly on desktop and mobile devices
- ⚡ **Fast Performance**: Optimized for large chat files with efficient filtering

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/stevie1mat/ChatVault
cd ChatVault
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Uploading a Chat File

1. **Export from WhatsApp**: 
   - Open the chat you want to export in WhatsApp
   - Go to Chat Settings → Export Chat
   - Choose "Without Media" to get a .txt file

2. **Upload to the App**:
   - Drag and drop your .txt file onto the upload area
   - Or click "Choose File" to browse and select your file
   - The app will automatically parse and display your chat

### Using Search and Filters

- **Keyword Search**: Type any word to search through message content
- **Date Range**: Select start and end dates to filter messages
- **Time Range**: Filter messages by specific time periods (e.g., 6 AM - 12 PM)
- **Sender Filter**: Filter messages by specific participants
- **Clear Filters**: Click "Clear all" to reset all filters

### Exporting Data

- **Export TXT**: Download filtered messages in plain text format
- **Export JSON**: Download filtered messages in structured JSON format

### Theme Toggle

Click the sun/moon icon in the header to switch between light and dark themes.

## Supported Chat Format

The app supports standard WhatsApp chat export format:

```
[MM/DD/YY, HH:MM AM/PM] Sender Name: Message content
```

Example:
```
[8/3/25, 10:15 PM] John: Hello! How are you doing?
[8/3/25, 10:16 PM] Sarah: Hi John! I'm doing great, thanks for asking.
```

## Technical Details

### Built With

- **Next.js 13** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - Modern React state management

### Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main application page
│   └── globals.css     # Global styles
├── components/          # React components
│   ├── ChatMessage.tsx # Individual message component
│   ├── ChatView.tsx    # Chat display component
│   ├── ExportButtons.tsx # Export functionality
│   ├── FileUpload.tsx  # File upload component
│   ├── SearchFilters.tsx # Search and filter controls
│   └── ThemeToggle.tsx # Dark/light mode toggle
├── types/              # TypeScript type definitions
│   └── chat.ts         # Chat-related types
└── utils/              # Utility functions
    └── chatParser.ts   # Chat parsing logic
```

### Key Features Implementation

- **Chat Parsing**: Regex-based parsing of WhatsApp export format
- **Real-time Filtering**: Efficient filtering with React useMemo
- **Local Storage**: Theme preference persistence
- **File Handling**: Client-side file processing with File API
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Testing

Use the included `sample-chat.txt` file to test the application functionality.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

If you encounter any issues or have questions, please open an issue on [GitHub](https://github.com/stevie1mat/ChatVault).

## Repository

📁 **GitHub**: [https://github.com/stevie1mat/ChatVault](https://github.com/stevie1mat/ChatVault)
