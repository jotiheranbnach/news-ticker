"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./assets/scss/styles.css");
class Newsticker {
    constructor(news, glue = '&nbsp;') {
        this.news = news;
        this.newstickerElement = document.getElementsByClassName('newsticker')[0];
        this.newsElement = document.getElementsByClassName('news')[0];
        this.newstickerRect = this.newstickerElement.getBoundingClientRect();
        this.buildNewsChain(glue);
    }
    runNews() {
        setInterval(() => {
            // Laufen lassen
            const newsElements = this.newstickerElement.children;
            for (let i = 0; i < newsElements.length; i++) {
                const newsElement = newsElements[i];
                let newLeft = Newsticker.extractPxNumber(newsElement.style.left) - 1;
                newsElement.style.left = newLeft + 'px';
                if (newLeft <= -newsElement.getBoundingClientRect().width) {
                    const lastElement = newsElements[newsElements.length - 1];
                    newsElement.style.left = (Newsticker.extractPxNumber(lastElement.style.left) + lastElement.getBoundingClientRect().width) + 'px';
                    this.newstickerElement.appendChild(this.newstickerElement.removeChild(newsElements[0]));
                }
            }
        }, 10);
    }
    static extractPxNumber(pxValue) {
        return +pxValue.substr(0, pxValue.length - 2);
    }
    buildNewsChain(glue) {
        let left = this.newstickerRect.width;
        let width = 0;
        while (true) {
            for (let newsFragment of this.news) {
                let div = document.createElement("div");
                div.classList.add('news');
                div.innerHTML = newsFragment + glue;
                div.style.left = left + 'px';
                this.newstickerElement.appendChild(div);
                div.style.width = Math.ceil(div.getBoundingClientRect().width) + 'px';
                width += Newsticker.extractPxNumber(div.style.width);
                left = left + div.getBoundingClientRect().width;
            }
            if (this.newstickerRect.width * 2 < width) {
                break;
            }
        }
    }
}
exports.Newsticker = Newsticker;
(() => {
    const newsticker = new Newsticker([
        'Newstickers are fun!',
        'Putin wieder beim Bärenreiten gesichtet.',
        'Jens hat sein Programm endlich fertig!',
    ], '&nbsp;&nbsp;+++&nbsp;&nbsp;');
    newsticker.runNews();
})();
//# sourceMappingURL=main.js.map