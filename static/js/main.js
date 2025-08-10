
        // JavaScript for Fade-in on Scroll
        document.addEventListener('DOMContentLoaded', () => {
            const sections = document.querySelectorAll('section, footer');

            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fade-in');
                        entry.target.classList.remove('hidden-on-load');
                        observer.unobserve(entry.target); // Stop observing once animated
                    }
                });
            }, observerOptions);

            sections.forEach(section => {
                section.classList.add('hidden-on-load'); // Hide all sections initially
                observer.observe(section);
            });

            // JavaScript for Narrator Carousel
            const carousel = document.getElementById('narratorCarousel');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const paginationDotsContainer = document.getElementById('paginationDots');
            const carouselItems = carousel.querySelectorAll('.carousel-item');
            let currentItemIndex = 0;

            // Function to update dots
            const updateDots = () => {
                paginationDotsContainer.innerHTML = ''; // Clear existing dots
                carouselItems.forEach((_, index) => {
                    const dot = document.createElement('button');
                    dot.classList.add('w-3', 'h-3', 'rounded-full', 'bg-brown', 'transition-colors', 'duration-300');
                    if (index === currentItemIndex) {
                        dot.classList.add('bg-vibrant-red');
                    }
                    dot.addEventListener('click', () => {
                        currentItemIndex = index;
                        scrollToItem(currentItemIndex);
                    });
                    paginationDotsContainer.appendChild(dot);
                });
            };

            // Function to scroll to a specific item
            const scrollToItem = (index) => {
                const itemWidth = carousel.offsetWidth; // Get the visible width of the carousel
                carousel.scrollLeft = itemWidth * index;
                updateDots();
            };

            // Event Listeners for navigation buttons
            prevBtn.addEventListener('click', () => {
                currentItemIndex = (currentItemIndex > 0) ? currentItemIndex - 1 : carouselItems.length - 1;
                scrollToItem(currentItemIndex);
            });

            nextBtn.addEventListener('click', () => {
                currentItemIndex = (currentItemIndex < carouselItems.length - 1) ? currentItemIndex + 1 : 0;
                scrollToItem(currentItemIndex);
            });

            // Update dots on scroll for manual scrolling
            carousel.addEventListener('scroll', () => {
                const scrollLeft = carousel.scrollLeft;
                const itemWidth = carousel.offsetWidth;
                const newIndex = Math.round(scrollLeft / itemWidth);
                if (newIndex !== currentItemIndex) {
                    currentItemIndex = newIndex;
                    updateDots();
                }
            });

            // Initial setup
            updateDots();
            // Adjust carousel item width on resize (important for responsiveness)
            window.addEventListener('resize', () => {
                scrollToItem(currentItemIndex); // Re-align after resize
            });

            // Gemini API Integration: Story Prompt Generator Logic
            const storyPromptInput = document.getElementById('storyPromptInput');
            const generateStoryPromptBtn = document.getElementById('generateStoryPromptBtn');
            const storyPromptResult = document.getElementById('storyPromptResult');
            const loadingSpinner = document.getElementById('loadingSpinner');

            generateStoryPromptBtn.addEventListener('click', async () => {
                const theme = storyPromptInput.value.trim();
                if (!theme) {
                    storyPromptResult.textContent = "Por favor, introduce un tema o palabra clave para generar una idea.";
                    return;
                }

                storyPromptResult.textContent = ''; // Clear previous result
                loadingSpinner.classList.remove('hidden'); // Show loading spinner
                generateStoryPromptBtn.disabled = true; // Disable button during loading

                try {
                    let chatHistory = [];
                    const prompt = `Genera una idea de cuento corta y creativa, de aproximadamente 50-80 palabras, basada en el siguiente tema o palabra clave: "${theme}". La idea debe ser inspiradora y apta para narración oral.`;
                    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

                    const payload = { contents: chatHistory };
                    const apiKey = ""; // Canvas will provide this API key at runtime
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    const result = await response.json();

                    if (result.candidates && result.candidates.length > 0 &&
                        result.candidates[0].content && result.candidates[0].content.parts &&
                        result.candidates[0].content.parts.length > 0) {
                        const text = result.candidates[0].content.parts[0].text;
                        storyPromptResult.textContent = text;
                    } else {
                        storyPromptResult.textContent = "No se pudo generar una idea de cuento. Intenta de nuevo.";
                        console.error('Unexpected API response structure:', result);
                    }
                } catch (error) {
                    storyPromptResult.textContent = "Ocurrió un error al conectar con el generador de ideas. Intenta de nuevo más tarde.";
                    console.error('Error generating story prompt:', error);
                } finally {
                    loadingSpinner.classList.add('hidden'); // Hide loading spinner
                    generateStoryPromptBtn.disabled = false; // Re-enable button
                }
            });
        });