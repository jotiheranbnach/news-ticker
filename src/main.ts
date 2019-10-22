import "./assets/scss/styles.css";

export class Newsticker {
    private newsElement: HTMLElement;
    private newstickerElement: HTMLElement;

    private news: string[] = [];
    private separator: string = '&nbsp;';

    private newsTickerWidth: number;
    private isRunning: boolean = false;

    private static speed: number = 2;
    private static fps: number = 1000 / 60;

    // 60fps

    constructor() {
        this.newstickerElement = <HTMLElement>document.getElementsByClassName('newsticker')[0];
        this.newsElement = <HTMLElement>document.getElementsByClassName('news')[0];
        this.newsTickerWidth = this.newstickerElement.getBoundingClientRect().width;
    }

    setSeparator(separator: string) {
        this.separator = separator;
    }

    addNews(news: string) {
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
                const newsElement = <HTMLElement>newsElements.item(i);
                let newLeft = Newsticker.extractPxNumber(newsElement.style.left) - Newsticker.speed;
                newsElement.style.left = newLeft + 'px';

                if (newLeft <= -newsElement.getBoundingClientRect().width) {
                    const lastElement = <HTMLElement>newsElements.item(newsElements.length - 1);
                    newsElement.style.left = (Newsticker.extractPxNumber(lastElement.style.left) + lastElement.getBoundingClientRect().width) + 'px';
                    this.newstickerElement.appendChild(this.newstickerElement.removeChild(newsElements[0]));
                }
            }
        }, Newsticker.fps)
    }

    stop() {
        this.isRunning = false;
    }

    /**
     * Extracts the numeric value form a "px" string. E.g. "10px" -> 10.
     * @param pxValue
     */
    private static extractPxNumber(pxValue: string): number {
        return +pxValue.substr(0, pxValue.length - 2);
    }

    private resetNewsTicker() {
        while (this.newstickerElement.firstChild) {
            this.newstickerElement.removeChild(this.newstickerElement.firstChild);
        }
    }

    private buildNewsChain() {
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
