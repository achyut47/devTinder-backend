# DevTinder Apis

## we will be kusing express router and will be categorizing certain apis to one category there by creating bunch of logical separations

### authRouter

    - POST /signup
    - POST /login
    - POST /logout

### profileRouter

    - GET /profile/view
    - PATCH /profile/edit
    - PATCH /profile/password

### connectionREquestRouter

    - POST /request/send/interested/:userId
    - POST /request/send/ignored/:userId
    - POST /request/review/accepted/:requestId
    - POST /request/review/rejected/:requestId

### userRouter

    - GET /user/connections
    - GET /user/requests
    - GET /user/feed
