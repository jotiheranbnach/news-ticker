"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./assets/scss/styles.css");
class Newsticker {
    // 60fps
    constructor() {
        this.news = [];
        this.separator = '&nbsp;';
        this.isRunning = false;
        this.newstickerElement = document.getElementsByClassName('newsticker')[0];
        this.newsElement = document.getElementsByClassName('news')[0];
        this.newsTickerWidth = this.newstickerElement.getBoundingClientRect().width;
    }
    setSeparator(separator) {
        this.separator = separator;
    }
    addNews(news) {
        this.news.push(news);
        this.buildNewsChain();
    }
    start() {
        this.isRunning = true;
        let interval = setInterval(() => {
            if (!this.isRunning) {
                clearInterval(interval);
            }
            // Laufen lassen
            const newsElements = this.newstickerElement.children;
            for (let i = 0; i < newsElements.length; i++) {
                const newsElement = newsElements.item(i);
                let newLeft = Newsticker.extractPxNumber(newsElement.style.left) - Newsticker.speed;
                newsElement.style.left = newLeft + 'px';
                if (newLeft <= -newsElement.getBoundingClientRect().width) {
                    const lastElement = newsElements.item(newsElements.length - 1);
                    newsElement.style.left = (Newsticker.extractPxNumber(lastElement.style.left) + lastElement.getBoundingClientRect().width) + 'px';
                    this.newstickerElement.appendChild(this.newstickerElement.removeChild(newsElements[0]));
                }
            }
        }, Newsticker.fps);
    }
    stop() {
        this.isRunning = false;
    }
    /**
     * Extracts the numeric value form a "px" string. E.g. "10px" -> 10.
     * @param pxValue
     */
    static extractPxNumber(pxValue) {
        return +pxValue.substr(0, pxValue.length - 2);
    }
    resetNewsTicker() {
        while (this.newstickerElement.firstChild) {
            this.newstickerElement.removeChild(this.newstickerElement.firstChild);
        }
    }
    buildNewsChain() {
        this.resetNewsTicker();
        let totalWidth = 0;
        // Create enough news fragments to fill the news ticker at least twice
        while (true) {
            for (let newsFragment of this.news) {
                // Create a new div element for the news fragment
                let div = document.createElement("div");
                div.classList.add('news');
                div.innerHTML = newsFragment + this.separator;
                // Add element to the news ticker
                this.newstickerElement.appendChild(div);
                // Set the width and position of the news fragment
                const fragmentWidth = Math.ceil(div.getBoundingClientRect().width);
                div.style.left = totalWidth + this.newsTickerWidth + 'px';
                div.style.width = fragmentWidth + 'px';
                // Track the total width of all news fragments combined
                totalWidth += fragmentWidth;
            }
            // Break the loop if the total width is at least twice as long as the news ticker
            if (this.newsTickerWidth * 2 <= totalWidth) {
                break;
            }
        }
    }
}
Newsticker.speed = 2;
Newsticker.fps = 1000 / 60;
exports.Newsticker = Newsticker;
(() => {
    const newsTicker = new Newsticker();
    // Set the separator of our news to a custom string (HTML allowed)
    newsTicker.setSeparator('&nbsp;&nbsp;+++&nbsp;&nbsp;');
    // Add our news
    newsTicker.addNews('Newstickers are fun!');
    newsTicker.addNews('Putin wieder beim Bärenreiten gesichtet.');
    newsTicker.addNews('Jens hat sein Programm endlich fertig!');
    // Start the news ticker animation
    newsTicker.start();
    // setTimeout(() => {
    //     newsTicker.stop();
    // }, 15000)
})();
//# sourceMappingURL=main.js.map