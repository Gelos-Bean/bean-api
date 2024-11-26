import { Router } from 'express';
import Table from '../models/Table.js';
import SalesHistory from '../models/SalesHistory.js';

const router = Router(); 
const options = {
    timeZone: 'Australia/Sydney',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    };

router.post('/', async (req, res) => {
    try{ 
        const { tableNo, pax, limit, total } = req.body;

        const existingTable = await Table.findOne({ tableNo });
        if (existingTable) {
            return res.status(409).send({
                success: false,
                msg: `Table ${tableNo} already exists`
              });
        }

        const newTable = new Table({
            tableNo: tableNo,
            pax: pax,
            total: total ? total : 0
        });
        
        const saveTable = await newTable.save();
        
        if (saveTable) {
            res.status(200).send({ 
                success: true, 
                msg: `Table ${newTable.tableNo} created`,
                _id: saveTable._id
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


router.get('/', async (req, res) => { 

    try {
        const allTables = await Table.find({})
            .populate({
                path: 'products.item',
                model: 'Product'})
            .populate({
                path: 'products.selectedOptions',
                model: 'Option'}
            );

        if (allTables.length === 0) {
            return res.status(404).send({ 
                success: false, 
                msg: 'No tables found' 
            });
        }
        
        res.status(200).send({ 
            success: true,
            msg: allTables });

    } catch (err) { 
        res.status(500).send({ success: false, msg: err.message });
    };
})


router.get('/:tableNo', async (req, res) => { 
    const tableNoURI = req.params.tableNo;
    const URINumCheck = isNaN(parseInt(req.params.tableNo));

    if (URINumCheck) {
        return res.status(400).send({
            success: false,
            msg: "Not a number"
        });
    }

    try { 
        const findTable = await Table.findOne({ tableNo: tableNoURI })
            .populate({
                path: 'products.item',
                model: 'Product'})
            .populate({
                path: 'products.selectedOptions',
                model: 'Option'});

        if (!findTable) {
            return res.status(404).send({ 
                success: false, 
                msg: 'Table not found' 
            });
        }

        res.status(200).send({
            success: true,
            msg: findTable
        });

    } catch (err) { 
        res.status(500).send({ success: false, msg: err.message });
    }
});


router.put('/:id', async (req, res) => { 

    try { 
        const updateTable = await Table.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );

        res.status(200).send({
            success: true,
            msg: `Table ${updateTable.tableNo} updated`
        });

    } catch (err) { 
        if(err.name === "CastError"){
            return res.status(400).send({ 
                success: false, 
                msg: 'Table not found' 
            });
        }
        res.status(500).send({ success: false, msg: err.message });
    };
})


router.delete('/:id', async (req, res) => {
    try { 
        const table = await Table.findById(req.params.id)
            .populate({
                path: 'products.item',
                model: 'Product'})
            .populate({
                path: 'products.selectedOptions',
                model: 'Option'});

    // save table to sales history before deleting
        const newDate = new Date().toLocaleString('en-AU', options);
        const dateParts = newDate.split('/');
        const date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`

        let report = await SalesHistory.findOne({ date: date })
            .populate({
                path: 'sales.products.item',
                model: 'Product'})
            .populate({
                path: 'sales.products.selectedOptions',
                model: 'Option'});

        if (!report) {
            report = new SalesHistory({ 
                date: date,
                sales: [],
                totalFood: 0,
                totalBev: 0,
                total: 0,
            });
        }
        const saleToAdd = {
            tableNo: table.tableNo,
            openedAt: table.openedAt,
            pax: table.pax,
            products: table.products,
            total: table.total
        };

        report.sales.push(saleToAdd);
        var newTotalFood = 0;
        var newTotalBev = 0;
        var newTotal = 0;
        report.sales.forEach(sale => {
            sale.products.forEach(prod => {
                if (!prod.item) {
                    console.error("Product item not found:", prod);
                    return; 
                }
        
                const price = prod.item.price || 0; 
                const quantity = prod.quantity || 1; 
                const course = prod.item.course || "Other";
        
                if (course === "Beverage") {

                    if (prod.selectedOptions && Array.isArray(prod.selectedOptions)) {
                        prod.selectedOptions.forEach(opt => {
                            newTotalBev += opt.price || 0; 
                        });
                    }

                    newTotalBev += price * quantity;
                } else {

                    if (prod.selectedOptions && Array.isArray(prod.selectedOptions)) {
                        prod.selectedOptions.forEach(opt => {
                            newTotalFood += opt.price || 0; 
                        });
                    }

                    newTotalFood += price * quantity;
                }
            });
        });
        newTotal += (newTotalBev + newTotalFood)
        console.log(`New bev: ${newTotalBev}`);
        console.log(`New food: ${newTotalFood}`)
        console.log(`New total: ${newTotal}`)


        report.totalBev += newTotalBev;
        report.totalFood += newTotalFood;
        report.total += newTotal;

        report.totalBev = report.totalBev.toFixed(2);
        report.totalFood = report.totalFood.toFixed(2);
        report.total = report.total.toFixed(2);

        const saveReport = await report.save();

        if (!saveReport) {
            res.status(400).send({
                success: false,
                msg: 'Could not save sale to sales history, try again later',
            })
        }

        console.log(`sales history saved`);


        //Once sales history saved, delete table
        const deleteTable = await Table.findByIdAndDelete(req.params.id);

        res.status(200).send({
            success: true,
            msg: `Table ${deleteTable.tableNo} deleted successfully`
        });

    } catch (err) { 
        if(err.name === "CastError"){
            return res.status(400).send({ 
                success: false, 
                msg: 'Table not found' 
            });
        }

        res.status(500).send({ success: false, msg: err.message });
    }
});

export default router; 