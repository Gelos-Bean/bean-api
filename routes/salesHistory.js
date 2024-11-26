import { Router } from 'express';
import SalesHistory from '../models/SalesHistory.js';

const router = Router(); 
const options = {
    timeZone: 'Australia/Sydney',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    };

const isValidDateFormat = (id) => /^\d{4}-\d{2}-\d{2}$/.test(id);

router.get('/today', async (req, res) => {
    try{ 
        const newDate = new Date().toLocaleString('en-AU', options);
        const dateParts = newDate.split('/');
        const date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`

        const report = await SalesHistory.findOne({ date })
        if (report) {
            return res.status(200).send({ 
                success: true, 
                newReport: false,
                msg: report
              });
        };

        const newReport = new SalesHistory({
            date: date,
            sales: [],
            totalFood: 0,
            totalBev: 0,
            total: 0,
          });

        const saveReport = await newReport.save();

        if(saveReport) {
            res.status(200).send({
                success: true,
                newReport: true,
                msg: `New empty sales reported created for ${date}`,
            });
        }
        } catch(err) { 
            if (err.name === "ValidationError") {
                return res.status(400).send({ 
                    success: false, 
                    msg: err.message 
                    });
                }
        }
});

router.get('/:date', async (req, res) => {
    try {
      // Date must be ensure it's passed as YYYY-MM-DD
      const date = req.params.date;

      if (!date) {
        return res.status(400).send({ 
          success: false, 
          msg: 'Date is required in YYYY-MM-DD format.' 
        });
      }
  
        const report = await SalesHistory.findOne({ date })
        if (!report) {
            return res.status(404).send({
            success: false,
            msg: 'No reports found for the given date.'
            });
        }
  
      res.status(200).send({ 
        success: true, 
        msg: report
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        success: false,
        msg: 'An error occurred while retrieving the reports.'
      });
    }
  });

router.get('/', async (req, res) => { 

    try {
        const reports = await SalesHistory.find({})
            .populate({
                path: 'sales',
                model: 'Table'
            })
            .populate({
                path: 'sales.products.item',
                model: 'Product'
            })
            .populate({
                path: 'sales.products.selectedOptions',
                model: 'Option'}
            );
        if(!reports || reports.length === 0) {
            return res.status(400).send({
                success: false,
                msg: 'No sales reports found'
            })
        } else {
            res.status(200).send({ 
                success: true,
                msg: reports });
        }
    } catch (err) { 
        res.status(500).send({ success: false, msg: err.message });
    };
});

router.put('/:id', async (req, res) => {
    try {
        const saleToAdd = req.body.sales;

        if (!saleToAdd) {
            return res.status(400).send({
                success: false,
                msg: 'No sale data provided.'
            });
        }

        const report = await SalesHistory.findById(req.params.id);
        if (!report || report.length === 0) {
            return res.status(404).send({
                success: false,
                msg: 'Report not found.'
            });
        }

        report.sales.push(saleToAdd);

        // Update totals
        report.total = report.sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
        report.totalFood = report.sales.reduce((sum, sale) => {
            return sum + sale.products.reduce((foodSum, product) => {
                return product.item.course === 'Starter' || product.item.course === 'Main Course' || product.item.course === 'Dessert' ? foodSum + product.quantity * product.item.price : foodSum;
            }, 0);
        }, 0);
        report.totalBev = report.sales.reduce((sum, sale) => {
            return sum + sale.products.reduce((bevSum, product) => {
                return product.item.course === 'Beverage' ? bevSum + product.quantity * product.item.price : bevSum;
            }, 0);
        }, 0);

        const updatedReport = await report.save();

        res.status(200).send({
            success: true,
            msg: 'Sale added successfully and totals updated.',
            report: updatedReport
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            msg: 'An error occurred while updating the report. ' + err
        });
    }
});


router.delete('/:id', async (req, res) => {

    try { 
        const deleteReport = await SalesHistory.findByIdAndDelete(req.params.id);
        res.status(200).send({
            success: true,
            msg: `Sales report for ${deleteReport.date.split('T')[0]} deleted successfully`
        });

    } catch (err) { 
        if(err.name === "CastError"){
            return res.status(400).send({ 
                success: false, 
                msg: 'Sales report not found' 
            });
        }

        res.status(500).send({ success: false, msg: err.message });
    }
});

export default router; 