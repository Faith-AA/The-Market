# The Market
#### Video Demo:  <URL HERE>
#### Description: The market is a Discord bot that is a bot on the Discord platform. You can execute commands to play this amazing game. Your objective during the game is to get as rich as possible by trading stocks and doing your job. I hope you guys enjoy this game since it took me a bit to make it. :)

* COMMANDS
    - #help
    - #start
    - #buy [SYMBOL](https://stockanalysis.com/stocks/) [SHARE COUNT]
    - #sell [SYMBOL](https://stockanalysis.com/stocks/) [SHARE COUNT]
    - #cash/#rich/#money
    - #portfolio
    - #leaderboard
    - #gamble
    - #work [start/find]
    - #beg
    - #ping
    - #shop

* How To Get The Market Online
    1. open a terminal and open ``..\The Market\src``.
    2. type ``npm install`` in the terminal.
    3. Create a ``.env`` file inside the src folder and type the following:
        - ```TOKEN=
        -    ownerID=
        -    MONGO_NAME=
        -    MONGO_PASS=
        -    MONGO_HOST=
        -    IEX_API_KEY=```
    4. Create a [Discord Application](https://discord.com/developers/applications) and create a bot. Then you copy the token and paste it under token in the ``.env`` file.
    5. The ownerID value is optional, but you can enter your discord ID.
    6. Create a MONGO database and fill ``MONGO_NAME``, ``MONGO_PASS`` and ``MONGO_HOST``.
    7. Create a [IEX](https://iexcloud.io/cloud-login#/register/) api key and paste it in ``IEX_API_KEY``.
    8. Now enter ``node bot.js`` in the terminal and the bot will be online.
