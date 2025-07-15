# DeelDeal

## Overview
DeelDeal is a platform designed to connect freelancers and clients, facilitating seamless project collaboration and payment processing. Our mission is to create a transparent, efficient marketplace where talent meets opportunity.

## Features
- **User Authentication**: Secure login and registration system
- **Project Marketplace**: Browse and post projects
- **Skill Matching**: Advanced algorithm to match freelancers with suitable projects
- **Secure Payments**: Integrated payment processing with escrow protection
- **Real-time Messaging**: Communication tools for clients and freelancers
- **Review System**: Build reputation through client and freelancer reviews
- **Portfolio Showcase**: Highlight previous work and skills

## Technology Stack
- **Frontend**: React.js, Redux, Material UI
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT, OAuth
- **Payment Processing**: Stripe API
- **Deployment**: Docker, AWS

## Installation

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- MongoDB

### Setup Instructions
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/DeelDeal.git
   cd DeelDeal

### Directus Deployment

1.  **Navigate to the `directus` directory:**
    ```bash
    cd directus
    ```

2.  **Create a `.env` file from the example:**
    ```bash
    cp .env.example .env
    ```

3.  **Update the `.env` file with your production credentials:**
    - `PUBLIC_URL`: Your production domain (e.g., `https://api.yourdomain.com`)
    - `DB_HOST`: Your production database host
    - `DB_USER`: Your production database user
    - `DB_PASSWORD`: Your production database password
    - `SECRET`: A long, random string for security
    - `EMAIL_SMTP_USER`: Your Gmail address for sending emails
    - `EMAIL_SMTP_PASSWORD`: Your Gmail password or app password
    - `EMAIL_FROM`: The email address to send emails from
    - `AUTH_GOOGLE_CLIENT_ID`: Your Google OAuth client ID
    - `AUTH_GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret

4.  **Install the dependencies:**
    ```bash
    npm install
    ```

5.  **Start the Directus server:**
    ```bash
    npx directus start
    ```