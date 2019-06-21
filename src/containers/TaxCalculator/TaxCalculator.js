import React, { Component } from 'react';
import styles from './TaxCalculator.module.css';
import { connect } from 'react-redux';

import TaxInput from '../../components/TaxInput/TaxInput';

//MaterialUI
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Grid, Button, Typography, Stepper, Step, StepLabel
} from '../../materialImports';
import 'typeface-roboto';

//Actions
import {
    newTaxInfo, cleanTaxObj, submitInfo
} from '../../actions'

const stylesMUI = theme => ({
    button: { margin: theme.spacing(1) },
    input: { display: 'none', },
    root: { flexGrow: 1, width: '100%', },
    grow: { flexGrow: 1, },

    //Stepper CSS
    backButton: { marginRight: theme.spacing(1) },
    instructions: { marginTop: theme.spacing(1), marginBottom: theme.spacing(1) },
});

function getSteps() {
    return ['Step 1', 'Step 2', 'Step 3', 'Step 4'];
}

class TaxCalculator extends Component {

    state = { activeStep: 0, stageError: '' };

    handleNext = () => {
        console.log(">>>>>" + this.props.taxOutput);
        switch (this.state.activeStep) {
            case 0: this.setState(state => ({ activeStep: state.activeStep + 1, stageError: '' })); break;
            case 1: this.setState(state => ({ activeStep: state.activeStep + 1, stageError: '' })); break;
            case 2: this.setState(state => ({ activeStep: state.activeStep + 1, stageError: '' })); break;
            case 3: this.setState(state => ({ activeStep: state.activeStep + 1, stageError: '' })); break;
            default: break;
        }
    };

    handleBack = () => {
        this.setState(state => ({ activeStep: state.activeStep - 1, stageError: '' }));
    };
    handleReset = () => {
        this.props.cleanTaxObj();
        this.setState({ activeStep: 0 });
    };

    handleSubmit = () => {
        
        this.props.taxOutput.NPBT.value = this.addValues(["REV", "PIC", "OI", "DISP_FA"]) -
            this.addValues(["COS", "AG_COMM", "ADVERT", "ADMIN", "BANK_FEES", "DEPR_CE", "DEPR_FFE",
                "ENT", "CORP_GIFT", "GEN_EXP", "FINE", "UTLS", "OFF_EXP", "WEB_SERV", "RENT", "HR_EXP",
                "SALAR", "DIR_REMUN", "CPF", "ALLOWANCE_TPT", "SKILL_DEV", "TRAINING", "MED_EXP",
                "MED_INS", "TEL_INT", "ROUNDING", "COMM", "MAINT", "IT_DEV", "TPT", "PRIV_CAR_EXP", "SECT_FEES"]);

        

        this.props.taxOutput.NDE_DEPR.value = parseFloat(this.props.taxInfo.DEPR_CE.value) + parseFloat(this.props.taxInfo.DEPR_FFE.value);
        this.props.taxOutput.NDE_FINE.value = parseFloat(this.props.taxInfo.FINE.value);
        this.props.taxOutput.NDE_PRIV_CAR_EXP.value = parseFloat(this.props.taxInfo.PRIV_CAR_EXP.value);
        this.props.taxOutput.NDE_ENT.value = parseFloat(this.props.taxInfo.NDE_ENT.value);
        this.props.taxOutput.NDE_TRAINING.value = parseFloat(this.props.taxInfo.NDE_TRAINING.value);
        this.props.taxOutput.NDE_GEN_EXP.value = parseFloat(this.props.taxInfo.NDE_GEN_EXP.value);
        this.props.taxOutput.NDE_MED.value = (parseFloat(this.props.taxInfo.MED_EXP.value) + parseFloat(this.props.taxInfo.MED_INS.value)) - ((parseFloat(this.props.taxInfo.SALAR.value) + parseFloat(this.props.taxInfo.DIR_REMUN.value) + parseFloat(this.props.taxInfo.CPF.value)) * (0.01));
        this.props.taxOutput.NDE.value = this.props.taxOutput.NDE_DEPR.value + this.props.taxOutput.NDE_FINE.value + this.props.taxOutput.NDE_PRIV_CAR_EXP.value + this.props.taxOutput.NDE_ENT.value + this.props.taxOutput.NDE_GEN_EXP.value + this.props.taxOutput.NDE_TRAINING.value + this.props.taxOutput.NDE_MED.value;

        this.props.taxOutput.OP_1.value = this.props.taxOutput.NPBT.value + this.props.taxOutput.NDE.value;

        this.props.taxOutput.NTI_PIC.value = parseFloat(this.props.taxInfo.PIC.value);
        this.props.taxOutput.NTI_DISP_FA.value = parseFloat(this.props.taxInfo.DISP_FA.value);
        this.props.taxOutput.NTI_GOV_GRANT.value = parseFloat(this.props.taxInfo.OI.value);
        this.props.taxOutput.NTI.value = this.props.taxOutput.NTI_PIC.value + this.props.taxOutput.NTI_DISP_FA.value + this.props.taxOutput.NTI_GOV_GRANT.value;

        this.props.taxOutput.OP_2.value = this.props.taxOutput.OP_1.value - this.props.taxOutput.NTI.value;

        if (parseInt(this.props.taxOutput.OP_2.value) < 0) {
            this.props.taxOutput.isLoss = true;
            this.props.submitInfo();
        } else {
            this.props.taxOutput.CA.value = parseFloat(this.props.taxInfo.CA.value);
            this.props.taxOutput.EA.value = parseFloat(this.props.taxInfo.EA.value);
            this.props.taxOutput.CYCA.value = this.props.taxOutput.CA.value + this.props.taxOutput.EA.value;

            this.props.taxOutput.OP_3.value = this.props.taxOutput.OP_2.value - this.props.taxOutput.CYCA.value;

            if (parseInt(this.props.taxInfo.YA.value) >= 2020) {			//tax exemption for all companies
                if (this.props.taxOutput.OP_3.value > 190000) {
                    this.props.taxOutput.OP_4.value = this.props.taxOutput.OP_3.value - (7500 + 95000);
                }

                else if (10000 > this.props.taxOutput.OP_3.value >= 190000) {
                    this.props.taxOutput.OP_4.value = this.props.taxOutput.OP_3.value - (7500 + (this.props.taxOutput.OP_3.value - 10000) * 0.5);
                }

                else {
                    this.props.taxOutput.OP_4.value = this.props.taxOutput.OP_3.value - (this.props.taxOutput.OP_3.value * 0.75);
                }
            }

            else {
                if (this.props.taxOutput.OP_3.value > 290000) {
                    this.props.taxOutput.OP_4.value = this.props.taxOutput.OP_3.value - (7500 + 145000);
                }

                else if (10000 > this.props.taxOutput.OP_3.value >= 290000) {
                    this.props.taxOutput.OP_4.value = this.props.taxOutput.OP_3.value - (7500 + (this.props.taxOutput.OP_3.value - 10000) * 0.5);
                }

                else {
                    this.props.taxOutput.OP_4.value = this.props.taxOutput.OP_3.value - (this.props.taxOutput.OP_3.value * 0.75);
                }
            }

            this.props.taxOutput.TAX17.value = 0.17 * this.props.taxOutput.OP_4.value;

            if (parseInt(this.props.taxInfo.YA.value) === 2019) {
                this.props.taxOutput.CITR.value = 0.2 * this.props.taxOutput.TAX17.value;
                if (this.props.taxOutput.CITR.value >= 10000) {
                    this.props.taxOutput.CITR.value = 10000;
                }
            }
            else if (parseInt(this.props.taxInfo.YA.value) === 2018) {
                this.props.taxOutput.CITR.value = 0.4 * this.props.taxOutput.TAX17.value;
                if (this.props.taxOutput.CITR.value >= 15000) {
                    this.props.taxOutput.CITR.value = 15000;
                }
            }
            else if (parseInt(this.props.taxInfo.YA.value) === 2017) {
                this.props.taxOutput.CITR.value = 0.5 * this.props.taxOutput.TAX17.value;
                if (this.props.taxOutput.CITR.value >= 25000) {
                    this.props.taxOutput.CITR.value = 25000;
                }
            }
            else if (parseInt(this.props.taxInfo.YA.value) === 2016) {
                this.props.taxOutput.CITR.value = 0.5 * this.props.taxOutput.TAX17.value;
                if (this.props.taxOutput.CITR.value >= 20000) {
                    this.props.taxOutput.CITR.value = 20000;
                }
            }
            else if (parseInt(this.props.taxInfo.YA.value) < 2016) {
                this.props.taxOutput.CITR.value = 0.3 * this.props.taxOutput.TAX17.value;
                if (this.props.taxOutput.CITR.value >= 30000) {
                    this.props.taxOutput.CITR.value = 30000;
                }
            }

            this.props.taxOutput.TAX.value = this.props.taxOutput.TAX17.value - this.props.taxOutput.CITR.value;
            this.props.submitInfo();
        }
       
    };

    addValues = (arr) => {
        let sum = 0.0;
        for (let i = 0; i < arr.length; i++) {
            try { sum += parseFloat(this.props.taxInfo[arr[i]].value); }
            catch { alert("Error at: " + arr[i]) }
        }
        return sum;
    }

    createField = (arr) => {
        let fields = [];

        for (let i = 0; i < arr.length; i++) {
            try {
                let current = <TaxInput
                    label={this.props.taxInfo[arr[i]].title}
                    field={this.props.taxInfo[arr[i]].field}
                    value={this.props.taxInfo[arr[i]].value}
                    changed={this.changeInput} />;
                fields.push(current);
            }
            catch{
                fields.push(<div style={{ textAlign: 'center', padding: '5px' }}>Error loading: {arr[i]}</div>)
            }
        }

        return fields;
    }

    getStepContent = (stepIndex) => {
        const form1P1Fields = this.createField(['REV', 'PIC', 'OI', 'DISP_FA', 'BANK_ACC', 'RE', 'SHARE_CAP',]);
        const form1P2Fields = this.createField(['CA', 'EA', 'ACC_REC', 'PREPAY', 'FFE', 'ACCUM_DEPR_FFE', 'COMP', 'ACCUM_DEPR_CE']);
        const form2P1Fields = this.createField(['ACC_PAYABLE', 'GST', 'CONV_NOTES', 'COS', 'AG_COMM', 'ADMIN' ]);
        const form2P2Fields = this.createField(['NDE_ENT', 'NDE_GEN_EXP','NDE_TRAINING', 'NDE_MED','ADVERT',]);
        const form3P1Fields = this.createField([ 'BANK_FEES', 'SECT_FEES', 'DEPR_FFE', 'DEPR_CE','ENT', 'CORP_GIFT',]);
        const form3P2Fields = this.createField([ 'GEN_EXP', 'FINE', 'UTLS', 'OFF_EXP', 'WEB_SERV', 'RENT']);
        const form4P1Fields = this.createField(['HR_EXP', 'SALAR', 'DIR_REMUN', 'CPF', 'ALLOWANCE_TPT', 'SKILL_DEV', 'TRAINING', 'MED_EXP']);
        const form4P2Fields = this.createField(['MED_INS', 'TEL_INT', 'ROUNDING', 'COMM', 'MAINT', 'IT_DEV', 'TPT', 'PRIV_CAR_EXP']);

        switch (stepIndex) {
            case 0: //FORM PAGE 1
                return (
                    <div>
                        <Grid
                            container spacing={24}
                            justify="center"
                            alignItems="center">
                            <Grid
                                item xs={12}
                                sm={12}
                                md={5}>
                                <TaxInput
                                    picker
                                    label={this.props.taxInfo.YA.title}
                                    field={this.props.taxInfo.YA.field}
                                    value={this.props.taxInfo.YA.value}
                                    changed={this.changeInput}
                                />
                                {form1P1Fields}
                            </Grid>
                            <Grid
                                item xs={12}
                                sm={12}
                                md={5}>
                                {form1P2Fields}
                            </Grid>
                        </Grid>
                    </div>
                );
            case 1: //FORM PAGE 2
                return (
                    <div>
                        <Grid
                            container spacing={24}
                            justify="center">
                            <Grid
                                alignItems="center"
                                item xs={12}
                                sm={12}
                                md={5}>
                                {form2P1Fields}
                            </Grid>
                            <Grid
                                alignItems="top"
                                item xs={12}
                                sm={12}
                                md={5}>
                                {form2P2Fields}
                            </Grid>
                        </Grid>
                    </div>
                );
            case 2: //FORM PAGE 3
                return (
                    <div>
                        <Grid
                            container spacing={24}
                            justify="center"
                            alignItems="center">
                            <Grid
                                item xs={12}
                                sm={12}
                                md={5}>
                                {form3P1Fields}
                            </Grid>
                            <Grid
                                item xs={12}
                                sm={12}
                                md={5}>
                                {form3P2Fields}
                            </Grid>
                        </Grid>
                    </div>
                );
            case 3: //FORM PAGE 4
                return (
                    <div>
                        <Grid
                            container spacing={24}
                            justify="center"
                            alignItems="center">
                            <Grid
                                item xs={12}
                                sm={12}
                                md={5}>
                                {form4P1Fields}
                            </Grid>
                            <Grid
                                item xs={12}
                                sm={12}
                                md={5}>
                                {form4P2Fields}
                            </Grid>
                        </Grid>
                    </div>
                );
            default:
                return 'Unknown stepIndex';
        }
    }

    changeInput = (event) => {
        this.props.newTaxInfo({ field: event.target.name, value: event.target.value })
    }

    render() {
        const { classes } = this.props;
        const steps = getSteps();
        const { activeStep } = this.state;

        return (
            <div className={classes.root}>
                <div className={styles.newTaxSection}>
                    <div><p className={styles.titleStyle}>Generate New Tax</p></div>
                    <div style={{ backgroundColor: 'white' }}>
                        <Stepper activeStep={activeStep} alternativeLabel>

                            {
                                steps.map(label => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))
                            }
                        </Stepper>
                        <div>
                            {this.state.activeStep === (steps.length) ? (
                                <div>
                                    <Grid
                                        container spacing={24}
                                        direction="column"
                                        justify="center"
                                        alignItems="center">
                                        <Typography className={classes.instructions} variant="h4">All steps completed</Typography>
                                        <div className={styles.ncbutton}>
                                            <Button
                                                onClick={this.handleReset}
                                                style={{ marginRight: '8px', marginBottom: '10px' }}>
                                                Reset</Button>
                                            <Button
                                                type='submit'
                                                variant="contained"
                                                color="primary"
                                                style={{ marginLeft: '8px', marginBottom: '10px' }}
                                                onClick={this.handleSubmit}>
                                                Submit</Button>
                                        </div>
                                    </Grid>
                                </div>
                            ) : (
                                    <div>
                                        {this.getStepContent(activeStep)}
                                        <div className={styles.ncbutton}>
                                            <Button
                                                disabled={activeStep === 0}
                                                onClick={this.handleBack}
                                                className={classes.backButton}
                                                style={{ marginRight: '4%', marginBottom: '10px' }}>
                                                Back </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={this.handleNext}
                                                style={{ marginRight: '8%', marginBottom: '10px' }}>
                                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

TaxCalculator.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = ({ tax }) => {
    const { taxInfo, taxOutput } = tax;
    return { taxInfo, taxOutput }
}

export default connect(mapStateToProps, {
    newTaxInfo, cleanTaxObj, submitInfo
})(withStyles(stylesMUI)(TaxCalculator));