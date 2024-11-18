import { Router } from 'express';
import SalesHistory from '../models/SalesHistory.js';

const router = Router(); 

router.post('/', async (req, res) => {
    try{ 
        const { date } = req.body;
        const existingDate = await SalesHistory.findOne({ date })
        if (existingDate) {
            return res.status(400).send({
                success: false,
                msg: `There is already a sales report for that date: ${date}`
              });
        };

        const newReport = new SalesHistory({
            date: date,
            sales: [],
            totalFood: 0,
            totalBev: 0,
            total: 0
        });

        const saveReport = await newReport.save();

        if(saveReport) {
            res.status(200).send({
                success: true,
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
            res.status(500).send({ success: false, msg: err.message })
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
  
        // Parse the date and match it in the database
        const localStartOfDay = new Date(date);
        localStartOfDay.setHours(0, 0, 0, 0);
        
        const localEndOfDay = new Date(date);
        localEndOfDay.setHours(23, 59, 59, 999);
        
        const startOfDay = new Date(localStartOfDay.toISOString());
        const endOfDay = new Date(localEndOfDay.toISOString());

        const reports = await SalesHistory.find({
            date: {
            $gte: startOfDay,
            $lte: endOfDay,  
            }
        });

        if (!reports || reports.length === 0) {
            return res.status(404).send({
            success: false,
            msg: 'No reports found for the given date.'
            });
        }
  
      res.status(200).send({ 
        success: true, 
        msg: reports 
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
        if(!reports) {
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
        const addSales = await SalesHistory.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );

        res.status(200).send({
            success: true,
            msg: `Sales history for ${addSales.date} updated successfully`
        });

    } catch (err) { 
        if(err.name === "CastError"){
            return res.status(400).send({ 
                success: false, 
                msg: 'Sales report not found' 
            });
        }
        res.status(500).send({ success: false, msg: err.message });
    };
})


router.delete('/:id', async (req, res) => {

    try { 
        const deleteReport = await SalesHistory.findByIdAndDelete(req.params.id);

        res.status(200).send({
            success: true,
            msg: `Sales report for ${deleteTable.date} deleted successfully`
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