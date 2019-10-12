import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import GridContainer from "../../components/Grid/GridContainer.js";
import GridItem from "../../components/Grid/GridItem.js";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import WawaLogo from '../../assets/images/wawa_logo.png';
import Button from "@material-ui/core/Button/Button";
import QRreader from './QRreader.js';

import AccountIcon from '@material-ui/icons/AccountCircle';
import ReceiptIcon from '@material-ui/icons/Receipt';
import Fab from "@material-ui/core/Fab/Fab";
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import BackIcon from '@material-ui/icons/ArrowBack';
import UpIcon from '@material-ui/icons/ArrowUpward';
import DownIcon from '@material-ui/icons/ArrowDownward';
import rawProfile from "../../utils/profile.json";
import rawSandwitch from "../../utils/sandwichJson.json";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3, 2),
        paddingBottom: 0,
        height: 'calc(100% - 20px)'
    },
    fab: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    }
}));


function ModalBase(props) {
    console.log(props);
    const classes = useStyles();
    const { authed, modalType, close } = props;
    const [content, setContent] = useState('buttons');
    const [prevContent, setPrevContent] = useState([]);
    const [list, setList] = useState('');
    const [scanned, setScanned] = useState(false);
    const profileData = JSON.parse(JSON.stringify(rawProfile));
    const sandwitch = JSON.parse(JSON.stringify(rawSandwitch));
    const otherButtonStyle = {
        width: '45%',
        height: '220px',
        display: 'flex',
        flexDirection: 'column',
        color: '#422007'
    };
    const iconStyle = {
        fontSize: '7rem'
    };

    let favItems = [];
    let prevItems = [];
    let prevItemsIDString = '';
    const hasInitFavs = 'favouritesGroups' in profileData && profileData.favouritesGroups.length> 0;
    const hasInitPrevs = "previousOrders" in profileData && profileData.previousOrders.length > 0;
    if (hasInitFavs) {
        const favItemsCategory = Object.keys(profileData.favouritesGroups);
        if (favItemsCategory.length > 0) {
            favItemsCategory.forEach(favCat => {
                const itemsInCat = profileData.favouritesGroup[favCat];
                if (itemsInCat.length > 0) {
                    itemsInCat.forEach(item => {
                        if (sandwitch.id === item.id) {
                            item.imageURL = sandwitch.img;
                            item.hasImage = true;
                        } else {
                            item.hasImage = false;
                        }
                        favItems.push(item);
                    })
                }
            })
        }
    }
    if (hasInitPrevs) {
        profileData.previousOrders.foreEach(prevOrder => {
            const orderDate = prevOrder.orderDate;
            if ("orderItems" in prevOrder && prevOrder.items.length > 0) {
                prevOrder.items.forEach(item => {
                    if (prevItemsIDString.indexOf(item.id) === -1) {
                        prevItemsIDString = prevItemsIDString + '###########' + item.id;
                        item.orderDate = orderDate;
                        prevItems.push(item);
                    }
                })
            }
        })
    }

    function updatePastModalContent(content) {
        let newPast = [...prevContent];
        newPast.push(content);
        setPrevContent(newPast);
    }



    function updateContent (e, content, fromQR=false, QRsource='') {
        console.log('content update attempt');
        console.log(e);
        console.log(content)
        console.log(fromQR)
        if (e || fromQR === 'fromQR') {
            updateContent(content);
            setContent(content);
            if (QRsource === 'receipt') {
                setList(QRsource)
            }
        }
    }

    function goBackInModal (e) {
        if (e) {
            //lets not waste time

            setContent('buttons');
            //
            // let foundAt = [];
            // let appliedIndex = 0;
            // let copyOfPrevContent = [...prevContent];
            // const prevContentCount = copyOfPrevContent.length;
            // copyOfPrevContent.reduct(function(foundAt, item, index){
            //     if (item === content) {
            //         foundAt.push(index);
            //     }
            // });
            // if (foundAt.length > 1) {
            //     const lastViewed = Math.max(...foundAt);
            //     appliedIndex = lastViewed - 1;
            // } else if (foundAt.length === 1) {
            //     appliedIndex = foundAt[0] - 1;
            // } else {
            //     //nothing to do
            // }
            // if (appliedIndex > 0) {
            //     const lastPage = prevContent[appliedIndex];
            //     copyOfPrevContent.length = prevContentCount - 1;
            //     setContent(lastPage);
            //     setPrevContent(copyOfPrevContent);
            // }
        }
    }

    function createItemList (items, type) {
        if (items.length < 1) {
            return (
                <div style={{width: '80%', padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <span>You have no {type} items</span>
                </div>
            );

        } else {
            return ( //show last ordered date
                <div style={{width: '80%', padding: '30px 10%', display: 'flex', flexDirection: 'column'}}>
                    <Button variant="contained" size="large" style={otherButtonStyle}>
                        <AccountIcon style={iconStyle}/>
                        <div>My Account</div>
                    </Button>
                </div>
            );
        }
    }

    function closeModal (e) {
        if (e) {
            close();
        }
    }

    const showNavsComponent = <GridContainer justify="space-evenly" direction="row" style={{padding: 5}}>
            <GridContainer justify="center" direction="column" style={{padding: 0}}>
                <Fab color="primary" aria-label="add" className={classes.fab} style={{backgroundColor: '#312B2B'}}
                     disabled={content === 'buttons'} onClick={(e) => {goBackInModal(e)}}>
                    <BackIcon />
                </Fab>
                <span style={{alignSelf: 'center'}}>Previous</span>
            </GridContainer>
            <GridContainer justify="center" direction="column" style={{padding: 0}}>
                <Fab aria-label="add" className={classes.fab}  size="medium" style={{backgroundColor: '#a93337', color: '#fff'}}>
                    <UpIcon />
                </Fab>
            </GridContainer>
            <GridContainer justify="center" direction="column" style={{padding: 0}}>
                <Fab style={{backgroundColor: '#a93337', color: '#fff'}} size="medium" aria-label="add" className={classes.fab}>
                    <DownIcon />
                </Fab>
            </GridContainer>
            <GridContainer justify="center" direction="column" style={{padding: 0}}>
                <Fab color="primary" aria-label="add" className={classes.fab}  style={{backgroundColor: '#312B2B'}} onClick={(e) => {closeModal(e)}}>
                    <ClearIcon />
                </Fab>
                <span style={{alignSelf: 'center'}}>Cancel</span>
            </GridContainer>
        </GridContainer>;

    const showNavs = content !== 'buttons';


    if (authed) {
        return (
            <Card raised style={{width: 800, height: 600, margin: 'auto', paddingTop: 20, textAlign: 'center' }}>
                {content === 'buttons' && <div>
                    <h1 style={{color: '#a93337'}}>Quickly Add Your Favourites</h1>
                    <h3>from the following sources...</h3>
                    <Button variant="contained" size="large"
                            onClick={(e) => {updateContent(e, 'byApp')}}
                            style={{backgroundColor: "#f0e3ce", width: '80%', outline: 'none', height: '175px'}}>
                        <img src={WawaLogo} style={{width: '150px'}}/><span
                        style={{fontSize: 60, color: '#422007'}}>App</span>
                    </Button>
                    <div style={{width: '80%', padding: '30px 10%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Button variant="contained" size="large" style={otherButtonStyle}>
                            <AccountIcon style={iconStyle} />
                            <div>My Account</div>
                        </Button>
                        <Button variant="contained" size="large" style={otherButtonStyle} onClick={(e) => {updateContent(e, 'byReceipt')}}>
                            <ReceiptIcon  style={iconStyle} />
                            Via Reciept
                        </Button>
                    </div>
                </div>
                }
                {content === 'byApp' && <QRreader source='app' updateContent={setContent} closeModal={closeModal} />}
                {content === 'byReceipt' && <QRreader source='receipt' updateContent={updateContent}  closeModal={closeModal} />}
                {content === 'byPhone' && <div>ByPhone</div>}
                {content === 'personalItems' && <div>
                    <h3>Select Items From...</h3>
                    {!list && <div style={{width: '80%', padding: '30px 10%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Button variant="contained" size="large" style={otherButtonStyle} >
                            <AccountIcon style={iconStyle} />
                            <div>My Favourites</div>
                        </Button>
                        <Button variant="contained" size="large" style={otherButtonStyle} onClick={(e) => {updateContent(e, 'byReceipt')}}>
                            <ReceiptIcon  style={iconStyle} />
                            Via Reciept
                            <div>Past Orders</div>
                        </Button>
                    </div>}
                    {list === 'prev' ? createItemList(prevItems, 'previously ordered') : createItemList(favItems, 'favourite') }
                </div>}
                {showNavs && showNavsComponent}
            </Card>
        );
    } else {
        return (
            <Card raised style={{width: 800, height: 600, margin: 'auto', textAlign: 'center' }}>
                <h1> Log in to use this</h1>
        </Card>);
    }
}

export default ModalBase;