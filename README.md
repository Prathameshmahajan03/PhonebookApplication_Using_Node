\# Phonebook Application — Node.js



A full-stack Phonebook application with a Vue.js frontend, Node.js/Express backend, and Microsoft SQL Server database.



\## Features



\- User login with JWT authentication

\- Create, view, update, and delete contacts

\- Search contacts

\- Server-side pagination

\- Export contacts to CSV and JSON

\- SQL Server stored-procedure-based data access



\## Tech Stack



\### Frontend

\- Vue 3

\- Vite

\- JavaScript



\### Backend

\- Node.js

\- Express.js

\- Microsoft SQL Server

\- `mssql` and `msnodesqlv8`

\- JWT authentication

\- Swagger UI



\## Project Structure



```text

PhonebookApplicationNode/

├── backend/

│   ├── src/

│   │   ├── config/

│   │   ├── controllers/

│   │   ├── middleware/

│   │   ├── repositories/

│   │   ├── routes/

│   │   └── services/

│   ├── server.js

│   └── package.json

├── frontend/

│   ├── src/

│   └── package.json

└── README.md

```





\## Prerequisites



\- Node.js and npm

\- Microsoft SQL Server

\- ODBC Driver 17 for SQL Server

\- Git



\## Database Configuration



The backend uses Microsoft SQL Server and stored procedures.



Configure the database connection in:



`backend/src/config/db.js`



The current local configuration uses SQL Server Express and the `PhonebookDB\_TestRestore` database. Update the connection settings for your own environment as needed.



\## Getting Started



\### 1. Clone the repository



```bash

git clone https://github.com/Prathameshmahajan03/PhonebookApplication\_Using\_Node.git

cd PhonebookApplication\_Using\_Node

```





\### 2. Install backend dependencies



Open a terminal in the project folder and run:



```bash

cd backend

npm install

```



\## API Overview



The backend provides REST API endpoints for authentication and contact management.



\### Authentication

\- User login using JWT authentication.



\### Contacts

\- Create, retrieve, update, and delete contacts.

\- Search contacts by supported search criteria.

\- Retrieve contacts using server-side pagination.

\- Export contacts in CSV and JSON formats.



Contact endpoints require a valid JWT token.



\## Security



\- Keep environment variables, credentials, and access tokens private.

\- Configure your own SQL Server connection.

\- Do not commit `.env` files or secrets.





\## Author



\*\*Prathamesh Mahajan\*\*



\- GitHub: \[Prathameshmahajan03](https://github.com/Prathameshmahajan03)

\- Repository: \[Phonebook Application Using Node.js](https://github.com/Prathameshmahajan03/PhonebookApplication\_Using\_Node)

