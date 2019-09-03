-----------------------------------------------------
NODEJS: Express, Mongoose & Passport Login/Signup app
-----------------------------------------------------

-----------
-- Index --
-----------

1. Introduction
2. Installation steps
3. What is going on in this app?
4. Which modules are being used?
5. Conclusion

---------------
1. Introduction
---------------

This is a minimal attempt at an excercise a teacher suggested us to do to integrate some concepts we learned in a NodeJS and MongoDB course at EducacionIT institute, based on a skeleton of a NodeJS app we have seen and discussed during that course. So, shout out to Daniel Sanchez (our teacher) and the academy itself for pushing us to practise and learn a little bit more every day.

Before going on, let me clarify that I have done this only as my first practise of backend authentication with NodeJS. I did not add any front-end decoration with plain CSS, bootstrap or alikes since this was not the objective of the excercise.

If you find the app useful, feel free to use it as you like. But please, since I'm just starting my programming career (in fact, this is my second attempt at programming), it would help lots if you could mention me while doing so. Thanks!


---------------------
2. Installation steps
---------------------

1. Clone the repository in your desired path.
2. Open a terminal on that path and recover all npm packages with 'npm install' command.
3. Initialize a Mongo database on that path in one terminal with the 'mongod --dbpath "path here"' command. Don't forget the 'data' and 'db' folders required by MongoDB.
4. On a second terminal, execute MongoDB (mongo.exe).
5. On a third terminal, launch the app: (node server.js).
6. Open http://localhost:8080 in a browser and there you go.


--------------------------------
3. What is going on in this app?
--------------------------------

Everything is commented in detail in server.js, but here is the summary.

First of all, the root page will render a login validation form which will either prompt you for you login credentials (username and password), or will ask you to sign up (redirecting you to the signup form).

Either way, when you type the data on the fields and hit the submit button, Passport will kick in to authenticate the submitted information.

    > If you attempted to log in and credentials were invalid, then it renders a login-error page and gives you the option to go back.

    > If you tried to sign up and the username is already in the database, same idea: it redirects you to a signup-error page.

On a valid authentication (either login or signup), Passport will create/restore the user session, render a login-ok page displaying the user information and offer you a logout option.

Additionally, the user will now have access to the /protected-path resource, which you can try by yourself by completing the URL with it (http://localhost:8080/protected-path). The cookie expiration is set to a default of 60 seconds, so after a minute, the session will be destroyed and you will lose the access to that path.

If the user tries to access the protected path but he/she is not logged in or did not sign up for the first time, Passport will redirect them to the /login page. This is the whole meaning of the excercise: to be able to render resources only if the session is authenticated.

Also, on a valid signup, the user data will be saved in MongoDB (by the way, the password will be encrypted at all times, even when comparing values at the time the user logs in).

If the user decides to log out, the session will be destroyed, so he/she will not be able to access the protected-path any longer.

There's a routing-map.jpg in the repository that illustrates the whole routing process of the app.


--------------------------------
4. Which modules are being used?
--------------------------------

EXPRESS: Server implementation, session persistance, user
    > EXPRESS-SESSION: session persistance.
    > COOKIE-PARSER: cookie usage.
    > BODY-PARSER: html parsing.
    > EXPRESS-HANDLEBARS: template rendering engine.

MONGOOSE: MongoDB managing (creating, saving, querying user profiles and information).

PASSPORT: Login and Signup authentication, forwarding and redirecting.
    > PASSPORT-LOCAL: Passport strategy managing. 

BCRYPT: Passport encryption.

CUSTOM ONES:
    > /routes: Route mapping module.
    > /db-controls: DB's URL and DB connection management.
    > /mongoose-models: Mongoose User model declaration.
    > /extra-configs: Cookie maxAge, env.IP and env.PORT (if you would prefer to use them that way).


-------------
5. Conclusion
-------------

Passport is a very powerful module to authenticate sessions and redirect paths. Needless to say, Express and Mongoose are excellent frameworks to work with NodeJS back-end implementations, which goes for servers and databases.

Being this my first experience this king of NodeJS app management, I apologize if any line of code or front-end presentation made your eyes bleed. I myself found it quite entertaining and a marvelous instance to practise on my way to learn how the wires are tied behind the web pages you see on screen.

Thank you for giving me the opportunity to share my first steps in the wholesome world of programming with you!