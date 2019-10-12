import React from 'react';
import PropTypes from "prop-types";
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';


import { useSnackbar } from 'material-ui-snackbar-provider';
import { pricingModalInfo, pricingVariables, pricingOptions } from 'utils/variables/sharedData.js';
import { emailValidations, userNameValidations, messageValidations, validateInput, validateNumber } from "utils/validations.js";

import workStyles from "assets/jss/material-kit-react/views/landingPageSections/workStyle.js";

import ModalStyles from "assets/jss/material-kit-react/components/sendMessageStyle.js";
const pricingModalStyles = makeStyles(ModalStyles);

function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, numSelected, rowCount } = props;

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell>
                {pricingVariables.map(headCell => (
                    <TableCell
                        key={headCell.name}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                    />
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
}));



const EnhancedTableToolbar = props => {
    const classes = useToolbarStyles();
    const { numSelected } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            <div className={classes.title}>
                {numSelected > 0 ? (
                    <Typography color="inherit" variant="subtitle1">
                        {numSelected} selected
                    </Typography>
                ) : (
                    <Typography variant="h6" id="tableTitle">
                        Properties
                    </Typography>
                )}
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
                {numSelected > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="Filter list">
                        <IconButton aria-label="filter list">
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </div>
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

function PricingOptions(props) {
    const { parentType, onClose, openAgain, options, updateOptions } = props;
    const snackbar = useSnackbar();
    const [properties, setProperties] = React.useState([...options]); //for adding properties to take into account
    const isBasic = JSON.stringify(options) === JSON.stringify(pricingVariables);
    const [isReady, setIsReady] = React.useState(false);
    const [showAddProperty, setShowAddProperty] = React.useState(false);
    const [count, setCount] = React.useState(1);
    const [countTouched, setCountTouched] = React.useState(false);
    const [countValid, setCountValid] = React.useState(false);
    const [countError, setCountError] = React.useState('');
    const [units, setUnits] = React.useState(1);
    const [unitsTouched, setUnitsTouched] = React.useState(false);
    const [unitsValid, setUnitsValid] = React.useState(false);
    const [unitsError, setUnitsError] = React.useState(false);
    const [propertyType, setPropertyType] = React.useState('apartment');
    const [okToAdd, setOkToAdd] = React.useState(false);
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const classes = pricingModalStyles();
    const rows = properties;


    const clearForms = () => {
        setCount(1);
        setCountTouched(false);
        setCountValid(false);
        setCountError('');
        setUnits(1);
        setUnitsTouched(false);
        setUnitsValid(false);
        setUnitsError('');
        setPropertyType('apartment');
        setOkToAdd(false);
    };

    const clearProperties = (e) => {
        if (e) {
            let basicOptions = [... pricingVariables];
            basicOptions.forEach(option => {
                option.count = 0;
                option.totalUnits = 0;
            });
            setProperties(basicOptions);
            setIsReady(false);
        }
    };

    const resetProperties = () => {
        //resets to the basic layout for site shared variables
        clearForms();
        setProperties([...options]);
    };

    const closeModal = (e) => {
        if (e) {
            console.log('cancel clicked')
            clearForms();
            onClose(e);
        }
    };

    const handleCount = (e) => {
        if (e) {
            const newValue = e.target.value;
            if (!countTouched) {
                setCountTouched(true);
            }
            const validationResults = validateNumber(newValue);
            setCount(validationResults.value);
            setCountValid(validationResults.valid);
            setCountError(validationResults.error);
        }
    };

    const handleUnits = (e) => {
        if (e) {
            const newValue = e.target.value;
            if (!unitsTouched) {
                setUnitsTouched(true);
            }
            const validationResults = validateInput(newValue);
            setUnits(validationResults.value);
            setUnitsValid(validationResults.valid);
            setUnitsError(validationResults.error);
        }
    };

    const addProperty = (e) => {
        if (e) {
            setShowAddProperty(true);
        }
    };

    const submitNewProperty = (e) => {
        if (e) {
            let newOptions = [...properties];
            newOptions.forEach(option => {
                if (option.type === propertyType) {
                    option.count = count;
                    option.totalUnits = units;
                }
            });
            setProperties(newOptions);

        }
    };

    const undoUpdate = (e, oldOptions, oldPage) => {
        if (e) {
            updateOptions(oldOptions);
            //open modal
            openAgain(e, 'pricing');
            //go back to current view
        }

    };

    const updatePricing = (e) => {
        //this updates the system. will connect to endpoint or wopoprah in the future
        if (e) {
            const oldOptions = [...options];
            const oldPage = [];
            updateOptions([...properties]);
            //do magic here & get response
            clearForms()
            closeModal(e);
            //go to pricing page
            snackbar.showMessage(
                'Your message has been sent!',
                'UNDO', (e) => undoUpdate(e, oldOptions, oldPage)
            )
        }
    };

    const handleSelectAllClick = e => {
        if (e.target.checked) {
            const newSelecteds = rows.map(n => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (e, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChangeDense = event => {
        setDense(event.target.checked);
    };

    const isSelected = name => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);


    return (
        <div onClick={(e) => {closeModal(e)}}>
            <div className={classes.container}>
            <GridContainer justify="center">
                <GridItem cs={12} sm={12} md={8}>
                    <Card onClick={(e) => {e.stopPropagation()}}>

                        <h3 className={classes.title}>{pricingModalInfo.title}</h3>
                        {/*<h5 className={classes.description}>{pricingModalInfo.subTitle}</h5>*/}
                        <form>
                            <CardContent>
                                <GridContainer>
                                    <EnhancedTableToolbar numSelected={selected.length} />
                                    <div className={classes.tableWrapper}>
                                        <Table
                                            className={classes.table}
                                            aria-labelledby="tableTitle"
                                            size={dense ? 'small' : 'medium'}
                                        >
                                            <EnhancedTableHead
                                                classes={classes}
                                                numSelected={selected.length}
                                                onSelectAllClick={handleSelectAllClick}
                                                rowCount={rows.length}
                                            />
                                            <TableBody>
                                                {properties.map((row, index) => {
                                                        const isItemSelected = isSelected(row.name);
                                                        const labelId = `enhanced-table-checkbox-${index}`;

                                                        return (
                                                            <TableRow
                                                                hover
                                                                onClick={event => handleClick(event, row.name)}
                                                                role="checkbox"
                                                                aria-checked={isItemSelected}
                                                                tabIndex={-1}
                                                                key={row.name}
                                                                selected={isItemSelected}
                                                            >
                                                                <TableCell padding="checkbox">
                                                                    <Checkbox
                                                                        checked={isItemSelected}
                                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell component="th" id={labelId} scope="row" padding="none">
                                                                    {row.name}
                                                                </TableCell>
                                                                <TableCell align="right">{row.calories}</TableCell>
                                                                <TableCell align="right">{row.fat}</TableCell>
                                                                <TableCell align="right">{row.carbs}</TableCell>
                                                                <TableCell align="right">{row.protein}</TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                {emptyRows > 0 && (
                                                    <TableRow style={{ height: 49 * emptyRows }}>
                                                        <TableCell colSpan={6} />
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25]}
                                        component="div"
                                        count={rows.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        backIconButtonProps={{
                                            'aria-label': 'previous page',
                                        }}
                                        nextIconButtonProps={{
                                            'aria-label': 'next page',
                                        }}
                                        onChangePage={handleChangePage}
                                        onChangeRowsPerPage={handleChangeRowsPerPage}
                                    />

                                </GridContainer>
                            </CardContent>
                            <CardActions>
                                <Button color="primary" simple onClick={(e) => {closeModal(e)}}>Cancel</Button>
                                <span></span>
                                <Button simple color="primary" onClick={(e) => {resetProperties(e)}}>Reset</Button>
                                <Button color="primary" onClick={(e) => {updatePricing(e)}}>{pricingModalInfo.actionButtonText}</Button>
                            </CardActions>
                        </form>
                    </Card>
                </GridItem>
            </GridContainer>
        </div>
        </div>

    );
}

PricingOptions.propTypes = {
    changeOptions: PropTypes.func.isRequired, //for updating the options array
    options:PropTypes.array.isRequired, //for calculating the price
    onClose: PropTypes.func, //close function for modal
    openAgain: PropTypes.func, //opens the modal form snackbar
    parentType: PropTypes.string.isRequired //modal or section
};

export default PricingOptions;

