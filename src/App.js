import React from 'react';
import $ from 'jquery';
import 'normalize.css';
import './App.css';
import GrossingApp from './GrossingApp';
import FreeApp from './FreeApp';
import AppModel from './Model/App';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.onAppListScroll = this.onAppListScroll.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.state = {
            search: '',
            grossingApps: [],
            freeApps: [],
            loadedFreeAppsCount: 0,
            isLoadingFreeAppList: false,
        };
    }

    componentDidMount() {
        this.loadTopGrossingAppList();
        this.loadTopFreeAppList();
    }

    loadTopGrossingAppList() {
        this.setState({
            isLoadingTopGrossingAppList: true
        });
        $.ajax({
            url: 'https://itunes.apple.com/hk/rss/topgrossingapplications/limit=' + this.props.totalTopGrossingAppsCount + '/json',
            dataType: 'json',
            success: (data) => {
                const entries = data.feed.entry;
                const items = entries.map(entry => new AppModel(entry));
                this.setState({
                    grossingApps: [...this.state.grossingApps.slice(), ...items]
                });
            },
            error: (error) => {
                console.log(error);
            },
            complete: () => {
                this.setState({
                    isLoadingTopGrossingAppList: false
                });
            }
        });
    }

    loadTopFreeAppList() {
        this.setState({
            isLoadingTopFreeAppList: true
        });
        $.ajax({
            url: 'https://itunes.apple.com/hk/rss/topfreeapplications/limit=' + this.props.totalTopFreeAppsCount + '/json',
            dataType: 'json',
            success: (data) => {
                const entries = data.feed.entry;
                const items = entries.map(entry => new AppModel(entry));
                this.setState({
                    freeApps: [...this.state.freeApps.slice(), ...items]
                });
                this.setState({
                    isLoadingTopFreeAppList: false
                });
                this.loadTopFreeAppListNextPage();
            },
            error: (error) => {
                console.log(error);
                this.setState({
                    isLoadingTopFreeAppList: false
                });
            }
        });
    }

    onAppListScroll(e) {
        const appListsContainer = e.target;
        const height = $(appListsContainer).outerHeight(true);
        const availableScrollheight = appListsContainer.scrollHeight;
        const scrollTop = appListsContainer.scrollTop;
        if (scrollTop + height >= availableScrollheight - 100) {
            this.loadTopFreeAppListNextPage();
        }
    }

    loadTopFreeAppListNextPage() {
        // Prevent multiple load
        if (this.state.isLoadingTopFreeAppList) {
            return;
        }
        // Already loaded all available apps
        if (this.state.loadedFreeAppsCount >= this.state.freeApps.length) {
            return;
        }
        this.setState({
            isLoadingTopFreeAppList: true
        });
        // setTimeout to simulate network lazy load
        setTimeout(() => {
            this.setState({
                loadedFreeAppsCount: this.state.loadedFreeAppsCount + parseInt(this.props.topFreeAppsPerPage)
            });
            this.setState({
                isLoadingTopFreeAppList: false
            });
        }, 100);
    }

    onSearchChange(e) {
        const value = e.target.value;
        this.setState({
            search: value
        });
    }

    render() {
        let freeApps = this.state.freeApps.slice(0, this.state.loadedFreeAppsCount);
        if (this.state.search) {
            const loweredSearchValue = this.state.search.toLowerCase();
            freeApps = freeApps.filter(app => app.name.toLowerCase().includes(loweredSearchValue) ||
                app.category.toLowerCase().includes(loweredSearchValue) ||
                app.author.toLowerCase().includes(loweredSearchValue) ||
                app.summary.toLowerCase().includes(loweredSearchValue));
        }
        return (
            <div className="app">
                <div className="search">
                    <input type="text" name="search" onChange={this.onSearchChange} placeholder="搜尋" />
                </div>
                <div className="app-lists" onScroll={this.onAppListScroll}>
                    <div className="grossing-app-list">
                        <div className="title">
                            推介
                        </div>
                        <div className="inner-list">
                            {this.state.grossingApps.map((app, i) => <GrossingApp key={'grossing_app_' + app.id} number={i + 1} model={app} />)}
                            {this.state.isLoadingTopGrossingAppList &&
                                <div className="loading">
                                    載入中…
                                </div>
                            }
                        </div>
                    </div>
                    <div className="free-app-list">
                        {freeApps.map((app, i) => <FreeApp key={'free_app_' + app.id} number={i + 1} model={app} />)}
                        {this.state.isLoadingTopFreeAppList &&
                            <div className="loading">
                                載入中…
                        </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
