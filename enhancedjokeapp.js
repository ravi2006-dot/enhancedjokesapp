const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Fetch a random joke
async function getJoke() {
    try {
        const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
        const { setup, punchline } = response.data;
        console.log(`\n😂 Here's a joke for you:\n${setup}\n${punchline} 😂\n`);
        return `${setup} - ${punchline}`;
    } catch (error) {
        console.error('Could not fetch a joke. Please try again later.');
        return null;
    }
}

// Fetch multiple jokes
async function getMultipleJokes(count) {
    console.log(`\nFetching ${count} jokes...\n`);
    for (let i = 0; i < count; i++) {
        await getJoke();
    }
}

// Fetch jokes by category
async function getJokeByCategory(category) {
    try {
        const url = `https://official-joke-api.appspot.com/jokes/${category}/random`;
        const response = await axios.get(url);
        const { setup, punchline } = response.data[0];
        console.log(`\n😂 Category: ${category}\n${setup}\n${punchline} 😂\n`);
        return `${setup} - ${punchline}`;
    } catch (error) {
        console.error('Invalid category or failed to fetch a joke.');
        return null;
    }
}

// Save joke to a file
async function saveJokeToFile() {
    const joke = await getJoke();
    if (joke) {
        const jokeWithTimestamp = `[${new Date().toISOString()}] ${joke}\n`;
        fs.appendFileSync('jokes.txt', jokeWithTimestamp, 'utf8');
        console.log('✅ Joke saved to jokes.txt.');
    }
}

// Search jokes in the saved file
function searchJokes(keyword) {
    try {
        const jokes = fs.readFileSync('jokes.txt', 'utf8').split('\n');
        const results = jokes.filter((joke) => joke.toLowerCase().includes(keyword.toLowerCase()));
        console.log(results.length ? results.join('\n') : 'No jokes found.');
    } catch (error) {
        console.error('Error reading jokes file or no jokes found.');
    }
}

// Display the menu
function displayMenu() {
    console.log('\n--- Joke App ---');
    console.log('1. Fetch a random joke');
    console.log('2. Fetch multiple jokes');
    console.log('3. Fetch a joke by category');
    console.log('4. Save a joke to a file');
    console.log('5. Search jokes in saved file');
    console.log('6. Exit');
    rl.question('Choose an option: ', handleMenu);
}

// Handle menu options
async function handleMenu(option) {
    switch (option) {
        case '1':
            await getJoke();
            break;
        case '2':
            rl.question('How many jokes do you want? ', async (count) => {
                await getMultipleJokes(parseInt(count, 10));
                displayMenu();
            });
            return;
        case '3':
            rl.question('Choose a category (programming/general): ', async (category) => {
                await getJokeByCategory(category);
                displayMenu();
            });
            return;
        case '4':
            await saveJokeToFile();
            break;
        case '5':
            rl.question('Enter a keyword to search in saved jokes: ', (keyword) => {
                searchJokes(keyword);
                displayMenu();
            });
            return;
        case '6':
            console.log('Goodbye! 😂');
            rl.close();
            return;
        default:
            console.log('Invalid option. Please try again.');
    }
    displayMenu();
}

// Start the app
displayMenu();
