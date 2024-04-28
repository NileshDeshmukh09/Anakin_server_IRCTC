# Anakin IRCTC SERVER

## SETUP
 
To get started and run the app:

Live Website : `https://anakin-server-irctc.vercel.app/`

- Clone the project using command : 

- ` git clone https://github.com/NileshDeshmukh09/Anakin_server_IRCTC.git `

- Run ` npm install ` to install the corresponding node packages

- Go to Project Directory &  Run ` npm start ` to run the app on http://localhost:8000

### FLow Chart - IRCTC server
-![FlowChart](https://github.com/NileshDeshmukh09/Anakin_server_IRCTC/blob/master/src/Images/flow-chart-IRCTC.png?raw=true)
### Swagger Docs Images - Anakin_IRCTC_server

- ![SwaggerAPI](https://github.com/NileshDeshmukh09/Anakin_server_IRCTC/blob/master/src/Images/swagger-Docs.png?raw=true)

- 
### TECHSTACK 

 - `NodeJS` , `ExpressJS ` , ` MySQL` , ` Swagger ` for API Docs







## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in root directory

- ` DB_HOST     = localhost `
- ` DB_USER     = root `
- ` DB_PASSWORD = root `
- ` DB_NAME     = anakin_db `
- ` PORT        = 8000 `

- ` JWT_SECRET = Nilesh_this_is_super_duper_secret_Key `
- ` API_KEY = admin_api_key `

### Handle the Race Condition 

-  bookSeat uses transactions to group database operations for seat booking, ensuring they either all succeed or all fail together.
-  It locks the train row using FOR UPDATE in SQL, preventing other transactions from modifying the train's seat availability while a booking is in progress.
- If the requested train is not found or doesn't have enough seats, the transaction is rolled back to undo any changes and keep data consistent.
- After successfully updating seat availability and recording the booking, the transaction commits changes, ensuring data integrity and preventing issues from concurrent bookings on the same train.


# Thankyou for Checking Project
