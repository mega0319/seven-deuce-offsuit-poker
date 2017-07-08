# Seven Deuce Off Suite Poker

created by Naz Khan

This project is using Ruby/Rails for back-end, along with ActionCable for web-socket implementation, ReactJS and JavaScript for the front-end. I also mixed in my own CSS with some Bootstrap CSS features. For animations, I am using the Animate CSS library. Last but certainly not least, I am also tapping into an external API from www.deckofcardsapi.com.

![seven-deuce-demo](./pokerclip.gif)
minute long gameplay demo

The name Seven Deuce "offsuit" is just the representation of the worst possible starting hand a player can hold. The entire name seven deuce off suite is just a play on words.

The objective of this project was to create a web-sockets based texas hold'em poker application
where users can connect to the same room and play against each other. Being a poker enthusiast myself,
I enjoy the nuances of the game and getting all of the game behaviors working seamlessly was quite challenging.

### Log-in Page

![Alt text](./screenshots/login.png?raw=true "Login Screen")

Your standard log-in screen. Pretty straightforward authentication using bcrypt. The logo for
my application was crafted using Adobe Illustrator.

### Cashier

![Alt text](./screenshots/cashier.png?raw=true "Cashier")

Poker always has a serious tone to it. I decided to lighten the mood by creating this cashier, using
Adobe Illustrator as well. On this page a user can add coins to their account simply by clicking on the register.

### Hand Rankings

![Alt text](./screenshots/hands.png?raw=true "Hands")

Quick overview of all the hand types in poker.

### Poker Table

![Alt text](./screenshots/table.png?raw=true "Poker Table")

This is the view of the Poker Table, which was also created using Adobe Illustrator but with the help of my good friend and colleague Peter Chicarielli and a tutorial I found online which instructs one on how to create a pool table from scratch using Illustrator. With a few modifications and tweaks here and there we were able to create a poker table SVG.

### Straight!

![Alt text](./screenshots/straight.png?raw=true "Action")

Here is a screenshot of some gameplay where I was holding a straight. Every player is able to see his/her own cards and what hand they are currently holding. Built from scratch, the hand solving algorithms I wrote are able to calculate all 10 different hand types out of the roughly 2.6 million hand combinations.

### Rooms

![Alt text](./screenshots/rooms.png?raw=true "Rooms")

You can select the room you want to join. Currently the room names are randomly generated Star Wars planets through a rails randomizer gem. 
