import request from 'supertest';
import express from 'express';
import Product from '../models/Product.js';
import Option from '../models/Option.js';
import Router from '../routes/router.js';

const app = express();
app.use(express.json());
Router(app);


describe('Options API Tests', () => {
    describe('POST /add-product', () => {

        it('creates a new product', async () => {
            const response = await request(app)
                .post('/add-product')
                .send({
                    name: 'I am new product',
                    price: 15,
                    course: 'Starter',
                })
                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.msg).toBe('I am new product saved');
        })

        it('creates a new product with option', async () => {
            const options = await Option.create([
                { name: 'No olives', price: 0.00 },
                { name: 'Extra bacon', price: 2.50 },
            ])

            const response = await request(app)
                .post('/add-product')
                .send({
                    name: 'I am new product with option',
                    price: 15,
                    course: 'Starter',
                    options: options[0]._id
                })

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toBe('I am new product with option saved');

            const savedProduct = await Product.findOne({ name: 'I am new product with option' }).populate('options');
            expect(savedProduct.options).toHaveLength(1);
            expect(savedProduct.options[0].name).toBe('No olives');
        })

        it('return 400 for invalid data', async () => {
            const response = await request(app).post('/add-product').send({});
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    })

    describe('GET /products', () => {
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
        })

        it('should return all products', async () => {
            const response = await request(app).get('/products');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toHaveLength(5);
        })
        
        it('should return all instances of search params', async () => {
            const response = await request(app).get('/products/pizza');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toHaveLength(2);

            const names = response.body.msg.map(item => item.name.toLowerCase());
            expect(names).toContain('pizza margherita');
            expect(names).toContain('pizza aussie');
        })

        it('should be case insensitive', async () => {
            const response = await request(app).get('/products/PIZZA');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toHaveLength(2);
        });
    
        it('should handle partial matches', async () => {
            const response = await request(app).get('/products/piz');
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toHaveLength(2);
        });
    })

     // PUT tests
     describe('PUT /products/:id', () => {
        it('should update option', async () => {
            const options = await Option.create([
                { name: 'No olives', price: 0.00 },
                { name: 'Extra bacon', price: 2.50 },
            ]);
    
            const product = await Product.create({
                name: 'Cheeseburger',
                price: 12.50,
                course: 'Main',
                options: [options[0]._id], 
                image: 'https://example.com/images/cheeseburger.jpg'
            });
    
            const response = await request(app).put(`/products/${product._id}`).send({ options: [options[1]._id]});
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.msg).toBe(`Cheeseburger updated`);
            
            const updatedProduct = await Product.findById(product._id).populate('options');
            expect(updatedProduct.options).toHaveLength(1); 
            expect(updatedProduct.options[0].name).toBe('Extra bacon');
        });
    
        it('should return 400 for invalid ID', async () => {
            const response = await request(app)
                .put('/products/wrongId')
                .send({name: 'Updated Name',price: 2.00});
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });
})