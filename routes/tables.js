import { Router } from 'express';
import Table from '../models/Table.js';

const router = Router(); 

router.post('/', (req, res) => {

    const add = req.body;

    const newTable = new Table({
        tableNo: add.tableNo,
        pax: add.pax,
        limit: add.limit ? add.limit : null,
        total: add.total ? add.total : 0
    });

    newTable.save()
        .then(() => {
            res.status(200).send({ 
                success: true, 
                msg: `Table ${newTable.tableNo} created` 
            });
        })
        .catch(err => { 
            if (err.name === "ValidationError"){
                return res.status(400).send({ 
                    success: false, 
                    msg: err.message 
                });
            }
            res.status(500).send({ success: false, msg: err.message })
        });
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