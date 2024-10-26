# API Documentation

These APIs allows CRUD operations on `Products`, `Tables`, `Orders`, and `Options`.

## Product Endpoints

### Add a Product
**POST** `/add-item`

- **Description**: Adds a new product.
- **Request Body**:
  - `name` (string, required)
  - `price` (number, required)
  - `course` (string, required)
  - `options` (array, optional)
  - `image` (string, optional)
- **Response**:
  - `200 OK`: `{ success: true, msg: "<product_name> saved" }`
  - `400 Bad Request`: Validation error.
  - `500 Internal Server Error`

### Get All Products
**GET** `/products`

- **Description**: Retrieves all products.
- **Response**:
  - `200 OK`: `{ success: true, msg: <array of products> }`
  - `400 Bad Request`: No products found.
  - `500 Internal Server Error`

### Get Product by Name
**GET** `/products/:name`

- **Description**: Searches for a product by name.
    Case-insensitive & returns every instance of the string
    regardless of where it is found within the name.
- **Response**:
  - `200 OK`: `{ success: true, msg: <product> }`
  - `400 Bad Request`: Product not found.
  - `500 Internal Server Error`

### Update Product
**PUT** `/products/:id`

- **Description**: Updates a product by ID.
- **Response**:
  - `200 OK`: `{ success: true, msg: "<product_name> updated" }`
  - `400 Bad Request`: Product not found.
  - `500 Internal Server Error`

### Delete Product
**DELETE** `/products/:id`

- **Description**: Deletes a product by ID.
- **Response**:
  - `200 OK`: `{ success: true, msg: "<product_name> deleted successfully" }`
  - `400 Bad Request`: Product not found.
  - `500 Internal Server Error`

## Table Endpoints

### Add a Table
**POST** `/add-table`

- **Description**: Adds a new table.
- **Request Body**:
  - `tableNo` (number, required)
  - `pax` (number, required)
  - `limit` (number, optional)
  - `products` (array, optional)
  - `total` (number, optional, default: 0)
- **Response**:
  - `200 OK`: `{ success: true, msg: "Table <tableNo> created" }`
  - `400 Bad Request`: Validation error.
  - `500 Internal Server Error`

### Get All Tables
**GET** `/tables`

- **Description**: Retrieves all tables.
- **Response**:
  - `200 OK`: `{ success: true, msg: <array of tables> }`
  - `400 Bad Request`: No tables found.
  - `500 Internal Server Error`

### Get Table by Number
**GET** `/tables/:tableNo`

- **Description**: Retrieves a table by its table number.
- **Response**:
  - `200 OK`: `{ success: true, msg: <table> }`
  - `400 Bad Request`: Invalid table number or not found.
  - `500 Internal Server Error`

### Update Table
**PUT** `/tables/:id`

- **Description**: Updates a table by ID.
- **Response**:
  - `200 OK`: `{ success: true, msg: "Table <tableNo> updated" }`
  - `400 Bad Request`: Table not found.
  - `500 Internal Server Error`

### Delete Table
**DELETE** `/tables/:id`

- **Description**: Deletes a table by ID.
- **Response**:
  - `200 OK`: `{ success: true, msg: "Table <tableNo> deleted successfully" }`
  - `400 Bad Request`: Table not found.
  - `500 Internal Server Error`

## Order Endpoints

### Add an Order
**POST** `/add-order`

- **Description**: Creates a new order for a table.
- **Request Body**:
  - `table` (object, required): Reference to the table object.
  - `products` (array, required): Array of product objects.
- **Response**:
  - `200 OK`: `{ success: true, msg: "Order <order_id> sent" }`
  - `400 Bad Request`: Validation error.
  - `500 Internal Server Error`

### Get All Orders
**GET** `/orders`

- **Description**: Retrieves all orders.
- **Response**:
  - `200 OK`: `{ success: true, msg: <array of orders> }`
  - `400 Bad Request`: No orders found.
  - `500 Internal Server Error`

### Get Order by ID
**GET** `/orders/:id`

- **Description**: Retrieves an order by ID.
- **Response**:
  - `200 OK`: `{ success: true, msg: <order> }`
  - `400 Bad Request`: Order not found.
  - `500 Internal Server Error`

### Update Order
**PUT** `/orders/:id`

- **Description**: Updates an order by ID.
- **Response**:
  - `200 OK`: `{ success: true, msg: "<order_name> updated" }`
  - `400 Bad Request`: Order not found.
  - `500 Internal Server Error`

### Delete Order
**DELETE** `/orders/:id`

- **Description**: Deletes an order by ID.
- **Response**:
  - `200 OK`: `{ success: true, msg: "<order_id> deleted successfully" }`
  - `400 Bad Request`: Order not found.
  - `500 Internal Server Error`

## Option Endpoints

### Add an Option
**POST** `/add-option`

- **Description**: Adds a new option.
- **Request Body**:
  - `name` (string, required)
  - `price` (number, required)
- **Response**:
  - `200 OK`: `{ success: true, msg: "<option_name> saved" }`
  - `400 Bad Request`: Validation error.
  - `500 Internal Server Error`

### Get All Options
**GET** `/options`

- **Description**: Retrieves all options.
- **Response**:
  - `200 OK`: `{ success: true, msg: <array of options> }`
  - `400 Bad Request`: No options found.
  - `500 Internal Server Error`

### Get Option by Name
**GET** `/options/:name`

- **Description**: Searches for an option by name.
    Case-insensitive & returns every instance of the string
    regardless of where it is found within the name.
- **Response**:
  - `200 OK`: `{ success: true, msg: <option> }`
  - `400 Bad Request`: Option not found.
  - `500 Internal Server Error`

### Update Option
**PUT** `/options/:id`

- **Description**: Updates an option by ID.
- **Response**:
  - `200 OK`: `{ success: true, msg: "<option_name> updated" }`
  - `400 Bad Request`: Option not found.
  - `500 Internal Server Error`

### Delete Option
**DELETE** `/options/:id`

- **Description**: Deletes an option by ID.
- **Response**:
  - `200 OK`: `{ success: true, msg: "<option_name> deleted successfully" }`
  - `400 Bad Request`: Option not found.
  - `500 Internal Server Error`