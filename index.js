const FAQ = [
    {
        q: "How much does Photoshop cost?",
        a: "Plans start at US$22.99/mo."
    },
    {
        q: "Can you use Photoshop to edit videos?",
        a: "Yes, you can use Photoshop to edit videos."
    },
    {
        q: "Is Photoshop available without a subscription?",
        a: "Photoshop is only available as part of a Creative Cloud plan, which includes the latest features, updates, fonts, and more."
    }
];

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function getFirstChildTextAndRemoveFirstChild(el) {
    const firstChild = el.firstElementChild;
    const backgroundColor = firstChild.textContent;
    el.removeChild(firstChild);
    return backgroundColor;
}

function handleLinks(el, parentTag, className) {
    el.querySelectorAll('a').forEach(link => {
        const parentEl = link.closest(parentTag);
        if (parentEl) {
            link.className = className;
            parentEl.parentNode.insertBefore(link, parentEl);
            parentEl.remove();
        }
    });
}

function handleFaqQuestionClick(el) {
    el.addEventListener('click', (event) => {
        if (event.target.closest('.question')) {
            const question = event.target.closest('.question');
            const answer = question.nextElementSibling;
            const isOpen = answer.classList.contains('open');
            document.querySelectorAll('.faq .answer').forEach(ans => {
                ans.classList.remove('open');
                ans.style.maxHeight = null;
                ans.style.padding = '0 8px';
            });
            document.querySelectorAll('.faq .question').forEach(q => q.classList.remove('open'));
            if (!isOpen) {
                answer.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.padding = '8px';
                question.classList.add('open');
            }
        }
    });
}

function processBackgroundColor(el) {
    if (!el || !el.firstElementChild) return;
    el.style.background = getFirstChildTextAndRemoveFirstChild(el);
}

function processHero(el) {
    processBackgroundColor(el);
    el.querySelectorAll('p').forEach(p => {
        if (p.querySelector('a')) {
            p.classList.add('action-area');
        }
    });
    handleLinks(el, 'b', 'con-button');
    handleLinks(el, 'i', 'con-button blue');
}

function processBrick(el) {
    processBackgroundColor(el);
    const paragraphs = el.querySelectorAll('p');
    paragraphs[0].classList.add('title');
    paragraphs[1].classList.add('price');
    paragraphs[2].classList.add('description');
}

function processFaq(el) {
    el.innerHTML = FAQ.map(item => `
        <div class="faq-set">
            <div class="question">
                <div>
                    <h3>${item.q}</h3>
                </div>
            </div>
            <div class="answer">
                <div>
                    <p>${item.a}</p>
                </div>
            </div>
        </div>
    `).join('');

    handleFaqQuestionClick(el)
}

function processBanner(el) {
    handleLinks(el, 'b', 'con-button blue');
    const hero = document.querySelector('.hero');
    const banner = el;
    function checkHeroVisibility() {
        const heroRect = hero.getBoundingClientRect();
        const isHeroOffScreen = heroRect.bottom < 0;
        if (isHeroOffScreen) {
            banner.style.transform = 'translateY(0)';
        } else {
            banner.style.transform = 'translateY(100%)';
        }
    }
    checkHeroVisibility();
    window.addEventListener('scroll', debounce(checkHeroVisibility, 100));
    banner.style.transition = 'transform 0.3s ease';
}

document.querySelectorAll('.hero').forEach(processHero);
document.querySelectorAll('.brick').forEach(processBrick);
document.querySelectorAll('.faq').forEach(processFaq);
document.querySelectorAll('.banner').forEach(processBanner);