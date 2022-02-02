
# Bug Blog

It's a Blogging Web App built with MERN Stack , where users can create their own blogs and can view ans react to other's blog 
and share there thoughts with each other.





## Badges

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)
## Environment Variables

To run this project, you will need to add the following environment variables

First in your server .env file

`MONGO_PASSWORD`
`SALT_ROUNDS`
`JWT_SECRET`
`CLOUD_NAME`
`API_KEY`
`API_SECRET`

Then in your client .env.local file

`REACT_APP_BASE_URL`
## Deployment

The web App is deployed on heroku on the following link

https://bugblog.netlify.app/



  
## Tech Stack

**Client:** React, React-Bootstrap, Ck-Editor5

**Server:** Node, Express, MongoDB

**Deployment:**

Fronted - Netlify

Backend - Heroku

  
## Run Locally

Clone the project

```bash
  git clone https://github.com/Aaditya1978/Bug-Blog.git
```

Go to the project directory

```bash
  cd Bug-Blog
```

Install dependencies for Client And Server

```bash
  cd server
  npm install

  cd client
  npm install
```

Set up the .env file for server ans .env.local for client

Start the both server on seprate terminals

```bash
  cd server
  npm run dev
```

```bash
  cd client
  npm start
```

  
## Features

- Rich Text Editor for Blog Writting
- Search for Blogs
- Like and Comment
- Secured Encryption of Accounts

  
## Feedback

If you have any feedback, please reach out to us.

  
## Contributing

Contributions are always welcome!

  
## License

[MIT](https://choosealicense.com/licenses/mit/)

  
