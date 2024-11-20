import { Router } from 'express';
import Table from '../models/Table.js';
import SalesHistory from '../models/SalesHistory.js';

const router = Router(); 

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
            limit: limit ? limit : '',
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

        if (!allTables) {
            return res.status(400).send({ 
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
                msg: 'Order not found' 
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
        const date = new Date().toISOString().split('T')[0];
        let report = await SalesHistory.findOne({ date: date });

        if (!report) {
            report = new SalesHistory({ 
                date: date,
                sales: [],
                totalFood: 0,
                totalBev: 0,
                total: 0
            });
        }

        const saleToAdd = {
            tableNo: table.tableNo,
            openedAt: table.openedAt,
            pax: table.pax,
            limit: Number(table.limit),
            products: table.products,
            total: table.total
        };

        report.sales.push(saleToAdd);

        const foodCourse = ["Starter", "Main", "Dessert"];

        report.total = report.sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
        report.totalFood = report.sales.reduce((sum, sale) => {
            return sum + sale.products.reduce((foodSum, product) => {
                return foodCourse.includes(product.item.course) ? foodSum + product.quantity * product.item.price : foodSum;
            }, 0);
        }, 0);
        report.totalBev = report.sales.reduce((sum, sale) => {
            return sum + sale.products.reduce((bevSum, product) => {
                return product.item.course === 'Beverage' ? bevSum + product.quantity * product.item.price : bevSum;
            }, 0);
        }, 0);

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