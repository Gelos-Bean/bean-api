import { Router } from 'express';
import Order from '../models/Order.js';

const router = Router();

router.post('/add-order', async (req, res) => {

    try  {
        // new order items to be added to order & table
        const orderItems = req.body.products;
        const saveToTab = {...orderItems[0]};

        const table = await Table.findById(req.body.table._id);
        
        const newOrder = new Order({
            table: table,
            products: orderItems
        });

        await newOrder.save();

        // save items to table only if order is sent
        table.products.push(saveToTab);
        table.save();


        res.status(200).send({
            success: true,
            msg: `Order ${newOrder._id} sent`
        });
    

    } catch(err) { 
        if (err.name === "ValidationError"){
            return res.status(400).send({ 
                success: false, 
                msg: err.message 
            });
        }
        res.status(500).send({ success: false, msg: err.message });
    };
});


router.get('/', async (req, res) => { 

    try {
        const allOrders = await Order.find({});

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
        const findOrder = await Order.findById(req.params.id);

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