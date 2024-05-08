# <img src='https://github.com/dhihana/CS-554-Group-Final-Project/blob/main/client/src/assets/piggyBankIconColored.png?raw=true' width=25> Piggy Bank <img src='https://github.com/dhihana/CS-554-Group-Final-Project/blob/main/client/src/assets/piggyBankIconColored.png?raw=true' width=25>

Welcome to **Piggy Bank!**

## Overview

Piggy Bank is an application focused on promoting financial education and responsibility among users, with a particular emphasis on families. It serves as a platform where children can engage in activities related to managing and understanding finances, supervised by their parent(s).

## How To Get Started
You will need 2 separate windows open for this.

1. Sign up to create your account OR login in using our pre-made accounts.
    1. If you choose to use our pre-made accounts:
        1. In Window 1:
            1. Login with the email **parent1@gmail.com** and password **Test123$567***.
        2. In Window 2:
            1. Login with the email **child1@gmail.com** and password **Test123$567***.
    2. If you choose to Sign Up:
        1. In Window 1:
            1. Sign up and fill out the information accordingly (or sign in with Google).
            2. Choose **Parent** for role and enter your DOB. 
            3. Once you're logged in, you will see a verification code, which will be used in one moment.
        2. In Window 2:
            1. Sign up and fill out the information accordingly (or sign in with Google).
            2. Choose **Child** for role, enter your DOB, and enter the verification code (from step 1iiac). 
2. Once you're logged into both:
    1. Parent Account:
        1. You can view your children's transactions.
        2. You can send money to your child (up to $500 per transaction).
    2. Child Account:
        1. You can view your Checking & Savings account's balances.
        2. You can transfer money from [Checking -> Savings], [Savings -> Checking], or [Checking -> Checking] if you choose to transfer the money to another user.
        3. Create a budgeted transaction, setting aside some funds for future short-term purchases.
        4. View all of your Transactions in My Transactions.
        5. Earn money for answering financial literacy correctly in Learn n' Earn.
    #### Note: If you're ever lost, navigate to How To Start!

## Downloading Transactions History Document

To generate a Transactions History document in PDF format, ensure you have `wkhtmltopdf` installed on your system. Follow these steps:

### For Windows Users

1. **Download `wkhtmltopdf`**:
   - Visit the [wkhtmltopdf download page](https://wkhtmltopdf.org/downloads.html) and download the appropriate Windows installer.
   
2. **Install `wkhtmltopdf`**:
   - Double-click on the downloaded installer and follow the installation instructions.
   
3. **Add `wkhtmltopdf` to System Path**:
   - After installation, you need to add `wkhtmltopdf` to your system environment variables:
     - Search for "Environment Variables" in the Start menu search bar and open the "Edit the system environment variables" option.
     - In the System Properties window, click on the "Environment Variables" button.
     - Under "System variables", select the "Path" variable and click on "Edit".
     - Click on "New" and add the path to the directory where `wkhtmltopdf` is installed (e.g., `C:\Program Files\wkhtmltopdf\bin`).
     - Click "OK" to save the changes.

4. **Verify Installation**:
   - Open a new command prompt and type `wkhtmltopdf --version`. If installed correctly, you should see the version information printed to the console.

### Generating Transactions History Document

Once `wkhtmltopdf` is installed and added to your system path, you can generate the Transactions History document using the provided functionality in our project.


### For Mac Users

1. **Install Homebrew (if not already installed)**:
   - Homebrew is a package manager for macOS that simplifies the process of installing software. If you don't have Homebrew installed, you can install it by running the following command in your terminal:
     ```bash
     /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
     ```

2. **Install `wkhtmltopdf`**:
   - Once Homebrew is installed, you can install `wkhtmltopdf` by running the following command in your terminal:
     ```bash
     brew install Caskroom/cask/wkhtmltopdf
     ```

3. **Verify Installation**:
   - Open a new terminal window and type `wkhtmltopdf --version`. If installed correctly, you should see the version information printed to the terminal.

### Generating Transactions History Document

Once `wkhtmltopdf` is installed, you can generate the Transactions History document using the provided functionality in our project.

## Technologies Used

- **Frontend**: React, DaisyUI, Tailwind CSS, Clerk
- **Backend**: Node.js, GraphQL, Redis, Wkhtmltopdf, Clerk
- **Database**: MongoDB

## Installation
I recommend having 3 terminal tabs/windows open for this.
1. **Clone the repository:**
   ```bash
   $ git https://github.com/DhihanA/CS-554-Group-Final-Project.git
   $ cd CS-554-Group-Final-Project
   ```

2. **Install Dependencies:**
    - Terminal 1:
   ```bash
   $ cd /your/path/to/CS-554-Group-Final-Project/server
   $ npm i
   ```
   
   - Terminal 2:
   ```bash
   $ cd /your/path/to/CS-554-Group-Final-Project/client
   $ npm i
   ```
3. **Ensure your Redis server is running.**
   - Terminal 3
   ```bash
   $ redis-stack-server
   ```
   or
   ```bash
   $ redis-server
   ```

4. **Seed the Database & Start the Server:**
    - Terminal 1 (/server):
   ```bash
   $ npm run seed
   $ npm start
   ```

5. **Start the Application:**
    - Terminal 2 (/client):
   ```bash
   $ npm run dev
   ```

    ## Notes
- We made the password for all seeded accounts **Test123$567***


## Contributors
This project was a collaborative effort by: 
<a href="https://github.com/dhihana">dhihana</a>,
<a href="https://github.com/jesalgandhi">jesalgandhi</a>,
<a href="https://github.com/ajitk123">ajitk123</a>,
<a href="https://github.com/lkbnch">lkbnch</a>,
<a href="https://github.com/jacobgrocks1234">jacobgrocks1234</a>.