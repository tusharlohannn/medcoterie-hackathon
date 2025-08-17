# Q&A Platform for Medical Professionals and Medical Students.  

A full-stack Question & Answer platform where users can post questions, browse through existing discussions, and interact with a community.
Tech Stack Used:
1. ReactJS (for frontend)
2. NodeJS + Express (for backend)
3. Postgres (for database)
4. Frontend Deployment (Used Vercel to deploy the frontend code with a free account)
5. Backend and Database Deployment (User Render to deploy the backend(node) and database(postgres) with a free account)

Features implemented:
- Authentication (login/logout with JWT)
- User Home with questions feed
- Search & Filter (by title, description, and username)
- Post creation & display
- Upvoting/Downvoting posts and also adding comments(answers) to the posts
- Notifications, when someone likes/comments on a users posts.
- Sorting posts(questions) based on uploaded time

----------------------------------------------------------------------------------------------------------------------------------------------
Local Setup Guide:
1. First pull the latest frontend and backend code from this repository(main branch).
2. Then open the backend folder in your terminal and run this command "npm i".
3. Now create a postgres Database. You can use the schema file attached in the root folder to create the tables in your local db.
4. Now open 2 terminal, one for running the frontend and one for the backend.
5. In the first terminal, move into the frontend folder and run "npm run dev", this will start your frontend server on the port: 5173.
6. Now open the backend folder in your second terminal and run "npm start"(if you see any errors here, just do "npm i --force") and this will start your backend on port 5000.
7. Now open your browser and enter this url ("http://localhost:5173/"). This will open the login page for you in your broswer.
8. You can now register with a new account, or log into an existing account and explore the platform.

-----------------------------------------------------------------------------------------------------------------------------------------------
## Future Improvements
- Tagging system for categorizing questions
- Rich-text support for answers
- User profile pages
- Real-time updates with WebSockets

## Deployment Links
- Frontend: https://medcoterie-hackathon.vercel.app
  You can use the above frontend link for testing the platform. It is deployed publicly and accessible to all.
  The below links are just for reference.
- Backend: https://medcoterie-hackathon.onrender.com
- External Database Url: postgresql://medcoterirdb_user:VJd05ozK36VQoVYTN9SmTgDZE6ZZyyke@dpg-d2gnj9ruibrs73eh6kfg-a.singapore-postgres.render.com/medcoterirdb

## Note
The Deployment links might be a little slow to respond, because I'm using a free account and both Vercel and Render temporarily sleep the servers when they are not being used.
