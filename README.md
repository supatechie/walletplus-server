# About this project
This is the server side implementation of a wallet aplication where users can be able to fund their wallet accounts and also earn points per each transaction from $5000 and above. This project is implemented with typescript and nodejs. The test is written in jest and the database used is mongodb with mongoose as the client. All best practices have duly been observed. I used node `events` to emit an event in the background to create the **two** user's wallet accounts, **main wallet account** & **points account**  whenever a new user creates an account. The good thing about this logic implementattion is that, it reduces the time spent creating an account while handling the wallets creation in the background with quick response back to the user to proceed. Infact, majority of the tasks such as keeping record of a user's transaction is being handled in the background with help of node js `events emitter` module to save response time. Unit & integration testing and done using jest but end to end test is not implemented.

## Features of the app include;

 1. Users can create accounts
 2. Users can sign in
 3. Users can fund their wallets
 4. Users can withdraw
 5. Users can transfer
 6. Users can send money from user to user
 7. Users can change their wallet pin
 8. Users can view their transaction records
 9. Users can view their profiles
 10. Admin users can view all users and all transaction records
 11. Sending of mail after account creation

# How points are earned

 1. Transactions from **$5,000 - $10,000** earn *1%*
 2. Transactions from **$10,001 - $25,000** earn *2.5%*
 3. Transactions from **$25,0001 above** earn *5%*
 Note: The maximum amount allowed per account is **$1,000,0000**

## Performance

To improve the performance of our app and limit the number of database calls, a ***cache mechanism*** has been implemented using `cache-manager` library to cache all the get endpoints which readily increased the performance of our app by more than 99%.

## Security features include;

 1. Use of `helmet` to set the correct headers for security purposes
 2. Use of `compression` to compress the size of resources returned
 3. Use of `cors` to limit api access restricted domains
 4. Use of `express-validator` to validate all inputs sent to the server
 5. Use of `express-rate-limit` to limit the number of requests through some public endpoints
 6. Use of `cookie-parser` parse all the cookies sent to the server
 7. Some route are restricted based on user's role

## How to run this project locally

  1. Create a **.env** file in the root directory using the ***.env.example*** sample
  2. Ensure you have mongodb installed locally on your system.
  3. Edit the **.env** file to point to the monogodb uri correctly. 
  4. Open your **cmd** & Run the command `npm install` to install all the dependencies.
  5. To create a dummy or testing account, run the command `npm run seed-admin` to create a single admin account that you can use on the client side to login. Or run the command `npm run seed-users` to create an admin user and other users as well. You can use any of this commands. This is populate the database with the accounts and you can use any of those to login on the client side.
  6. To start the server run the command `npm run dev`. This will start a local development server
  7. To run the tests, open another cmd window and run `npm run test` and it will show your all the tests written.

## How to run the tests

### `npm test`

Launches the test runner in the interactive watch mode

## To build for production

### `npm run build`

Builds the app for production to the `dist` folder.\
This will transpile your app from typescript to javascript

### Happy coding & reviewing :) 