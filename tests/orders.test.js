import request from 'supertest';
import express from 'express';
import Table from '../models/Table.js';
import Product from '../models/Product.js';
import Option from '../models/Option.js';
import Router from '../routes/router.js';

const app = express(); 
app.use(express.json());
Router(app);

describe('Orders API Tests', () => {
    describe('POST /add-order', () => {
        beforeEach(async () => {
            await Product.create([
                {
                    name: 'Fries',
                    price: 5.00,
                    course: 'Side',
                    options: [],
                    image: 'https://example.com/images/fries.jpg'
                },
                {
                    name: 'Cheeseburger',
                    price: 12.50,
                    course: 'Main',
                    options: [],
                    image: 'https://example.com/images/cheeseburger.jpg'
                },
                {
                    name: 'Caesar Salad',
                    price: 8.00,
                    course: 'Starter',
                    options: [],
                    image: 'https://example.com/images/caesar_salad.jpg'
                },
                {
                    name: 'Pizza Margherita',
                    price: 15.00,
                    course: 'Main',
                    options: [],
                    image: 'https://example.com/images/pizza_margherita.jpg'
                },
                {
                    name: 'Pizza Aussie',
                    price: 15.00,
                    course: 'Main',
                    options: [],
                    image: 'https://example.com/images/pizza_Aussie.jpg'
                }
            ])
            await Table.create({
                tableNo: 1,
                pax: 4,
                total: 17.50
            });
        })
        it('should create a new order', async () => {
            const table = await Table.findOne({tableNo: 1})            
                .populate({
                    path: 'products.item',
                    model: 'Product'
                })
            const cheeseburger = await Product.findOne({ name: 'Cheeseburger'})
            const response = await request(app)
                .post('/add-order') 
                .send({
                    table: table._id,
                    products: [{ item: cheeseburger._id }],
                    comment: 'Test order',
                    total: 20
                });
                console.log(response.body.msg)
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toContain('Order');
        });

        it('should return 400 for missing fields', async () => {
            const response = await request(app)
                .post('/add-order')
                .send({ table: table._id, products: [] });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.msg).toContain('Validation failed');
        });
    });
});