import React, { forwardedRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import GridContainer from "../../components/Grid/GridContainer.js";
import GridItem from "../../components/Grid/GridItem.js";
import Card from '@material-ui/core/Card';
import WawaLogo from '../../assets/images/wawa_logo.png';
import Button from "@material-ui/core/Button/Button";
import Badge from '@material-ui/core/Badge';

import AccountIcon from '@material-ui/icons/AccountCircle';
import ReceiptIcon from '@material-ui/icons/Receipt';
import Fab from "@material-ui/core/Fab/Fab";
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import BackIcon from '@material-ui/icons/ArrowBack';
import UpIcon from '@material-ui/icons/ArrowUpward';
import DownIcon from '@material-ui/icons/ArrowDownward';
import TailSpin from '../../assets/images/svgs/tail-spin.svg';
import rawProfile from "../../utils/profile.json";
import rawSandwitch from "../../utils/sandwichJson.json";
import rawKiosk from "../../utils/kiosk";
import QrReader from "react-qr-reader";
import QRCode from 'qrcode.react';

import SmartphoneIcon from '@material-ui/icons/Smartphone';


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
    const loadingTime = 500;
    const scanDelay = 300;
    const [addMode, setAddMode] = useState('all');
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const { forwardedRef, authed, modalType, close, hasItems, toggleItems } = props;
    const [content, setContent] = useState('buttons');
    const [prevContent, setPrevContent] = useState([]);
    const [list, setList] = useState('');
    const [scanned, setScanned] = useState(false);
    const profileData = JSON.parse(JSON.stringify(rawProfile));
    const sandwitch = JSON.parse(JSON.stringify(rawSandwitch));
    const kioskData = JSON.stringify(rawKiosk);
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

    const loadingStyle = {
        position: 'absolute',
        width: 800,
        height: 600,
        flexDirection: 'column',
        zIndex: 9,
        paddingTop: 200
    }

    const [favItems, setFavItems] = useState([]);
    const [prevItems, setPrevItems] = useState([]);
    let prevItemsIDString = '';
    const hasInitFavs = profileData && 'favouritesGroups' in profileData && profileData.favouritesGroups.length> 0;
    const hasInitPrevs = profileData && "previousOrders" in profileData && profileData.previousOrders.length > 0;

    function mockGetFaves (anyToGo) {
        if (anyToGo) {
            console.log('favs started');
            let favItems = [];
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
                });
                setFavItems(favItems);
            }
        }
    }

    function mockGetPrevs (anyToGo) {
        if (anyToGo) {
            console.log('prevstarted');
            profileData.previousOrders.foreEach(prevOrder => {
                let prevItems = [];
                const orderDate = prevOrder.orderDate;
                if ("orderItems" in prevOrder && prevOrder.items.length > 0) {
                    prevOrder.items.forEach(item => {
                        if (prevItemsIDString.indexOf(item.id) === -1) {
                            prevItemsIDString = prevItemsIDString + '###########' + item.id;
                            item.orderDate = orderDate;
                            prevItems.push(item);
                        }
                    });
                    setPrevItems(prevItems);
                }
            })
        }
    }

    mockGetFaves(hasInitFavs);
    mockGetPrevs(hasInitPrevs);

    function updatePastModalContent(content) {
        let newPast = [...prevContent];
        newPast.push(content);
        setPrevContent(newPast);
    }

    function updateAddMode (e, mode) {
        if (e) {
            setAddMode(mode);
        }
    }

    function handleError (err) {
        console.error(err)
    }

    function handleScan (result) {
        if(result){
            console.log(result);
            const qrData = {
                nextContent: 'personalItems',
                fromQR: true,
                source: content
            };
            const e = {
                one: 'two'
            };
            updateContent(result, qrData);
        }
    }

    function clickQR (e) {
        if (e) {
            console.log('hj');
            const qrData = {
                nextContent: 'personalItems',
                fromQR: true,
                source: content
            };
            updateContent(e, qrData);
        }
    }

    console.log('component load');
    console.log(favItems);
    console.log(prevItems);


    function updateContent (e, updateData) {
        if (e) {
            console.log('update triggered');
            console.log(updateData);
            let nextContent = '', fromQR = false, source = '';
            if (updateData) {
                if ('nextContent' in updateData && updateData.nextContent) {
                    nextContent = updateData.nextContent;
                }
                if ('fromQR' in updateData && updateData.fromQR) {
                    fromQR = updateData.fromQR;
                }
                if ('source' in updateData && updateData.source) {
                    source = updateData.source;
                }
                if (fromQR) {
                    setLoading(true);
                    if (fromQR) {

                        console.log('qr update');
                        console.log(favItems);
                        console.log(prevItems);
                    }

                    setTimeout(() => {
                        setLoading(false);
                        setContent(nextContent);
                        if (source && source === 'receipt') {
                            setList(source)
                        }
                    }, loadingTime);
                } else {
                    setContent(nextContent);
                }
            } else {
                console.log('no data');
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

        }
    }

    function closeModal (e) {
        if (e) {
            close();
        }
    }

    function addItem(e, val) {
        if (e) {
            toggleItems(val);
        }
    }

    const previewStyle = {
        height: 240,
        width: 240,
        margin: content === 'receipt' ? 'auto' : ''
    }

    function addItem2 (e) {
        if (e) {
            this.bntRef.current.click()
            // const prev = document.getElementById("backbutton")
            // k.click();
        }

    }

    const showNavsComponent = <GridContainer justify="space-evenly" direction="row" style={{padding: 5, position: 'absolute', width: 800, bottom: 'calc((100vh - 600px)/2)'}}>
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
    const titleText = content === 'receipt' ? 'Scan from a receipt' : 'Scan the QR in your app';
    const nextAddMode = addMode === 'all' ? 'single' : 'all';

    const k = [1,2,3,4,,5];

    if (authed) {
        return (
            <Card raised style={{width: 800, height: 600, margin: 'auto', paddingTop: 20, textAlign: 'center', overflow: 'hidden' }}>
                {loading &&  <GridContainer justify="space-evenly" direction="row">
                    <GridItem style={loadingStyle}>
                        <img src={TailSpin} />
                    </GridItem>
                </GridContainer>
                }
                {content === 'buttons' && <div>
                    <h1 style={{color: '#a93337'}}>Quickly Add Your Favourites</h1>
                    <h3>from the following sources...</h3>
                    <Button variant="contained" size="large"
                            onClick={(e) => {updateContent(e, {nextContent: 'app', source: content})}}
                            style={{backgroundColor: "#f0e3ce", width: '80%', outline: 'none', height: '175px'}}>
                        <img src={WawaLogo} style={{width: '150px'}}/><span
                        style={{fontSize: 60, color: '#422007'}}>App</span>
                    </Button>
                    <div style={{width: '80%', padding: '30px 10%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Button variant="contained" size="large" style={otherButtonStyle}>
                            <AccountIcon style={iconStyle} />
                            <div>My Account</div>
                        </Button>
                        <Button variant="contained" size="large" style={otherButtonStyle} onClick={(e) => {updateContent(e, {nextContent: 'receipt', source: content})}}>
                            <ReceiptIcon  style={iconStyle} />
                            Via Receipt
                        </Button>
                    </div>
                </div>
                }
                {(content === 'app' || content === 'receipt') && <div>
                    <h1 style={{color: '#a93337'}}>{titleText}</h1>
                    <h3>{content === 'receipt' ? 'To Quickly Add Your Items' : addMode === 'all' ? 'Connect with your app to see your items' : 'Add an item from your app'}</h3>
                    <GridContainer direction='column' justify="center" style={{height: 350}}>
                        {content === 'receipt' ?
                            <GridItem style={{display: 'flex', flexDirection: 'column'}}>
                                <QrReader
                                    delay={scanDelay}
                                    style={previewStyle}
                                    onError={handleError}
                                    onScan={handleScan}
                                />
                            </GridItem> :
                            <GridItem style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                                <Button variant="contained" size="large"
                                        onClick={(e) => {updateAddMode(e, nextAddMode)}} >
                                    {addMode === 'all' ? <AddIcon /> : <SmartphoneIcon />}
                                    <div>{addMode === 'all' ? 'Add Item from App' : 'Browse all Your Items'}</div>
                                </Button>
                                {addMode === 'all' ? <QRCode onClick={(e) => {clickQR(e)}} value={kioskData} style={previewStyle}/> :
                                    <QrReader
                                        delay={scanDelay}
                                        style={previewStyle}
                                        onError={handleError}
                                        onScan={handleScan}
                                    />
                                }
                            </GridItem>
                        }
                    </GridContainer>
                </div>}
                {content === 'phone' && <div>ByPhone</div>}
                {content === 'personalItems' && <div>
                    <h3>Select Items From...</h3>
                    <div style={{width: '80%', padding: '100px 10%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Button variant="contained" size="large" style={otherButtonStyle} onClick={(e) => {updateContent(e, {nextContent: 'favourites', source: content})}}>
                            <Badge badgeContent={favItems.length} color="primary">
                                <AccountIcon style={iconStyle} />
                            </Badge>
                            <div>My Favourites</div>
                        </Button>
                        <Button variant="contained" size="large" style={otherButtonStyle} onClick={(e) => {updateContent(e, {nextContent: 'previous', source: content})}}>
                            <Badge badgeContent={prevItems.length} color="primary">
                                <ReceiptIcon  style={iconStyle} />
                            </Badge>
                            <div>Past Orders</div>
                        </Button>
                    </div>
                    {/*{list === 'prev' ? createItemList(prevItems, 'previously ordered') : createItemList(favItems, 'favourite') }*/}
                </div>}
                {(content === 'favourites' || content === 'previous') && <div>
                    <h3>Select Items From {content}</h3>
                    <div style={{width: '80%', padding: '100px 10%', display: 'flex', flexDirection: 'row'}}>
                        {k.map(item => {
                            return ( //show last ordered date
                                <div style={{width: '80%', padding: '30px 10%', display: 'flex', flexDirection: 'column'}}>
                                    <Button onClick={(e) => {addItem2(e)}} variant="contained" size="large" style={{width: 200, height: 200, margin: 10}} >
                                        {item  === 1 ? 'Oven Roasted Turkey' : content + ' #' +item.toString()}
                                    </Button>
                                </div>);
                        })}
                    </div>
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