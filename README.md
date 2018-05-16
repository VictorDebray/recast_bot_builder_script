# chatbot_conf

To make this script run you must write some configuration files:
1. Account configuration - config.json
2. Bot configuration - in each bot folder bot.json
3. Intents list - one intent.json file per bot
4. intent.json For intent configuration

*Note: all paths are relative to the folder the json file is in*

This tutorial will take the following structure as example :
* config.json
* ./myChatBot
  * bot.json
  * ./intents
    * intents.json
    * ./greetings
        * intent.json
        * fr.csv
        * en.csv
        * ./add
            * en.csv
            * fr.csv
    
##1. Account configuration - config.json

```javascript
{
    "user_slug": "MY_USER_SLUG",
    "bots": [
        { "dir": "myChatBot"},
        { "dir": "botDirectory2"}
    ]
}
```

##2. Bot configuration - in each bot folder bot.json

```javascript
{
    "name": "myChatBot",
    "description": "my first chatbot",
    "req_token": "blablabla",
    "dev_token": "albalbalb",
    "intents_dir": "intents"
}
```
*Note: the directory name of the bot can differ from the value of `name` property.*
*Only this value will be taken for bot conf*


##3. Intents list - one intent.json file per bot

```javascript
{
    "intents": [
        { "dir": "greetings"},
        { "dir": "mySecondIntent"}
    ]
}
```
*Note: here again the directory name has no incidence on the naming of the intent*


##4. Intent configuration - one per intent.json folder

```javascript
{
    "name": "greetings",
    "description": "greet through chatbot",
    "expressions": [
        {
            "language": "fr",
            "file": "fr.csv"
        },
        {
            "language": "en",
            "file": "en.csv"
        }
    ]
}
```

In this folder simply write a single column csv file for each expression you would like to have in your intent.
They will automatically be attached to the language if you respect the correct [isocode](https://recast.ai/docs/text-analysis-api)


Those expressions will be added to intent if intent does not already exist.
To add expressions to already existing intents, just put all the file described in `intent.json` in `add`
folder. Write only new expression in the language file you want to complete !
If one file is missing here it will be ignored.

This script is built in typescript.
