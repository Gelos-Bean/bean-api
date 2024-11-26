import { Router } from 'express';
import Order from '../models/Order.js';
import Table from '../models/Table.js';


const router = Router();

router.post('/', async (req, res) => {

    try {
        const { table, products, comment, total } = req.body;
        if (!table || !products || products.length === 0) {
            return res.status(400).send({ success: false, 
                msg: 'Invalid input: Missing or incorrect fields.' });
        }
       
        const tableId = await Table.findById(table);
       
        const newOrder = new Order({
            table: tableId._id,
            products: products,
            comment: comment,
            total: total
        });

        await newOrder.save();

        for (let product of products) {
            tableId.products.push(product);
        }
        tableId.total += total;
        await tableId.save();

        res.status(200).send({
            success: true,
            msg: `Order ${newOrder._id} sent`
        });

    } catch (err) {
        res.status(500).send({ success: false, msg: err.message });
    }
});

router.get('/', async (req, res) => { 

    try {
        const orders = await Order.find({})
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

        if (!orders || orders.length === 0) {
            return res.status(400).send({ 
                success: false, 
                msg: 'No orders found' });
        }
        
        res.status(200).send({
            success: true, 
            msg: orders
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

        if(!findOrder || findOrder.length === 0){
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
        const updateOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
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

            if(!updateOrder) {
                return res.status(400).send({ 
                    success: false, 
                    msg: 'Order not sent' 
                });
            }

        res.status(200).send({
            success: true,
            msg: `Items sent`
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