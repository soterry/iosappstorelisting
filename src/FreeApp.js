import React from 'react';
import classNames from 'classnames';

class FreeApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rating: null
        };
        this.props.model.requestRating().then(() => this.setState({
            rating: this.props.model.rating
        }));
    }

    render() {
        const model = this.props.model;
        const ratings = [];
        const roundedRating = Math.round(this.props.model.rating);
        for (let i = 1; i <= 5; i++) {
            ratings.push(<i key={'rating_star_' + i} className={classNames('item-rating-star', { 'enabled': roundedRating >= i })}></i>)
        }
        return (
            <a href={model.link} target="_blank" rel="noreferrer" className="item">
                <div className="item-number">
                    {this.props.number}
                </div>
                <img className="item-icon" src={model.icon} alt="App Icon" />
                <div className="item-detail">
                    <div className="item-name">
                        {model.name}
                    </div>
                    <div className="item-category">
                        {model.category}
                    </div>
                    {this.state.rating !== null &&
                        <div className="item-rating">
                            {ratings}<span className="item-rating-number">({this.props.model.totalRatingCount})</span>
                        </div>
                    }
                </div>
            </a>
        );
    }
}

export default FreeApp;
