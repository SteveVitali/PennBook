PennBook - a one-page Facebook.
by Steve Vitali (svitali)
and Tim Clancy (clancyt)

The features implemented are all those required:
- Start page for user login.
- User passwords are hashed.
- Users have profiles with IDs, status support, affiliations, and friends.
- There is a homepage with status updates, currently-online friends, and a means of updating status.
- Users have the ability to comment on the items displayed on this homepage.
- The user sees friend recommendations based on an adsorption implementation.
- The user can post publicly to a friend's wall.
- The user can visualize their network of friends and affiliates.
- The user homepage is dynamic and periodically refreshes.
- The user is offered a search field with suggestions.
- The project has been designed with scalability in mind as much as possible.
- We believe the project to be secure.

No extra credit is claimed.

Sources:
README.md
app.js
bin/www
controllers/api/action.js
controllers/api/comment.js
controllers/api/friend-request.js
controllers/api/friendship.js
controllers/api/index.js
controllers/api/status.js
controllers/api/user.js
controllers/user.js
controllers/visualize.js
db/action.js
db/comment.js
db/friend-request.js
db/friendship.js
db/index.js
db/recommendation.js
db/status.js
db/user.js
gulpfile.js
package.json
public/build/main.js
public/css/base.css
public/images/signup.png
public/js/friendvisualizer.js
public/js/jit.js
public/models/action.js
public/models/friendship.js
public/models/index.js
public/models/status.js
public/models/user.js
public/styles/auto-complete.css
public/styles/style.css
public/utils.js
public/views/app.js
public/views/auto-complete-input.jsx
public/views/comment.jsx
public/views/login.jsx
public/views/navigation-bar.jsx
public/views/news-feed-item.jsx
public/views/news-feed.jsx
public/views/post-status-form.jsx
public/views/status.jsx
public/views/user-profile-info.jsx
public/views/user-profile.jsx
recommender/src/edu/upenn/nets212/pennbook/RecommendDriver.java
recommender/src/edu/upenn/nets212/pennbook/RecommendMapperDiff.java
recommender/src/edu/upenn/nets212/pennbook/RecommendMapperFinish.java
recommender/src/edu/upenn/nets212/pennbook/RecommendMapperInit.java
recommender/src/edu/upenn/nets212/pennbook/RecommendMapperIter.java
recommender/src/edu/upenn/nets212/pennbook/RecommendMapperPreInit.java
recommender/src/edu/upenn/nets212/pennbook/RecommendMapperSort.java
recommender/src/edu/upenn/nets212/pennbook/RecommendReducerDiff.java
recommender/src/edu/upenn/nets212/pennbook/RecommendReducerFinish.java
recommender/src/edu/upenn/nets212/pennbook/RecommendReducerInit.java
recommender/src/edu/upenn/nets212/pennbook/RecommendReducerIter.java
recommender/src/edu/upenn/nets212/pennbook/RecommendReducerPreInit.java
recommender/src/edu/upenn/nets212/pennbook/RecommendReducerSort.java
routes/index.js
scripts/generate-recommender-input.js
scripts/init-database.js
scripts/make-random-friends.js
scripts/test-recommender.js
scripts/upload-mock-users.js
scripts/upload-recommender-output.js
views/error.jade
views/friendvisualizer.ejs
views/index.jade
views/layout.jade

We declare that all code included herein is our own. [X]

To build and run this project, begin with the command "npm install" to obtain all dependencies. Next. build the frontend using the command "gulp." Finally, the project can be started with the command "npm start." The project should then be available on port 3000.