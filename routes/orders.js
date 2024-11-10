import { Router } from 'express';
import Order from '../models/Order.js';
import Table from '../models/Table.js';


const router = Router();

router.post('/', async (req, res) => {

    try {
        const { table, products, comment, total } = req.body;
        const tableId = await Table.findById(table._id);
       
        const newOrder = new Order({
            table: tableId,
            products: products,
            comment: comment,
            total: total
        });

        await newOrder.save();

        tableId.products.push(...products);
        tableId.total += total;
        await tableId.save();

        res.status(200).send({
            success: true,
            msg: `Order ${newOrder._id} sent`
        });

    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).send({ success: false, msg: err.message });
        }
        res.status(500).send({ success: false, msg: err.message });
    }
});

router.get('/', async (req, res) => { 

    try {
        const allOrders = await Order.find({})
            .populate({
                path: 'table',
                model: 'Table'})
            .populate({
                path: 'products.item',
                model: 'Product'
            })
            .populate({
                path: 'products.selectedOptions',
                model: 'Option'
            })

        if (!allOrders) {
            return res.status(400).send({ 
                success: false, 
                msg: 'No orders found' });
        }
        
        res.status(200).send({
            success: true, 
            msg: allOrders
        });

    } catch (err) { 
        res.status(500).send({ success: false, msg: err.message });
    };
})


router.get('/:id', async (req, res) => { 

    try { 
        const findOrder = await Order.findById(req.params.id)
            .populate({
                path: 'table',
                model: 'Table'})
            .populate({
                path: 'products.item',
                model: 'Product'
            })
            .populate({
                path: 'products.selectedOptions',
                model: 'Option'
            });

        if(!findOrder){
            return res.status(400).send({ 
                success: false, 
                msg: 'Order not found' 
            });
        }

        res.status(200).send({
            success: true,
            msg: findOrder
        });

    } catch (err) { 
        res.status(500).send({ success: false, msg: err.message });
    };
})


router.put('/:id', async (req, res) => { 

    try { 

        // get order items 
        // compare order.products against req.body products
        // find table 
        //      if changes === product changes
        //              update
        //      else leave
        // Update order



        const updateOrder = await Order.findByIdAndUpdate(req.params._id, req.body, { new: true })

        
        const updateTable = await Table.findByIdAndUpdate(req.params.table._id, req.body.products,  { new: true })

        table.products.push(saveToTab);
        table.save();


        res.status(200).send({
            success: true,
            msg: `${updateOrder.name} updated`
    });

    } catch (err) { 
        if(err.name === "CastError"){
            return res.status(400).send({ 
                success: false, 
                msg: 'Order not found' 
            });
        }
        res.status(500).send({ success: false, msg: err.message });
    };
})


router.delete('/:id', async (req, res) => {

    try { 

// ----> Stretch TO DO: send item to sales history before deleting
// ----> BK note on the above: this should go in delete tables, not orders

        const deleteOrder = await Order.findByIdAndDelete(req.params.id);

        res.status(200).send({
            success: true,
            msg: `${deleteOrder._id} deleted successfully`
        });

    } catch (err) { 
        if(err.name === "CastError"){
            return res.status(400).send({ 
                success: false, 
                msg: 'Order not found' 
            });
        }

        res.status(500).send({ success: false, msg: err.message });
    }
});

export default router; 