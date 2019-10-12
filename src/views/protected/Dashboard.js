import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import GridContainer from "../../components/Grid/GridContainer.js";
import GridItem from "../../components/Grid/GridItem.js";
import TouchScreen from "../../assets/images/touchscreen_left.jpg";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import Table from '@material-ui/core/Table';
import AddIcon from '@material-ui/icons/Add';
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

    const classes = useStyles();
    const user = JSON.parse(JSON.stringify(rawProfile));
    const sandwitch = JSON.parse(JSON.stringify(rawSandwitch));
    const [cartItems, setCartItems] = useState([]);
    const [favItems, setFavtems] = useState([]);
    const testSandwitch = Object.assign({}, sandwitch);

    useEffect(() => {
        console.log(user);
        setFavtems(setItems(user.profile));
        console.log(favItems);
    },[]);

    function setItems (profileData) {
        let favorites = [];
        const favItemsCategory = Object.keys(profileData.favouritesGroup);
        if (favItemsCategory.length > 0) {
            favItemsCategory.forEach(favItem => {
                const categoryObj = {
                    id: favItemsCategory.indexOf(favItem) + 1,
                    catName: favItem,
                    items: profileData[favItem],
                    enabled: true,
                    active: true,
                }
                favorites.push(categoryObj);
            });
            return favorites;
        } else {
            return [];
        }


    }

    return (
      <GridContainer justify="center" direction="row">
        <GridItem md={7} lg={8}>
            <img style={{width: '100%', height: '100vh'}} src={TouchScreen} alt="Touchscreen" />
        </GridItem>
          <GridItem md={5} lg={4}>
              <GridContainer justify="center" direction="column" style={{padding: 30, paddingBottom: 0, height: '100vh'}}>
                  <GridItem>
                      <Button variant="contained" size="large" simple style={{
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
                      <Button disabled={true} simple size="large" style={{
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
                              <GridItem>
                                  <Table className={classes.table} size="small">


                                  </Table>
                              </GridItem>
                              <GridItem>
                                  <GridContainer justify="space-evenly" direction="row" style={{padding: 5}}>
                                      <Fab aria-label="add" className={classes.fab}  size="medium" style={{backgroundColor: '#a93337', color: '#fff'}}>
                                          <AddIcon />
                                      </Fab>
                                      <Fab style={{backgroundColor: '#a93337', color: '#fff'}} size="medium" aria-label="add" className={classes.fab}>
                                          <AddIcon />
                                      </Fab>
                                  </GridContainer>
                              </GridItem>
                          </GridContainer>
                      </Paper>
                  </GridItem>
                  <GridItem>
                      <GridContainer justify="space-evenly" direction="row" style={{padding: 5}}>
                          <GridContainer justify="center" direction="column" style={{padding: 0}}>
                              <Fab color="primary" aria-label="add" className={classes.fab} style={{backgroundColor: '#312B2B'}}>
                                  <AddIcon />
                              </Fab>
                              <span style={{alignSelf: 'center'}}>
                                Previous
                              </span>
                          </GridContainer>
                          <div syle={{width: 10}}></div>
                          <GridContainer justify="center" direction="column" style={{padding: 0}}>
                              <Fab color="primary" aria-label="add" className={classes.fab}  style={{backgroundColor: '#312B2B'}}>
                                  <AddIcon />
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

