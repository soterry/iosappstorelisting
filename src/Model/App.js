import $ from 'jquery';

class App {

    constructor(data) {
        this.data = data;
        this._rating = null;
        this._totalRatingCount = null;
    }

    get id() {
        return this.data.id.attributes['im:id'];
    }

    get icon() {
        const icons = this.data['im:image'];
        return icons[icons.length - 1].label;
    }

    get name() {
        return this.data['im:name'].label;
    }

    get category() {
        return this.data.category.attributes.label;
    }

    get author() {
        return this.data['im:artist'].label;
    }

    get summary() {
        return this.data.summary.label;
    }

    requestRating() {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'https://itunes.apple.com/hk/lookup?id=' + encodeURIComponent(this.id),
                dataType: 'json',
                success: (data) => {
                    if (data.results.length <= 0) {
                        reject();
                        return;
                    }
                    const result = data.results[0];
                    this._rating = result.averageUserRating;
                    this._totalRatingCount = result.userRatingCount;
                    resolve();
                },
                error: (error) => {
                    console.log(error);
                    reject();
                }
            });
        });
    }

    get rating() {
        return this._rating;
    }

    get totalRatingCount(){
        return this._totalRatingCount;
    }

    get link() {
        return this.data.id.label;
    }

}

export default App;