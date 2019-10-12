import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import GridContainer from "../../components/Grid/GridContainer.js";
import GridItem from "../../components/Grid/GridItem.js";
import TouchScreen from "../../assets/images/touchscreen_left.jpg";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';


import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import BackIcon from '@material-ui/icons/ArrowBack';
import UpIcon from '@material-ui/icons/ArrowUpward';
import DownIcon from '@material-ui/icons/ArrowDownward';
import EditIcon from '@material-ui/icons/Edit';
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
    },
    table: {}
}));



export default function Dashboard(props){
    const btnRef = React.useRef(null)
    const { openModal, closeModal, setHasItems, hasItems, toggleItems } = props;
    const classes = useStyles();
    const testing = true;
    let notYetLoaded = true;
    const user = JSON.parse(JSON.stringify(rawProfile));
    const sandwitch = JSON.parse(JSON.stringify(rawSandwitch));
    const [basketItems, setBasketItems] = useState([]);
    const [favItems, setFavItems] = useState([]);
    const rowItems = [];
    const [showItem, setShowItem] = useState(false)
    let itemCount = 0;
    basketItems.forEach(item => {
        const itemId = basketItems.indexOf(item);
        const newItem = {
            id : itemCount,
            topLevel: true,
            parentId: itemId,
            name: item.displayName,
            price: item.totalPrice.toFixed(2)
        };
        rowItems.push(newItem);
        itemCount = itemCount + 1;
        if (item.hasCondiments) {
            item.condiments.forEach(condiment => {
               const newItem2 = {
                   id: itemCount,
                   topLevel: false,
                   parentId: itemId,
                   name: condiment.condimentSetDisplayName,
                   price: condiment.totalAmount.toFixed(2)
               };
               rowItems.push(newItem2);
               itemCount = itemCount + 1;
            });
        }
    });

    useEffect(() => {
        //console.log(user);
        const newItems = setItems(user.profile);
        setFavItems(newItems);
        if (testing && newItems.length > 0) {
            const selectedItem = newItems[0].items[0];
            addToBasket(basketItems, selectedItem);
        }
        notYetLoaded = false;

    },[notYetLoaded]);

    function updateHasItems () {
        setHasItems(!hasItems);
    }

    function setItems (profileData) {
        let favorites = [];
        if (profileData && 'favouritesGroups' in profileData) {
            const favItemsCategory = Object.keys(profileData.favouritesGroups);
            if (favItemsCategory.length > 0) {
                favItemsCategory.forEach(favItem => {
                    const categoryObj = {
                        id: favItemsCategory.indexOf(favItem) + 1,
                        name: favItem,
                        items: profileData.favouritesGroups[favItem],
                        enabled: true,
                        active: true,
                        expanded: false
                    };
                    favorites.push(categoryObj);
                });
                return favorites;
            } else {
                return [];
            }
        } else {
            return [];
        }
    }

    function addItem1 (e, val) {
        if (e) {
            setShowItem(val);
        }
    }

    function addToBasket (basket, item) {
        let newBasket = [...basket];
        let totalPrice = 0;
        //update tiem price  //pretend sandwitch data fetched from a db based off matching ids
        const basePrice = sandwitch.unitprice.amount;
        item.basePrice = basePrice;
        totalPrice = totalPrice + basePrice;
        if ("condiments" in item && item.condiments.length > 0){
            const priceyStuff = sandwitch.optionSetsArray.filter(option => option.isAddOn);
            item.hasCondiments = true;

            item.condiments.forEach(condiment => {
                priceyStuff.forEach(pricey => {
                    if ("extraOptionsArray" in pricey && pricey.extraOptionsArray.length > 0) {
                        pricey.extraOptionsArray.forEach(extraOption => {
                            if (extraOption.name.toLowerCase() === condiment.condimentSetDisplayName.toLowerCase()) {
                                condiment.extraAmount = extraOption.OptionsItemPricing.amount;
                            }
                        });
                    } else {
                        condiment.extraAmount = 0;
                    }

                    if ("optionsArray" in pricey && pricey.optionsArray.length > 0) {
                        pricey.optionsArray.forEach(option => {
                            if (option.name.toLowerCase() === condiment.condimentSetDisplayName.toLowerCase()) {
                                condiment.amount = option.OptionsItemPricing.amount;
                            }
                        });
                    } else {
                        condiment.amount = 0;
                    }
                    condiment.totalAmount = condiment.extraAmount + condiment.amount ? condiment.amount : 0;
                })
                // if (hasPriceyStuff) {
                //     const priceyMatch = priceyStuff.filter(stuff => stuff.name.toLowerCase() === condiment.condimentSetDisplayName.toLowerCase());
                //     if (priceyMatch > 0) {
                //         condiment.extraPrice = priceyMatch[0].OptionsItemPricing.amount;
                //     }
                //     console.log(priceyMatch);
                // }
                // if ()
                item.totalPrice = item.totalPrice + condiment.totalAmount;
            })
        }
        item.totalPrice = totalPrice;
        newBasket.push(item);
        setBasketItems(newBasket);
    }

    const editStyle = {
        marginLeft: '-15px',
        backgroundColor: '#b48b69'
    };
    const editStyle2 = {
        height: 0,
        marginLeft: '-15px',
        backgroundColor: '#b48b69'
    }

    return (
      <GridContainer justify="center" direction="row">
        <GridItem md={7} lg={8}>
            <img style={{width: '100%', height: '100vh'}} src={TouchScreen} alt="Touchscreen" />
        </GridItem>
          <GridItem md={5} lg={4}>
              <GridContainer justify="center" direction="column" style={{padding: 30, paddingBottom: 0, height: '100vh'}}>
                  <GridItem>
                      <Button variant="contained" size="large"
                        onClick={(e) => {openModal(e,'add')}}
                        style={{
                          padding: 15,
                          marginBottom: 15,
                          backgroundColor: '#a93337',
                          color: '#fff',
                          width: '100%',
                      }}>
                          <AddIcon/> Quick Add
                      </Button>
                  </GridItem>
                  <GridItem>
                      <Button disabled={true} size="large" style={{
                      backgroundColor: 'transparent',
                      color: '#a93337',
                      width: '100%',
                          padding: 0,
                      marginBottom: 15,
                          fontWeight: 'bold'
                  }}>
                      My Order
                  </Button></GridItem>
                  <GridItem style={{flex: 1}}>
                      <Paper className={classes.root}>
                          <GridContainer justify="center" direction="column" style={{padding: 5}}>
                              <GridItem style={{paddingBottom: '0 0 64px 0'}}>
                                  {rowItems.length > 0 && <Table className={classes.table} size="small">
                                      {showItem && rowItems.map(item => {
                                          return (
                                              <TableRow key={item.id.toString() + '-' + item.name} >
                                                  <Fab
                                                      variant="extended"
                                                      size="small"
                                                      color="primary"
                                                      aria-label="add"
                                                      style={item.topLevel ? editStyle : editStyle2}
                                                      className={classes.margin}
                                                  ><EditIcon /></Fab>
                                                  <TableCell  style={item.topLevel ? {border: 0} : {border: 0, padding: 0, paddingLeft: 50, fontStyle: 'italic'}}>
                                                      {item.name}
                                                  </TableCell>
                                                  <TableCell style={item.topLevel ? {border: 0, textAlign: 'right'} : {border: 0, textAlign: 'right', padding: 0, paddingRight: 16, fontStyle: 'italic'}}>
                                                      ${item.price}
                                                  </TableCell>
                                              </TableRow>
                                          );
                                      })}
                                  </Table>}
                              </GridItem>
                              <GridItem style={{position: 'absolute', bottom: 0, padding: 0, left: 0, right: 0}}>
                                  <GridContainer justify="space-evenly" direction="row" style={{padding: 5}}>
                                      <Fab aria-label="add" className={classes.fab}  size="medium" style={{backgroundColor: '#a93337', color: '#fff'}}>
                                          <UpIcon />
                                      </Fab>
                                      <Fab style={{backgroundColor: '#a93337', color: '#fff'}} size="medium" aria-label="add" className={classes.fab}>
                                          <DownIcon />
                                      </Fab>
                                  </GridContainer>
                              </GridItem>
                          </GridContainer>
                      </Paper>
                  </GridItem>
                  <GridItem>
                      <GridContainer justify="space-evenly" direction="row" style={{padding: 5}}>
                          <GridContainer justify="center" direction="column" style={{padding: 0}}>
                              <Fab color="primary" aria-label="add" ref={btnRef} id="backbutton" onClick={(e) => {setShowItem(e, true)}} className={classes.fab} style={{backgroundColor: '#312B2B'}}>
                                  <BackIcon />
                              </Fab>
                              <span style={{alignSelf: 'center'}}>
                                Previous
                              </span>
                          </GridContainer>
                          <div syle={{width: 10}}></div>
                          <GridContainer justify="center" direction="column" style={{padding: 0}}>
                              <Fab color="primary" onClick={(e) => {setShowItem(e, false)}} aria-label="add" className={classes.fab}  style={{backgroundColor: '#312B2B'}}>
                                  <ClearIcon />
                              </Fab>
                              <span style={{alignSelf: 'center'}}>
                                Cancel
                              </span>
                          </GridContainer>
                      </GridContainer>
                  </GridItem>
              </GridContainer>
          </GridItem>
      </GridContainer>
    );
}

