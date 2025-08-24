document.addEventListener('DOMContentLoaded', () => {
    const stripe = Stripe('pk_live_51RHruF06XnUtC0HX0w4CWzfNMGATA0skgovfEEJOOyb5PpOlWx5rfOCv3JdugRmy1AUMrCC1xsxfhBvpiI6jGX3W00UvAfDAeL');

    const modals = {
        followers: document.getElementById('followersModal'),
        gamerscore: document.getElementById('gamerscoreModal'),
        gamertag: document.getElementById('gamertagModal'),
        lfg: document.getElementById('lfgModal'),
        rareGamertag: document.getElementById('rareGamertagModal'),
        codPoints: document.getElementById('codPointsModal'),
        sharkCard: document.getElementById('sharkCardModal'),
        followerBot: document.getElementById('followerBotModal'),
        messageSpammer: document.getElementById('messageSpammerModal'),
        profilePicture: document.getElementById('profilePictureCheckoutModal'),
        forzaCredits: document.getElementById('forzaCreditsModal'),
        gtFourLetter: document.getElementById('gt-fourLetterModal')
    };

    let selectedGamertag = null;

    function openModal(modal) {
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            if (modal.id === 'gt-fourLetterModal') {
                fetchGtGamertags();
            }
            if (modal.id === 'rareGamertagModal') {
                const activeOption = modal.querySelector('.package-option.active');
                if (activeOption && activeOption.getAttribute('data-amount') === '4-letter' && selectedGamertag) {
                    const selectedPackage = modal.querySelector('.selected-package');
                    if (selectedPackage) {
                        selectedPackage.textContent = selectedGamertag;
                    }
                }
            }
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    document.querySelectorAll('.modal-close, .gt-modal-close').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal-overlay, .gt-modal-overlay');
            closeModal(modal);
        });
    });

    Object.values(modals).forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        }
    });

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'gamertag-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    function fetchGtGamertags() {
        const gamertagUrl = 'https://raw.githubusercontent.com/x6aa/gamertags/refs/heads/main/gamertags.txt';
        const gamertagList = document.getElementById('gt-gamertag-list');
        if (!gamertagList) return;

        gamertagList.innerHTML = '<p>Loading gamertags...</p>';

        fetch(gamertagUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                const gamertags = data.split('\n').filter(tag => tag.trim() !== '');
                const ul = document.createElement('ul');

                gamertags.forEach(tag => {
                    const li = document.createElement('li');
                    const gamertagSpan = document.createElement('span');
                    gamertagSpan.textContent = tag.trim();
                    const selectButton = document.createElement('span');
                    selectButton.textContent = 'Select';

                    li.addEventListener('mouseover', () => {
                        selectButton.classList.add('hover');
                    });
                    li.addEventListener('mouseout', () => {
                        selectButton.classList.remove('hover');
                        if (selectedGamertag !== tag.trim()) {
                            selectButton.classList.remove('selected');
                        }
                    });

                    li.addEventListener('click', () => {
                        selectedGamertag = tag.trim();
                        ul.querySelectorAll('li').forEach(item => {
                            item.classList.remove('selected');
                            const button = item.querySelector('span:last-child');
                            if (button) button.classList.remove('selected');
                        });
                        li.classList.add('selected');
                        selectButton.classList.add('selected');
                        showNotification(`${selectedGamertag} Selected Successfully!`);

                        const rareGamertagModal = modals.rareGamertag;
                        if (rareGamertagModal) {
                            const fourLetterOption = rareGamertagModal.querySelector('.package-option[data-amount="4-letter"]');
                            if (fourLetterOption) {
                                rareGamertagModal.querySelectorAll('.package-option').forEach(opt => opt.classList.remove('active'));
                                fourLetterOption.classList.add('active');
                                const selectedPackage = rareGamertagModal.querySelector('.selected-package');
                                const selectedPrice = rareGamertagModal.querySelector('.selected-price');
                                const totalPrice = rareGamertagModal.querySelector('.total-price');
                                if (selectedPackage && selectedPrice && totalPrice) {
                                    selectedPackage.textContent = selectedGamertag;
                                    const price = fourLetterOption.getAttribute('data-price');
                                    selectedPrice.textContent = `$${price}`;
                                    totalPrice.textContent = `$${price}`;
                                }
                                openModal(rareGamertagModal);
                            }
                        }
                        closeModal(modals.gtFourLetter);
                    });

                    li.appendChild(gamertagSpan);
                    li.appendChild(selectButton);
                    ul.appendChild(li);
                });
                gamertagList.innerHTML = '';
                gamertagList.appendChild(ul);
            })
            .catch(error => {
                gamertagList.innerHTML = '<p>Error loading gamertags: ' + error.message + '. Please try again later or contact support.</p>';
                console.error('Fetch Error:', error);
            });
    }

    document.querySelectorAll('.gt-info-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            openModal(modals.gtFourLetter);
        });
    });

    function setupPackageSelection(modalId, packageData) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        const packageOptions = modal.querySelectorAll('.package-option');
        const selectedPackage = modal.querySelector('.selected-package');
        const selectedPrice = modal.querySelector('.selected-price');
        const totalPrice = modal.querySelector('.total-price');

        packageOptions.forEach(option => {
            option.addEventListener('click', () => {
                packageOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                const amount = option.getAttribute('data-amount');
                const price = option.getAttribute('data-price');
                selectedPackage.textContent = (amount === '4-letter' && selectedGamertag) ? selectedGamertag : (packageData[amount] || amount);
                selectedPrice.textContent = `$${price}`;
                totalPrice.textContent = `$${price}`;
            });
        });
    }

    const packageData = {
        followers: {
            '1000': '1,000 Followers',
            '2000': '2,000 Followers',
            '5000': '5,000 Followers',
            '10000': '10,000 Followers',
            '20000': '20,000 Followers',
            '100000': '100,000 Followers',
            '1000000': '1,000,000 Followers'
        },
        gamerscore: {
            '50000': '50,000 GS',
            '200000': '200,000 GS',
            '500000': '500,000 GS',
            '1000000': '1,000,000 GS'
        },
        gamertag: {
            'daily': 'Daily',
            'weekly': 'Weekly',
            'monthly': 'Monthly',
            'lifetime': 'Lifetime'
        },
        lfg: {
            'daily': 'Daily',
            'weekly': 'Weekly',
            'monthly': 'Monthly',
            'lifetime': 'Lifetime'
        },
        rareGamertag: {
            '5-Letter': '5-Letter Gamertag',
            '4-Character': '4-Character Gamertag',
            '4-letter': '4-Letter Gamertag',
            '3-Character': '3-Character Gamertag',
            '3-Letter': '3-Letter Gamertag',
            '2-Letter': '2-Letter Gamertag',
            'word': 'Word Gamertag'
        },
        codPoints: {
            '500': '500 COD Points',
            '1000': '1,000 COD Points',
            '2000': '2,000 COD Points',
            '5000': '5,000 COD Points'
        },
        sharkCard: {
            '100M': '100M GTA$',
            '200M': '200M GTA$',
            '300M': '300M GTA$',
            '500M': '500M GTA$'
        },
        followerBot: {
            'daily': 'Daily',
            'weekly': 'Weekly',
            'monthly': 'Monthly',
            'lifetime': 'Lifetime'
        },
        messageSpammer: {
            'daily': 'Daily',
            'weekly': 'Weekly',
            'monthly': 'Monthly',
            'lifetime': 'Lifetime'
        },
        forzaCredits: {
            '100M': '100 Million Credits',
            '200M': '200 Million Credits',
            '300M': '300 Million Credits',
            '500M': '500 Million Credits'
        }
    };

    Object.keys(modals).forEach(key => {
        if (packageData[key]) {
            setupPackageSelection(`${key}Modal`, packageData[key]);
        }
    });

    const followerInput = document.querySelector('.follower-input');
    const decreaseBtn = document.querySelector('.control-btn.decrease');
    const increaseBtn = document.querySelector('.control-btn.increase');
    const selectedFollowers = document.getElementById('selected-followers');
    const totalPrice = document.getElementById('total-price');
    const discountRate = document.getElementById('discount-rate');

    function updatePrice() {
        let followers = parseInt(followerInput.value);
        if (isNaN(followers) || followers < 1000) followers = 1000;
        if (followers > 1000000) followers = 1000000;
        followerInput.value = followers;

        let discount = 0;
        if (followers >= 10000 && followers < 50000) discount = 10;
        else if (followers >= 50000 && followers < 100000) discount = 20;
        else if (followers >= 100000) discount = 30;

        const basePrice = (followers / 1000) * 2.99;
        const discountedPrice = basePrice * (1 - discount / 100);

        selectedFollowers.textContent = followers.toLocaleString();
        discountRate.textContent = discount > 0 ? `${discount}% off` : '0% off';
        totalPrice.textContent = `$${discountedPrice.toFixed(2)}`;

        decreaseBtn.disabled = followers <= 1000;
        increaseBtn.disabled = followers >= 1000000;
    }

    if (followerInput && decreaseBtn && increaseBtn) {
        increaseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let value = parseInt(followerInput.value);
            if (value < 1000000) {
                followerInput.value = value + 1000;
                updatePrice();
            }
        });

        decreaseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let value = parseInt(followerInput.value);
            if (value > 1000) {
                followerInput.value = value - 1000;
                updatePrice();
            }
        });

        followerInput.addEventListener('input', (e) => {
            e.preventDefault();
            updatePrice();
        });

        [increaseBtn, decreaseBtn, followerInput].forEach(element => {
            element.addEventListener('touchstart', (e) => {
                e.preventDefault();
                element.focus();
            }, { passive: false });
        });

        updatePrice();
    }

    document.querySelectorAll('.followers-purchase-btn').forEach(btn => {
        btn.addEventListener('click', () => openModal(modals.followers));
    });
    document.querySelectorAll('.gamerscore-purchase-btn').forEach(btn => {
        btn.addEventListener('click', () => openModal(modals.gamerscore));
    });
    document.querySelectorAll('.gamertag-purchase-btn').forEach(btn => {
        btn.addEventListener('click', () => openModal(modals.gamertag));
    });
    document.querySelectorAll('.lfg-purchase-btn').forEach(btn => {
        btn.addEventListener('click', () => openModal(modals.lfg));
    });
    document.querySelectorAll('.rare-gamertag-purchase-btn').forEach(btn => {
        btn.addEventListener('click', () => openModal(modals.rareGamertag));
    });
    document.querySelectorAll('.codpoints-purchase-btn').forEach(btn => {
        btn.addEventListener('click', () => openModal(modals.codPoints));
    });
    document.querySelectorAll('.shark-card-purchase-btn').forEach(btn => {
        btn.addEventListener('click', () => openModal(modals.sharkCard));
    });
    document.querySelectorAll('.follower-bot-purchase-btn').forEach(btn => {
        btn.addEventListener('click', () => openModal(modals.followerBot));
    });
    document.querySelectorAll('.message-spammer-purchase-btn').forEach(btn => {
        btn.addEventListener('click', () => openModal(modals.messageSpammer));
    });
    document.querySelectorAll('.profile-picture-purchase-btn').forEach(btn => {
        btn.addEventListener('click', () => openModal(modals.profilePicture));
    });
    document.querySelectorAll('.forza-credits-purchase-btn').forEach(btn => {
        btn.addEventListener('click', () => openModal(modals.forzaCredits));
    });

    document.querySelectorAll('.method-option').forEach(option => {
        option.addEventListener('click', () => {
            const parent = option.closest('.method-options');
            parent.querySelectorAll('.method-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });

    const purchaseHandlers = {
        followers: {
            selector: '#followersModal .followers-purchase-btn',
            inputs: ['followers-gamertag'],
            tosCheckbox: 'followers-tos-agreement',
            productName: 'Profile Visibility Boost',
            productType: 'followers'
        },
        gamerscore: {
            selector: '#gamerscoreModal .gamerscore-purchase-btn',
            inputs: ['gamerscore-gamertag'],
            tosCheckbox: 'gamerscore-tos-agreement',
            productName: 'Gamerscore Enhancement',
            productType: 'gamerscore'
        },
        gamertag: {
            selector: '#gamertagModal .gamertag-purchase-btn',
            inputs: ['gamertag-email'],
            tosCheckbox: 'gamertag-tos-agreement',
            productName: 'Gamertag Autoclaimer',
            productType: 'gamertag'
        },
        lfg: {
            selector: '#lfgModal .lfg-purchase-btn',
            inputs: ['lfg-email'],
            tosCheckbox: 'lfg-tos-agreement',
            productName: 'LFG Promotion',
            productType: 'lfg'
        },
        rareGamertag: {
            selector: '#rareGamertagModal .rare-gamertag-purchase-btn',
            inputs: ['rare-gamertag-email'],
            tosCheckbox: 'rare-gamertag-tos-agreement',
            productName: 'Rare Xbox Gamertag',
            productType: 'rareGamertag'
        },
        codPoints: {
            selector: '#codPointsModal .codpoints-purchase-btn',
            inputs: ['codpoints-gamertag'],
            tosCheckbox: 'codpoints-tos-agreement',
            productName: 'Call of Duty COD Points',
            productType: 'codPoints'
        },
        sharkCard: {
            selector: '#sharkCardModal .shark-card-purchase-btn',
            inputs: ['sharkcard-gamertag'],
            tosCheckbox: 'sharkcard-tos-agreement',
            productName: 'GTA 5 Cash',
            productType: 'sharkCard'
        },
        followerBot: {
            selector: '#followerBotModal .follower-bot-purchase-btn',
            inputs: ['follower-bot-email'],
            tosCheckbox: 'follower-bot-tos-agreement',
            productName: 'Follower Boost Manager',
            productType: 'followerBot'
        },
        messageSpammer: {
            selector: '#messageSpammerModal .message-spammer-purchase-btn',
            inputs: ['message-spammer-email'],
            tosCheckbox: 'message-spammer-tos-agreement',
            productName: 'Message Sender',
            productType: 'messageSpammer'
        },
        profilePicture: {
            selector: '#profilePictureCheckoutModal .profile-picture-checkout-btn',
            inputs: ['profile-picture-checkout-gamertag', 'profile-picture-checkout-link'],
            tosCheckbox: 'profile-picture-checkout-tos-agreement',
            productName: 'Classic Xbox Profile Picture',
            productType: 'profilePicture'
        },
        forzaCredits: {
            selector: '#forzaCreditsModal .forza-credits-purchase-btn',
            inputs: ['forza-credits-gamertag'],
            tosCheckbox: 'forza-credits-tos-agreement',
            productName: 'Forza Horizon 5 Credits',
            productType: 'forzaCredits'
        }
    };

    Object.keys(purchaseHandlers).forEach(key => {
        document.querySelectorAll(purchaseHandlers[key].selector).forEach(button => {
            button.addEventListener('click', async function(e) {
                e.preventDefault();
                const modal = this.closest('.modal-overlay');
                if (!modal) return;
                
                const productType = purchaseHandlers[key].productType;
                const productName = purchaseHandlers[key].productName;
                
                const inputs = purchaseHandlers[key].inputs.map(id => document.getElementById(id));
                const tosCheckbox = document.getElementById(purchaseHandlers[key].tosCheckbox);
                let hasError = false;
                let firstInvalidElement = null;

                inputs.forEach(input => {
                    if (!input.value) {
                        input.classList.remove('shake');
                        void input.offsetWidth;
                        input.classList.add('shake');
                        input.style.border = '2px solid #ff4444';
                        setTimeout(() => input.classList.remove('shake'), 500);
                        if (!firstInvalidElement) firstInvalidElement = input;
                        hasError = true;
                    } else {
                        input.style.border = '';
                    }
                });

                if (!tosCheckbox.checked) {
                    tosCheckbox.classList.remove('shake', 'red-neon-glow');
                    void tosCheckbox.offsetWidth;
                    tosCheckbox.classList.add('shake', 'red-neon-glow');
                    setTimeout(() => {
                        tosCheckbox.classList.remove('shake', 'red-neon-glow');
                    }, 800);
                    if (!firstInvalidElement) firstInvalidElement = tosCheckbox;
                    hasError = true;
                }

                let price, displayName, amount;
                if (key === 'followers') {
                    const totalPriceElement = modal.querySelector('#total-price');
                    const selectedFollowersElement = modal.querySelector('#selected-followers');
                    if (!totalPriceElement || !selectedFollowersElement) {
                        alert('Error: Unable to retrieve price or follower amount.');
                        return;
                    }
                    price = parseFloat(totalPriceElement.textContent.replace('$', '')) || 0;
                    amount = selectedFollowersElement.textContent.replace(/,/g, '');
                    displayName = `${productName} - ${amount} Followers`;
                    if (isNaN(price) || price <= 0) {
                        alert('Error: Invalid price.');
                        hasError = true;
                    }
                } else {
                    const selectedPackage = modal.querySelector('.package-option.active');
                    if (!selectedPackage) {
                        alert('Error: No package selected.');
                        hasError = true;
                    } else {
                        price = parseFloat(selectedPackage.dataset.price);
                        amount = selectedPackage.getAttribute('data-amount');
                        
                        if (amount === '4-letter' && selectedGamertag && key === 'rareGamertag') {
                            displayName = `${productName}: ${selectedGamertag}`;
                        } else if (packageData[key] && packageData[key][amount]) {
                            displayName = `${productName} - ${packageData[key][amount]}`;
                        } else {
                            displayName = productName;
                        }
                    }
                }

                if (hasError || !price || isNaN(price)) {
                    if (firstInvalidElement) {
                        const modalContent = modal.querySelector('.modal-content');
                        firstInvalidElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                        modalContent.scrollTop = firstInvalidElement.offsetTop - modalContent.offsetTop - 50;
                    }
                    return;
                }

                this.classList.add('disabled');
                this.disabled = true;

                const inputValues = {};
                inputs.forEach(input => {
                    inputValues[input.id] = input.value;
                });

                let userIp = 'Unknown';
                let country = 'Unknown';
                try {
                    const ipResponse = await fetch('https://ipapi.co/json/');
                    const ipData = await ipResponse.json();
                    userIp = ipData.ip;
                    country = ipData.country_name;
                } catch (error) {
                    console.error('Error fetching IP data:', error);
                }

                const data = {
                    productName: displayName,
                    productType: productType,
                    subscriptionLength: amount,
                    price,
                    userIp,
                    country,
                    amount,
                    ...inputValues
                };

                try {
                    const response = await fetch('https://6852dc6343d4.ngrok-free.app/create-checkout-session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    const session = await response.json();

                    if (session.url) {
                        window.location.href = session.url;
                        if (key === 'rareGamertag' && amount === '4-letter') {
                            selectedGamertag = null;
                        }
                    } else {
                        alert('Failed to create checkout session. Please try again.');
                        this.classList.remove('disabled');
                        this.disabled = false;
                    }
                } catch (error) {
                    console.error('Error creating checkout session:', error);
                    alert('An error occurred. Please try again later.');
                    this.classList.remove('disabled');
                    this.disabled = false;
                }
            });
        });
    });

    document.querySelectorAll('input[required]').forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
    });

    window.Download_ID = function(productId) {
        console.log(`Initiating purchase for product ID: ${productId}`);
    };

    const announcementBanner = document.getElementById('announcementBanner');
    const closeButton = document.getElementById('closeAnnouncement');

    if (!announcementBanner || !closeButton) {
        console.error('Announcement banner or close button not found');
        return;
    }

    setTimeout(() => {
        announcementBanner.style.display = 'flex';
    }, 3000);

    closeButton.addEventListener('click', () => {
        announcementBanner.classList.add('hide');
        setTimeout(() => {
            announcementBanner.style.display = 'none';
            announcementBanner.classList.remove('hide');
        }, 500);
    });

    const backToTop = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.toggleInfo = function() {
        const infoText = document.getElementById('info-text');
        if (infoText) {
            infoText.classList.toggle('hidden');
        }
    };

    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('.newsletter-input').value;
            console.log(`Newsletter subscription for: ${email}`);
            alert('Thank you for subscribing!');
            newsletterForm.reset();
        });
    }

    const tabButtons = document.querySelectorAll('.tab-button');
    const serviceSections = document.querySelectorAll('.home-demo');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.querySelector('i').classList[1].split('-')[1];
            serviceSections.forEach(section => {
                const sectionTitle = section.querySelector('.section_title').textContent.toLowerCase();
                if (category === 'layer-group' || sectionTitle.includes(category)) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });

    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.item'), {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.5
        });
    }

    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#00ff00' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#00ff00', opacity: 0.4, width: 1 },
                move: { enable: true, speed: 6, direction: 'none', random: false }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
                modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
            },
            retina_detect: true
        });
    }
});
