# index

Homepage
if auth
show button "go to profile/activities"
(signout in nav)
else
show buttons
[/signin, /signup]

# signout

/signout
remove auth
redirect to '/'

# signup

/signup
if auth
somehow takes you to '/', haven't found where
else
signs up using page.server.ts form actions...
(Major changes needed. Currently uses cookies(?) and signs in immediately upon signup)

# signin

/signin
if auth
redirect to '/'
else
signin page with forms
redirect to /profile on signin

# api

/api/me/+server.ts
idk

# (authenticated)

/any authenticated route
