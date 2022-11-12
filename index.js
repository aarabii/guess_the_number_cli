#!/usr/bin/env node

// Import the module
import chalk from "chalk";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";
import inquirer from "inquirer";

import congoTextCollection from './congoText.json' assert { type: 'json', filename: 'congoText.json' } // Import the module

let playerName;
let guess = 1;

const sleep = (ms = 1200) => new Promise((r) => setTimeout(r, ms));

// Function to display welcome text
async function welcome() {
    const title = chalkAnimation.rainbow(
            'Welcome to the "Guess the Number" game!'
    )
    await sleep();
    title.stop();

    console.log(`
        ${chalk.black.bgYellowBright.underline.bold("How to play???")}
        Keep guessing the number until you get it right!
        If you win you will get a candy 🍬        
    `)
};

// Function to get player name
async function askName() {
    const answer = await inquirer.prompt({
        name: 'player_name',
        type: 'input',
        message: 'What is your name?',

        default() {
            return 'Player';
        }
    });
    playerName = answer.player_name;
}

// Function to ask player to guess a number
async function askNumber() {
    const answer = await inquirer.prompt({
        name: 'player_number',
        type: 'input',
        message: 'Guess a number between 1 and 100',
        validate(value) {
            const valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
        },
        filter(value) {
            return parseFloat(value);
        }
    });
    return answer.player_number;
}

// win function
function winner() {
    console.clear()
    const message = `Congratulations`;
    const congoText = congoTextCollection[Math.floor(Math.random() * congoTextCollection.length)];
    figlet(message, (err, data) => {
        console.log(gradient.pastel.multiline(data));
        const playerNameText = chalk.white.bgMagenta.bold(`${playerName}!`);
        console.log(playerNameText + " You won! 🎉\nHere is your free candy 🍬 ");
        console.log(chalk.magenta(congoText));
        console.log(`You guessed the number in ${guess} guesses!`);
    })
}

// game function
async function game() {
    welcome()
    await askName()
    const spinner = createSpinner();
    spinner.success()    
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    let playerNumber = await askNumber();

    while (playerNumber !== randomNumber) {
        if (playerNumber < randomNumber) {
            guess++;
            console.log("Too low");
            spinner.error();
        } else {
            guess++;
            console.log("Too high");
            spinner.error();
        }
        playerNumber = await askNumber();
    }
    winner();
}

// Start the game
await game()
