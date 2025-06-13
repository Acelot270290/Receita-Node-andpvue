import 'reflect-metadata'; 
import dotenv from 'dotenv';
dotenv.config(); 

import app from './app'; 
import { AppDataSource } from './data-source'; 


const PORT = process.env.PORT || 3000; 

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully!');
    app.listen(PORT, () => { // <<-- O MÉTODO '.listen()' é de 'app' (Express Application)
      console.log(`Server running on port ${PORT}`);
      console.log(`Access API health check at http://localhost:${PORT}/api/health`);
      console.log(`Access Swagger Docs at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error: unknown) => { 
    console.error('Error connecting to database:', error); 
  });
