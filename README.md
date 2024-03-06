# Custom Business Operation System - Backend

## Introduction - the project's aim

By centralizing data management, the software provides multiple business functions with a single view of the truth. This helps a company better manage complex business processes by giving employees of different departments easy access to real-time insights across the enterprise.
The application is responsible for handling all the incoming requests from the frontend and integrating the frontend app with other systems currently used in the company (EPR, e-commerce, websites etc.)

## Routes

### Available now:
- Customers:
  * adding new customer
  * getting all customers
    
- Products
  * getting all products
  * getting a product by id
 
- Members
  * registering a new member
  * activating new member
  * logging in member
  * logging out member
  * authenticating member
  * sending password reset request
  * resetting password
    
- ShoppingCart
  * adding product to shopping cart
  * removing a product from the shopping cart
  * increasing product quantity in the shopping cart
  * decreasing product quantity in the shopping cart
  * getting all products in the shopping cart

## Important:

- the system is being developed based on real cases and solves real existing problems of the company.
- it is only a backend part of the full stack application (Frontend part available here: https://github.com/TheCodemate/business-managment-system-fe)
- the live demon has not been deployed yet
- it is not exposed for testing purposes

# Technologies

- TypeScript
- Express
- Prisma
- Zod
