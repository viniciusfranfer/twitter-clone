Test twitter-clone : https://twitter-clone-kqll.onrender.com/

# Twitter Clone

A Twitter clone built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Technologies Used

- **Frontend:** React.js + Vite
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (JSON Web Token)
- **Styling:** Tailwind CSS
- **State Management:** Context API
- **Image Uploads:** Cloudinary

## 📂 Project Structure

```
/twitter-clone
├── backend   # Server-side code (Node.js + Express)
├── frontend  # Client-side code (React.js + Vite)
├── README.md # Project documentation
```

## 🛠 Setup

### Backend

1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file with the environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_url
   JWT_SECRET=your_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Start the server:
   ```sh
   npm run dev
   ```

### Frontend

1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend:
   ```sh
   npm run dev
   ```

## 🚀 Features

- Sign up and log in with JWT
- Create and delete tweets
- Like tweets
- Follow/unfollow users
- Dynamic feed with posts from followed users
- Responsive UI
- Upload images for tweets and profiles using Cloudinary

## 📝 Future Improvements

- Improve user experience with animations
- Implement real-time notifications with WebSockets

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Developed by [Vinicius](https://github.com/viniciusfranfer) 🚀


