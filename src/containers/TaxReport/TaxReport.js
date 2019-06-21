import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './TaxReport.module.css'

//pdf
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

//MaterialUI
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
    Table, TableBody, TableCell, TableHead, TableRow, Paper, Button
} from '../../materialImports';
import 'typeface-roboto';

import {
    cleanTaxObj, cleanOpObj
} from '../../actions'

const stylesMUI = theme => ({
    root: {
        width: '210mm',
        marginTop: theme.spacing(2),
        overflowX: 'auto',
        padding: '30px 30px',
        margin: 'auto'
    },
    table: {
        minWidth: 650,
        align: 'center'
    },
});

class TaxReport extends Component {

    savePDF(year) {
        const filename = `Company_${year}_taxReport.pdf`;
        window.scrollTo(0,0);  
        html2canvas(document.getElementById('paper'),
            { scale: 2 }
        ).then(canvas => {
            let pdf = new jsPDF('p', 'mm');
            var imgData = canvas.toDataURL('image/png');
            var imgWidth = 210;
            var pageHeight = 297;
            var imgHeight = canvas.height * imgWidth / canvas.width;
            var heightLeft = imgHeight;
            var position = 0;
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save(filename);
        });  
    }

    numberWithCommas(x) {
        var parts = x.toString()
        parts = parts.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts;
    }

    ccyFormat(num) {
        num = Math.round(num)
        const val = this.numberWithCommas(Math.abs(num))
        return (num >= 0) ? val : `(${val})`;
      }

    handleDone = () => {
        this.props.cleanTaxObj();
        this.props.cleanOpObj();
    }

    handleSave = () => {
        this.savePDF(parseInt(this.props.taxInfo.YA.value));
    }

    render () {
        let taxExempt = null;
        let profit = null;

        const yr = parseInt(this.props.taxInfo.YA.value);
        const check = Math.round(this.props.taxOutput.OP_3.value)

        if (yr >= 2020) {
            if (check > 190000) {
                taxExempt = (
                    <React.Fragment>
                        <TableRow>
                            <TableCell colSpan={1} />
                            <TableCell align='left'>First $10,000 @ 75%</TableCell>
                            <TableCell colSpan={1} align='right'>7,500</TableCell>
                            <TableCell colSpan={1} />
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={1} />
                            <TableCell align='left'>Next $190,000 @ 50%</TableCell>
                            <TableCell colSpan={1} align='right'>95,000</TableCell>
                            <TableCell colSpan={1} />
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={3} />
                            <TableCell align='right'>102,500</TableCell>
                        </TableRow>
                    </React.Fragment>
                );
            } else if (10000 < check && check <= 190000) {
                const exempt = (check - 10000) * 0.5
                const sum = exempt + 7500
                taxExempt = (
                    <React.Fragment>
                        <TableRow>
                            <TableCell colSpan={1} />
                            <TableCell align='left'>First $10,000 @ 75%</TableCell>
                            <TableCell colSpan={1} align='right'>7,500</TableCell>
                            <TableCell colSpan={1} />
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={1} />
                            <TableCell align='left'>Next $190,000 @ 50%</TableCell>
                            <TableCell colSpan={1} align='right'>{this.ccyFormat(exempt)}</TableCell>
                            <TableCell colSpan={1} />
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={3} />
                            <TableCell align='right'>{this.ccyFormat(sum)}</TableCell>
                        </TableRow>
                    </React.Fragment>
                );
            } else {
                const exempt = check * 0.75
                taxExempt = (
                    <React.Fragment>
                        <TableRow>
                            <TableCell colSpan={1} />
                            <TableCell align='left'>First $10,000 @ 75%</TableCell>
                            <TableCell colSpan={1} align='right'>{this.ccyFormat(exempt)}</TableCell>
                            <TableCell colSpan={1} />
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={3} />
                            <TableCell align='right'>{this.ccyFormat(exempt)}</TableCell>
                        </TableRow>
                    </React.Fragment>
                );
            }

        } else {
            if (check > 290000) {
                taxExempt = (
                    <React.Fragment>
                        <TableRow>
                            <TableCell colSpan={1} />
                            <TableCell align='left'>First $10,000 @ 75%</TableCell>
                            <TableCell colSpan={1} align='right'>7,500</TableCell>
                            <TableCell colSpan={1} />
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={1} />
                            <TableCell align='left'>Next $290,000 @ 50%</TableCell>
                            <TableCell colSpan={1} align='right'>145,000</TableCell>
                            <TableCell colSpan={1} />
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={3} />
                            <TableCell align='right'>152,500</TableCell>
                        </TableRow>
                    </React.Fragment>
                );
            } else if (10000 < check && check <= 290000) {
                const exempt = (check - 10000) * 0.5
                const sum = exempt + 7500
                taxExempt = (
                    <React.Fragment>
                        <TableRow>
                            <TableCell colSpan={1} />
                            <TableCell align='left'>First $10,000 @ 75%</TableCell>
                            <TableCell colSpan={1} align='right'>7,500</TableCell>
                            <TableCell colSpan={1} />
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={1} />
                            <TableCell align='left'>Next $290,000 @ 50%</TableCell>
                            <TableCell colSpan={1} align='right'>{this.ccyFormat(exempt)}</TableCell>
                            <TableCell colSpan={1} />
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={3} />
                            <TableCell align='right'>{this.ccyFormat(sum)}</TableCell>
                        </TableRow>
                    </React.Fragment>
                );
            } else {
                const exempt = check * 0.75
                taxExempt = (
                    <React.Fragment>
                        <TableRow>
                            <TableCell colSpan={1} />
                            <TableCell align='left'>First $10,000 @ 75%</TableCell>
                            <TableCell colSpan={1} align='right'>{this.ccyFormat(exempt)}</TableCell>
                            <TableCell colSpan={1} />
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={3} />
                            <TableCell align='right'>{this.ccyFormat(exempt)}</TableCell>
                        </TableRow>
                    </React.Fragment>
                );
            }
        }

        if (this.props.taxOutput.isLoss) {
            profit = (
                <React.Fragment>
                    <TableRow>
                    <TableCell colSpan={3} align='left'>Adjusted loss</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align='right'>{this.ccyFormat(this.props.taxOutput.OP_2.value)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3} align='left'>Chargeable income</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align='right'>NIL</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3} align='left'>Tax payable</TableCell>
                        <TableCell style={{ fontWeight: '900' }} align='right'>NIL</TableCell>
                    </TableRow>
                </React.Fragment>
            )
        } else {
            profit = (
                <React.Fragment>
                    <TableRow>
                        <TableCell colSpan={3} align='left'>Adjusted profit before capital allowances</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align='right'>{this.ccyFormat(this.props.taxOutput.OP_2.value)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={4} align='left'>Less: current year capital allowances</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={1} />
                        <TableCell align='left'>Capital allowances</TableCell>
                        <TableCell colSpan={1} align='right'>{this.ccyFormat(this.props.taxOutput.CA.value)}</TableCell>
                        <TableCell colSpan={1} />
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={1} />
                        <TableCell align='left'>Enhanced allowances</TableCell>
                        <TableCell colSpan={1} align='right'>{this.ccyFormat(this.props.taxOutput.EA.value)}</TableCell>
                        <TableCell colSpan={1} />
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3} />
                        <TableCell align='right'>{this.ccyFormat(this.props.taxOutput.CYCA.value)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3} align='left'>Chargeable income before exempt amount</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align='right'>{this.ccyFormat(this.props.taxOutput.OP_3.value)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={4} align='left'>Less: exempt amount</TableCell>
                    </TableRow>
                    {taxExempt}
                    <TableRow>
                        <TableCell colSpan={3} align='left'>Chargeable income after exempt amount</TableCell>
                        <TableCell style={{ fontWeight: '600' }} align='right'>{this.ccyFormat(this.props.taxOutput.OP_4.value)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3} align='left'>Tax @ 17%</TableCell>
                        <TableCell align='right'>{this.ccyFormat(this.props.taxOutput.TAX17.value)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3} align='left'>Less: Corporate Income Tax (CIT) rebate</TableCell>
                        <TableCell align='right'>{this.ccyFormat(this.props.taxOutput.CITR.value)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={3} align='left'>Tax payable</TableCell>
                        <TableCell style={{ fontWeight: '900' }} align='right'>{this.ccyFormat(this.props.taxOutput.TAX.value)}</TableCell>
                    </TableRow>
                </React.Fragment>
            );
        }
        
        const { classes } = this.props;
        return (
            <div>
                <Paper className={classes.root} id='paper'>
                    <div style={{ textAlign: 'center', lineHeight: '5px', fontFamily: "Roboto", fontWeight: '300' }}>
                        <p>Company</p>
                        <p>UEN No. 2018xxxxx</p>
                        <p>Singapore Coporate Tax Computation</p>
                        <p>Year of Assessment {this.props.taxInfo.YA.value}</p>
                        <p>Basis Period: 1 Janurary {this.props.taxInfo.YA.value - 1} to 31 December {this.props.taxInfo.YA.value - 1}</p>
                    </div>
                    <Table className={classes.table} size='small'>
                        <colgroup>
                            <col style={{ width: '15%' }} />
                            <col style={{ width: '55%' }} />
                            <col style={{ width: '15%' }} />
                            <col style={{ width: '15%' }} />
                        </colgroup>
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={1} />
                                <TableCell colSpan={1} />
                                <TableCell align='center'>S$</TableCell>
                                <TableCell align='center'>S$</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={3}>Net profit before tax per accounts</TableCell>
                                <TableCell style={{ fontWeight: '600' }} align='right'>{this.ccyFormat(this.props.taxOutput.NPBT.value)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={4} >Add back: non-deductable expenses</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={1} />
                                <TableCell align='left'>Depreciation</TableCell>
                                <TableCell colSpan={1} align='right'>{this.ccyFormat(this.props.taxOutput.NDE_DEPR.value)}</TableCell>
                                <TableCell colSpan={1} />
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={1} />
                                <TableCell align='left'>Fine</TableCell>
                                <TableCell colSpan={1} align='right'>{this.ccyFormat(this.props.taxOutput.NDE_FINE.value)}</TableCell>
                                <TableCell colSpan={1} />
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={1} />
                                <TableCell align='left'>Private car expenses</TableCell>
                                <TableCell colSpan={1} align='right'>{this.ccyFormat(this.props.taxOutput.NDE_PRIV_CAR_EXP.value)}</TableCell>
                                <TableCell colSpan={1} />
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={1} />
                                <TableCell align='left'>Entertainment</TableCell>
                                <TableCell colSpan={1} align='right'>{this.ccyFormat(this.props.taxOutput.NDE_ENT.value)}</TableCell>
                                <TableCell colSpan={1} />
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={1} />
                                <TableCell align='left'>General expenses</TableCell>
                                <TableCell colSpan={1} align='right'>{this.ccyFormat(this.props.taxOutput.NDE_GEN_EXP.value)}</TableCell>
                                <TableCell colSpan={1} />
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={1} />
                                <TableCell align='left'>Training expenses converted to PIC cash payout</TableCell>
                                <TableCell colSpan={1} align='right'>{this.ccyFormat(this.props.taxOutput.NDE_TRAINING.value)}</TableCell>
                                <TableCell colSpan={1} />
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={1} />
                                <TableCell align='left'>Non-deductible portion of medial expenses/ insurance</TableCell>
                                <TableCell colSpan={1} align='right'>{this.ccyFormat(this.props.taxOutput.NDE_MED.value)}</TableCell>
                                <TableCell colSpan={1} />
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={3} />
                                <TableCell align='right'>{this.ccyFormat(this.props.taxOutput.NDE.value)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={3} />
                                <TableCell style={{ fontWeight: '600' }} align='right'>{this.ccyFormat(this.props.taxOutput.OP_1.value)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={4} align='left'>Less: non-taxable income</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={1} />
                                <TableCell align='left'>PIC cash payout</TableCell>
                                <TableCell colSpan={1} align='right'>{this.ccyFormat(this.props.taxOutput.NTI_PIC.value)}</TableCell>
                                <TableCell colSpan={1} />
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={1} />
                                <TableCell align='left'>Gain on disposal of fixed assets</TableCell>
                                <TableCell colSpan={1} align='right'>{this.ccyFormat(this.props.taxOutput.NTI_DISP_FA.value)}</TableCell>
                                <TableCell colSpan={1} />
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={1} />
                                <TableCell align='left'>Government grant</TableCell>
                                <TableCell colSpan={1} align='right'>{this.ccyFormat(this.props.taxOutput.NTI_GOV_GRANT.value)}</TableCell>
                                <TableCell colSpan={1} />
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={3} />
                                <TableCell align='right'>{this.ccyFormat(this.props.taxOutput.NTI.value)}</TableCell>
                            </TableRow>
                            {profit}
                        </TableBody>
                    </Table>
                </Paper>
                <div className={styles.ncbutton}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleSave}
                        style={{ marginRight: '4%', marginBottom: '10px' }}>
                        Save to PDF
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleDone}
                        style={{ marginRight: '8%', marginBottom: '10px' }}>
                        Done
                    </Button>
                </div>
            </div>
        );
    }
}

TaxReport.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = ({ tax }) => {
    const { taxInfo, taxOutput } = tax;
    return { taxInfo, taxOutput }
}

export default connect(mapStateToProps, {
    cleanTaxObj, cleanOpObj
})(withStyles(stylesMUI)(TaxReport));