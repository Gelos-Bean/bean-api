import request from 'supertest';
import express from 'express';
import Table from '../models/Table.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Option from '../models/Option.js';
import Router from '../routes/router.js';

const app = express(); 
app.use(express.json());
Router(app);

describe('Orders API Tests', () => {
    let cheeseburger;
    let fries;
    let table;
    let order;

    beforeAll(async () => {
        cheeseburger = await Product.create({ name: 'Cheeseburger', price: 12.5, course: 'Main' });
        fries = await Product.create({ name: 'Fries', price: 5, course: 'Starter' });
        table = await Table.create({ tableNo: 2, pax: 8, total: 20 });
    });

    describe('POST /add-order', () => {
        it('should create a new order & add products to table', async () => {
            const response = await request(app)
                .post('/add-order')
                .send({
                    table: table._id,
                    products: [
                        { item: cheeseburger._id, quantity: 1 },
                        { item: fries._id, quantity: 3 }
                    ],
                    comment: 'Test order',
                    total: 17.50
                });

            const updatedTable = await Table.findById(table._id).populate({
                path: 'products',
                populate: { path: 'item' }
            });

            expect(updatedTable.products).toHaveLength(2);
            expect(updatedTable.products[0].item.name).toBe('Cheeseburger');
            expect(updatedTable.products[0].quantity).toBe(1);
            expect(updatedTable.products[1].item.name).toBe('Fries');
            expect(updatedTable.products[1].quantity).toBe(3);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toContain('Order');
        });

        it('should return 400 for missing fields', async () => {
            const response = await request(app)
                .post('/add-order')
                .send({ table: table._id, products: '' });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /orders', () => {
        beforeAll(async () => {
            order = await Order.create({
                table: table._id,
                products: [{ item: cheeseburger._id, quantity: 1 }],
                comment: 'Test order',
                total: 20
            });
        });

        it('should retrieve all orders', async () => {
            const response = await request(app).get('/orders');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toHaveLength(1);
        });

        it('should return 400 if no orders are found', async () => {
            await Order.deleteMany({});
            const response = await request(app).get('/orders');
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.msg).toBe('No orders found');
        });
    });
    describe('PUT /:id', () => {
        let order;
    
        beforeAll(async () => {
            order = await Order.create({
                table: table._id,
                products: [{ item: cheeseburger._id, quantity: 1 }],
                comment: 'Initial order'
            });
        });
    
        it('should update an existing order', async () => {
            const response = await request(app)
                .put(`/orders/${order._id}`)
                .send({ comment: 'Updated order' });
    
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toBe('Items sent');
    
            const updatedOrder = await Order.findById(order._id); 
            expect(updatedOrder.comment).toBe('Updated order');
        });
    
        it('should return 400 for an invalid order ID', async () => {
            const response = await request(app)
                .put('/orders/invalid-id')
                .send({ comment: 'Invalid update' });
    
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.msg).toBe('Order not found');
        });
    
    });

    describe('DELETE /:id', () => {
        let order;
    
        beforeAll(async () => {
            // Create a sample order
            order = await Order.create({
                table: table._id,
                products: [{ item: cheeseburger._id, quantity: 1 }],
                comment: 'Order to delete',
                total: 20
            });
        });
    
        it('should delete an existing order', async () => {
            const response = await request(app).delete(`/orders/${order._id}`);
    
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toBe(`${order._id} deleted successfully`);
    
            const deletedOrder = await Order.findById(order._id);
            expect(deletedOrder).toBeNull();
        });
    
        it('should return 400 for an invalid order ID', async () => {
            const response = await request(app).delete('/orders/invalid-id');
    
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.msg).toBe('Order not found');
        });
    
    });
});