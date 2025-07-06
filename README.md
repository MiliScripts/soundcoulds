Of course! Here is the raw Markdown version of the README. You can copy and paste this directly into a README.md file for your project.

Generated markdown
# SoundCloud Downloader & Toolkit

A comprehensive, responsive web-based tool to search, play, and download tracks, playlists, and user content from SoundCloud. Built with modern web technologies and optimized for both desktop browsers and Telegram Web Apps.

---

## ✨ Features

-   **🔍 Track Search & Download:** Search for tracks by name/artist or use a direct SoundCloud URL.
-   **ℹ️ Detailed Track Info:** View extensive details for any track, including high-quality artwork, description, and stats (plays, likes, comments, downloads).
-   **▶️ In-Browser Playback:** Stream tracks directly in the browser before downloading.
-   **📊 Download with Progress:** Download tracks with a visual progress bar showing the download status.
-   **🎵 Playlist Downloader:** Input a playlist URL to view and download all its tracks.
-   **👤 User Profile Tools:**
    -   Fetch all tracks uploaded by a specific user.
    -   Fetch all tracks liked by a specific user.
    -   A utility to get a user's numerical ID from their username.
-   **批量 Batch Operations:** "Download All" option for user tracks, likes, and playlists.
-   **➕ Pagination:** "Load More" functionality for browsing long lists of tracks.
-   **📱 Responsive Design:** A clean, modern UI that looks great on all devices, from mobile phones to desktops.
-   **🎨 Light & Dark Mode:** Automatic and manual theme switching for your viewing comfort.
-   **✈️ Telegram Web App Ready:** Fully optimized for a seamless experience inside the Telegram app.

## 🛠️ Technology Stack

-   **Frontend:** HTML5, Vanilla JavaScript, Tailwind CSS, daisyUI
-   **Backend:** Cloudflare Workers (for API requests and bypassing CORS)
-   **Deployment:** Can be deployed on any static hosting platform (e.g., Cloudflare Pages, GitHub Pages, Vercel).

## 🚀 How to Use

1.  **Main Page (`index.html`):**
    -   To download a specific track, paste its SoundCloud URL into the search bar and press "Search". You will be redirected to the results page.
    -   To find a track, type the artist or track name and press "Search". A modal will appear with the search results. Click "Download" on your desired track.

2.  **Playlist Downloader (`playlist.html`):**
    -   Paste the full URL of a SoundCloud playlist to see all its tracks.
    -   You can then download tracks individually.

3.  **User Tools:**
    -   **Get User ID (`user-id.html`):** Enter a SoundCloud username to get their unique numerical ID, which is required for the other user tools.
    -   **Get User Likes (`user-likes.html`):** Enter a user ID to see all the tracks they've liked.
    -   **Get User Tracks (`user-tracks.html`):** Enter a user ID to see all the tracks they've uploaded.

## 🔮 Future Plans

Based on the `todo` file, here are some planned features:
-   [ ] **Batch Download:** Implement batch downloading for playlists and user tracks as a single `.zip` file.
-   [ ] **Forced Download:** Add an option to force-download a track instead of opening it in a new tab.
-   [ ] **Telegram Enhancements:**
    -   Add a visual progress bar for track playback within the app.
    -   Improve the UI for drawers and modals.
-   [ ] **General Improvements:**
    -   Add SEO-friendly meta tags.
    -   Follow artists directly from the app.
    -   Purchase a custom domain.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/your-repo/issues).

---
---
---

<div dir="rtl">

# دانلودر و ابزار ساندکلود

یک ابزار تحت وب جامع و واکنش‌گرا برای جستجو، پخش و دانلود آهنگ‌ها، پلی‌لیست‌ها و محتوای کاربران از ساندکلود. این پروژه با تکنولوژی‌های مدرن وب ساخته شده و برای مرورگرهای دسکتاپ و همچنین وب‌اپ تلگرام بهینه‌سازی شده است.

---

## ✨ ویژگی‌ها

-   **🔍 جستجو و دانلود آهنگ:** جستجوی آهنگ بر اساس نام خواننده/قطعه یا استفاده از لینک مستقیم ساندکلود.
-   **ℹ️ اطلاعات دقیق آهنگ:** نمایش جزئیات کامل هر آهنگ، شامل کاور باکیفیت، توضیحات و آمار (تعداد پخش، لایک، کامنت و دانلود).
-   **▶️ پخش آنلاین:** پخش مستقیم آهنگ در مرورگر قبل از اقدام به دانلود.
-   **📊 دانلود با نوار پیشرفت:** دانلود آهنگ‌ها با نمایش بصری وضعیت و درصد پیشرفت دانلود.
-   **🎵 دانلودر پلی‌لیست:** وارد کردن لینک یک پلی‌لیست برای مشاهده و دانلود تمام آهنگ‌های آن.
-   **👤 ابزارهای پروفایل کاربر:**
    -   دریافت تمام آهنگ‌های آپلود شده توسط یک کاربر خاص.
    -   دریافت تمام آهنگ‌های لایک شده توسط یک کاربر خاص.
    -   ابزاری برای دریافت شناسه عددی کاربر از طریق نام کاربری.
-   **批量 عملیات دسته‌جمعی:** قابلیت «دانلود همه» برای آهنگ‌های کاربر، لایک‌ها و پلی‌لیست‌ها.
-   **➕ صفحه‌بندی:** قابلیت «بارگذاری بیشتر» برای مرور لیست‌های طولانی آهنگ‌ها.
-   **📱 طراحی واکنش‌گرا (Responsive):** رابط کاربری تمیز و مدرن که در تمام دستگاه‌ها، از موبایل تا دسکتاپ، عالی به نظر می‌رسد.
-   **🎨 حالت روشن و تاریک:** قابلیت تغییر تم به صورت خودکار و دستی برای راحتی چشمان شما.
-   **✈️ آماده برای وب‌اپ تلگرام:** کاملاً بهینه‌سازی شده برای تجربه‌ای روان و یکپارچه در داخل اپلیکیشن تلگرام.

## 🛠️ تکنولوژی‌های استفاده شده

-   **فرانت‌اند:** HTML5, Vanilla JavaScript, Tailwind CSS, daisyUI
-   **بک‌اند:** Cloudflare Workers (برای مدیریت درخواست‌های API و عبور از محدودیت‌های CORS)
-   **استقرار:** قابلیت استقرار بر روی تمامی پلتفرم‌های هاستینگ استاتیک (مانند Cloudflare Pages, GitHub Pages, Vercel).

## 🚀 نحوه استفاده

۱. **صفحه اصلی (`index.html`):**
    - برای دانلود یک آهنگ مشخص، لینک URL آن را در نوار جستجو وارد کرده و دکمه «جستجو» را بزنید. به صفحه نتایج هدایت خواهید شد.
    - برای پیدا کردن یک آهنگ، نام هنرمند یا قطعه را تایپ کرده و «جستجو» را بزنید. یک پنجره مودال با نتایج جستجو نمایش داده می‌شود. روی دکمه «دانلود» آهنگ مورد نظر کلیک کنید.

۲. **دانلودر پلی‌لیست (`playlist.html`):**
    - لینک کامل یک پلی‌لیست ساندکلود را وارد کنید تا تمام آهنگ‌های آن نمایش داده شود.
    - سپس می‌توانید آهنگ‌ها را به صورت تکی دانلود کنید.

۳. **ابزارهای کاربر:**
    - **دریافت شناسه کاربر (`user-id.html`):** نام کاربری ساندکلود را وارد کنید تا شناسه عددی منحصر به فرد او را دریافت کنید. این شناسه برای ابزارهای دیگر لازم است.
    - **دریافت لایک‌های کاربر (`user-likes.html`):** شناسه کاربر را وارد کنید تا تمام آهنگ‌هایی که لایک کرده است را ببینید.
    - **دریافت آهنگ‌های کاربر (`user-tracks.html`):** شناسه کاربر را وارد کنید تا تمام آهنگ‌هایی که آپلود کرده است را ببینید.

## 🔮 برنامه‌های آینده

بر اساس فایل `todo`، ویژگی‌های زیر برای آینده برنامه‌ریزی شده‌اند:
-   [ ] **دانلود دسته‌جمعی:** پیاده‌سازی دانلود گروهی آهنگ‌های پلی‌لیست و کاربر به صورت یک فایل `.zip`.
-   [ ] **دانلود اجباری (Force Download):** افزودن گزینه‌ای برای دانلود مستقیم فایل به جای باز شدن در تب جدید.
-   [ ] **بهبودهای تلگرام:**
    -   افزودن نوار پیشرفت بصری برای پخش آهنگ در داخل اپ.
    -   بهبود رابط کاربری پنل‌های کشویی و مودال‌ها.
-   [ ] **بهبودهای کلی:**
    -   افزودن متا تگ‌ها برای بهینه‌سازی موتورهای جستجو (SEO).
    -   امکان دنبال کردن هنرمندان از داخل اپ.
    -   خرید یک دامنه اختصاصی.

## 🤝 مشارکت

از مشارکت، گزارش مشکلات و ارائه پیشنهادات استقبال می‌شود! می‌توانید به [صفحه مشکلات (Issues)](https://github.com/your-username/your-repo/issues) مراجعه کنید.

</div>
