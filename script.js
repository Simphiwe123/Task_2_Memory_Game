
        let flippedCards = [];
        let matchedPairs = 0;
        let disableClicks = false;
        let isMuted = false;

        const screens = {
            welcome: document.querySelector('.welcome-screen'),
            game: document.querySelector('.game-screen'),
            congrats: document.querySelector('.congrats-screen')
        };

        const audio = {
            flip: document.getElementById('flip-sound'),
            match: document.getElementById('match-sound'),
            win: document.getElementById('win-sound'),
            pop: document.getElementById('pop-sound')
        };

        // Game Initialization
        function startGame() {
            matchedPairs = 0;
            flippedCards = [];
            document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
            screens.game.classList.add('active');
            createGame();
        }

        function createGame() {
            const grid = document.getElementById('game-grid');
            grid.innerHTML = '';
            
            const letters = ['A','B','C','D','E','F','G','H','A','B','C','D','E','F','G','H'];
            letters.sort(() => Math.random() - 0.5);

            letters.forEach(letter => {
                const card = document.createElement('div');
                card.className = 'card';
                card.dataset.letter = letter;
                card.innerHTML = `
                    <div class="card-front"></div>
                    <div class="card-back">${letter}</div>
                `;
                card.addEventListener('click', () => flipCard(card));
                grid.appendChild(card);
            });
        }

        // Game Logic
        function flipCard(card) {
            if (disableClicks || card.classList.contains('flipped') || flippedCards.length >= 2) return;
            
            playSound(audio.flip);
            card.classList.add('flipped');
            flippedCards.push(card);

            if (flippedCards.length === 2) checkMatch();
        }

        function checkMatch() {
            disableClicks = true;
            const [card1, card2] = flippedCards;
            const match = card1.dataset.letter === card2.dataset.letter;

            if (match) {
                playSound(audio.match);
                matchedPairs++;
                flippedCards = [];
                disableClicks = false;
                
                if (matchedPairs === 8) showCongrats();
            } else {
                setTimeout(() => {
                    card1.classList.remove('flipped');
                    card2.classList.remove('flipped');
                    flippedCards = [];
                    disableClicks = false;
                }, 1000);
            }
        }

        function showCongrats() {
            playSound(audio.win);
            screens.game.classList.remove('active');
            screens.congrats.classList.add('active');
            createBalloons();
        }

        // Balloon Functions
        function createBalloons() {
            const colors = ['#ff4081','#00bcd4','#ffeb3b','#4caf50','#e91e63','#9c27b0','#3f51b5','#ff5722'];
            
            for (let i = 0; i < 20; i++) {
                const balloon = document.createElement('div');
                balloon.className = 'balloon';
                balloon.style.left = Math.random() * 95 + '%';
                balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                balloon.style.animationDelay = i * 0.2 + 's';

                balloon.addEventListener('click', () => {
                    playSound(audio.pop);
                    balloon.remove();
                });

                document.body.appendChild(balloon);
            }
        }

        // Sound Control
        document.getElementById('mute-btn').addEventListener('click', () => {
            isMuted = !isMuted;
            document.getElementById('mute-btn').textContent = isMuted ? "🔇 Sound Off" : "🔊 Sound On";
        });

        function playSound(sound) {
            if (!isMuted) {
                sound.currentTime = 0;
                sound.play().catch(() => {});
            }
        }

        // Initial setup
        startGame();
 