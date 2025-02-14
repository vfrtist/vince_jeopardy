function make(item) { return document.createElement(item.toString()); }

class Player {
    constructor(item) {
        this.container = item
        this.display = item.querySelector('.score');
        this.score = 0;
    }
    addScore(points) {
        this.score += parseInt(points);
        this.display.innerText = `${this.score} pt`;
    }
}

class Card {
    constructor(question, answer, score) {
        this.container = make('button');
        this.question = question;
        this.answer = answer;
        this.score = score;
        this.setup();
    }

    setup() {
        this.container.classList.add('prompt');
        this.container.innerText = this.score;
        this.container.type = 'submit';
        this.container.addEventListener('click', (e) => {
            e.preventDefault()
            if (!this.container.classList.contains('inactive')) {
                this.container.classList.add('inactive');
                promptFrame.classList.toggle('hidden');
                // frame
                const modal = make('dialog');
                modal.classList.add('container', 'vertical');
                const [upper, lower] = this.buildUpperLower();
                modal.append(upper, lower);
                document.body.append(modal);
                lower.querySelector('.refresh').addEventListener('click', () => {
                    upper.innerText = this.answer;
                    this.buildScoreButtons();
                })
                modal.showModal();
            }
        })
    }

    buildUpperLower() {
        // upper
        const upper = make('div');
        upper.classList.add('upper', 'container', 'vertical', 'cabin');
        upper.innerText = this.question;
        // lower
        const lower = make('div');
        const refresh = make('div');
        lower.classList.add('lower', 'container', 'horizontal');
        refresh.classList.add('refresh', 'cabin');
        refresh.innerText = 'Reveal Answer';
        lower.append(refresh);
        // combine
        return [upper, lower];
    }

    buildScoreButtons() {
        const scoreP1 = make('div');
        const scoreP2 = make('div');
        const scoreBoth = make('div');
        const scoreNone = make('div');

        scoreP1.classList.add('player1', 'cabin');
        scoreP2.classList.add('player2', 'cabin');
        scoreBoth.classList.add('both', 'cabin');
        scoreNone.classList.add('none', 'cabin');

        scoreP1.innerText = 'Add to P1';
        scoreP2.innerText = 'Add to P2';
        scoreBoth.innerText = 'Add to Both!';
        scoreNone.innerText = 'Failure';

        const lower = document.querySelector('.lower');
        lower.innerHTML = '';
        lower.append(scoreP1, scoreBoth, scoreP2, scoreNone);

        scoreP1.addEventListener('click', () => {
            p1.addScore(this.score);
            this.closeDialog();
        })
        scoreP2.addEventListener('click', () => {
            p2.addScore(this.score);
            this.closeDialog();
        })
        scoreBoth.addEventListener('click', () => {
            p1.addScore(this.score);
            p2.addScore(this.score);
            this.closeDialog();
        })
        scoreNone.addEventListener('click', () => {
            this.closeDialog();
        })
    }

    closeDialog() {
        document.querySelector('dialog').remove()
        promptFrame.classList.toggle('hidden');
    }

    getProperties() {
        return [this.question, this.answer, this.score];
    }
}

const promptFrame = document.querySelector('#prompts');
const p1 = new Player(document.querySelector('#player1'));
const p2 = new Player(document.querySelector('#player2'));
p1.container.classList.add('player1', 'cabin');
p2.container.classList.add('player2', 'cabin');

const prompts = [{
    title: 'People',
    prompts: [
        { question: 'What is the largest organ in the human body?', answer: 'Skin' },
        { question: 'How long is an adult human circulatory system?', answer: 'If laid out flat end to end 100,000 miles' },
        { question: 'What were Susan B Anthony\'s last words?', answer: 'Make them' },
        { question: 'Cartilage is one of only two places in the human body without blood vessels, what is the other?', answer: 'The cornea' }
    ]
},
{
    title: 'Places',
    prompts: [
        { question: 'It takes how long for a drop of water to travel the entire Mississippi River?', answer: '90 days' },
        { question: 'What is the ratio of vending machines per person in japan?', answer: '1 machine for every 40 people' },
        { question: 'What is the cherry capital of the world?', answer: 'Traverse City, MI' },
        { question: 'Where did the Spanish Influenza originate?', answer: 'Most evidence points to Haskell County, Kansas' }
    ]
},
{
    title: 'Things',
    prompts: [
        { question: 'Where was german chocolate cake invented?', answer: 'Texas' },
        { question: 'How many licks does it take to get to the center of a tootsie pop?', answer: '175 over the course of 14.1 minutes' },
        { question: 'When was the first Ferris Wheel constructed?', answer: '1893 for the Worlds Columbian Exposition in Chicago' },
        { question: 'When was the first animated feature film made?', answer: '1917, a 70 minute film made up of 58,000 drawings was made in Argentina' }
    ]
},
{
    title: 'Animals',
    prompts: [
        { question: 'What give flamingos their distinctive color?', answer: 'Their diet; eating algae, brine shrimp, and crustaceans' },
        { question: 'Is an Okapi related to a Zebra?', answer: 'No, it\'s actually the only living relative of a giraffe' },
        { question: 'A man from texas was hospitalized when he shot at what animal?', answer: 'An armadillo, it ricocheted and hit him in the jaw' },
        { question: 'What is Scotlands national animal?', answer: 'The Unicorn' }
    ]
}
];

for (let section of prompts) {
    let column = make('section');
    column.classList.add('container', 'vertical');
    let title = make('h2');
    title.innerText = section.title;
    title.classList.add('title', 'cabin');
    column.append(title);
    promptFrame.append(column);
    for (const [index, prompt] of section.prompts.entries()) {
        let promptCard = new Card(prompt.question, prompt.answer, (index + 1) * 100);
        column.append(promptCard.container);
    }
}
