# Titles and internal titles

Custom Business Operation System - Backend

## Introduction - the project's aim

By centralizing data management, the software provides multiple business functions with a single view of the truth. This helps a company better manage complex business processes by giving employees of different departments easy access to real-time insights across the enterprise.
The application is reposible for handling all the incoming requests from the frontend and integreting frontend app with other systems currently used in the company (EPR, ecommerce, websites etc.)

## Routes

### Available now:
- Customers:
  * adding new customer
  * getting all customers
    
- Products
  * getting all products
  * getting product by id
 
- Members
  * registering new member
  * activating new member
  * logging in member
  * logging out member
  * authenticating member
  * sending password reset request
  * resetting password
    
- ShoppingCart
  * adding product to shopping cart
  * removing product from shopping cart
  * increasing product quantity in the shopping cart
  * decreasing product quantity in the shopping cart
  * getting all products in the shopping cart

## Important:

- system is being developed based on real case and solves real existing problems of the company.
- it is only a backend part of the fullstack application (Frontend part available here: https://github.com/TheCodemate/business-managment-system-fe)
- live demon has not been deployed yet
- it is not exposed for testing purpose

# Technologies

- TypeScript
- Express
- Prisma
- Zod
