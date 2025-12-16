<div align="center">
  <img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" alt="Gemini Editor Banner" width="1200" height="475" />
</div>

# 🎨 Gemini AI Image Editor

> Transform your images with the power of AI using natural language commands

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?logo=google)](https://ai.google.dev/)

## ✨ Overview

**Gemini Editor** is a cutting-edge AI-powered image editing application that leverages Google's Gemini 2.5 Flash Image model to transform your images using simple text instructions. No complex tools, no steep learning curve—just describe what you want, and watch AI bring your vision to life.

**🔗 Live Demo:** [View in AI Studio](https://ai.studio/apps/drive/1QIBAjvFoYeHUUWAhKpdm5Y3WxURP_hnf)

---

## 🚀 Key Features

### 🤖 AI-Powered Editing
- **Natural Language Processing**: Edit images using plain English commands
- **Powered by Gemini 2.5 Flash**: Lightning-fast image generation with state-of-the-art AI
- **Professional Results**: From background removal to color grading, achieve studio-quality edits

### 📜 Edit History & Version Control
- **Visual History Timeline**: Track all your edits with thumbnail previews
- **Undo/Redo Support**: Navigate through your edit history with keyboard shortcuts (Ctrl+Z/Y)
- **Non-Destructive Editing**: Original image is always preserved

### 🎯 Smart Features
- **AI-Generated Suggestions**: Get context-aware prompt suggestions tailored to your image
- **Iterative Editing**: Apply multiple transformations in sequence
- **Side-by-Side Comparison**: Compare original and edited images instantly
- **Drag & Drop Upload**: Seamless file upload experience

### 📱 Fully Responsive Design
- **Mobile-First**: Optimized for all screen sizes from phones to desktops
- **Touch-Friendly**: Intuitive mobile navigation with sidebar drawer
- **Adaptive UI**: Components adjust intelligently to viewport size

### 🎨 Supported Formats
- **Images**: PNG, JPG, JPEG, WebP
- **Documents**: PDF (with preview support)
- **File Size**: Up to 10MB

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|-----------|
| **Frontend Framework** | React 19 with TypeScript |
| **Build Tool** | Vite 6.2 |
| **Styling** | Tailwind CSS (CDN) |
| **AI Model** | Google Gemini 2.5 Flash Image |
| **API SDK** | @google/genai v1.30.0 |
| **Icons** | Lucide React v0.555.0 |
| **State Management** | React Hooks (useState, useEffect, useCallback) |
| **Utilities** | UUID for unique identifiers |

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **Gemini API Key** ([Get one here](https://aistudio.google.com/app/apikey))

### Step 1: Clone the Repository
```bash
git clone https://github.com/MD-Abdul-Raheem/AI-Img-Editor.git
cd AI-Img-Editor
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure API Key
Create or edit `.env.local` in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

⚠️ **Important**: Never commit your API key to version control. The `.env.local` file is already in `.gitignore`.

### Step 4: Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Step 5: Build for Production
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

---

## 📖 How to Use

### 1️⃣ Upload an Image
- **Drag & Drop**: Simply drag an image or PDF onto the upload area
- **Browse Files**: Click to open file picker
- **Supported Formats**: PNG, JPG, WebP, PDF (max 10MB)

### 2️⃣ Describe Your Edit
Type what you want to change in natural language. Examples:
- "Remove the background and make it white"
- "Add dramatic cinematic lighting"
- "Convert to black and white with high contrast"
- "Make it look like a watercolor painting"
- "Enhance colors and increase sharpness"

### 3️⃣ Generate & Compare
- Click the **Send** button or press **Enter**
- AI processes your request (typically 3-10 seconds)
- View side-by-side comparison of original vs edited

### 4️⃣ Iterate & Refine
- Click **Edit Output** to continue editing the result
- Apply multiple transformations in sequence
- Use **Undo/Redo** to navigate through versions
- **Download** your final result

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Z` | Undo last edit |
| `Ctrl/Cmd + Shift + Z` | Redo edit |
| `Ctrl/Cmd + Y` | Redo edit (alternative) |
| `Enter` | Generate edit (when prompt is focused) |

---

## 💡 Tips for Best Results

### ✅ Be Specific
Instead of: *"Make it better"*  
Try: *"Enhance lighting with warm tones, increase contrast, and sharpen details"*

### ✅ Use Professional Terms
- **Photography**: bokeh, depth of field, golden hour, HDR
- **Design**: color grading, saturation, vignette, studio lighting
- **Artistic**: watercolor, oil painting, sketch, vector art

### ✅ Iterate Gradually
1. Start with broad changes (e.g., "Remove background")
2. Refine with specific adjustments (e.g., "Add soft shadows")
3. Fine-tune details (e.g., "Increase brightness by 10%")

### ✅ Leverage AI Suggestions
- Click on suggested prompts for inspiration
- Suggestions are context-aware based on your image content

---

## 🏗️ Project Structure

```
ai-image-editor/
├── components/
│   ├── AboutPage.tsx          # About page with app documentation
│   ├── Button.tsx              # Reusable button component
│   ├── ComparisonView.tsx      # Side-by-side image comparison
│   ├── ImageUploader.tsx       # Drag & drop file upload
│   └── PromptInput.tsx         # Text input with auto-resize
├── services/
│   └── geminiService.ts        # Gemini API integration
├── App.tsx                     # Main application component
├── types.ts                    # TypeScript type definitions
├── index.tsx                   # React entry point
├── index.html                  # HTML template with Tailwind
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── .env.local                  # Environment variables (API key)
└── README.md                   # This file
```

---

## 🔧 Configuration

### Environment Variables
Create `.env.local` in the root directory:
```env
GEMINI_API_KEY=your_api_key_here
```

### Vite Configuration
The app uses Vite's environment variable system. In `geminiService.ts`, the API key is accessed via:
```typescript
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
```

Vite automatically loads `.env.local` and makes variables available via `process.env`.

---

## 🎨 Customization

### Tailwind Configuration
Tailwind is loaded via CDN in `index.html` with custom configuration:
```javascript
tailwind.config = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      }
    }
  }
}
```

### Color Scheme
The app uses a monochrome "Shine" palette:
- **Background**: Pure Black (#000000)
- **Borders**: Zinc-800 (#27272a)
- **Text**: White (#ffffff) and Zinc shades
- **Accents**: White glow effects

---

## 🚀 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload the 'dist' folder to Netlify
```

### Environment Variables in Production
Don't forget to set `GEMINI_API_KEY` in your hosting platform's environment variables.

---

## 🐛 Troubleshooting

### Issue: "API Key not found"
**Solution**: Ensure `.env.local` exists with `GEMINI_API_KEY=your_key`

### Issue: "Model returned no image"
**Solution**: Try a more specific prompt or a different image. Some prompts may be blocked by safety filters.

### Issue: Build fails
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Slow generation
**Solution**: Gemini 2.5 Flash is optimized for speed. Slow responses may indicate network issues or API rate limits.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/MD-Abdul-Raheem/AI-Img-Editor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/MD-Abdul-Raheem/AI-Img-Editor/discussions)
- **Email**: [Your Email]

---

## 🙏 Acknowledgments

- **Google Gemini Team** for the incredible AI model
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon set

---

## 📊 Version History

- **v2.1** (Current)
  - Added About page with comprehensive documentation
  - Improved responsive design for mobile devices
  - Enhanced keyboard shortcuts
  - Better error handling

- **v2.0**
  - Edit history with undo/redo
  - AI-generated prompt suggestions
  - Side-by-side comparison view

- **v1.0**
  - Initial release
  - Basic image editing with Gemini AI

---

<div align="center">
  <p>Made with ❤️ using React, TypeScript, and Google Gemini AI</p>
  <p>
    <a href="https://github.com/MD-Abdul-Raheem/AI-Img-Editor">⭐ Star this repo</a> •
    <a href="https://github.com/MD-Abdul-Raheem/AI-Img-Editor/issues">🐛 Report Bug</a> •
    <a href="https://github.com/MD-Abdul-Raheem/AI-Img-Editor/issues">✨ Request Feature</a>
  </p>
</div>
