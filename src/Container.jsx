import React from 'react'
import {
    Route,
    BrowserRouter,
    Link
  } from 'react-router-dom';
import Reboot from 'material-ui/Reboot';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import Popover from 'material-ui/Popover';
import Button from 'material-ui/Button';
import StudysetPage from './StudysetPage';
import StudysetListPage from './StudysetListPage';

export default class Container extends React.Component {

    constructor() {
        super();
        this.state = {
            studysets: [],
            profilePopoverOpen: false,
            profilePopoverAnchorEl: null
        }
    }

    componentDidMount() {
        fetch('/studysets', { credentials: 'include' })
            .then(res => res.json())
            .then(studysets => this.setState({ studysets}))
            .catch(e => console.log(e));
        console.log("study sets: ", this.state.studysets);
    }

    openProfilePopover(event) {
        this.setState({
            profilePopoverOpen: true,
            profilePopoverAnchorEl: event.currentTarget
        });
    }

    closeProfilePopover() {
        this.setState({
            profilePopoverOpen: false
        });
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <Reboot />
                    <Route exact path='/' render={(props) => (
                        <React.Fragment>
                            {this.renderAppBar()}
                            <StudysetListPage {...props} studysets={this.state.studysets}/>
                        </React.Fragment>
                    )}/>
                    <Route path = '/studyset/:id' render = {props => <StudysetPage {...props} studysets={this.state.studysets}/>}/>
                </div>
            </BrowserRouter>
        );
    }

    renderAppBar() {
        return (
            <AppBar position="static">
                <Toolbar style={{ justifyContent: 'space-between' }}>
                    <Typography variant="title" color="inherit">Study sets</Typography>
                    <IconButton onClick={this.openProfilePopover.bind(this)}><Avatar src={window.user.picture} /></IconButton>
                    {this.renderProfilePopover()}
                </Toolbar>
            </AppBar>
        );
    }

    renderProfilePopover() {
        let { displayName, picture } = window.user;
        return (
            <Popover
                open={this.state.profilePopoverOpen}
                anchorEl={this.state.profilePopoverAnchorEl}
                onClose={this.closeProfilePopover.bind(this)}>
                <div style={{ display: 'flex', flexDirection: 'row', margin: 8 }}>
                    <Avatar src={picture} style={{ width: 96, height: 96, margin: 8 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ margin: 16 }}>
                            <Typography variant="body2">{displayName}</Typography>
                            {this.renderEmailIfNeeded()}
                        </div>
                        <Button component="a" href="/logout" color="primary" style={{ alignSelf: 'flex-end' }}>Log out</Button>
                    </div>
                </div>
            </Popover>
        );
    }

    renderEmailIfNeeded() {
        let { displayName, emails } = window.user;
        return emails && emails.length > 0 && emails[0].value !== displayName && (
            <Typography variant="body1">{emails[0].value}</Typography>
        );
    }

};
