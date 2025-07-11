# 🗺️ Marauder's Mapper

> _"I solemnly swear that I am up to no good"_ - A magical Chrome extension to scrape Google Maps data with style!

**Marauder's Mapper** is a Chrome extension that helps you extract business information from Google Maps search results in a beautiful, Harry Potter-themed interface. Perfect for market research, lead generation, and data analysis.

## ✨ Features

- 🪄 **One-Click Scraping**: Extract business data from Google Maps with a single click
- 📊 **Comprehensive Data**: Captures business name, rating, reviews, phone, industry, address, website, and Maps link
- 📥 **CSV Export**: Download data as CSV with actual URLs (not just display text)
- 🎨 **Beautiful UI**: Modern, responsive design with Harry Potter theming
- ⚡ **Fast & Reliable**: Built with modern web technologies for optimal performance
- 🔒 **Privacy Focused**: All processing happens locally, no data sent to external servers

## 🚀 Installation

### Option 1: Install from Chrome Web Store

_Coming soon..._(meaning never 😁)

### Option 2: Install Manually (Developer Mode)

1. **Download the Extension**

   ```bash
   git clone https://github.com/Nemanzh/marauders-mapper.git
   cd marauders-mapper
   ```

2. **Open Chrome Extensions Page**

   - Go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the `src` folder from the downloaded repository
   - The extension should now appear in your Chrome toolbar

## 📖 How to Use

### Step 1: Navigate to Google Maps

1. Go to [Google Maps](https://www.google.com/maps)
2. Search for businesses (e.g., "restaurants in New York", "dentists near me")
3. Make sure you're on a search results page with multiple business listings

### Step 2: Open Marauder's Mapper

1. Click the Marauder's Mapper icon in your Chrome toolbar
2. If you're on a Google Maps search page, you'll see: _"All set! The spell is in place. Start revealing the hidden places."_
3. If not, click the link to navigate to Google Maps search

### Step 3: Scrape the Data

1. Click **"Reveal Hidden Places"** button
2. The extension will extract data from all visible businesses on the page
3. Results will appear in a beautiful table format

### Step 4: Export Your Data

1. Click **"Download Scroll (CSV)"** to export the data
2. The file will be saved as `marauders-map-data.csv`
3. Open in Excel, Google Sheets, or any CSV reader

## 📊 Data Fields Extracted

| Field                | Description                        |
| -------------------- | ---------------------------------- |
| **Title**            | Business name                      |
| **Rating**           | Star rating (1-5)                  |
| **Reviews**          | Number of reviews                  |
| **Phone**            | Phone number                       |
| **Industry**         | Business category/type             |
| **Address**          | Full business address              |
| **Website**          | Company website URL                |
| **Google Maps Link** | Direct link to Google Maps listing |

## 💡 Tips for Best Results

- **Scroll Down**: Load more results by scrolling down on Google Maps before scraping
- **Specific Searches**: Use specific search terms for better targeting (e.g., "Italian restaurants" vs "restaurants")
- **Location-Based**: Include location in your search for geo-targeted results
- **Multiple Exports**: You can scrape different searches and combine the CSV files

## 🛠️ Technical Details

### Built With

- **HTML5** - Structure and layout
- **CSS3** - Modern styling with gradients and animations
- **JavaScript (ES6+)** - Core functionality and DOM manipulation
- **Chrome Extension API** - Browser integration
- **Font Awesome** - Beautiful icons

### File Structure

```
src/
├── manifest.json       # Extension configuration
├── popup.html         # Main UI
├── popup.css          # Styling
├── popup.js           # Core functionality
└── icon.png          # Extension icon
```

### Permissions Used

- `activeTab` - Access to current tab for scraping
- `scripting` - Execute scripts on Google Maps pages

## 🔧 Development

### Prerequisites

- Chrome Browser
- Basic knowledge of HTML/CSS/JavaScript

### Local Development

1. Clone the repository
2. Make changes to files in the `src/` directory
3. Go to `chrome://extensions/`
4. Click the refresh button on the Marauder's Mapper extension
5. Test your changes

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 Changelog

### Version 1.0

- Initial release
- Harry Potter themed UI
- Basic Google Maps scraping functionality
- CSV export with URLs
- Responsive design

## ⚠️ Disclaimer

This extension is for educational and research purposes. Please respect Google's Terms of Service and robots.txt files. Use responsibly and don't overload Google's servers with excessive requests.

## 🐛 Known Issues

- Works best with English Google Maps interface
- Some business details might be missing if not displayed on the search results page
- Large datasets may take a moment to process

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Harry Potter universe by J.K. Rowling for inspiration
- Google Maps for providing the data source
- Chrome Extension community for tutorials and best practices

---

<div align="center">

**⚡ Mischief Managed ⚡**

_Built with ❤️ and way too much coffee by [@Nemanzh](https://github.com/Nemanzh)_

</div>
