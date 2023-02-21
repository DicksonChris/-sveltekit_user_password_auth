# index

Homepage
if auth
show button "go to profile/activities"
(logout in nav)
else
show buttons
[/login, /signup]

# logout

/logout
remove auth
redirect to '/'

# signup

/signup
if auth
somehow takes you to '/', haven't found where
else
signs up using page.server.ts form actions...
(Major changes needed. Currently uses cookies(?) and signs in immediately upon signup)

# login

/login
if auth
redirect to '/'
else
login page with forms
redirect to /profile on login

# api

/api/me/+server.ts
idk

# (authenticated)

/any authenticated route
