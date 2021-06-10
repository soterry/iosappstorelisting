import React from 'react';

class GrossingApp extends React.Component {

    render() {
        const model = this.props.model;
        return (
            <a href={model.link} target="_blank" rel="noreferrer" className="item">
                <img className="item-icon" src={model.icon} alt="App Icon" />
                <div className="item-detail">
                    <div className="item-name">
                        {model.name}
                    </div>
                    <div className="item-category">
                        {model.category}
                    </div>
                </div>
            </a>
        );
    }
}

export default GrossingApp;
